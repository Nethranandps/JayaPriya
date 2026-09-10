import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '2+', label: 'YEARS EXPERIENCE' },
  { value: '800+', label: 'QUALIFIED LEADS' },
  { value: '2,500+', label: 'PAGES OPTIMIZED' },
  { value: '10×', label: 'ONLINE SALES GROWTH' },
];

const StatBarSection = () => {
  return (
    <section className="relative w-full bg-[#08090B] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`flex flex-col items-center justify-center gap-1 border-slate-800 px-6 py-10 text-center ${
              i > 0 ? 'border-l' : ''
            } ${i < 2 ? 'border-b md:border-b-0' : ''}`}
          >
            <span className="text-4xl font-black text-[#FF8A3D] md:text-5xl">{stat.value}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatBarSection;
