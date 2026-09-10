import React from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section className="relative w-full bg-white text-slate-900 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-xl md:text-3xl font-black mb-16 text-center">
          {['SEO', 'CONTENT', 'PERFORMANCE', 'B2B', 'AUTOMATION'].map((item, i, arr) => (
            <React.Fragment key={item}>
              <span className="hover:text-[#FF8A3D] transition-colors cursor-default">{item}</span>
              {i < arr.length - 1 && <span className="text-slate-300">+</span>}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-between gap-8 overflow-hidden bg-[#FF8A3D] p-10 text-white md:flex-row md:items-center md:p-16"
        >
          <h2 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">
            LET'S CREATE SOMETHING GREAT TOGETHER.
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#FF8A3D] shadow-xl"
          >
            ↗
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 border-t border-slate-200 pt-10 mt-10 md:grid-cols-3">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">Get in Touch</span>
            <p className="text-slate-600">hello@jayapriya.co</p>
            <p className="text-slate-600">+1 (212) 555-0188</p>
          </div>
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">Follow</span>
            <div className="flex flex-col gap-1 text-slate-600">
              <span className="cursor-pointer hover:text-[#FF8A3D] transition-colors">LinkedIn</span>
              <span className="cursor-pointer hover:text-[#FF8A3D] transition-colors">Instagram</span>
            </div>
          </div>
          <div className="md:text-right">
            <span className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">&copy; 2026</span>
            <p className="text-slate-600">All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
