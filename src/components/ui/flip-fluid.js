// FLIP / PIC fluid simulation in pixel space (y down).
// Based on Matthias Müller's "Ten Minute Physics" FLIP water simulator (MIT),
// tuned to behave like the particle field on lusion.co/about.

const FLUID_CELL = 0;
const AIR_CELL = 1;
const SOLID_CELL = 2;

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);

export class FlipFluid {
  constructor(width, height, spacing, particleRadius, maxParticles, looseness = 3.2) {
    this.fNumX = Math.floor(width / spacing) + 1;
    this.fNumY = Math.floor(height / spacing) + 1;
    this.h = Math.max(width / this.fNumX, height / this.fNumY);
    this.fInvSpacing = 1 / this.h;
    this.fNumCells = this.fNumX * this.fNumY;

    const n = this.fNumCells;
    this.u = new Float32Array(n);
    this.v = new Float32Array(n);
    this.du = new Float32Array(n);
    this.dv = new Float32Array(n);
    this.prevU = new Float32Array(n);
    this.prevV = new Float32Array(n);
    this.s = new Float32Array(n);
    this.cellType = new Int8Array(n);
    this.particleDensity = new Float32Array(n);

    this.maxParticles = maxParticles;
    this.numParticles = 0;
    this.particlePos = new Float32Array(2 * maxParticles);
    this.particleVel = new Float32Array(2 * maxParticles);
    this.particleActive = new Uint8Array(maxParticles);
    this.particleAngle = new Float32Array(maxParticles);

    this.particleRadius = particleRadius;
    this.pInvSpacing = 1 / (2.2 * particleRadius);
    this.pNumX = Math.floor(width * this.pInvSpacing) + 1;
    this.pNumY = Math.floor(height * this.pInvSpacing) + 1;
    this.pNumCells = this.pNumX * this.pNumY;
    this.numCellParticles = new Int32Array(this.pNumCells);
    this.firstCellParticle = new Int32Array(this.pNumCells + 1);
    this.cellParticleIds = new Int32Array(maxParticles);

    // How loosely the fluid settles: rest density for particles spaced `looseness * r` apart.
    this.particleRestDensity = (this.h / (looseness * particleRadius)) ** 2;
    // Drift compensation strength in velocity units (px/s per unit of over-density).
    this.driftStiffness = width / 4;
    // How much of the cursor's velocity a particle picks up when the cursor hits it.
    this.obstacleKick = 2;

    for (let i = 0; i < this.fNumX; i += 1) {
      for (let j = 0; j < this.fNumY; j += 1) {
        const wall = i === 0 || i === this.fNumX - 1 || j === 0 || j === this.fNumY - 1;
        this.s[i * this.fNumY + j] = wall ? 0 : 1;
      }
    }
  }

  emit(x, y, vx, vy) {
    if (this.numParticles >= this.maxParticles) return false;
    const i = this.numParticles;
    this.particlePos[2 * i] = x;
    this.particlePos[2 * i + 1] = y;
    this.particleVel[2 * i] = vx;
    this.particleVel[2 * i + 1] = vy;
    this.particleActive[i] = 1;
    this.particleAngle[i] = Math.random() * Math.PI * 2;
    this.numParticles += 1;
    return true;
  }

  integrateParticles(dt, gravity) {
    const pos = this.particlePos;
    const vel = this.particleVel;
    for (let i = 0; i < this.numParticles; i += 1) {
      if (!this.particleActive[i]) continue;
      vel[2 * i + 1] += dt * gravity;
      pos[2 * i] += vel[2 * i] * dt;
      pos[2 * i + 1] += vel[2 * i + 1] * dt;
    }
  }

