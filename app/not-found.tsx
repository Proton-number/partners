"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Home } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NotFound() {
  const reduce = useReducedMotion();

  // cursor position, normalized to -0.5..0.5 and smoothed
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 20 });
  const my = useSpring(rawY, { stiffness: 50, damping: 20 });

  // background drifts opposite to the cursor, numerals follow it a little
  const bgX = useTransform(mx, [-0.5, 0.5], [24, -24]);
  const bgY = useTransform(my, [-0.5, 0.5], [16, -16]);
  const numX = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const numY = useTransform(my, [-0.5, 0.5], [-10, 10]);

  const digitClass =
    "inline-block bg-linear-to-b from-white via-white/80 to-white/10 bg-clip-text font-semibold leading-none tracking-tighter text-transparent text-[clamp(7rem,30vw,22rem)]";

  return (
    <main
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden text-white"
      onMouseMove={(e) => {
        if (reduce) return;
        rawX.set(e.clientX / window.innerWidth - 0.5);
        rawY.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="absolute inset-[-6%] -z-20"
      >
        <motion.div
          initial={reduce ? false : { scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.6, ease: EASE }}
          className="relative h-full w-full"
        >
          <Image
            src="/404.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950/95 via-neutral-900/65 to-neutral-900/35" />
      <div className="absolute inset-0 -z-10 bg-[#091e3c]/30 mix-blend-multiply" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-24 text-center">
        <motion.p
          aria-hidden
          style={{ x: numX, y: numY }}
          className="mt-4 select-none"
        >
          <motion.span
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <motion.span
              initial={reduce ? false : { opacity: 0, x: -140 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
              className={digitClass}
            >
              4
            </motion.span>
            <motion.span
              initial={
                reduce ? false : { opacity: 0, scale: 0.5, rotate: -140 }
              }
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.6, delay: 0.55, ease: EASE }}
              className={digitClass}
            >
              0
            </motion.span>
            <motion.span
              initial={reduce ? false : { opacity: 0, x: 140 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
              className={digitClass}
            >
              4
            </motion.span>
          </motion.span>
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
          className="-mt-2 text-3xl font-semibold tracking-tight sm:text-5xl"
        >
          <span className="sr-only">404, Page not found.</span>
          We couldn’t find
          <span className="block font-serif font-normal italic text-white/90">
            this address.
          </span>
        </motion.h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.65, ease: EASE }}
          className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
          <Button className="h-12 w-full rounded-full bg-white px-8 text-sm font-semibold text-[#091e3c] shadow-lg shadow-black/20 transition-colors hover:bg-white/90 sm:w-auto">
            <Link href="/">Go back home</Link>
          </Button>

          <Button
            variant="outline"
            className="group h-12 w-full rounded-full border-white/30 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white sm:w-auto"
          >
            <Link href="https://constrally.com/properties">
              Browse properties
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
