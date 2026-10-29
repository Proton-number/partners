"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  duration?: number;
  fade?: boolean;
  as?: "div" | "span";
  className?: string;
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1.2,
  fade = true,
  as = "div",
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = as === "span" ? motion.span : motion.div;

  const offset =
    direction === "left"
      ? { x: -70 }
      : direction === "right"
        ? { x: 70 }
        : { y: 40 };

  return (
    <Tag
      initial={reduce ? false : { ...(fade ? { opacity: 0 } : {}), ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function ZoomSettle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { scale: 1.18 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2.2, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 2.4,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
