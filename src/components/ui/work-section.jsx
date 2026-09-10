import React from 'react';
import { motion } from 'framer-motion';

const CASE_STUDIES = [
  {
    tag: 'SEO · 2024',
    title: '2,500+ PAGES OPTIMIZED',
    detail: 'Website health 19 → 96, domain authority 11 → 24.',
    bg: 'from-[#08090B] via-[#08090B] to-orange-950',
    accent: '#FF8A3D',
  },
  {
    tag: 'PERFORMANCE · 2024',
    title: '800+ QUALIFIED LEADS',
    detail: '4.2% CTR, $12.40 CPL across Meta and Google Ads.',
    bg: 'from-[#08090B] via-[#08090B] to-slate-800',
    accent: '#73C7FF',
  },
  {
    tag: 'B2B · 2023',
    title: '80+ B2B LEADS',
    detail: 'Organic LinkedIn outreach built into a repeatable pipeline.',
    bg: 'from-[#08090B] via-[#08090B] to-blue-950',
    accent: '#FF8A3D',
  },
];

const WorkSection = () => {
  return (
    <section className="relative w-full bg-slate-50 text-slate-900 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold leading-tight md:text-7xl"
          >
            SELECTED <span className="text-slate-400">WORK</span>
          </motion.h2>
          <span className="hidden text-sm font-bold uppercase tracking-widest text-[#FF8A3D] md:block">
            View all projects ↗
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`group relative flex h-[420px] flex-col justify-between overflow-hidden bg-gradient-to-br p-7 text-white shadow-xl ${cs.bg}`}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative z-10 flex items-start justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-white/60">{cs.tag}</span>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm transition-colors group-hover:bg-white group-hover:text-[#08090B]"
                >
                  ↗
                </span>
              </div>
              <div className="relative z-10">
                <div className="mb-3 h-1 w-10" style={{ backgroundColor: cs.accent }} />
                <h3 className="text-3xl font-black leading-tight md:text-4xl">{cs.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{cs.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
