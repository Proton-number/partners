"use client";

import { SyntheticEvent, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/submitClient";

const ease = [0.2, 0.7, 0.2, 1] as const;
const MIN_YEAR = 1970;

const stagger = (gap: number, delay = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: gap,
      delayChildren: delay,
    },
  },
});

const root = stagger(0.08, 0.1);
const column = stagger(0.09);

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

const word = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease },
  },
};

const panel = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease,
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const inputCls =
  "h-11 rounded-none border-0 border-b border-neutral-300 bg-transparent px-0 font-serif text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 [color-scheme:light]";

const labelCls = "font-serif text-xs uppercase tracking-wider text-neutral-600";

type Errors = Partial<
  Record<"name" | "email" | "year" | "birthday" | "whatsapp", string>
>;

function Word({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="mb-[-0.15em] mr-[-0.08em] inline-block overflow-hidden pb-[0.15em] pr-[0.08em] align-bottom">
      <motion.span variants={word} className={`inline-block ${className}`}>
        {children}
      </motion.span>
    </span>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={rise} className="space-y-1">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>

      <div className="group/field relative">
        {children}

        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-neutral-900 transition-transform duration-500 group-focus-within/field:scale-x-100"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            key={`${id}-error`}
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-serif text-xs text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const get = (key: string) => String(data.get(key) ?? "").trim();
  const errors: Errors = {};

  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  if (get("name").length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!/^\S+@\S+\.\S+$/.test(get("email"))) {
    errors.email = "Please enter a valid email address.";
  }

  const year = Number(get("year"));
  if (!Number.isInteger(year) || year < MIN_YEAR || year > currentYear) {
    errors.year = `Enter a year between ${MIN_YEAR} and ${currentYear}.`;
  }

  const birthday = get("birthday");
  if (!birthday) {
    errors.birthday = "Please select your date of birth.";
  } else if (birthday > today) {
    errors.birthday = "Date of birth can't be in the future.";
  }

  const whatsapp = get("whatsapp").replace(/[\s()-]/g, "");
  if (!/^\+?\d{10,15}$/.test(whatsapp)) {
    errors.whatsapp = "Enter a valid number, e.g. +234 801 234 5678.";
  }

  return errors;
}

export default function PartnersPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    setError("");
    try {
      const data = new FormData(form);
      const get = (key: string) => String(data.get(key) ?? "").trim();
      const { error: insertError } = await supabase
        .from("partner_applications")
        .insert({
          name: get("name"),
          email: get("email").toLowerCase(),
          year_joined: Number(get("year")),
          date_of_birth: get("birthday"),
          whatsapp: get("whatsapp").replace(/[\s()-]/g, ""),
        });
      if (insertError) {
        console.error("Supabase error:", insertError); // add this
        if (insertError.code === "23505") {
          setError("This email has already been submitted.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }
      form.reset();

      setSent(true);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => setSent(false), 10000);

    return () => clearTimeout(timer);
  }, [sent]);

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 px-6 pb-24 pt-32 sm:pt-40">
      <motion.div
        variants={root}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-start lg:gap-16"
      >
        <motion.div
          variants={column}
          className="lg:sticky lg:top-32 lg:self-start lg:pt-6"
        >
          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
            <Word>Partners</Word> <Word>in</Word> <Word>every</Word>{" "}
            <Word className="italic text-[#091e3c]">deal.</Word>
          </h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-lg font-serif text-lg leading-relaxed text-neutral-600"
          >
            You know the market and the people in it. We build, develop and sell
            the properties. Together, that means better opportunities for your
            clients and a stronger name for both of us.
          </motion.p>
        </motion.div>

        <motion.div
          variants={panel}
          className="relative overflow-hidden border border-neutral-200 bg-white p-6 shadow-none sm:p-8"
        >
          <motion.h2
            variants={rise}
            className="font-serif text-2xl font-medium tracking-tight text-neutral-900"
          >
            Become a partner
          </motion.h2>

          <motion.div
            variants={rise}
            className="my-6 h-px origin-left bg-neutral-300"
          />

          <motion.p
            variants={rise}
            className="font-serif text-sm text-neutral-500"
          >
            All fields are required.
          </motion.p>

          <form
            onSubmit={handleSubmit}
            noValidate
            onChange={() => {
              if (error) setError("");
            }}
            inert={sent}
            className={`mt-8 flex flex-col gap-6 transition-opacity duration-300 ${
              sent ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <Field id="name" label="Full Name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={inputCls}
                />
              </Field>

              <Field id="email" label="Email Address" error={errors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <Field
                id="year"
                label="Year You Joined Real Estate"
                error={errors.year}
              >
                <Input
                  id="year"
                  name="year"
                  type="number"
                  inputMode="numeric"
                  min={MIN_YEAR}
                  max={currentYear}
                  placeholder={String(currentYear - 5)}
                  required
                  aria-invalid={!!errors.year}
                  aria-describedby={errors.year ? "year-error" : undefined}
                  className={inputCls}
                />
              </Field>

              <Field
                id="birthday"
                label="Date of Birth"
                error={errors.birthday}
              >
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  autoComplete="bday"
                  max={today}
                  required
                  aria-invalid={!!errors.birthday}
                  aria-describedby={
                    errors.birthday ? "birthday-error" : undefined
                  }
                  className={inputCls}
                />
              </Field>
            </div>

            <Field
              id="whatsapp"
              label="WhatsApp Number"
              error={errors.whatsapp}
            >
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+234 801 234 5678"
                required
                aria-invalid={!!errors.whatsapp}
                aria-describedby={
                  errors.whatsapp ? "whatsapp-error" : undefined
                }
                className={inputCls}
              />
            </Field>

            <motion.div variants={rise}>
              <Button
                type="submit"
                disabled={loading}
                className="group h-12 w-full rounded-none bg-[#091e3c] font-serif text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#071832] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit"}

                {loading && <Loader2 className="ml-2 size-4 animate-spin" />}
              </Button>
            </motion.div>
          </form>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                role="alert"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 border border-red-200 bg-red-50 px-4 py-3 font-serif text-sm text-red-700"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Success screen */}
          <AnimatePresence>
            {sent && (
              <motion.div
                key="done"
                role="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white p-8 text-center"
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  aria-hidden
                >
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke="#091e3c"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease }}
                  />

                  <motion.path
                    d="M20 33l8 8 16-17"
                    stroke="#091e3c"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, ease }}
                  />
                </svg>

                <h2 className="font-serif text-2xl font-medium text-neutral-900">
                  Application received.
                </h2>

                <p className="max-w-xs font-serif text-sm leading-relaxed text-neutral-600">
                  We&apos;ll review your details and contact you shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </main>
  );
}
