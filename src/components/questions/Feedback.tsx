"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Flame, Lightbulb, X } from "lucide-react";
import type { Question } from "@/types/question";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Feedback({
  question,
  userAnswer,
  correct,
  xpGained,
  streak,
  masteredTopicName,
  onContinue,
  isLast,
}: {
  question: Question;
  userAnswer: string;
  correct: boolean;
  xpGained: number;
  streak: number;
  masteredTopicName?: string | null;
  onContinue: () => void;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className={cn(
        "rounded-2xl border p-5 sm:p-6",
        correct ? "border-success/30 bg-success/8" : "border-danger/30 bg-danger/8",
      )}
    >
      <div className="flex items-start gap-3">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            correct ? "bg-success text-white" : "bg-danger text-white",
          )}
        >
          {correct ? <Check className="size-5" /> : <X className="size-5" />}
        </motion.span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-display text-2xl leading-none",
              correct ? "text-success" : "text-danger",
            )}
          >
            {correct ? "Correct!" : "Not quite."}
          </p>

          {correct ? (
            <p className="mt-3 text-lg leading-snug font-medium">{question.correctAnswer}</p>
          ) : (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">
                  Your answer
                </p>
                <p className="mt-1 text-[1.05rem] leading-snug line-through decoration-danger/50">
                  {userAnswer.trim() || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">
                  Correct answer
                </p>
                <p className="mt-1 text-[1.05rem] leading-snug font-semibold">
                  {question.correctAnswer}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2.5 rounded-xl border border-ink/8 bg-surface/70 p-3.5">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
            <div className="min-w-0">
              {question.rule ? (
                <p className="text-sm font-semibold">{question.rule}</p>
              ) : null}
              <p className={cn("text-sm text-muted", question.rule && "mt-1")}>
                {question.explanation}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {correct && xpGained > 0 ? (
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full bg-gold/15 px-2.5 py-1 font-semibold text-gold"
              >
                +{xpGained} XP
              </motion.span>
            ) : null}
            {correct && streak >= 3 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-muted">
                <Flame className="size-3.5 text-warning" />
                {streak} question streak
              </span>
            ) : null}
            {!correct && streak === 0 ? (
              <span className="text-muted">Streak ended — let&apos;s build another one.</span>
            ) : null}
            {masteredTopicName ? (
              <span className="rounded-full bg-success/15 px-2.5 py-1 font-semibold text-success">
                {masteredTopicName} mastered +50 XP
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Button
        onClick={onContinue}
        fullWidth
        size="lg"
        variant={correct ? "accent" : "primary"}
        className="mt-5"
      >
        {correct ? (isLast ? "Finish" : "Continue") : isLast ? "Got it → Finish" : "Got it → Continue"}
        <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  );
}
