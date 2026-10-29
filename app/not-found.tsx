"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const ease = [0.2, 0.7, 0.2, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const digit = {
  hidden: { y: "120%" },
  show: { y: "0%", transition: { duration: 1, ease } },
};
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-6 pb-[env(safe-area-inset-bottom)] pt-24 text-center text-neutral-900">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col items-center"
      >
      
        <div
          aria-hidden
          className="flex select-none overflow-hidden pb-[0.15em] font-serif text-[36vw] font-medium leading-[0.85] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(9,30,60,0.35)] sm:text-[24vw] lg:text-[17rem]"
        >
          {"404".split("").map((c, i) => (
            <motion.span key={i} variants={digit} className="inline-block">
              {c}
            </motion.span>
          ))}
        </div>

        <motion.h1
          variants={rise}
          className="mt-6 max-w-2xl font-serif text-3xl font-medium leading-tight tracking-tight text-neutral-900 md:text-5xl"
        >
          <span className="sr-only">404. </span>
          We couldn’t find that address.
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-4 max-w-md font-serif text-base leading-relaxed text-neutral-600 md:text-lg"
        >
          The page may have been moved, sold, or never existed. Let’s get you
          back on track.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Link
            href="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#091e3c] px-7 font-serif text-xs font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#071832]"
          >
            Return home
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href="/properties"
            className="inline-flex h-12 items-center justify-center rounded-sm border border-neutral-300 px-7 font-serif text-xs font-semibold uppercase tracking-wider text-neutral-900 transition-colors duration-300 hover:border-neutral-900 hover:bg-neutral-50"
          >
            View properties
          </Link>
        </motion.div>

        <motion.p
          variants={rise}
          className="mt-8 font-serif text-xs uppercase tracking-wider text-neutral-500"
        >
          Need help?{" "}
          <Link
            href="/#contact"
            className="border-b border-neutral-400 pb-0.5 text-neutral-900 transition-colors hover:border-neutral-900"
          >
            Contact us
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
