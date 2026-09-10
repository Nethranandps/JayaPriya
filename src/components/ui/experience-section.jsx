import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const EXPERIENCE = [
  {
    company: 'CODEREAD',
    role: 'Performance Marketing Specialist',
    result: '800+ qualified leads',
    year: '202X',
    description: 'Managed high-budget Meta and Google Ads campaigns, optimizing for CPL and conversion rates.',
  },
  {
    company: 'COGENT INNOVATION',
    role: 'LinkedIn & Email Marketing Specialist',
    result: '80+ B2B leads',
    year: '202X',
    description: 'Built out organic outreach systems on LinkedIn and automated email sequences.',
  },
  {
    company: 'FIRSTHUB ECOM',
    role: 'Digital Marketing Executive',
    result: '2,500+ products | 10x online sales',
    year: '202X',
    description: 'Led full-scale SEO overhaul and product page optimization for e-commerce growth.',
  },
];

const backfaceStyle = { WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' };

function ExperienceCard({ exp, index, smoothProgress }) {
  const total = EXPERIENCE.length;
  const start = index * 0.12;
  const end = start + 0.45;

  // Closed: cards stacked dead-center, fanned by a few degrees, offset by index.
  // Open: they spread into their own column and flatten out.
  const fanAngle = (index - (total - 1) / 2) * 10;
  const fanX = (index - (total - 1) / 2) * 26;
  const fanY = (total - 1 - index) * 10;

  const x = useTransform(smoothProgress, [start, end], [`${fanX}px`, `${(index - (total - 1) / 2) * 340}px`]);
  const y = useTransform(smoothProgress, [start, end], [`${fanY}px`, '0px']);
  const rotateZ = useTransform(smoothProgress, [start, end], [fanAngle, 0]);
  const rotateY = useTransform(smoothProgress, [start, end], [0, 180]);
  const scale = useTransform(smoothProgress, [start, (start + end) / 2, end], [0.82, 0.95, 1]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: total - index }}
    >
      <motion.div
        style={{ x, y, rotateZ, scale }}
        className="h-[380px] w-[280px] md:h-[420px] md:w-[320px]"
      >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        className="h-full w-full"
      >
      <motion.div
        style={{ rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {/* Back face — closed state */}
        <div
          style={backfaceStyle}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/30 bg-[#4A5CFF] text-white shadow-2xl"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/60 text-2xl font-black text-white">
            JP
          </div>
          <span className="relative text-xs font-bold uppercase tracking-widest text-white/70">{exp.year}</span>
        </div>

        {/* Front face — open state */}
        <div
          style={{ ...backfaceStyle, transform: 'rotateY(180deg)' }}
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 text-slate-900 shadow-2xl"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{exp.year}</span>
            <h3 className="mt-2 text-2xl font-black leading-tight">{exp.company}</h3>
            <p className="mt-1 text-sm font-medium text-slate-600">{exp.role}</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">{exp.description}</p>
          <div className="text-lg font-bold text-[#4A5CFF]">{exp.result}</div>
        </div>
      </motion.div>
      </motion.div>
      </motion.div>
    </div>
  );
}

const ExperienceSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative w-full bg-[#4A5CFF]" style={{ height: '280vh' }}>
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden px-6 py-16 md:px-12">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1440 1000"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M -50 850 C 250 780 320 620 560 600 C 800 580 850 420 1100 380 C 1300 348 1360 220 1500 120"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M -80 200 C 150 260 260 140 480 180 C 700 220 780 80 1020 60"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="560" cy="600" r="5" fill="white" />
          <circle cx="1100" cy="380" r="5" fill="white" />
        </svg>

        <div className="relative text-center">
          <span className="mb-4 block text-sm uppercase tracking-widest text-white/70">Journey</span>
          <h2 className="text-5xl font-bold text-white md:text-7xl">EXPERIENCE</h2>
        </div>

        <div className="relative mt-8 flex-1">
          {EXPERIENCE.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} smoothProgress={smoothProgress} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
