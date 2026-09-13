import { useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ArrowDown, Plus, Minus, X, Menu, Search, Target, Layers, Zap, Mail, Copy, Check, Download, Workflow, MousePointer2, BarChart3, FileText } from 'lucide-react';
import GrowthScene from './components/growth-scene';
import DancingLetters from './components/ui/dancing-letters';
import { TubesBackground } from './components/ui/neon-flow';
import { MagneticCursor } from './components/ui/magnetic-cursor';
import { FlipFluid } from './components/ui/flip-fluid';

import { capabilities, projects, process, email } from './portfolio-data';
import './App.css';

const navigation = ['About', 'Expertise', 'Work', 'Experience', 'Stack', 'Resume', 'Contact'];
const icons = [Search, FileText, Target, Mail, Workflow];

function SectionHeading({ label, aside, children, description }) {
  const ref = useRef(null);
  const lines = (Array.isArray(children) ? children : [children]).flatMap((child) => {
    if (child == null || child === false || child === true) return [];
    if (typeof child === 'string' || typeof child === 'number') return String(child).split('\n');
    if (typeof child === 'object' && child.type === 'br') return [];
    return [];
  }).filter(line => String(line).trim());

  return <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-12% 0px' }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}><motion.div className="section-meta meta" variants={revealUp}><span>{label}</span>{aside && <span>{aside}</span>}</motion.div><div className="heading-row"><motion.h2 className="section-heading-title" variants={revealUp}>{lines.map((line, index) => <span className="reveal-line" key={`${line || 'line'}-${index}`} style={{ '--line-index': index }}><span>{line || '\u00A0'}</span></span>)}</motion.h2>{description && <motion.p variants={revealUp}>{description}</motion.p>}</div></motion.div>;
}

function ScrollReveal({ children, className = '', delay = 0, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [40, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.95, 1, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ opacity, y, scale }}
      {...props}
    >
      {typeof children === 'function' ? children({ opacity, y, scale }) : children}
    </motion.div>
  );
}

function Counter({ value, suffix = '', prefix = '', duration = 2, delay = 0 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center start'] });
  const [animatedValue, setAnimatedValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (scrollYProgress.get() > 0.1 && !hasAnimated.current) {
      hasAnimated.current = true;
      const startValue = 0;
      const endValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (endValue - startValue) * eased);
        setAnimatedValue(current);
        if (progress < 1) requestAnimationFrame(animate);
      };
      setTimeout(animate, delay);
    }
  }, [scrollYProgress, value, duration, delay]);

  return <motion.span ref={ref} className="counter-value">{prefix}{animatedValue.toLocaleString()}{suffix}</motion.span>;
}

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function RevealText({ as: Tag = 'div', children, className = '' }) {
  const text = String(children).split('\n');
  return <Tag className={className}>{text.map((line, index) => <span className="reveal-line" key={`${line}-${index}`}><motion.span variants={revealUp}>{line}</motion.span></span>)}</Tag>;
}

function Tilt({ children, className = '' }) {
  const reduced = useReducedMotion();
  function move(event) {
    if (reduced || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${-((event.clientY - rect.top) / rect.height - 0.5) * 7}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 7}deg`);
  }
  function reset(event) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  }
  return <div className={`tilt ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}

function ProjectVisual({ project }) {
  return <div className={`project-visual visual-${project.theme}`} aria-hidden="true">
    <div className="visual-top meta"><span>{project.company}</span><span>Outcome / {project.category}</span></div>
    {project.id === 'seo' && <div className="seo-visual"><div className="seo-plot"><div className="plot-caption meta">Website health <span>+77 pts</span></div><svg viewBox="0 0 420 135" fill="none"><path className="plot-grid" d="M0 20H420M0 65H420M0 110H420M70 0V135M175 0V135M280 0V135M385 0V135" /><path className="plot-area" d="M0 118L48 111L85 115L130 85L170 90L215 60L260 67L310 33L360 40L410 8V135H0Z" /><path className="plot-line" d="M0 118L48 111L85 115L130 85L170 90L215 60L260 67L310 33L360 40L410 8" /><circle cx="410" cy="8" r="5" /></svg><div className="plot-ends"><span>19</span><span>96 <ArrowUpRight size={16} /></span></div></div><div className="seo-document"><span className="meta">Product index</span><span /><span /><span /><div><Check size={12} /> Optimized for discovery</div></div></div>}
    {project.id === 'paid' && <div className="paid-visual"><div className="paid-rings"><i /><i /><i /><Target size={36} /></div><div className="paid-label meta"><span className="status-dot" /> High-intent audiences</div><div className="paid-bars">{[20, 31, 25, 45, 38, 55, 48, 70, 62, 86, 79, 100].map((n, i) => <i key={i} style={{ height: `${n}%` }} />)}</div></div>}
    {project.id === 'b2b' && <div className="network-visual"><svg viewBox="0 0 420 210"><g fill="none" stroke="currentColor" strokeWidth="1"><path d="M210 100L70 45M210 100L345 45M210 100L70 170M210 100L350 165M210 100L210 195M70 45L70 170M345 45L350 165" /><circle cx="210" cy="100" r="75" strokeDasharray="3 8" /></g></svg>{[[50, 47], [17, 21], [82, 21], [17, 81], [83, 79], [50, 92]].map(([x, y], i) => <div className={`network-node node-${i}`} key={i} style={{ left: `${x}%`, top: `${y}%` }}>{i === 0 ? <span>JP</span> : <span className="person-glyph" />}</div>)}<span className="network-tag meta">Built on relevance.</span></div>}
    <div className="visual-metric"><strong>{project.metric}</strong><span>{project.label}</span><ArrowUpRight /></div>
  </div>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} className="case-dialog" aria-labelledby="case-title" onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) ref.current.close(); }}><div className="case-body"><button className="icon-button dialog-close" aria-label="Close case study" onClick={() => ref.current.close()}><X /></button><span className="meta accent">{project.company} / {project.category}</span><h2 id="case-title">{project.title}</h2><p className="case-intro">{project.summary}</p><ProjectVisual project={project} /><h3>The challenge</h3><p>{project.challenge}</p><h3>The approach</h3><ol>{project.approach.map(step => <li key={step}>{step}</li>)}</ol><div className="case-outcomes">{project.outcomes.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="case-note">{project.note}</p><a className="button button-dark" href="#contact" onClick={() => ref.current.close()}>Let's talk about your growth <ArrowUpRight size={18} /></a></div></dialog>;
}

