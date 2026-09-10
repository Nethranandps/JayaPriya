"use client"

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import DancingLetters from "./dancing-letters"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CAPABILITIES = [
  {
    id: "seo",
    number: "01",
    title: "SEO & ORGANIC GROWTH",
    metric: "2,500+",
    label: "PRODUCTS OPTIMIZED",
    detail: "Website health 19 → 96 · Domain authority 11 → 24",
    accent: "blue",
    process: ["AUDIT", "OPTIMIZE", "INDEX", "GROW"],
  },
  {
    id: "performance",
    number: "02",
    title: "PERFORMANCE MARKETING",
    metric: "800+",
    label: "QUALIFIED LEADS",
    detail: "Generated within the first two months",
    accent: "orange",
    process: ["AUDIENCE", "CAMPAIGN", "TEST", "OPTIMIZE"],
  },
  {
    id: "b2b",
    number: "03",
    title: "B2B LEAD GENERATION",
    metric: "80+",
    label: "B2B LEADS",
    detail: "Generated through organic LinkedIn",
    accent: "blue",
    process: ["CONTENT", "NETWORK", "OUTREACH", "CONVERT"],
  },
  {
    id: "content",
    number: "04",
    title: "CONTENT & OUTREACH",
    metric: "35",
    label: "WEBINAR SIGN-UPS",
    detail: "Generated in 14 days",
    accent: "orange",
    process: ["RESEARCH", "CREATE", "DISTRIBUTE", "MEASURE"],
  },
  {
    id: "automation",
    number: "05",
    title: "AI + AUTOMATION",
    metric: "SMARTER",
    label: "MARKETING SYSTEMS",
    detail: "Less repetitive work → faster execution",
    accent: "blue",
    process: ["CONNECT", "AUTOMATE", "SCALE", "OPTIMIZE"],
  },
]

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function GrowthCurve() {
  return (
    <svg
      className="absolute w-[min(55vw,760px)] right-[1%] top-[16%] opacity-20 pointer-events-none"
      viewBox="0 0 700 500"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="stroke-[#FF8A3D] stroke-1"
        style={{ strokeDasharray: '12 10' }}
        d="
          M30 430
          C110 410 105 350 175 365
          C240 380 225 300 300 320
          C365 340 370 245 435 265
          C505 285 510 165 570 180
          C620 195 625 90 680 55
        "
      />
      <circle cx="175" cy="365" r="3" fill="#ff8a3d" opacity="0.55" />
      <circle cx="300" cy="320" r="3" fill="#ff8a3d" opacity="0.55" />
      <circle cx="435" cy="265" r="3" fill="#ff8a3d" opacity="0.55" />
      <circle cx="570" cy="180" r="3" fill="#ff8a3d" opacity="0.55" />
      <circle cx="680" cy="55" r="4" fill="#ff8a3d" opacity="0.55" />
    </svg>
  )
}

function Background() {
  return (
    <div className="absolute inset-0 z-[-2] overflow-hidden pointer-events-none bg-slate-50" aria-hidden="true">
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
             backgroundSize: '72px 72px',
             maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
             WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
           }}
      />
      <div className="absolute -left-[18vw] -top-[15vw] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-10 bg-blue-400 animate-growthFloat" />
      <div className="absolute -right-[18vw] -bottom-[20vw] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-10 bg-orange-400 animate-growthFloat" style={{ animationDelay: '-6s' }} />

      <div className="absolute left-[68%] top-[47%] -translate-x-1/2 -translate-y-1/2 border border-slate-200 rounded-full w-[680px] h-[680px] animate-growthSpin" />
      <div className="absolute left-[68%] top-[47%] -translate-x-1/2 -translate-y-1/2 border border-blue-400/10 rounded-full w-[420px] h-[420px] animate-growthSpinReverse" />

      <GrowthCurve />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.7\'/%3E%3C/svg%3E")',
           }}
      />
    </div>
  )
}

