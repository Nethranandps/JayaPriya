// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Mechanism
// ---------------------------------------------------------------------------

// Scroll progress where the cluster starts scattering and where it finishes.
const SCATTER_START = 0.12;
const SCATTER_END = 0.9;

const PARALLAX_X = 2.6;
const PARALLAX_Y = 2.2;
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };
const parallaxDepth = (i: number, total: number) =>
  total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75;

const RESPONSIVE = {
  desktop: {
    scale: null as number | null,
    small: false,
    colX: null as number | null,
    card: null as { w: number; h: number } | null,
  },
  small: {
    scale: 0.72,
    small: true,
    colX: 22,
    card: { w: 40, h: 20 },
  },
};

function useResponsive() {
  const [r, setR] = useState(RESPONSIVE.desktop);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => setR(mq.matches ? RESPONSIVE.small : RESPONSIVE.desktop);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return r;
}

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;

    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

export interface StackSpreadCardConfig {
  /** horizontal offset while clustered (vw) */
  stackOffsetX?: number;
  /** vertical offset while clustered (vh) */
  stackOffsetY?: number;
  /** rotation while clustered (degrees) */
  stackRotate?: number;
  /** final x position when scattered (vw) */
  targetX?: number;
  /** final y position when scattered (vh) */
  targetY?: number;
  /** final rotation when scattered (degrees) */
  targetRotate?: number;
  /** card width (vw) */
  width?: number;
  /** card height (vh) */
  height?: number;
  /** z-index */
  z?: number;
  /** mobile x position (vw) */
  targetSmX?: number;
  /** mobile y position (vh) */
  targetSmY?: number;
}

