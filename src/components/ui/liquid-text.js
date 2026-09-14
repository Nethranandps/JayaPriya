// Liquid text: the contact headline drawn onto the particle canvas and refracted by a
// cursor-driven disturbance field, after the "Let's work together" page on lusion.co/about.
//
// The headline stays in the DOM (transparent) for layout and accessibility. We copy each
// glyph's position from the DOM, so alignment, letter-spacing, line breaks and font
// fallback are decided by the browser rather than re-implemented here.

// Copies glyph positions from the heading. `originRect` is the canvas rect, so the
// returned coordinates are canvas-relative and scroll-invariant.
export function measureGlyphs(h2, originRect, ctx) {
  const style = getComputedStyle(h2);
  const fontSize = parseFloat(style.fontSize);
  // Not the `font` shorthand: it carries `/line-height`, which canvas parsers reject.
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.font = font;
  const metrics = ctx.measureText('H');
  const asc = metrics.fontBoundingBoxAscent;
  const desc = metrics.fontBoundingBoxDescent;
  // Where the baseline sits inside a character's inline box. Measured against the DOM's own box
  // height, so a one-pixel metric difference between DOM and canvas cannot shift the text.
  const baselineRatio = asc > 0 && desc >= 0 ? asc / (asc + desc) : 0.8;

  const walker = document.createTreeWalker(h2, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const glyphs = [];
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue;
    if (!text.trim()) continue;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === ' ' || ch === '\n' || ch === '\t') continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const x = r.left - originRect.left;
      const y = r.top - originRect.top;
      glyphs.push({ ch, x, baseline: y + r.height * baselineRatio });
      if (x < left) left = x;
      if (y < top) top = y;
      if (x + r.width > right) right = x + r.width;
      if (y + r.height > bottom) bottom = y + r.height;
    }
  }
  return { glyphs, left, top, right, bottom, fontSize, font };
}

// Rasterises the glyphs into an offscreen canvas whose origin is snapped to a device pixel,
// so every glyph keeps the same sub-pixel phase it has in the DOM.
export function renderTextTexture(measure, dpr) {
  if (!measure.glyphs.length) return null;
  const pad = Math.ceil(measure.fontSize * 0.15);
  const x = Math.floor((measure.left - pad) * dpr) / dpr;
  const y = Math.floor((measure.top - pad) * dpr) / dpr;
  const wDev = Math.ceil((measure.right + pad - x) * dpr);
  const hDev = Math.ceil((measure.bottom + pad - y) * dpr);
  const canvas = document.createElement('canvas');
  canvas.width = wDev;
  canvas.height = hDev;
  const tctx = canvas.getContext('2d');
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  tctx.font = measure.font;
  tctx.fillStyle = '#fff';
  tctx.textAlign = 'left';
  tctx.textBaseline = 'alphabetic';
  for (const g of measure.glyphs) tctx.fillText(g.ch, g.x - x, g.baseline - y);
  return { canvas, x, y, w: wDev / dpr, h: hDev / dpr, wDev, hDev, fontSize: measure.fontSize };
}

// Which grid tiles contain ink. Empty tiles are never drawn, which roughly halves the
// per-frame drawImage count. Done once per texture build, not per frame.
export function buildTileMask(text, cell, dpr) {
  const tx0 = Math.round(text.x * dpr);
  const ty0 = Math.round(text.y * dpr);
  const i0 = Math.max(0, Math.floor(text.x / cell));
  const i1 = Math.floor((text.x + text.w) / cell);
  const j0 = Math.max(0, Math.floor(text.y / cell));
  const j1 = Math.floor((text.y + text.h) / cell);
  const cols = i1 - i0 + 1;
  const rows = j1 - j0 + 1;
  const mask = new Uint8Array(cols * rows);
  const data = text.canvas.getContext('2d').getImageData(0, 0, text.wDev, text.hDev).data;
  for (let j = j0; j <= j1; j += 1) {
    const sy0 = Math.max(Math.round(j * cell * dpr), ty0) - ty0;
    const sy1 = Math.min(Math.round((j + 1) * cell * dpr), ty0 + text.hDev) - ty0;
    for (let i = i0; i <= i1; i += 1) {
      const sx0 = Math.max(Math.round(i * cell * dpr), tx0) - tx0;
      const sx1 = Math.min(Math.round((i + 1) * cell * dpr), tx0 + text.wDev) - tx0;
      let ink = 0;
      for (let y = sy0; y < sy1 && !ink; y += 2) {
        const row = y * text.wDev;
        for (let x = sx0; x < sx1; x += 2) {
          if (data[(row + x) * 4 + 3] > 8) { ink = 1; break; }
        }
      }
      mask[(j - j0) * cols + (i - i0)] = ink;
    }
  }
  return { i0, i1, j0, j1, cols, mask };
}

// A coarse liquid field on the fluid grid: `a` is how much liquid sits in a cell (drives the
// tint), `vx`/`vy` is how fast it moves (drives the refraction). Row-major `j * nx + i`;
// note FlipFluid is column-major, so never index one with the other's layout.
export class DisturbanceField {
  constructor(nx, ny, cell) {
    this.nx = nx;
    this.ny = ny;
    this.cell = cell;
    const n = nx * ny;
    this.a = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.ta = new Float32Array(n);
    this.tvx = new Float32Array(n);
    this.tvy = new Float32Array(n);
    this.maxA = 0;
    this.maxSpeed = 0;
  }