  pushParticlesApart(numIters) {
    const pos = this.particlePos;
    this.numCellParticles.fill(0);
    for (let i = 0; i < this.numParticles; i += 1) {
      if (!this.particleActive[i]) continue;
      const xi = clamp(Math.floor(pos[2 * i] * this.pInvSpacing), 0, this.pNumX - 1);
      const yi = clamp(Math.floor(pos[2 * i + 1] * this.pInvSpacing), 0, this.pNumY - 1);
      this.numCellParticles[xi * this.pNumY + yi] += 1;
    }
    let first = 0;
    for (let i = 0; i < this.pNumCells; i += 1) {
      first += this.numCellParticles[i];
      this.firstCellParticle[i] = first;
    }
    this.firstCellParticle[this.pNumCells] = first;
    for (let i = 0; i < this.numParticles; i += 1) {
      if (!this.particleActive[i]) continue;
      const xi = clamp(Math.floor(pos[2 * i] * this.pInvSpacing), 0, this.pNumX - 1);
      const yi = clamp(Math.floor(pos[2 * i + 1] * this.pInvSpacing), 0, this.pNumY - 1);
      const cell = xi * this.pNumY + yi;
      this.firstCellParticle[cell] -= 1;
      this.cellParticleIds[this.firstCellParticle[cell]] = i;
    }

    const minDist = 2 * this.particleRadius;
    const minDist2 = minDist * minDist;
    for (let iter = 0; iter < numIters; iter += 1) {
      for (let i = 0; i < this.numParticles; i += 1) {
        if (!this.particleActive[i]) continue;
        const px = pos[2 * i];
        const py = pos[2 * i + 1];
        const pxi = Math.floor(px * this.pInvSpacing);
        const pyi = Math.floor(py * this.pInvSpacing);
        const x0 = Math.max(pxi - 1, 0);
        const y0 = Math.max(pyi - 1, 0);
        const x1 = Math.min(pxi + 1, this.pNumX - 1);
        const y1 = Math.min(pyi + 1, this.pNumY - 1);
        for (let xi = x0; xi <= x1; xi += 1) {
          for (let yi = y0; yi <= y1; yi += 1) {
            const cell = xi * this.pNumY + yi;
            const start = this.firstCellParticle[cell];
            const end = this.firstCellParticle[cell + 1];
            for (let k = start; k < end; k += 1) {
              const id = this.cellParticleIds[k];
              if (id === i) continue;
              const qx = pos[2 * id];
              const qy = pos[2 * id + 1];
              let dx = qx - px;
              let dy = qy - py;
              const d2 = dx * dx + dy * dy;
              if (d2 > minDist2 || d2 === 0) continue;
              const d = Math.sqrt(d2);
              const sMove = (0.5 * (minDist - d)) / d;
              dx *= sMove;
              dy *= sMove;
              pos[2 * i] -= dx;
              pos[2 * i + 1] -= dy;
              pos[2 * id] += dx;
              pos[2 * id + 1] += dy;
            }
          }
        }
      }
    }
  }

  // Circular obstacle at (ox, oy) moving with (ovx, ovy). Returns ids that hit the floor while draining.
  handleParticleCollisions(ox, oy, oRadius, ovx, ovy, draining, drained) {
    const h = this.h;
    const r = this.particleRadius;
    const minX = h + r;
    const maxX = (this.fNumX - 1) * h - r;
    const minY = h + r;
    const maxY = (this.fNumY - 1) * h - r;
    const hit = oRadius + r;
    const hit2 = hit * hit;
    const pos = this.particlePos;
    const vel = this.particleVel;

    for (let i = 0; i < this.numParticles; i += 1) {
      if (!this.particleActive[i]) continue;
      let x = pos[2 * i];
      let y = pos[2 * i + 1];
      const dx = x - ox;
      const dy = y - oy;
      const d2 = dx * dx + dy * dy;
      if (d2 < hit2 && d2 > 0) {
        const d = Math.sqrt(d2);
        const f = (hit - d) / d;
        x += dx * f;
        y += dy * f;
        vel[2 * i] = ovx * this.obstacleKick;
        vel[2 * i + 1] = ovy * this.obstacleKick;
      }
      if (x < minX) { x = minX; vel[2 * i] = 0; }
      if (x > maxX) { x = maxX; vel[2 * i] = 0; }
      if (y < minY) { y = minY; vel[2 * i + 1] = 0; }
      if (y > maxY) {
        if (draining) { this.particleActive[i] = 0; drained.push(i); }
        else { y = maxY; vel[2 * i + 1] = 0; }
      }
      pos[2 * i] = x;
      pos[2 * i + 1] = y;
    }
  }