function Card({
  children,
  config,
  progress,
  reduce,
  clusterRotation,
  scaleMul,
  isSmall,
  colX,
  fixedCard,
  stackScale,
  cardRadius,
  pointer,
  depth,
}: {
  children: React.ReactNode;
  config: StackSpreadCardConfig;
  progress: MotionValue<number>;
  reduce: boolean | null;
  clusterRotation: boolean;
  scaleMul: number | null;
  isSmall: boolean;
  colX: number | null;
  fixedCard: { w: number; h: number } | null;
  stackScale: number;
  cardRadius: number;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  depth: number;
}) {
  const flat = reduce === true;
  const stackRotate = flat ? 0 : clusterRotation ? config.stackRotate ?? 0 : 0;
  const stackOffsetX = config.stackOffsetX ?? 0;
  const stackOffsetY = config.stackOffsetY ?? 0;
  const restScale = scaleMul ?? 1;

  const endX = isSmall && config.targetSmX != null
    ? colX != null
      ? Math.sign(config.targetSmX) * colX
      : config.targetSmX
    : config.targetX ?? 0;
  const endY = isSmall && config.targetSmY != null ? config.targetSmY : config.targetY ?? 0;
  const endRotate = flat || isSmall ? 0 : config.targetRotate ?? 0;

  const width = fixedCard ? fixedCard.w : config.width ?? 20;
  const height = fixedCard ? fixedCard.h : config.height ?? 20;

  const translate = useTransform(
    [progress, pointer.x, pointer.y],
    ([p, px, py]: number[]) => {
      const tx = stackOffsetX + (endX - stackOffsetX) * p;
      const ty = stackOffsetY + (endY - stackOffsetY) * p;
      const drift = depth * p;
      const dx = tx - px * PARALLAX_X * drift;
      const dy = ty - py * PARALLAX_Y * drift;
      return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`;
    },
  );
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [stackScale, restScale]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: `${width}vw`,
        height: `${height}vh`,
        zIndex: config.z ?? 1,
        translate,
        rotate,
        scale,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden max-md:rounded-[4vw]"
        style={{ borderRadius: `${cardRadius}px` }}
      >
        {children}
      </div>
    </motion.div>
  );
}

interface StackSpreadStageProps {
  children: React.ReactElement | React.ReactElement[];
  /** scatter scroll distance, in vh */
  scrollLength?: number;
  bgColor?: string;
  /** fan the clustered stack (default) or start flat */
  clusterRotation?: boolean;
  /** scale of the cards while clustered, before the scatter */
  stackScale?: number;
  /** corner radius on each card, in px (desktop only — mobile keeps its responsive radius) */
  cardRadius?: number;
  /** color of the centre headline and subtitle */
  textColor?: string;
  /** scroll progress (0-1) where the centre text starts fading in */
  textFadeStart?: number;
  /** show the "scroll to spread" hint at the bottom until the scatter begins */
  showScrollHint?: boolean;
  /** center headline text (optional) */
  headline?: string;
  /** center subheadline text (optional) */
  subheadline?: string;
}

function StackSpreadStage({
  children,
  scrollLength = 350,
  bgColor = "#ececeb",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 8,
  textColor = "#141414",
  textFadeStart = 0.3,
  showScrollHint = true,
  headline,
  subheadline,
}: StackSpreadStageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scale: scaleMul, small: isSmall, colX, card: fixedCard } =
    useResponsive();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(
    scrollYProgress,
    [0, SCATTER_START, SCATTER_END, 1],
    [0, 0, 1, 1],
  );

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    setSpread((was) => (was ? p > 0.985 : p >= 0.999));
  });
  const parallaxEnabled = reduce !== true && !isSmall;
  const pointer = usePointerParallax(spread, parallaxEnabled);

  const noScale = reduce === true;
  const copyOpacity = useTransform(progress, [textFadeStart, textFadeStart + 0.35], [0, 1]);
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.85, 1]);
  const hintOpacity = useTransform(progress, [0, SCATTER_START], [1, 0]);

  const cardsArray = Array.isArray(children) ? children : [children];

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      style={{ height: `${scrollLength}vh`, backgroundColor: bgColor }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {headline && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center max-md:px-8"
            style={{
              opacity: copyOpacity,
              scale: noScale ? 1 : copyScale,
            }}
          >
            <h2
              className="w-full whitespace-pre-line text-[4.5vw] font-normal leading-none! tracking-tight max-md:text-[10vw]"
              style={{ color: textColor }}
            >
              {headline}
            </h2>
            {subheadline && (
              <p
                className="mt-[1.2vw] w-full max-w-[42ch] text-[1.15vw] leading-relaxed tracking-tight max-md:mt-3 max-md:text-[3.6vw]"
                style={{ color: textColor, opacity: 0.6 }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        <div className="absolute inset-0 z-10">
          {cardsArray.map((child, i) => {
            const config = (child.props as any)?.config || {};
            return (
              <Card
                key={i}
                config={config}
                progress={progress}
                reduce={reduce}
                clusterRotation={clusterRotation}
                scaleMul={scaleMul}
                isSmall={isSmall}
                colX={colX}
                fixedCard={fixedCard}
                stackScale={stackScale}
                cardRadius={cardRadius}
                pointer={pointer}
                depth={parallaxEnabled ? parallaxDepth(i, cardsArray.length) : 0}
              >
                {child}
              </Card>
            );
          })}
        </div>

        {showScrollHint && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[3vh] z-20 flex flex-col items-center gap-[0.6vh] text-[0.8vw] font-medium uppercase tracking-[0.2em] max-md:bottom-6 max-md:gap-1 max-md:text-[2.8vw]"
            style={{ color: textColor, opacity: hintOpacity }}
          >
            <span>Scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce max-md:h-[4vw] max-md:w-[4vw]"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export interface StackSpreadProps {
  children: React.ReactElement | React.ReactElement[];
  /** scatter scroll distance, in vh */
  scrollLength?: number;
  bgColor?: string;
  /** fan the clustered stack (default) or start flat */
  clusterRotation?: boolean;
  /** scale of the cards while clustered, before the scatter */
  stackScale?: number;
  /** corner radius on each card, in px (desktop only — mobile keeps its responsive radius) */
  cardRadius?: number;
  /** color of the centre headline and subtitle */
  textColor?: string;
  /** scroll progress (0-1) where the centre text starts fading in */
  textFadeStart?: number;
  /** show the "scroll to spread" hint at the bottom until the scatter begins */
  showScrollHint?: boolean;
  /** center headline text (optional) */
  headline?: string;
  /** center subheadline text (optional) */
  subheadline?: string;
}

export default function StackSpread({
  children,
  scrollLength = 350,
  bgColor = "#ececeb",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 8,
  textColor = "#141414",
  textFadeStart = 0.3,
  showScrollHint = true,
  headline,
  subheadline,
}: StackSpreadProps) {
  return (
    <StackSpreadStage
      children={children}
      scrollLength={scrollLength}
      bgColor={bgColor}
      clusterRotation={clusterRotation}
      stackScale={stackScale}
      cardRadius={cardRadius}
      textColor={textColor}
      textFadeStart={textFadeStart}
      showScrollHint={showScrollHint}
      headline={headline}
      subheadline={subheadline}
    />
  );
}