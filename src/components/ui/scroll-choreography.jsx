import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "../../lib/utils";

function Card({ card, style, zIndex, contentOpacity }) {
  const Icon = card.icon;
  return (
    <motion.div
      style={style}
      whileHover={{ scale: 1.035 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 will-change-transform",
        zIndex
      )}
    >
      <div className="relative h-full w-full cursor-pointer overflow-hidden shadow-2xl">
        <img src={card.image} alt={card.label} className="absolute inset-0 h-full w-full object-cover" />
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30 mix-blend-multiply", card.gradient)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative flex h-full w-full flex-col justify-between p-[clamp(0.75rem,1.4vw,1.75rem)] text-white"
        >
          <div className="flex items-start justify-between">
            <span className="text-[clamp(0.65rem,1vw,0.9rem)] font-black tracking-widest text-white/70">
              {card.id}
            </span>
            {Icon && <Icon className="h-[clamp(14px,1.6vw,26px)] w-[clamp(14px,1.6vw,26px)] text-white/85" />}
          </div>
          <div>
            <div className="text-[clamp(0.8rem,1.6vw,1.5rem)] font-bold tracking-tight">{card.label}</div>
            <p className="mt-1 line-clamp-2 max-w-[90%] text-[clamp(0.6rem,0.9vw,0.85rem)] leading-snug text-white/80">
              {card.desc}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ScrollChoreography({
  className,
  cards,
  overlay,
  // Lets the cluster sit off-center (e.g. in a right-hand column next to
  // text) during the diagonal/stack phases, then recenters for the
  // full-screen hero reveal so the finale is never clipped.
  clusterShift = "0vw",
  cardWidth = "36vw",
  cardHeight = "24vh",
  spreadX = "20vw",
  spreadY = "14vh",
  // Total pinned scroll distance. Shorter = less dead scrolling after the
  // stack forms before the next section takes over.
  scrollLength = "300vh",
}) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 1,
    restDelta: 0.001,
  });

  const xLeft = `-${spreadX}`;
  const xRight = spreadX;
  const yTop = `-${spreadY}`;
  const yBottom = spreadY;

  const clusterX = useTransform(
    smoothProgress,
    [0, 0.65, 0.9, 1],
    [clusterShift, clusterShift, "0vw", "0vw"]
  );

  // Gentle pointer parallax so the cluster feels alive even between scroll
  // ticks. Skipped entirely for prefers-reduced-motion.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const tiltX = useTransform(pointerY, [0, 1], [5, -5]);
  const tiltY = useTransform(pointerX, [0, 1], [-5, 5]);
  const handlePointerMove = reduceMotion
    ? undefined
    : (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerX.set((e.clientX - rect.left) / rect.width);
        pointerY.set((e.clientY - rect.top) / rect.height);
      };
  const handlePointerLeave = reduceMotion
    ? undefined
    : () => {
        pointerX.set(0.5);
        pointerY.set(0.5);
      };

  const tlX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const tlY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yBottom, yBottom, "0vh", "0vh"]);

  const brX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const brY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yTop, yTop, "0vh", "0vh"]);

  const blX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const blY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yBottom, yBottom, "0vh", "0vh"]);

  const trX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const trY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yTop, yTop, "0vh", "0vh"]);

  // Cards converge to a stack by ~0.65, hold briefly so it reads, then the
  // whole stack fades out right at the end of the pin so scrolling carries
  // straight into the next section — no reveal stage, no dead gap.
  const cardsOpacity = useTransform(smoothProgress, [0.8, 1], [1, 0]);
  const overlayOpacity = useTransform(smoothProgress, [0, 0.55, 0.7], [1, 1, 0]);

  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ height: scrollLength }}>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ perspective: 1200 }}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
      >
        {overlay && (
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="pointer-events-none absolute inset-0 z-50"
          >
            {overlay}
          </motion.div>
        )}

        <motion.div
          style={{ x: clusterX, rotateX: reduceMotion ? 0 : tiltX, rotateY: reduceMotion ? 0 : tiltY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Card
            card={cards.topLeft}
            zIndex="z-10"
            contentOpacity={1}
            style={{ x: tlX, y: tlY, opacity: cardsOpacity, width: cardWidth, height: cardHeight }}
          />

          <Card
            card={cards.bottomRight}
            zIndex="z-20"
            contentOpacity={1}
            style={{ x: brX, y: brY, opacity: cardsOpacity, width: cardWidth, height: cardHeight }}
          />

          <Card
            card={cards.bottomLeft}
            zIndex="z-30"
            contentOpacity={1}
            style={{ x: blX, y: blY, opacity: cardsOpacity, width: cardWidth, height: cardHeight }}
          />

          <Card
            card={cards.topRight}
            zIndex="z-40"
            contentOpacity={1}
            style={{ x: trX, y: trY, opacity: cardsOpacity, width: cardWidth, height: cardHeight }}
          />
        </motion.div>

        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-slate-400">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-5 rounded-full border-2 border-slate-300"
          >
            <div className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF8A3D]" />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 z-50 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-slate-200">
          <motion.div style={{ width: progressWidth }} className="h-full rounded-full bg-[#FF8A3D]" />
        </div>
      </div>
    </div>
  );
}

export default ScrollChoreography;
