"use client";

import { motion } from "framer-motion";
import { ED_SOUND_RULES } from "@/data/lessons";
import { cn } from "@/lib/cn";

const TONE_STYLES = {
  warning: {
    ring: "border-warning/30 bg-warning/8",
    text: "text-warning",
    chip: "bg-warning/15 text-warning",
  },
  danger: {
    ring: "border-danger/30 bg-danger/8",
    text: "text-danger",
    chip: "bg-danger/15 text-danger",
  },
  success: {
    ring: "border-success/30 bg-success/8",
    text: "text-success",
    chip: "bg-success/15 text-success",
  },
} as const;

export function EdSoundTrainer() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-surface-2 p-5">
        <p className="text-sm font-semibold">The one rule that decides everything</p>
        <p className="mt-2 text-sm text-muted">
          Look at the <span className="font-semibold text-ink">final sound</span> of the verb, not
          the final letter. <span className="phonetic">work</span> ends with the sound{" "}
          <span className="phonetic font-semibold text-ink">/k/</span>, so{" "}
          <span className="phonetic">worked</span> ={" "}
          <span className="phonetic font-semibold text-ink">/wɜːrkt/</span>.
        </p>
      </div>

      {ED_SOUND_RULES.map((rule, index) => {
        const tone = TONE_STYLES[rule.tone];
        return (
          <motion.div
            key={rule.sound}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className={cn("rounded-2xl border p-5 sm:p-6", tone.ring)}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className={cn("phonetic text-4xl font-semibold", tone.text)}>{rule.sound}</span>
              <span className="text-sm font-medium">{rule.after}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{rule.detail}</p>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {rule.examples.map((ex) => (
                <li
                  key={ex.verb}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{ex.verb}</p>
                    <p className="mt-0.5 text-xs text-muted">{ex.why}</p>
                  </div>
                  <span className={cn("phonetic shrink-0 rounded-lg px-2 py-1 text-sm", tone.chip)}>
                    {ex.ipa}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm font-semibold">Traps that cost points</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <span className="font-medium text-ink">studied</span> looks like it ends in d, but the
            verb <span className="phonetic">study</span> ends in a vowel sound → /d/.
          </li>
          <li>
            <span className="font-medium text-ink">watched</span> ends in the sound /tʃ/, which is
            voiceless → /t/.
          </li>
          <li>
            <span className="font-medium text-ink">opened</span> has a /p/ in the middle, but only
            the last sound /n/ counts → /d/.
          </li>
          <li>
            Only <span className="phonetic font-medium text-ink">/ɪd/</span> adds a syllable:
            vis-it-ed.
          </li>
        </ul>
      </div>
    </div>
  );
}