  // Pours liquid and momentum in around the cursor with a gaussian falloff (sigma = radius / 2).
  splat(px, py, pvx, pvy, radius, injectA, injectV, dtFrames) {
    const { nx, ny, cell } = this;
    const i0 = Math.max(0, Math.floor((px - radius) / cell));
    const i1 = Math.min(nx - 1, Math.ceil((px + radius) / cell));
    const j0 = Math.max(0, Math.floor((py - radius) / cell));
    const j1 = Math.min(ny - 1, Math.ceil((py + radius) / cell));
    const k = -2 / (radius * radius);
    for (let j = j0; j <= j1; j += 1) {
      const dy = (j + 0.5) * cell - py;
      for (let i = i0; i <= i1; i += 1) {
        const dx = (i + 0.5) * cell - px;
        const w = Math.exp((dx * dx + dy * dy) * k) * dtFrames;
        if (w < 0.002) continue;
        const idx = j * nx + i;
        this.a[idx] = Math.min(1, this.a[idx] + w * injectA);
        this.vx[idx] += w * injectV * pvx;
        this.vy[idx] += w * injectV * pvy;
      }
    }
  }

  // Lets particle splashes under the text refract it too. Only fluid cells carry velocity.
  addFluid(fluid, j0, j1, k, dtFrames) {
    const { nx, ny } = this;
    const n = fluid.fNumY;
    const jStart = Math.max(1, j0);
    const jEnd = Math.min(ny - 2, j1);
    const scale = k * dtFrames;
    for (let j = jStart; j <= jEnd; j += 1) {
      for (let i = 1; i < nx - 1; i += 1) {
        const c = i * n + j;
        if (fluid.cellType[c] !== 0) continue;
        this.vx[j * nx + i] += scale * 0.5 * (fluid.u[c] + fluid.u[c + n]);
        this.vy[j * nx + i] += scale * 0.5 * (fluid.v[c] + fluid.v[c + 1]);
      }
    }
  }

  // Decay, then a light 3x3 blur so blobs spread and flatten instead of flickering per cell.
  // `jFrom..jTo` limits the max-speed bookkeeping to the rows under the text, so the renderer
  // can take its single-draw fast path while liquid moves elsewhere.
  step(decayA, decayV, blurMix, dtFrames, jFrom = 0, jTo = this.ny - 1) {
    const { nx, ny, a, vx, vy, ta, tvx, tvy } = this;
    const dA = decayA ** dtFrames;
    const dV = decayV ** dtFrames;
    const mix = Math.min(1, blurMix * dtFrames);
    const keep = 1 - mix;
    let maxA = 0;
    let maxSpeed2 = 0;
    for (let j = 0; j < ny; j += 1) {
      const jm = j > 0 ? j - 1 : 0;
      const jp = j < ny - 1 ? j + 1 : ny - 1;
      for (let i = 0; i < nx; i += 1) {
        const im = i > 0 ? i - 1 : 0;
        const ip = i < nx - 1 ? i + 1 : nx - 1;
        let sa = 0;
        let sx = 0;
        let sy = 0;
        for (let jj = jm; jj <= jp; jj += 1) {
          const row = jj * nx;
          sa += a[row + im] + a[row + i] + a[row + ip];
          sx += vx[row + im] + vx[row + i] + vx[row + ip];
          sy += vy[row + im] + vy[row + i] + vy[row + ip];
        }
        const idx = j * nx + i;
        const na = (a[idx] * keep + (sa / 9) * mix) * dA;
        const nvx = (vx[idx] * keep + (sx / 9) * mix) * dV;
        const nvy = (vy[idx] * keep + (sy / 9) * mix) * dV;
        ta[idx] = na < 0.001 ? 0 : na;
        tvx[idx] = nvx;
        tvy[idx] = nvy;
        if (na > maxA) maxA = na;
        if (j >= jFrom && j <= jTo) {
          const s2 = nvx * nvx + nvy * nvy;
          if (s2 > maxSpeed2) maxSpeed2 = s2;
        }
      }
    }
    this.a = ta; this.ta = a;
    this.vx = tvx; this.tvx = vx;
    this.vy = tvy; this.tvy = vy;
    this.maxA = maxA;
    this.maxSpeed = Math.sqrt(maxSpeed2);
  }

  // Displacement for a tile: the liquid's own motion plus a lens-like term from the gradient of
  // the liquid amount, gated by local speed so a resting blob does not keep the letters bent.
  // Below `deadZone` (as a fraction of vRef) a tile stays put, so the cuts are a few bold chunks
  // in the liquid's core rather than a haze of one-pixel slivers around it.
  offsetAt(i, j, maxOff, vRef, gradientGain, deadZone, out) {
    const { nx, ny, a, vx, vy } = this;
    const idx = j * nx + i;
    const sx = vx[idx];
    const sy = vy[idx];
    const speed = Math.hypot(sx, sy);
    const r = Math.min(1, Math.max(0, (speed / vRef - deadZone) / (1 - deadZone)));
    if (r === 0) { out[0] = 0; out[1] = 0; return; }
    const response = r * r * (3 - 2 * r);
    const gx = a[j * nx + Math.min(nx - 1, i + 1)] - a[j * nx + Math.max(0, i - 1)];
    const gy = a[Math.min(ny - 1, j + 1) * nx + i] - a[Math.max(0, j - 1) * nx + i];
    const along = (maxOff * response) / speed;
    let ox = sx * along + gradientGain * gx * maxOff * response;
    let oy = sy * along + gradientGain * gy * maxOff * response;
    const len = Math.hypot(ox, oy);
    if (len > maxOff) { ox *= maxOff / len; oy *= maxOff / len; }
    out[0] = ox;
    out[1] = oy;
  }
}
