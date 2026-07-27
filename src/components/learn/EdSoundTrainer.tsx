"use client";

import { ED_SOUND_RULES } from "@/data/lessons";
import { Eyebrow } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const TONE_STYLES = {
  warning: {
    ring: "border-warning bg-warning/8",
    text: "text-warning",
    chip: "border-warning/35 bg-warning/12 text-warning",
  },
  danger: {
    ring: "border-danger bg-danger/8",
    text: "text-danger",
    chip: "border-danger/35 bg-danger/12 text-danger",
  },
  success: {
    ring: "border-success bg-success/8",
    text: "text-success",
    chip: "border-success/35 bg-success/12 text-success",
  },
} as const;

export function EdSoundTrainer() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-ink bg-surface p-5">
        <Eyebrow>The one rule that decides everything</Eyebrow>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Look at the <span className="marker font-semibold text-ink">final sound</span> of the
          verb, not the final letter. <span className="phonetic">work</span> ends with the sound{" "}
          <span className="phonetic font-semibold text-ink">/k/</span>, so{" "}
          <span className="phonetic">worked</span> ={" "}
          <span className="phonetic font-semibold text-ink">/wɜːrkt/</span>.
        </p>
      </div>

      {ED_SOUND_RULES.map((rule, index) => {
        const tone = TONE_STYLES[rule.tone];
        return (
          <div
            key={rule.sound}
            className={cn("rise rounded-xl border-2 p-5 sm:p-6", tone.ring)}
            style={{ "--d": `${index * 70}ms` } as React.CSSProperties}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className={cn("phonetic text-[2.75rem] leading-none font-bold", tone.text)}>
                {rule.sound}
              </span>
              <span className="font-semibold tracking-[-0.01em]">{rule.after}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{rule.detail}</p>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {rule.examples.map((ex) => (
                <li
                  key={ex.verb}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold tracking-[-0.01em]">{ex.verb}</p>
                    <p className="mt-0.5 text-xs text-muted">{ex.why}</p>
                  </div>
                  <span
                    className={cn(
                      "phonetic shrink-0 rounded-[5px] border px-2 py-1 text-sm",
                      tone.chip,
                    )}
                  >
                    {ex.ipa}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="rounded-xl border border-line bg-surface-2 p-5">
        <Eyebrow>Traps that cost points</Eyebrow>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
          <li>
            <span className="font-semibold text-ink">studied</span> looks like it ends in d, but the
            verb <span className="phonetic">study</span> ends in a vowel sound → /d/.
          </li>
          <li>
            <span className="font-semibold text-ink">watched</span> ends in the sound /tʃ/, which is
            voiceless → /t/.
          </li>
          <li>
            <span className="font-semibold text-ink">opened</span> has a /p/ in the middle, but only
            the last sound /n/ counts → /d/.
          </li>
          <li>
            Only <span className="phonetic font-semibold text-ink">/ɪd/</span> adds a syllable:
            vis-it-ed.
          </li>
        </ul>
      </div>
    </div>
  );
}
