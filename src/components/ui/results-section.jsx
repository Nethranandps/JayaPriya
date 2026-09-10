import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const RESULTS = [
  { value: '800+', label: 'PAID LEADS', color: '#FF8A3D' },
  { value: '80+', label: 'B2B LEADS', color: '#73C7FF' },
  { value: '2,500+', label: 'PRODUCTS OPTIMIZED', color: '#FF8A3D' },
  { value: '19 → 96', label: 'WEBSITE HEALTH', color: '#73C7FF' },
  { value: '11 → 24', label: 'DOMAIN AUTHORITY', color: '#FF8A3D' },
  { value: '10×', label: 'ONLINE SALES', color: '#73C7FF' },
  { value: '35', label: 'WEBINAR SIGN-UPS', color: '#FF8A3D' },
];

const ResultsSection = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#08090B] text-[#F5F3EE] py-24 px-6 md:px-12 overflow-hidden flex flex-col justify-center">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {RESULTS.map((res, i) => (
            <motion.div
              key={res.label}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl"
            >
              <h3 className="text-6xl md:text-8xl font-black mb-2" style={{ color: res.color }}>
                {res.value}
              </h3>
              <p className="text-xl font-bold text-stone-400 uppercase tracking-widest">{res.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h2 className="text-6xl md:text-9xl font-black text-center leading-tight mix-blend-overlay opacity-20">
            MARKETING THAT <br />
            MOVES NUMBERS.
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