  updateParticleDensity() {
    const n = this.fNumY;
    const h = this.h;
    const h1 = this.fInvSpacing;
    const h2 = 0.5 * h;
    const d = this.particleDensity;
    d.fill(0);
    for (let i = 0; i < this.numParticles; i += 1) {
      if (!this.particleActive[i]) continue;
      const x = clamp(this.particlePos[2 * i], h, (this.fNumX - 1) * h);
      const y = clamp(this.particlePos[2 * i + 1], h, (this.fNumY - 1) * h);
      const x0 = Math.floor((x - h2) * h1);
      const tx = (x - h2 - x0 * h) * h1;
      const x1 = Math.min(x0 + 1, this.fNumX - 2);
      const y0 = Math.floor((y - h2) * h1);
      const ty = (y - h2 - y0 * h) * h1;
      const y1 = Math.min(y0 + 1, this.fNumY - 2);
      const sx = 1 - tx;
      const sy = 1 - ty;
      if (x0 < this.fNumX && y0 < this.fNumY) d[x0 * n + y0] += sx * sy;
      if (x1 < this.fNumX && y0 < this.fNumY) d[x1 * n + y0] += tx * sy;
      if (x1 < this.fNumX && y1 < this.fNumY) d[x1 * n + y1] += tx * ty;
      if (x0 < this.fNumX && y1 < this.fNumY) d[x0 * n + y1] += sx * ty;
    }
  }

  transferVelocities(toGrid, flipRatio) {
    const n = this.fNumY;
    const h = this.h;
    const h1 = this.fInvSpacing;
    const h2 = 0.5 * h;

    if (toGrid) {
      this.prevU.set(this.u);
      this.prevV.set(this.v);
      this.du.fill(0);
      this.dv.fill(0);
      this.u.fill(0);
      this.v.fill(0);
      for (let i = 0; i < this.fNumCells; i += 1) this.cellType[i] = this.s[i] === 0 ? SOLID_CELL : AIR_CELL;
      for (let i = 0; i < this.numParticles; i += 1) {
        if (!this.particleActive[i]) continue;
        const xi = clamp(Math.floor(this.particlePos[2 * i] * h1), 0, this.fNumX - 1);
        const yi = clamp(Math.floor(this.particlePos[2 * i + 1] * h1), 0, this.fNumY - 1);
        const cell = xi * n + yi;
        if (this.cellType[cell] === AIR_CELL) this.cellType[cell] = FLUID_CELL;
      }
    }

    for (let component = 0; component < 2; component += 1) {
      const dx = component === 0 ? 0 : h2;
      const dy = component === 0 ? h2 : 0;
      const f = component === 0 ? this.u : this.v;
      const prevF = component === 0 ? this.prevU : this.prevV;
      const dF = component === 0 ? this.du : this.dv;

      for (let i = 0; i < this.numParticles; i += 1) {
        if (!this.particleActive[i]) continue;
        const x = clamp(this.particlePos[2 * i], h, (this.fNumX - 1) * h);
        const y = clamp(this.particlePos[2 * i + 1], h, (this.fNumY - 1) * h);
        const x0 = Math.min(Math.floor((x - dx) * h1), this.fNumX - 2);
        const tx = (x - dx - x0 * h) * h1;
        const x1 = Math.min(x0 + 1, this.fNumX - 2);
        const y0 = Math.min(Math.floor((y - dy) * h1), this.fNumY - 2);
        const ty = (y - dy - y0 * h) * h1;
        const y1 = Math.min(y0 + 1, this.fNumY - 2);
        const sx = 1 - tx;
        const sy = 1 - ty;
        const d0 = sx * sy;
        const d1 = tx * sy;
        const d2 = tx * ty;
        const d3 = sx * ty;
        const nr0 = x0 * n + y0;
        const nr1 = x1 * n + y0;
        const nr2 = x1 * n + y1;
        const nr3 = x0 * n + y1;

        if (toGrid) {
          const pv = this.particleVel[2 * i + component];
          f[nr0] += pv * d0; dF[nr0] += d0;
          f[nr1] += pv * d1; dF[nr1] += d1;
          f[nr2] += pv * d2; dF[nr2] += d2;
          f[nr3] += pv * d3; dF[nr3] += d3;
        } else {
          const offset = component === 0 ? n : 1;
          const valid0 = this.cellType[nr0] !== AIR_CELL || this.cellType[nr0 - offset] !== AIR_CELL ? 1 : 0;
          const valid1 = this.cellType[nr1] !== AIR_CELL || this.cellType[nr1 - offset] !== AIR_CELL ? 1 : 0;
          const valid2 = this.cellType[nr2] !== AIR_CELL || this.cellType[nr2 - offset] !== AIR_CELL ? 1 : 0;
          const valid3 = this.cellType[nr3] !== AIR_CELL || this.cellType[nr3 - offset] !== AIR_CELL ? 1 : 0;
          const v = this.particleVel[2 * i + component];
          const dsum = valid0 * d0 + valid1 * d1 + valid2 * d2 + valid3 * d3;
          if (dsum > 0) {
            const picV = (valid0 * d0 * f[nr0] + valid1 * d1 * f[nr1] + valid2 * d2 * f[nr2] + valid3 * d3 * f[nr3]) / dsum;
            const corr = (valid0 * d0 * (f[nr0] - prevF[nr0]) + valid1 * d1 * (f[nr1] - prevF[nr1]) + valid2 * d2 * (f[nr2] - prevF[nr2]) + valid3 * d3 * (f[nr3] - prevF[nr3])) / dsum;
            const flipV = v + corr;
            this.particleVel[2 * i + component] = (1 - flipRatio) * picV + flipRatio * flipV;
          }
        }
      }

      if (toGrid) {
        for (let i = 0; i < f.length; i += 1) if (dF[i] > 0) f[i] /= dF[i];
        // Restore solid cell velocities.
        for (let i = 0; i < this.fNumX; i += 1) {
          for (let j = 0; j < this.fNumY; j += 1) {
            const solid = this.cellType[i * n + j] === SOLID_CELL;
            if (solid || (i > 0 && this.cellType[(i - 1) * n + j] === SOLID_CELL)) this.u[i * n + j] = this.prevU[i * n + j];
            if (solid || (j > 0 && this.cellType[i * n + j - 1] === SOLID_CELL)) this.v[i * n + j] = this.prevV[i * n + j];
          }
        }
      }
    }
  }

