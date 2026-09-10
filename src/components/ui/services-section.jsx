import React from 'react';
import { motion } from 'framer-motion';
import { Mail, PenTool, Search, Target, Zap } from 'lucide-react';

const SERVICES = [
  {
    icon: Search,
    title: 'SEO',
    desc: 'Organic visibility and technical authority that compounds over time.',
  },
  {
    icon: PenTool,
    title: 'CONTENT',
    desc: 'Editorial storytelling and website copy that converts readers into leads.',
  },
  {
    icon: Target,
    title: 'PAID MARKETING',
    desc: 'High-precision performance campaigns across search and social.',
  },
  {
    icon: Mail,
    title: 'B2B & EMAIL OUTREACH',
    desc: 'LinkedIn lead generation and personalized email sequences.',
  },
  {
    icon: Zap,
    title: 'AI + AUTOMATION',
    desc: 'Workflow systems that remove repetitive work and free up time for strategy.',
  },
];

const TOOLS = ['AHREFS', 'SEMRUSH', 'GOOGLE ADS', 'META ADS', 'HUBSPOT', 'APOLLO.IO', 'N8N', 'FIGMA'];

const ServicesSection = () => {
  return (
    <section className="relative w-full bg-white text-slate-900 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[280px,1fr] md:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex min-h-[160px] flex-col justify-between bg-[#FF8A3D] p-8 text-white"
          >
            <h2 className="text-5xl font-black tracking-tight">SERVICES</h2>
            <span className="text-3xl">↘</span>
          </motion.div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-none border border-slate-200 sm:grid-cols-2">
            {SERVICES.slice(0, 4).map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="flex items-start gap-4 border-slate-200 p-6 sm:[&:nth-child(-n+2)]:border-b sm:[&:nth-child(odd)]:border-r">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FF8A3D]/50 text-[#FF8A3D]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold tracking-tight">{service.title}</h3>
                    <p className="text-sm leading-snug text-slate-500">{service.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-10 sm:grid-cols-[auto,1fr] sm:items-center"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FF8A3D]/50 text-[#FF8A3D]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold tracking-tight">{SERVICES[4].title}</h3>
              <p className="max-w-xs text-sm leading-snug text-slate-500">{SERVICES[4].desc}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end">
            {TOOLS.map((tool) => (
              <span key={tool} className="text-xs font-bold tracking-widest text-slate-400">
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
