"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame, Lightbulb } from "lucide-react";
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
        "relative rounded-xl border-2 p-5 pt-8 sm:p-6 sm:pt-9",
        correct ? "border-success bg-success/8" : "border-danger bg-danger/8",
      )}
    >
      {/* The verdict, pressed into the page like a marker's rubber stamp. */}
      <div
        className={cn(
          "stamped absolute -top-4 left-4 -rotate-[5deg] rounded-[5px] border-[2.5px] bg-paper px-3 py-1.5 sm:left-6",
          correct ? "border-success text-success" : "border-danger text-danger",
        )}
      >
        <span className="index text-[0.8rem]">{correct ? "Correct" : "Not quite"}</span>
      </div>

      {correct ? (
        <p className="font-display text-2xl leading-snug tracking-[-0.015em]">
          {question.correctAnswer}
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="index text-muted">Your answer</p>
            <p className="mt-1.5 text-[1.05rem] leading-snug text-danger line-through decoration-danger/60">
              {userAnswer.trim() || "—"}
            </p>
          </div>
          <div>
            <p className="index text-muted">Correct answer</p>
            <p className="mt-1.5 font-display text-2xl leading-snug tracking-[-0.015em]">
              {question.correctAnswer}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-3 rounded-lg border border-ink/10 bg-surface/80 p-4">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
        <div className="min-w-0">
          {question.rule ? (
            <p className="text-sm font-semibold tracking-[-0.005em]">{question.rule}</p>
          ) : null}
          <p className={cn("text-sm leading-relaxed text-muted", question.rule && "mt-1.5")}>
            {question.explanation}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {correct && xpGained > 0 ? (
          <span className="index rounded-[5px] border border-gold/35 bg-gold/12 px-2 py-1 text-gold">
            +{xpGained} XP
          </span>
        ) : null}
        {correct && streak >= 3 ? (
          <span className="index inline-flex items-center gap-1 rounded-[5px] border border-warning/30 bg-warning/10 px-2 py-1 text-warning">
            <Flame className="size-3" />
            {streak} in a row
          </span>
        ) : null}
        {!correct && streak === 0 ? (
          <span className="index text-muted">Streak ended — build another one</span>
        ) : null}
        {masteredTopicName ? (
          <span className="index rounded-[5px] border border-success/35 bg-success/12 px-2 py-1 text-success">
            {masteredTopicName} mastered · +50 XP
          </span>
        ) : null}
      </div>

      <Button
        onClick={onContinue}
        fullWidth
        size="lg"
        variant={correct ? "accent" : "primary"}
        className="mt-6"
      >
        {isLast ? "Finish" : "Continue"}
        <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  );
}
