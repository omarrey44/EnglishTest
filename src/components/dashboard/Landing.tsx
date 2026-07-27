"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { TOPICS } from "@/data/topics";

export function Landing() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-5 py-14 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          Basic English · Written exam
        </p>
        <h1 className="mt-5 font-display text-[3rem] leading-[0.95] sm:text-[4.5rem]">
          English Exam
          <br />
          Trainer
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted sm:text-xl">
          Let&apos;s get you ready for a 10. Fifteen questions to find your level, then a
          practice plan built around exactly what you get wrong.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/diagnostic" size="lg" className="px-7">
            Start Diagnostic
            <ArrowRight className="size-4" />
          </ButtonLink>
          <span className="text-sm text-muted">Takes about 6 minutes · no account needed</span>
        </div>

        <div className="mt-14 border-t border-line pt-7">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            What you will master
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <li
                key={topic.id}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted"
              >
                {topic.name}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