function FloatingProjectCard({ project, index, progress, compact, onOpen }) {
  const desktopX = [-390, 0, 390][index] ?? 0;
  const compactY = [-320, 0, 320][index] ?? 0;
  const deckX = [0, 7, 14][index] ?? 0;
  const deckY = [0, 8, 16][index] ?? 0;
  const leftTurn = [-72, -56, -40][index] ?? -52;
  const x = useTransform(progress, [0, 0.26, 0.58, 0.88, 1], [deckX, deckX, compact ? 0 : desktopX * 0.36, compact ? 0 : desktopX, compact ? 0 : desktopX]);
  const y = useTransform(progress, [0, 0.26, 0.58, 0.88, 1], [deckY, deckY, compact ? compactY * 0.55 : 0, compact ? compactY : 0, compact ? compactY : 0]);
  const rotate = useTransform(progress, [0, 0.26, 0.58, 0.88, 1], [0, 0, [-10, 2, 10][index] ?? 0, 0, 0]);
  const rotateY = useTransform(progress, [0, 0.28, 0.62, 0.88, 1], [0, 0, compact ? 0 : leftTurn, compact ? 0 : -8, 0]);
  const scale = useTransform(progress, [0, 0.26, 0.88, 1], [1 - index * 0.02, 1 - index * 0.02, compact ? 0.9 : 0.84, compact ? 0.9 : 0.84]);
  const visualOpacity = useTransform(progress, [0, 0.18, 0.42], [index === 0 ? 1 : 0.35, index === 0 ? 1 : 0.35, 1]);
  const infoOpacity = useTransform(progress, [0.48, 0.72], [0, 1]);
  const infoY = useTransform(progress, [0.48, 0.72], [24, 0]);

  return <motion.div className="floating-project-card" style={{ x, y, rotate, rotateY, scale, zIndex: 5 - index }}>
    <Tilt className="project-card">
      <button className="project-open" onClick={() => onOpen(project)} aria-label={`View ${project.company} case study`}>
        <motion.div style={{ opacity: visualOpacity }}><ProjectVisual project={project} /></motion.div>
        <motion.div className="project-info" style={{ opacity: infoOpacity, y: infoY }}>
          <div className="meta"><span>{project.company}</span><span>{project.category}</span></div>
          <h3>{project.title}</h3>
          <div className="project-link">Explore the case study <ArrowUpRight size={18} /></div>
        </motion.div>
      </button>
    </Tilt>
  </motion.div>;
}

function WorkShowcase({ projects: visibleProjects, onOpen }) {
  const ref = useRef(null);
  const [compact, setCompact] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90px', 'end end'] });
  const stageScale = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [0.82, 1, 1, 0.96]);
  const stageY = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [reduced ? 0 : 60, 0, 0, reduced ? 0 : -34]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 850px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return <div className="work-scroll-scene" ref={ref}>
    <motion.div className="work-sticky-stage" style={{ scale: stageScale, y: stageY }}>
      <div className="work-card-stage" aria-label="Selected project case studies">
        {visibleProjects.map((project, index) => <FloatingProjectCard key={project.id} project={project} index={index} progress={scrollYProgress} compact={compact} onOpen={onOpen} />)}
      </div>
    </motion.div>
  </div>;
}

function MobileMenu({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} className="mobile-menu" aria-label="Site navigation" onClose={onClose}><div className="menu-header"><span className="wordmark">JAYA PRIYA<span>.</span></span><button className="icon-button" aria-label="Close menu" onClick={() => ref.current.close()}><X /></button></div><nav>{navigation.map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => ref.current.close()}>{item}<ArrowUpRight /></a>)}</nav><div className="meta">Digital marketing & growth specialist</div></dialog>;
}


function ContactParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const fit = (x, a, b, c, d) => c + (d - c) * Math.min(1, Math.max(0, (x - a) / (b - a)));

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let fluid = null;
    let gravity = 0;
    let emitSpeed = 0;
    let visible = true;
    let lastTime = 0;
    let shapes = null;
    let sizes = null;
    let prevPos = null;
    let shapeSize = 12;
    const emitter = { x: 0, y: 0 };
    const pointer = { x: -1e4, y: -1e4, px: -1e4, py: -1e4, vx: 0, vy: 0, active: false, holding: false, touch: false };
    const drained = [];

    function setup() {
      const cellsX = Math.ceil(fit(width, 320, 2560, 20, 80));
      const spacing = width / cellsX;
      const radius = Math.max(3.2, spacing * 0.2);
      const looseness = 2.6;
      const fillFraction = 0.25;
      const count = Math.round(Math.min(3200, Math.max(320, (width * height * fillFraction) / (looseness * radius) ** 2)));
      fluid = new FlipFluid(width, height, spacing, radius, count, looseness);
      // Gentler density correction keeps the surface level without pumping energy into the pile.
      fluid.driftStiffness = width / 16;
      // Particles the cursor hits pick up a bit more than cursor speed; 2x threw the whole pile to the ceiling.
      fluid.obstacleKick = 1.2;
      gravity = Math.ceil(fit(width, 320, 2560, 15, 3)) * (width / 2);
      emitSpeed = gravity * 0.1;
      // Shapes never exceed the collision diameter, so they touch but no longer pass through each other.
      shapeSize = radius * 2;
      prevPos = new Float32Array(count * 2);
      emitter.x = width / 2;
      emitter.y = height * 0.5;
      shapes = new Uint8Array(count);
      sizes = new Float32Array(count);
      for (let i = 0; i < count; i += 1) {
        shapes[i] = Math.floor(Math.random() * 4);
        sizes[i] = shapeSize * (0.7 + Math.random() * 0.3);
      }
    }

    function emitFrom(x, y) {
      const jitter = width / 200;
      const vy = (2 + Math.random() ** 2 * 3) * emitSpeed;
      return fluid.emit(x + (Math.random() - 0.5) * jitter, y + (Math.random() - 0.5) * jitter, 0, vy);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = Math.abs(rect.width - width) > 1;
      dpr = nextDpr;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || !fluid) setup();
    }

    function updatePointer(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      pointer.touch = event.pointerType === 'touch';
    }

    function drawParticles() {
      const pos = fluid.particlePos;
      const angle = fluid.particleAngle;
      ctx.globalAlpha = 0.96;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      for (let i = 0; i < fluid.numParticles; i += 1) {
        if (!fluid.particleActive[i] || shapes[i] === 3) continue;
        const x = pos[2 * i];
        const y = pos[2 * i + 1];
        const s = sizes[i];
        const a = angle[i];
        if (shapes[i] === 0) {
          ctx.moveTo(x + s * 0.5, y);
          ctx.arc(x, y, s * 0.5, 0, Math.PI * 2);
        } else if (shapes[i] === 1) {
          const h = s * 0.46;
          const c = Math.cos(a);
          const n = Math.sin(a);
          ctx.moveTo(x + (-h * c + h * n), y + (-h * n - h * c));
          ctx.lineTo(x + (h * c + h * n), y + (h * n - h * c));
          ctx.lineTo(x + (h * c - h * n), y + (h * n + h * c));
          ctx.lineTo(x + (-h * c - h * n), y + (-h * n + h * c));
          ctx.closePath();
        } else {
          const r = s * 0.58;
          for (let k = 0; k < 3; k += 1) {
            const t = a + (k * Math.PI * 2) / 3;
            const px = x + Math.cos(t) * r;
            const py = y + Math.sin(t) * r;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
        }
      }
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(1.4, shapeSize * 0.2);
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < fluid.numParticles; i += 1) {
        if (!fluid.particleActive[i] || shapes[i] !== 3) continue;
        const x = pos[2 * i];
        const y = pos[2 * i + 1];
        const h = sizes[i] * 0.5;
        const c = Math.cos(angle[i]) * h;
        const n = Math.sin(angle[i]) * h;
        ctx.moveTo(x - c, y - n);
        ctx.lineTo(x + c, y + n);
        ctx.moveTo(x + n, y - c);
        ctx.lineTo(x - n, y + c);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function tick(time) {
      animationFrame = requestAnimationFrame(tick);
      if (!visible) { lastTime = time; return; }
      const dt = Math.min(1 / 60, Math.max(1 / 120, (time - lastTime) / 1000 || 1 / 60));
      lastTime = time;

      // Pouring: on load the shapes pour in from the centre; while holding, they drain and pour from the cursor.
      const pouring = pointer.holding && !pointer.touch && pointer.active;
      const source = pouring ? pointer : emitter;
      let budget = Math.ceil(2000 * dt);
      while (budget > 0 && drained.length > 0) {
        const id = drained.pop();
        fluid.particlePos[2 * id] = source.x + (Math.random() - 0.5) * width / 200;
        fluid.particlePos[2 * id + 1] = source.y;
        fluid.particleVel[2 * id] = 0;
        fluid.particleVel[2 * id + 1] = (2 + Math.random() ** 2 * 3) * emitSpeed;
        fluid.particleActive[id] = 1;
        budget -= 1;
      }
      while (budget > 0 && emitFrom(source.x, source.y)) budget -= 1;

      // Cursor obstacle: grows with cursor speed, like the reference.
      if (pointer.active) {
        pointer.vx = (pointer.x - pointer.px) / dt;
        pointer.vy = (pointer.y - pointer.py) / dt;
      } else { pointer.vx = 0; pointer.vy = 0; }
      const speed = Math.hypot(pointer.vx, pointer.vy);
      let factor = pointer.touch ? (pointer.holding ? 0.35 : 0) : fit(speed / width, 0, 1, 0.2, 1);
      if (pouring) factor = 0;
      const obstacle = pointer.active && factor > 0
        ? { x: pointer.x, y: pointer.y, radius: 70 * factor, vx: pointer.vx, vy: pointer.vy }
        : { x: -1e4, y: -1e4, radius: 0, vx: 0, vy: 0 };
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      // Two sub-steps per frame: fast particles otherwise cross more than a grid cell per step,
      // which shows up as a shimmering pile.
      prevPos.set(fluid.particlePos);
      fluid.simulate(dt * 0.5, gravity, 0, 60, 4, 1, obstacle, pouring, drained);
      fluid.simulate(dt * 0.5, gravity, 0, 60, 4, 1, obstacle, pouring, drained);

      // Spin each shape with how far it actually moved. Using velocity here made every shape
      // rotate slowly forever, because a resting particle still carries one frame of gravity.
      const pos = fluid.particlePos;
      const angle = fluid.particleAngle;
      for (let i = 0; i < fluid.numParticles; i += 1) {
        const dx = pos[2 * i] - prevPos[2 * i];
        const dy = pos[2 * i + 1] - prevPos[2 * i + 1];
        angle[i] += Math.max(-0.3, Math.min(0.3, (dx - dy * 0.5) * 0.004));
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#1d37ff';
      ctx.fillRect(0, 0, width, height);
      drawParticles();
    }

    resize();
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(tick);

    const leave = () => { pointer.active = false; pointer.holding = false; pointer.x = -1e4; pointer.y = -1e4; pointer.px = -1e4; pointer.py = -1e4; };
    const down = (event) => {
      if (event.target.closest('input, textarea, select, button, a')) return;
      updatePointer(event);
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.holding = true;
    };
    const up = () => { pointer.holding = false; if (pointer.touch) leave(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '80px' });
    observer.observe(host);

    host.addEventListener('pointermove', updatePointer);
    host.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    host.addEventListener('pointerleave', leave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      host.removeEventListener('pointermove', updatePointer);
      host.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      host.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="contact-particle-canvas" aria-hidden="true" />;
}

function HeroBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const orbOneY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div ref={ref} className="hero-background" aria-hidden="true">
      <div className="hero-gradient-orb orb-1" style={{ y: orbOneY, opacity }} />
      <div className="hero-gradient-orb orb-2" style={{ y: orbTwoY, opacity }} />
      <div className="hero-gradient-orb orb-3" style={{ y: orbThreeY, opacity }} />
      <div className="hero-grid-overlay" style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.08, 0.02]) }} />
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');
  const copyTimer = useRef(null);
  const formRef = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch { setStatus(`You can copy the address directly: ${email}`); }
  }
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Let's talk growth — ${String(data.get('name')).trim()}`;
    const body = `Hi Jaya,\n\n${String(data.get('message')).trim()}\n\nInterested in: ${data.get('interest')}\n\n${String(data.get('name')).trim()}\n${data.get('email')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Your email draft is ready in your mail app. Review it and press Send. If it did not open, use the email link below.');
  }
  return (
    <section className="contact-section section dark-section relative" id="contact">
      <ContactParticleCanvas />
      <div className="container relative" style={{ zIndex: 1 }}>
        <motion.div className="section-meta meta" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span><span className="status-dot" /> Start a conversation</span>
          <span>Hold your cursor to gather the particles.</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          LET'S BUILD<br />SOMETHING THAT<br /><span>ACTUALLY GROWS.</span><ArrowUpRight aria-hidden="true" />
        </motion.h2>
        <div className="contact-grid">
          <motion.div className="contact-copy" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <p>Have a challenge, an ambitious target, or a good question? I'd love to hear it.</p>
            <motion.a className="email-link" href={`mailto:${email}`} data-magnetic whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              {email}<ArrowUpRight size={22} />
            </motion.a>
            <motion.button className="text-button" onClick={copyEmail} data-magnetic whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Email copied' : 'Copy email address'}
            </motion.button>
            <span className="contact-location meta">India <span>UTC +05:30</span></span>
          </motion.div>
          <motion.form ref={formRef} className="contact-form" onSubmit={submit} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <motion.div className="form-row" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <motion.label>
                Your name
                <input name="name" autoComplete="name" placeholder="Alex Morgan" maxLength={100} required data-magnetic />
              </motion.label>
              <motion.label>
                Email address
                <input name="email" type="email" autoComplete="email" placeholder="alex@company.com" maxLength={200} required data-magnetic />
              </motion.label>
            </motion.div>
            <motion.label initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }}>
              What can I help with?
              <select name="interest" defaultValue="A connected growth strategy" data-magnetic>
                <option>A connected growth strategy</option>
                <option>SEO & content</option>
                <option>Performance marketing</option>
                <option>B2B & outreach</option>
                <option>AI & automation</option>
                <option>A career opportunity</option>
              </select>
            </motion.label>
            <motion.label initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              A little about your project
              <textarea name="message" placeholder="Where are you now, and where do you want to go?" rows={3} maxLength={3000} required data-magnetic />
            </motion.label>
            <motion.div className="form-footer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }}>
              <span>Click send when you are ready. Click and hold anywhere here to pour the particles from your cursor.</span>
              <button type="submit" className="button button-orange contact-submit" data-magnetic>Let's talk <ArrowUpRight size={19} /></button>
            </motion.div>
            <motion.p role="status" className="form-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{status}</motion.p>
          </motion.form>
        </div>
        <motion.footer initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
          <motion.a className="wordmark" href="#top" data-magnetic whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>JAYA PRIYA<span>.</span></motion.a>
          <span className="meta">© {new Date().getFullYear()} Jaya Priya</span>
          <motion.a className="text-button" href="#top" data-magnetic whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>Back to top <ArrowUpRight size={16} /></motion.a>
        </motion.footer>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [processActive, setProcessActive] = useState(0);
  const [expertiseActive, setExpertiseActive] = useState(0);
  const [filter, setFilter] = useState('All work');
  const [selectedProject, setSelectedProject] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const reduced = useReducedMotion();
  const service = capabilities[expertiseActive];
  const ServiceIcon = icons[expertiseActive];
  const visibleProjects = projects.filter(project => filter === 'All work' || project.category === filter);
  const resultItems = [
    ['800', 'Qualified paid leads', 'Within a 60-day sprint', '+', 'Paid search and social tuned every week around lead quality, not clicks.'],
    ['80', 'Organic B2B leads', 'Through LinkedIn outreach', '+', 'Ideal customer research, LinkedIn content, and personalised email follow-ups.'],
    ['2500', 'Products optimized', 'Copy, metadata & on-page SEO', '+', 'Copy, metadata, and on-page SEO rewritten across an entire catalogue.'],
    ['10', 'Online sales growth', 'For FirstHub Ecom', '×', 'One connected funnel for FirstHub Ecom, from first search to checkout.'],
    ['19 → 96', 'Website health', 'A stronger technical foundation', '', 'Technical SEO fixes that turned a red audit score green.'],
    ['11 → 24', 'Domain authority', 'Building organic credibility', '', 'Steady link building and content that earned its citations.'],
    ['35', 'Webinar sign-ups', 'In just 14 days', '+', 'A two-week outreach sprint with a single, clear ask.'],
  ];
  const [flippedCard, setFlippedCard] = useState(null);
  const [burst, setBurst] = useState(null);
  const burstTimer = useRef(null);
  const burstId = useRef(0);
  useEffect(() => () => clearTimeout(burstTimer.current), []);
  function flipCard(index) {
    setFlippedCard(current => (current === index ? null : index));
    burstId.current += 1;
    setBurst({ index, id: burstId.current });
    clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBurst(null), 800);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><div className="header-inner"><a className="wordmark" href="#top" aria-label="Jaya Priya home">JAYA PRIYA<span>.</span></a><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item} href={`#${item.toLowerCase()}`} className={activeSection === item.toLowerCase() ? 'active' : ''} aria-current={activeSection === item.toLowerCase() ? 'location' : undefined}>{item}</a>)}</nav><a className="header-cta" href="#contact">Let's talk <ArrowUpRight size={16} /></a><button className="icon-button menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu /></button></div><motion.div className="reading-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} /></header>
    <main id="main">
      <section className="hero-section container relative" id="top">
        <HeroBackground />
        <motion.div className="hero-meta meta" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span><span className="status-dot" /> Independent thinking. Measurable impact.</span>
          <span>India <span className="meta-separator">/</span> Portfolio 2026</span>
        </motion.div>
        <div className="masthead">
          <h1 aria-label="Jaya Priya"><DancingLetters text="JAYA PRIYA" /><sup className="name-mark" aria-hidden="true">®</sup></h1>
          <div className="masthead-role">
            <span className="meta">Connecting the dots.</span>
            <p>Digital marketing<br />& growth specialist</p>
            <span className="role-line" />
          </div>
        </div>
        <div className="hero-grid">
          <motion.div className="hero-statement" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}>
            <motion.span className="meta accent" variants={revealUp}>Strategy meets execution.</motion.span>
            <RevealText as="h2" className="hero-title">I TURN
            MARKETING INTO
            MEASURABLE GROWTH.</RevealText>
            <motion.p variants={revealUp}>I connect search, content, paid media, and automation to build one thing: a business that grows.</motion.p>
            <motion.div className="hero-actions" variants={revealUp}>
              <a className="button button-dark" href="#work" data-magnetic>Explore my work <ArrowUpRight size={18} /></a>
              <a className="text-button" href="#about" data-magnetic>The way I think <ArrowDown size={16} /></a>
            </motion.div>
            <motion.div className="hero-footnote meta" variants={revealUp}><span className="tiny-cross">+</span> Many channels. One connected system.</motion.div>
          </motion.div>
          <div className="hero-interactive">
            <GrowthScene active={active} onSelect={setActive} capabilities={capabilities} />
          </div>
        </div>
        <div className="capability-ribbon" aria-label="Growth disciplines">
          {capabilities.map((item, index) => <button key={item.name} aria-pressed={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span className="ribbon-top meta">{item.label}<ArrowUpRight size={14} /></span><span>{item.name}</span></button>)}
        </div>
      </section>

      <div className="dark-zone">
        <div className="dark-zone-bg" aria-hidden="true">
          <TubesBackground className="sticky top-0 h-screen w-full pointer-events-none" enableClickInteraction={false} />
        </div>
      <ScrollReveal className="proof-strip" delay={0.2} stagger={0.1}>
        <div className="container">
          <span className="meta">Strategy.<br />With something to show.</span>
          {[['800', 'qualified leads', '+'], ['2500', 'products optimized', '+'], ['10', 'online sales growth', '×']].map(([value, label, suffix]) => (
            <div key={label} className="proof-stat">
              <Counter value={value} suffix={suffix} duration={1.5} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="section about-section" id="about" delay={0.1}>
        <div className="container">
          <SectionHeading label="01 / The philosophy" aside="Built to work together">
            NO CHANNEL<br />IS AN ISLAND.
          </SectionHeading>
          <div className="about-grid">
            <div className="about-copy">
              <ScrollReveal delay={0.1} className="lead-text">
                <p className="lead">I don't see marketing as separate channels. I see the parts of one growth system.</p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p>I'm a digital marketing professional working across SEO, performance, content, LinkedIn and email outreach, and automation. My focus is connecting the work, so each channel makes the next one stronger.</p>
              </ScrollReveal>
              <ScrollReveal delay={0.3} className="thesis" whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                <span className="meta">The principle</span>
                <blockquote>Good marketing connects.<br />Great marketing compounds.</blockquote>
                <span className="signature">Jaya Priya</span>
              </ScrollReveal>
            </div>
            <div className="process-list">
              <ScrollReveal delay={0.1} className="process-label meta">
                <span>From insight to impact</span>
                <span>A continuous loop <Workflow size={14} /></span>
              </ScrollReveal>
              {process.map((step, index) => (
                <ScrollReveal key={step.title} delay={0.15 + index * 0.08} stagger={0.05}>
                  <motion.div
                    className={`process-step ${processActive === index ? 'expanded' : ''}`}
                    whileHover={{ x: 8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <button
                      aria-expanded={processActive === index}
                      aria-controls={`process-${index}`}
                      onClick={() => setProcessActive(processActive === index ? -1 : index)}
                    >
                      <span className="step-number meta">0{index + 1}</span>
                      <h3>{step.title}</h3>
                      {processActive === index ? <Minus size={18} /> : <Plus size={18} />}
                    </button>
                    <div id={`process-${index}`} className="process-description" hidden={processActive !== index}>
                      <p>{step.description}</p>
                      <span className="meta">{step.detail}</span>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section expertise-section" id="expertise" delay={0.1}>
        <div className="container">
          <SectionHeading label="02 / The capabilities" aside="Five disciplines. One direction." description="From the first search to the next sale, I build the connections that move a business forward.">
            ONE SYSTEM.<br />MANY POSSIBILITIES.
          </SectionHeading>
          <div className="expertise-grid">
            <ScrollReveal delay={0.1} className="expertise-tabs" role="tablist" aria-label="Marketing expertise" aria-orientation="vertical" onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (expertiseActive + (event.key === 'ArrowDown' ? 1 : -1) + 5) % 5; setExpertiseActive(next); document.getElementById(`expertise-tab-${next}`).focus(); } }}>
              {capabilities.map((item, index) => {
                const Icon = icons[index];
                return (
                  <motion.button
                    key={item.name}
                    id={`expertise-tab-${index}`}
                    role="tab"
                    aria-selected={expertiseActive === index}
                    tabIndex={expertiseActive === index ? 0 : -1}
                    aria-controls="expertise-panel"
                    className={expertiseActive === index ? 'selected' : ''}
                    onClick={() => setExpertiseActive(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                    <ArrowUpRight size={18} />
                  </motion.button>
                );
              })}
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="expertise-panel" id="expertise-panel" role="tabpanel" aria-labelledby={`expertise-tab-${expertiseActive}`} tabIndex={0}>
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="service-head">
                  <ServiceIcon size={35} strokeWidth={1.2} />
                  <span className="meta">{service.label}</span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.steps.map((step, i) => (
                    <motion.li key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Plus size={13} />{step}
                    </motion.li>
                  ))}
                </ul>
                <div className="service-tools meta">{service.tools}</div>
                <a className="text-button" href="#contact" data-magnetic>Let's connect the dots <ArrowUpRight size={17} /></a>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section work-section" id="work" delay={0.1}>
        <div className="container">
          <SectionHeading label="03 / Selected work" aside="The work behind the numbers" description="A few examples of turning scattered effort into clear, measurable outcomes.">
            LESS GUESSWORK.<br />MORE GROWTH.
          </SectionHeading>
          <ScrollReveal delay={0.15} className="work-toolbar">
            <div className="work-filters" aria-label="Filter projects">
              {['All work', 'SEO', 'Performance', 'B2B'].map((item, i) => (
                <motion.button
                  key={item}
                  className={filter === item ? 'active' : ''}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {item}{item === 'All work' && <sup>03</sup>}
                </motion.button>
              ))}
            </div>
            <span className="meta" role="status">{String(visibleProjects.length).padStart(2, '0')} projects</span>
          </ScrollReveal>
          <WorkShowcase projects={visibleProjects} onOpen={setSelectedProject} />
          <ScrollReveal delay={0.3} className="work-note meta">
            <span>Real businesses. Connected thinking.</span>
            <span>Every result starts with a better question. <ArrowDown size={14} /></span>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section automation-section dark-section relative min-h-[600px]" id="automation" delay={0.1}>
        <div className="container relative z-10">
          <SectionHeading label="04 / The connected engine" aside="Less repetition. More possibility." description="When tools work together, people can focus on the work that actually needs them.">
            SMARTER SYSTEMS.<br /><span>MORE HUMAN WORK.</span>
          </SectionHeading>
          <ScrollReveal delay={0.15} className="automation-grid">
            <div>
              <p className="lead">Give repetitive work a workflow.<br />Give good ideas room to grow.</p>
              <p>From lead capture to personalized follow-ups, I connect the tools you already use with practical automation and AI.</p>
              <a className="text-button" href="#contact" data-magnetic>Build a better workflow <ArrowUpRight size={18} /></a>
              <motion.div className="automation-note" whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                <Zap size={17} /><span>Designed around your process.<br />With a human in the loop.</span>
              </motion.div>
            </div>
            <div className="workflow-demo">
              <div className="meta workflow-title"><span><span className="status-dot" /> A lead's journey</span><span>Interactive walkthrough</span></div>
              <div className="workflow-nodes" aria-label="Explore the automation workflow">
                {[{ icon: MousePointer2, title: 'Capture' }, { icon: Layers, title: 'Enrich' }, { icon: Mail, title: 'Connect' }, { icon: BarChart3, title: 'Measure' }].map(({ icon: Icon, title }, index) => (
                  <motion.button
                    key={title}
                    className={workflowStep === index ? 'active' : ''}
                    aria-pressed={workflowStep === index}
                    onClick={() => setWorkflowStep(index)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    animate={{ scale: workflowStep === index ? 1.05 : 1 }}
                  >
                    <span className="workflow-icon"><Icon size={24} strokeWidth={1.5} /></span>
                    <span>{title}</span>
                    <span className="meta">0{index + 1}</span>
                  </motion.button>
                ))}
              </div>
              <motion.div
                className="workflow-detail"
                aria-live="polite"
                key={workflowStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="meta accent">Step 0{workflowStep + 1}</span>
                <h3>{['Catch the right signal.', 'Make the context useful.', 'Start with relevance.', 'Close the feedback loop.'][workflowStep]}</h3>
                <p>{['A form submission becomes a structured record in your CRM. No copy and paste, no lost details.', 'Organize company, interest, and source data so the next step is informed and personal.', 'Route the lead to a relevant email sequence, with thoughtful timing and a human review where it matters.', 'Bring outcomes back into reporting. Learn which sources and messages lead to better conversations.'][workflowStep]}</p>
              </motion.div>
              <div className="workflow-footer meta">
                <span>Form → CRM → Email → Analytics</span>
                <motion.button onClick={() => setWorkflowStep((workflowStep + 1) % 4)} whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>Next step <ArrowRight size={15} /></motion.button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section stack-section" id="stack" delay={0.1}>
        <div className="container">
          <SectionHeading label="05 / The working toolkit" aside="Chosen for the job">
            THE RIGHT TOOLS.<br />CONNECTED WELL.
          </SectionHeading>
          <ScrollReveal delay={0.15} className="stack-grid">
            {[{ title: 'Search & analytics', items: ['Ahrefs', 'Semrush', 'Google Analytics', 'Search Console'], icon: Search }, { title: 'Paid & performance', items: ['Google Ads', 'Meta Ads', 'Google Tag Manager'], icon: Target }, { title: 'Content & creative', items: ['WordPress', 'Canva', 'Figma'], icon: FileText }, { title: 'Outreach & automation', items: ['LinkedIn', 'Apollo.io', 'HubSpot', 'n8n'], icon: Workflow }].map(({ title, items, icon: Icon }, i) => (
              <motion.div
                key={title}
                className="stack-group"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <motion.div className="stack-icon" whileHover={{ rotate: 12 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                  <Icon size={23} strokeWidth={1.4} />
                </motion.div>
                <h3>{title}</h3>
                <div>
                  {items.map((item, j) => (
                    <motion.span key={item} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.05 + i * 0.1 }}>
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </ScrollReveal>
        </div>
      </ScrollReveal>

<ScrollReveal className="section results-section dark-section" id="results" delay={0.1}>
        <div className="container">
          <SectionHeading label="06 / The impact" aside="Outcomes over vanity metrics">
            MARKETING THAT<br />MOVES NUMBERS.
          </SectionHeading>
          <ScrollReveal delay={0.15} className="results-path-scene results-left-scene">
            <div className="results-left-marquee" aria-label="Marketing impact metrics">
              <div className="results-left-track">
                {[...resultItems, ...resultItems].map(([value, label, note, suffix, story], i) => {
                  const flipped = flippedCard === i;
                  return (
                  <motion.div
                    key={`${label}-${i}`}
                    className={`result-cell path-result-card result-card-${i % resultItems.length}${flipped ? ' is-flipped' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={flipped}
                    aria-label={`${value}${suffix} ${label}. Click to read the story.`}
                    onClick={() => flipCard(i)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flipCard(i); } }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 210, damping: 19 }}
                    whileHover={{ y: -34, rotate: i % 2 ? 5 : -5, scale: 1.28, zIndex: 50, transition: { type: 'spring', stiffness: 260, damping: 16 } }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="card-face card-front" aria-hidden={flipped}>
                      {suffix ? <Counter value={value} suffix={suffix} duration={1.5} delay={(i % resultItems.length) * 160} /> : <strong>{value}</strong>}
                      <h3>{label}</h3>
                      <span>{note}</span>
                    </div>
                    <div className="card-face card-back" aria-hidden={!flipped}>
                      <span className="meta">The story</span>
                      <p>{story}</p>
                      <a href="#work" onClick={event => event.stopPropagation()} tabIndex={flipped ? 0 : -1}>See the work <ArrowUpRight size={11} /></a>
                    </div>
                    {burst?.index === i && (
                      <span className="card-burst" aria-hidden="true" key={burst.id}>
                        {Array.from({ length: 12 }).map((_, k) => {
                          const angle = (k / 12) * Math.PI * 2;
                          const reach = 58 + (k % 3) * 20;
                          return <motion.i key={k} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(angle) * reach, y: Math.sin(angle) * reach, opacity: 0, scale: 0.15, rotate: 200 }} transition={{ duration: 0.75, ease: 'easeOut' }} />;
                        })}
                      </span>
                    )}
                  </motion.div>
                  );
                })}
              </div>
            </div>
            <motion.a
              className="result-cell result-cta"
              href="#contact"
              whileHover={{ scale: 1.03, rotate: -1.5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="meta">What's next?</span>
              <h3>YOUR NEXT<br />GROWTH STORY.</h3>
              <ArrowUpRight size={40} strokeWidth={1.25} />
            </motion.a>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section experience-section" id="experience" delay={0.1}>
        <div className="container">
          <SectionHeading label="07 / The experience" aside="Built by doing">
            THINKING BIG.<br />WORKING HANDS-ON.
          </SectionHeading>
          <ScrollReveal delay={0.15} className="experience-list">
            {[{ company: 'Coderead', role: 'Performance Marketing Specialist', category: 'Performance', result: '800+ qualified leads', description: 'Managed Meta and Google Ads campaigns, with continuous attention to cost per lead, creative performance, and conversion rates.', project: 1 }, { company: 'Cogent Innovation', role: 'LinkedIn & Email Marketing Specialist', category: 'B2B & outreach', result: '80+ organic B2B leads', description: 'Built organic LinkedIn outreach and personalized email sequences to connect with relevant business decision-makers.', project: 2 }, { company: 'FirstHub Ecom', role: 'Digital Marketing Executive', category: 'SEO & ecommerce', result: '2,500+ products optimized', description: 'Led product-page optimization and SEO improvements that supported a healthier website and increased online sales.', project: 0 }].map((exp, i) => (
              <motion.details
                key={exp.company}
                className="experience-row"
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <summary>
                  <span className="meta">{exp.category}</span>
                  <div>
                    <h3>{exp.company}</h3>
                    <p>{exp.role}</p>
                  </div>
                  <span className="experience-result">{exp.result}</span>
                  <Plus size={19} />
                </summary>
                <div className="experience-detail">
                  <p>{exp.description}</p>
                  <motion.button
                    className="text-button"
                    onClick={() => setSelectedProject(projects[exp.project])}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    See the work <ArrowUpRight size={17} />
                  </motion.button>
                </div>
              </motion.details>
            ))}
          </ScrollReveal>
        </div>
      </ScrollReveal>

      <ScrollReveal className="resume-section" id="resume" delay={0.1}>
        <div className="container">
          <div className="resume-header">
            <span className="meta accent">08 / The complete picture</span>
            <h2>TAKE THE<br />INTRODUCTION WITH YOU.</h2>
            <p>Experience, capabilities, and selected results in one place.</p>
            <motion.a
              className="button button-dark"
              href="/resume.html"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View résumé <Download size={17} />
            </motion.a>
          </div>
          <Tilt className="resume-paper">
            <div className="paper-top meta"><span>Professional profile</span><ArrowUpRight size={16} /></div>
            <h3>JAYA<br />PRIYA<span>.</span></h3>
            <p>Digital Marketing & Growth Specialist</p>
            <div className="paper-rule" />
            <span className="meta">Strategy / Execution / Growth</span>
            <div className="paper-columns">
              <div><i /><i /><i /></div>
              <div>
                <Counter value={800} suffix="+" duration={1.5} />
                <span>Qualified leads</span>
                <Counter value={2500} suffix="+" duration={1.5} delay={300} />
                <span>Products optimized</span>
              </div>
            </div>
          </Tilt>
        </div>
      </ScrollReveal>
      </div>
      <MagneticCursor
        magneticFactor={0.5}
        blendMode="exclusion"
        cursorSize={56}
        cursorColor="white"
        hoverAttribute="data-magnetic"
      >
        <Contact />
      </MagneticCursor>
    </main><div className="status-bar"><span><span className="status-dot" /> Open to meaningful opportunities</span><span className="status-middle">Strategy + creativity + a healthy respect for data.</span><a href="#contact">Let's connect <ArrowUpRight size={12} /></a></div>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}{selectedProject && <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />}</MotionConfig>;
}