  solveIncompressibility(numIters, overRelaxation, compensateDrift) {
    const n = this.fNumY;
    const k = this.driftStiffness;
    for (let iter = 0; iter < numIters; iter += 1) {
      for (let i = 1; i < this.fNumX - 1; i += 1) {
        for (let j = 1; j < this.fNumY - 1; j += 1) {
          const center = i * n + j;
          if (this.cellType[center] !== FLUID_CELL) continue;
          const left = (i - 1) * n + j;
          const right = (i + 1) * n + j;
          const bottom = i * n + j - 1;
          const top = i * n + j + 1;
          const sx0 = this.s[left];
          const sx1 = this.s[right];
          const sy0 = this.s[bottom];
          const sy1 = this.s[top];
          const sSum = sx0 + sx1 + sy0 + sy1;
          if (sSum === 0) continue;
          let div = this.u[right] - this.u[center] + this.v[top] - this.v[center];
          if (this.particleRestDensity > 0 && compensateDrift) {
            const compression = this.particleDensity[center] - this.particleRestDensity;
            if (compression > 0) div -= k * compression;
          }
          const p = (-div / sSum) * overRelaxation;
          this.u[center] -= sx0 * p;
          this.u[right] += sx1 * p;
          this.v[center] -= sy0 * p;
          this.v[top] += sy1 * p;
        }
      }
    }
  }

  simulate(dt, gravity, flipRatio, pressureIters, separateIters, overRelaxation, obstacle, draining, drained, dampingRate = 0.9) {
    this.integrateParticles(dt, gravity);
    this.pushParticlesApart(separateIters);
    this.handleParticleCollisions(obstacle.x, obstacle.y, obstacle.radius, obstacle.vx, obstacle.vy, draining, drained);
    this.transferVelocities(true, flipRatio);
    this.updateParticleDensity();
    this.solveIncompressibility(pressureIters, overRelaxation, true);
    this.transferVelocities(false, flipRatio);
    // Light viscous damping so the fluid settles instead of jittering forever.
    const damp = Math.exp(-dampingRate * dt);
    const vel = this.particleVel;
    for (let i = 0; i < 2 * this.numParticles; i += 1) vel[i] *= damp;
  }
}
