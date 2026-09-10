import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Search, FileText, Target, Mail, Workflow } from 'lucide-react';

const icons = [Search, FileText, Target, Mail, Workflow];

function CalendarPage({ item, index, progress, active, reduced }) {
  const Icon = icons[index];
  const start = index / 5;
  const middle = start + 0.08;
  const end = start + 0.18;
  const rotateX = useTransform(progress, [start, middle, end], [0, 0, reduced || index === 4 ? 0 : 178]);
  const y = useTransform(progress, [start, end], [0, reduced || index === 4 ? 0 : -30]);
  const opacity = useTransform(progress, [start, end - 0.015, end], [1, 1, index === 4 ? 1 : 0]);
  const shadow = useTransform(progress, [start, middle, end], ['0 3px 7px #0003', '0 28px 45px #0007', '0 3px 7px #0000']);

  return <motion.article className={`calendar-page calendar-page-${index}`} aria-hidden={active !== index}
    style={{ zIndex: 5 - index, rotateX, y, opacity, boxShadow: shadow }}>
    <div className="calendar-page-top"><span>{item.label}</span><Icon size={21} strokeWidth={1.5} /></div>
    <div className="calendar-page-main">
      <motion.span className="calendar-number" initial={false} animate={{ scale: active === index ? 1 : 0.92, opacity: active === index ? 0.25 : 0.13 }}>0{index + 1}</motion.span>
      <motion.h3 initial={false} animate={{ y: active === index ? 0 : 14, opacity: active === index ? 1 : 0.55 }}>{item.name}</motion.h3>
    </div>
    <motion.div className="calendar-page-bottom" initial={false} animate={{ opacity: active === index ? 1 : 0.45, y: active === index ? 0 : 10 }}>
      <div><strong>{item.metric}</strong><span>{item.result}</span></div><ArrowUpRight size={28} strokeWidth={1.3} />
    </motion.div>
  </motion.article>;
}

export default function GrowthScene({ active, onSelect, capabilities }) {
  const scene = useRef(null);
  const sticky = useRef(null);
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [stageShift, setStageShift] = useState(0);
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start 90px', 'end end'] });
  const calendarProgress = useTransform(scrollYProgress, value => `${Math.min(100, Math.max(0, value * 100))}%`);
  const centerShift = reduced || compact ? 0 : stageShift;
  const stageX = useTransform(scrollYProgress, [0, 0.14, 1], [0, centerShift, centerShift]);
  const stageScale = useTransform(scrollYProgress, [0, 0.14, 0.92, 1], [1, reduced ? 1 : 1.32, reduced ? 1 : 1.32, reduced ? 1 : 1.2]);
  const stageRadius = useTransform(scrollYProgress, [0, 0.14, 1], ['0px', '8px', '8px']);
  const objectY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -18]);
  const objectRotateX = useTransform(scrollYProgress, [0, 1], [5, reduced ? 5 : 12]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)');
    const update = () => {
      setCompact(query.matches);
      setViewportWidth(window.innerWidth);
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    if (!sticky.current) return;
    const measure = () => {
      const element = sticky.current;
      const previous = element.style.transform;
      element.style.transform = 'none';
      const rect = element.getBoundingClientRect();
      element.style.transform = previous;
      setStageShift(window.innerWidth / 2 - (rect.left + rect.width / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sticky.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [viewportWidth]);

  useMotionValueEvent(scrollYProgress, 'change', value => {
    onSelect(Math.min(4, Math.max(0, Math.floor(value * 5))));
  });

  function select(index) {
    if (!scene.current) return onSelect(index);
    const rect = scene.current.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const distance = Math.max(1, rect.height - window.innerHeight);
    window.scrollTo({ top: top + distance * ((index + 0.08) / 5), behavior: 'smooth' });
  }

  return <div className={`growth-scene calendar-scene calendar-scroll-scene ${reduced ? 'calendar-static' : ''}`} ref={scene}>
    <motion.div className="calendar-sticky" ref={sticky} style={{ x: stageX, scale: stageScale, borderRadius: stageRadius }}>
      <div className="scene-top meta"><span><span className="status-dot" /> The growth architecture</span><span>Five disciplines</span></div>
      <div className="calendar-stage">
        <motion.div className="calendar-object" style={{ y: objectY, rotateX: objectRotateX, rotateY: -7, rotateZ: -2 }}>
          <div className="calendar-stand" aria-hidden="true" />
          <div className="calendar-paper-stack" aria-hidden="true" />
          <div className="calendar-rings" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map(ring => <i key={ring} />)}</div>
          {capabilities.map((item, index) => <CalendarPage key={item.short} item={item} index={index} progress={scrollYProgress} active={active} reduced={reduced} />)}
        </motion.div>
      </div>
      <div className="calendar-footer"><div className="calendar-instruction"><ArrowDown size={13} /><span>{active === 4 ? 'Keep scrolling to discover more' : 'Scroll to turn the page'}</span><span className="calendar-count">0{active + 1} / 05</span></div>
        <div className="calendar-progress" aria-hidden="true"><motion.i style={{ width: calendarProgress }} /></div>
        <div className="calendar-navigation"><div className="scene-controls" aria-label="Choose a calendar page">{capabilities.map((item, index) => <button key={item.short} className={active === index ? 'selected' : ''} aria-pressed={active === index} aria-label={`Explore ${item.name}`} onClick={() => select(index)}>{String(index + 1).padStart(2, '0')}</button>)}</div><a href="#about">Skip to about <ArrowUpRight size={12} /></a></div>
      </div>
    </motion.div>
  </div>;
}
