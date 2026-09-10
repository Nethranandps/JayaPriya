"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const letterAnimations = [
  {
    active: {
      scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
      scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
    },
    transition: { duration: 0.8, ease: "easeInOut" },
    transformOrigin: "center center",
  },
  {
    active: {
      rotate: [0, 80, 60, 80, 60, 0],
      y: [0, 10, -5, 5, -2, 0],
    },
    transition: { duration: 1.2, ease: [0.175, 0.885, 0.32, 1.275] },
    transformOrigin: "bottom left",
  },
  {
    active: {
      scaleY: [1, 0.6, 1.2, 1],
      y: [0, 20, -40, 0],
    },
    transition: { duration: 0.6, ease: "easeOut" },
    transformOrigin: "bottom center",
  },
  {
    active: {
      rotateX: [0, 240, 150, 200, 175, 180, 180, 0],
      scale: [1, 1.1, 1],
    },
    transition: {
      duration: 2,
      ease: "easeOut",
      times: [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.85, 1],
    },
    transformOrigin: "50% 80%",
  },
  {
    active: {
      x: [0, -20, 15, -10, 5, 0],
    },
    transition: { duration: 0.8, ease: "easeInOut" },
    transformOrigin: "center center",
  },
  {
    active: {
      x: [0, -5, 5, -5, 5, -2, 2, 0],
      y: [0, -2, 2, -1, 1, 0],
      rotate: [0, -1, 1, -0.5, 0.5, 0],
    },
    transition: { duration: 0.5, ease: "linear" },
    transformOrigin: "center center",
  },
  {
    active: {
      scale: [1, 1.4, 1],
    },
    transition: { duration: 0.5, ease: "easeInOut" },
    transformOrigin: "center center",
  },
  {
    active: {
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
      textShadow: [
        "0px 0px 0px rgba(0,0,0,0)",
        "0px 20px 20px rgba(0,0,0,0.2)",
        "0px 0px 0px rgba(0,0,0,0)",
      ],
    },
    transition: { duration: 1.2, ease: "easeInOut" },
    transformOrigin: "center center",
  },
];

const DancingLetters = ({ text = "ANIMATE", className = "", letterClassName = "" }) => {
  const reduced = useReducedMotion();
  const [activeIndices, setActiveIndices] = useState(new Set());
  const activate = (index) => {
    if (reduced) return;
    setActiveIndices(previous => new Set(previous).add(index));
  };
  const complete = (index) => setActiveIndices(previous => {
    const next = new Set(previous);
    next.delete(index);
    return next;
  });

  return <LazyMotion features={domAnimation}>
    <m.span className={cn("dancing-letters", className)}
      initial={reduced ? false : "hidden"} animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
      {Array.from(text).map((letter, index) => {
        if (letter === " ") return <span className="dancing-space" key={index} aria-hidden="true"> </span>;
        const animation = letterAnimations[index % letterAnimations.length];
        const active = activeIndices.has(index) && !reduced;
        return <m.button type="button" key={index}
          initial={reduced ? false : "hidden"}
          aria-label={`Animate ${letter}, letter ${index + 1}`}
          className={cn("dancing-letter", letterClassName)}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.8 },
            visible: { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, scale: 1, scaleX: 1, scaleY: 1,
              textShadow: "0px 0px 0px rgba(0,0,0,0)",
              transition: reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 } },
            active: { ...animation.active, opacity: 1, transition: animation.transition },
          }}
          animate={active ? "active" : "visible"}
          onHoverStart={() => activate(index)} onClick={() => activate(index)}
          onAnimationComplete={definition => { if (definition === "active") complete(index); }}
          style={{ transformOrigin: animation.transformOrigin, transformStyle: "preserve-3d", zIndex: active ? 1 : 0 }}>
          {letter}
        </m.button>;
      })}
    </m.span>
  </LazyMotion>;
};

export default DancingLetters;
