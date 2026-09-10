import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, Sparkles, Target, Zap } from 'lucide-react';
import ScrollChoreography from './scroll-choreography';

const APPROACH_STEPS = [
  { id: '01', label: 'The Audience', question: 'Who are we trying to reach?' },
  { id: '02', label: 'The Intent', question: 'What problem are they solving?' },
  { id: '03', label: 'The Action', question: 'What should they do next?' },
];

const SKILLS = [
  { label: 'SEO', value: 95 },
  { label: 'PERFORMANCE MARKETING', value: 90 },
  { label: 'CONTENT & OUTREACH', value: 85 },
  { label: 'AI + AUTOMATION', value: 80 },
];

const CARDS = {
  topLeft: {
    id: '03',
    label: 'EXECUTE',
    desc: 'Rapid deployment of content, ads, and automation.',
    icon: Zap,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    image: 'https://cdn.21st.dev/assets/mirror/d3/d310c7e0904578a268f9b43e56334bbedab73259827f78fa5820bae55938adf0.webp',
  },
  topRight: {
    id: '02',
    label: 'STRATEGIZE',
    desc: 'Mapping the growth engine across high-intent channels.',
    icon: Target,
    gradient: 'from-orange-500 via-amber-500 to-rose-500',
    image: 'https://cdn.21st.dev/assets/mirror/e1/e1a768d91c721771a9095e1079f7ac04e9ce8b81d2264db6f614c42d4cc65a6b.webp',
  },
  bottomLeft: {
    id: '05',
    label: 'OPTIMIZE',
    desc: 'Iterative refinement for maximum scalable growth.',
    icon: Sparkles,
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
    image: 'https://cdn.21st.dev/assets/mirror/00/00f17e7c8379b3c4629810073d1c1fe0c79946ae0e0660f05aebf7c21b0ebbde.webp',
  },
  bottomRight: {
    id: '04',
    label: 'MEASURE',
    desc: 'Real-time data tracking and attribution analysis.',
    icon: BarChart3,
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    image: 'https://cdn.21st.dev/assets/mirror/1a/1a300fea6e7f3a7e530448dd8277eb31e0f11c2e726f09ccbac310d516f8075f.webp',
  },
};

const UnderstandCard = () => (
  <div className="absolute left-[62%] top-[16%] flex w-[min(19vw,260px)] items-center gap-3 bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-white shadow-2xl">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/10">
      <Search className="h-5 w-5 text-[#FF8A3D]" />
    </div>
    <div>
      <div className="text-[11px] font-black tracking-widest text-white/60">01</div>
      <div className="text-sm font-bold tracking-tight">UNDERSTAND</div>
      <p className="mt-0.5 text-[11px] leading-snug text-white/70">
        Deep diving into audience intent and market gaps.
      </p>
    </div>
  </div>
);

const AboutSection = () => {
  return (
    <section className="relative w-full bg-slate-50 text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <ScrollChoreography
        cards={CARDS}
        clusterShift="21vw"
        cardWidth="24vw"
        cardHeight="16vh"
        spreadX="12vw"
        spreadY="9vh"
        scrollLength="180vh"
        overlay={
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 md:px-12">
            <div className="max-w-xl">
              <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-[#FF8A3D]">
                About / Philosophy
              </span>
              <h2 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
                I DON'T SEE <br />
                MARKETING <br />
                <span className="text-slate-500">AS SEPARATE CHANNELS.</span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-slate-500">
                I build integrated growth systems where SEO, Paid, Content, and Automation
                work as one engine to drive measurable results.
              </p>
            </div>

            <UnderstandCard />
          </div>
        }
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12">
        <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-[#FF8A3D]">
          My Approach
        </span>
        <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          {APPROACH_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-t-2 border-slate-900 pt-6"
            >
              <div className="mb-2 text-xs font-black tracking-widest text-slate-400">{step.id}</div>
              <h4 className="text-2xl font-bold tracking-tight">{step.label}</h4>
              <p className="mt-2 text-slate-500">{step.question}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 border-t border-slate-200 pt-16 md:grid-cols-[1fr,180px,1fr] md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 block text-xs font-black uppercase tracking-widest text-[#FF8A3D]">About Me</span>
            <h3 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
              GROWTH IS SOLVING <br /> PROBLEMS WITH DATA <br /> AND CREATIVITY.
            </h3>
            <p className="max-w-md text-slate-500">
              I partner with brands to turn scattered marketing efforts into one measurable
              growth system across SEO, paid, content, and automation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto flex h-44 w-44 items-center justify-center bg-[#FF8A3D] text-white shadow-xl md:h-full md:w-full"
          >
            <span className="text-2xl font-black tracking-widest">JP</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {SKILLS.map((skill) => (
              <div key={skill.label}>
                <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>{skill.label}</span>
                  <span className="text-slate-900">{skill.value}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-[#FF8A3D]"
                  />
                </div>
              </div>
            ))}
            <button className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50">
              DOWNLOAD RESUME →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