function CapabilityRow({
  item,
  index,
  activeIndex,
  onSelect,
}) {
  const distance = index - activeIndex
  const absDistance = Math.abs(distance)

  const scale = clamp(1 - absDistance * 0.105, 0.7, 1)
  const opacity = clamp(1 - absDistance * 0.22, 0.18, 1)
  const translateZ = -absDistance * 85
  const rotateX = clamp(-distance * 12, -28, 28)

  const accentColor = item.accent === "orange" ? "#ff8a3d" : "#73c7ff"

  return (
    <button
      type="button"
      aria-current={index === activeIndex ? "true" : undefined}
      onClick={() => onSelect(index)}
      className={`absolute w-full h-[64px] left-0 top-1/2 -mt-[32px] px-[24px] grid grid-cols-[48px_1fr_24px] items-center gap-4 border border-transparent bg-transparent text-slate-500 cursor-pointer text-left origin-center transition-all duration-300 ease-out will-change-transform ${
        index === activeIndex ? "text-slate-900 border-slate-200 bg-white shadow-lg" : "hover:text-slate-700"
      }`}
      style={{
        transform: `translate3d(0, ${distance * 92}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
        opacity,
        boxShadow: index === activeIndex ? `0 10px 30px ${accentColor}20` : 'none',
      }}
    >
      <span className="text-[10px] font-medium tracking-widest opacity-40">{item.number}</span>
      <span className="text-[13px] font-bold tracking-wide uppercase">{item.title}</span>
      <span className="transition-colors duration-300" style={{ color: accentColor, opacity: 0.75 }}>{"→"}</span>
    </button>
  )
}

function GrowthDataPanel({
  capability,
}) {
  const accentColor = capability.accent === "orange" ? "#ff8a3d" : "#73c7ff"

  return (
    <div
      className="relative p-8 min-h-[340px] bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-2xl animate-panelReveal flex flex-col"
      style={{
        borderColor: `${accentColor}40`,
      }}
    >
      <div className="flex justify-between items-center text-[9px] tracking-widest text-slate-500 mb-12">
        <span className="font-medium uppercase">Marketing System / {capability.number}</span>
        <span className="flex gap-1.5 items-center">
          <i className="block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
          <span className="font-bold">ACTIVE</span>
        </span>
      </div>

      <div className="mb-6">
        <div className="text-[11px] tracking-widest font-bold uppercase mb-2" style={{ color: accentColor }}>
          {capability.title}
        </div>
        <div className="flex items-baseline gap-2">
          <div key={`${capability.id}-metric`} className="text-[clamp(60px,7vw,96px)] leading-none tracking-tighter font-black text-slate-900 animate-metricIn">
            {capability.metric}
          </div>
          <div
            key={`${capability.id}-label`}
            className="text-[10px] tracking-widest font-semibold text-slate-500 uppercase animate-metricIn"
            style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          >
            {capability.label}
          </div>
        </div>
      </div>

      <div
        key={`${capability.id}-detail`}
        className="mb-8 max-w-[320px] text-[14px] leading-relaxed text-slate-600 animate-metricIn"
        style={{ animationDelay: '140ms', animationFillMode: 'both' }}
      >
        {capability.detail}
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <div className="flex items-center flex-wrap gap-3">
          {capability.process.map((step, index) => (
            <React.Fragment key={step}>
              <div
                className="flex gap-1.5 items-center text-[9px] font-bold tracking-wide text-slate-500 animate-metricIn"
                style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'both' }}
              >
                <span style={{ color: accentColor }} className="opacity-80">{String(index + 1).padStart(2, "0")}</span>
                <span className="uppercase">{step}</span>
              </div>
              {index !== capability.process.length - 1 && (
                <span className="text-slate-300 text-[10px]">{"→"}</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-[8px] tracking-widest text-slate-500 pt-4 border-t border-slate-100">
          <span className="font-medium">MEASURABLE OUTCOME</span>
          <span className="font-bold">{capability.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}

function Reveal({
  children,
  className = "",
  delay = 0,
}) {
  return (
    <div
      className={`hero-reveal ${className}`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function MarketingGrowthHero() {
  const [activeIndex, setActiveIndex] = useState(1)

  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const heroContentRef = useRef(null)

  const targetRef = useRef(1)
  const positionRef = useRef(1)
  const velocityRef = useRef(0)

  const draggingRef = useRef(false)
  const startYRef = useRef(0)
  const lastYRef = useRef(0)

  const rafRef = useRef(null)

  const prefersReducedMotion = useRef(false)

  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const activeCapability = useMemo(
    () => CAPABILITIES[activeIndex],
    [activeIndex]
  )

  const goTo = useCallback((index) => {
    const next = clamp(
      Math.round(index),
      0,
      CAPABILITIES.length - 1
    )

    targetRef.current = next
    velocityRef.current = 0
  }, [])

  useEffect(() => {
    prefersReducedMotion.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) return

    const tick = () => {
      const target = targetRef.current
      const current = positionRef.current

      if (prefersReducedMotion.current) {
        positionRef.current = target
      } else {
        const difference = target - current

        velocityRef.current += difference * 0.085
        velocityRef.current *= 0.78

        positionRef.current = current + velocityRef.current
      }

      const nextIndex = clamp(
        Math.round(positionRef.current),
        0,
        CAPABILITIES.length - 1
      )

      if (nextIndex !== activeIndexRef.current) {
        setActiveIndex(nextIndex)
      }

      const rows =
        viewport.querySelectorAll("[data-growth-row]")

      rows.forEach((row, index) => {
        const distance = index - positionRef.current
        const absDistance = Math.abs(distance)

        const focusBoost = absDistance === 0 ? 0.24 : 0
        const scale = clamp(
          1 - absDistance * 0.09 + focusBoost,
          0.72,
          1.22
        )

        const opacity = clamp(
          1 - absDistance * 0.22,
          0.18,
          1
        )

        const translateZ = -absDistance * 85
        const rotateX = clamp(-distance * 12, -28, 28)

        row.style.transform = `
          translate3d(
            0,
            ${distance * 86}px,
            ${translateZ}px
          )
          rotateX(${rotateX}deg)
          scale(${scale})
        `

        row.style.opacity = `${opacity}`
        row.style.zIndex = String(50 - absDistance)
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const heroContent = heroContentRef.current
    if (!section || !heroContent) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=240%",
      pin: true,
      scrub: 1.4,
      onUpdate: (self) => {
        targetRef.current = self.progress * (CAPABILITIES.length - 1)
      },
    })

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=220%",
        scrub: 1.4,
      },
    })

    heroTimeline
      .to(heroContent, {
        scale: 1,
        opacity: 1,
        y: 0,
        ease: "none",
      }, 0)
      .to(heroContent, {
        scale: 1.18,
        opacity: 0.12,
        y: -22,
        ease: "none",
      }, 0.82)

    return () => {
      st.kill()
      heroTimeline.kill()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault()
        goTo(activeIndex + 1)
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft"
      ) {
        event.preventDefault()
        goTo(activeIndex - 1)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeIndex, goTo])

  const handlePointerDown = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    lastYRef.current = event.clientY
  }

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return

    const delta = lastYRef.current - event.clientY

    lastYRef.current = event.clientY

    targetRef.current += delta / 130

    targetRef.current = clamp(
      targetRef.current,
      0,
      CAPABILITIES.length - 1
    )
  }

  const handlePointerUp = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    targetRef.current = Math.round(targetRef.current)
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 isolate font-sans">
      <div ref={heroContentRef} className="relative z-10 min-h-screen will-change-transform">
      <style>{`
        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(28px);
            clip-path: inset(0 0 100% 0);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes panelReveal {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes metricIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes growthDash {
          to {
            stroke-dashoffset: -220;
          }
        }

        @keyframes growthSpin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes growthSpinReverse {
          to {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }

        @keyframes growthFloat {
          0%,100% {
            transform: translate3d(0,0,0) scale(1);
          }
          50% {
            transform: translate3d(25px,-20px,0) scale(1.08);
          }
        }

        .hero-reveal {
          opacity: 0;
          animation: heroReveal .8s cubic-bezier(.16,1,.3,1) forwards;
        }
      `}</style>

      <Background />

      <div className="relative z-10 min-h-screen w-full max-w-[1440px] mx-auto px-[6vw] py-12 grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] gap-[4vw] items-center">
        <div className="max-w-[760px]">
          <Reveal delay={200}>
            <div className="flex items-center gap-3 mb-7 text-[11px] tracking-[.22em] text-slate-600 before:content-[''] before:w-[34px] before:h-[1px] before:bg-orange-500">
              DIGITAL MARKETING / GROWTH
            </div>
          </Reveal>

          <Reveal delay={350}>
            <p className="m-0 mb-[10px] text-[clamp(12px,1vw,15px)] font-semibold tracking-[.15em] text-slate-600">
              JAYA PRIYA
            </p>
          </Reveal>

          <Reveal delay={450}>
            <p className="m-0 mb-[38px] text-[clamp(11px,1vw,14px)] tracking-[.12em] text-orange-500">
              DIGITAL MARKETING & GROWTH SPECIALIST
            </p>
          </Reveal>

          <Reveal delay={600}>
            <div className="flex flex-col">
              <DancingLetters
                text="I TURN"
                className="justify-start text-slate-900"
                letterClassName="text-[clamp(54px,7vw,112px)] leading-[0.89] tracking-tighter font-bold"
              />
              <DancingLetters
                text="MARKETING"
                className="justify-start text-slate-900"
                letterClassName="text-[clamp(54px,7vw,112px)] leading-[0.89] tracking-tighter font-bold"
              />
              <DancingLetters
                text="INTO MEASURABLE"
                className="justify-start text-slate-900"
                letterClassName="text-[clamp(54px,7vw,112px)] leading-[0.89] tracking-tighter font-bold"
              />
              <DancingLetters
                text="GROWTH."
                className="justify-start text-orange-500"
                letterClassName="text-[clamp(54px,7vw,112px)] leading-[0.89] tracking-tighter font-bold"
              />
            </div>
          </Reveal>

          <Reveal delay={900}>
            <p className="max-w-[570px] mt-8 text-[15px] leading-relaxed text-slate-600">
              I build digital marketing strategies that
              connect search, content, paid media,
              outreach and automation to drive measurable
              business growth.
            </p>
          </Reveal>

          <Reveal delay={1050}>
            <div className="flex flex-wrap gap-[7px] mt-[22px]">
              {[
                "SEO",
                "CONTENT",
                "PERFORMANCE",
                "B2B",
                "AUTOMATION",
              ].map((tag) => (
                <span
                  className="border border-slate-200 rounded-full px-[11px] py-[7px] text-[9px] tracking-widest text-slate-500"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1200}>
            <div className="flex gap-2.5 mt-[34px]">
              <button
                className="border border-slate-200 bg-slate-900 text-white px-[17px] py-[13px] rounded-full text-[10px] tracking-widest cursor-pointer transition-all duration-250 hover:-translate-y-0.5 hover:bg-slate-800 hover:border-slate-900"
                type="button"
              >
                VIEW MY WORK
              </button>

              <button
                className="border border-slate-200 bg-white text-slate-900 px-[17px] py-[13px] rounded-full text-[10px] tracking-widest cursor-pointer transition-all duration-250 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300"
                type="button"
              >
                LET&apos;S CONNECT
              </button>
            </div>
          </Reveal>

          <Reveal delay={1400}>
            <div className="mt-12 flex gap-[35px] text-[9px] tracking-widest text-slate-500">
              <span>02+ YEARS EXPERIENCE</span>
              <span>MARKETING / GROWTH</span>
            </div>
          </Reveal>
        </div>

        <div
          ref={viewportRef}
          className="relative h-[650px] flex items-center justify-center perspective-[1200px] touch-none select-none before:content-[''] before:absolute before:w-[1px] before:h-[74%] before:left-1/2 before:top-[13%] before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="absolute w-full max-w-[470px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <GrowthDataPanel
              capability={activeCapability}
            />
          </div>

          <div className="absolute inset-0 transform-style-3d pointer-events-auto">
            {CAPABILITIES.map((item, index) => (
              <div
                key={item.id}
                data-growth-row
              >
                <CapabilityRow
                  item={item}
                  index={index}
                  activeIndex={activeIndex}
                  onSelect={goTo}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-[6vw] bottom-[30px] flex items-center gap-[9px] text-[8px] tracking-widest text-slate-500">
        <span className="w-[35px] h-[1px] bg-slate-300" />
        SCROLL TO EXPLORE
        <span className="w-[35px] h-[1px] bg-slate-300" />
      </div>
      </div>
    </section>
  )
}
