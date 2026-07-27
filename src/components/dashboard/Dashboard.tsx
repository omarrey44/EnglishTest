"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  ClipboardCheck,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useProgress } from "@/components/progress/ProgressProvider";
import { SkillsGrid } from "@/components/progress/SkillCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ButtonLink } from "@/components/ui/Button";
import { getReadiness, getTopicProgress } from "@/lib/adaptiveLearning";
import { accuracyOf, readinessLabel, scoreOutOfTen } from "@/lib/scoring";

export function Dashboard() {
  const { state, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const topics = getTopicProgress(state);
  const readiness = getReadiness(state);
  const accuracy = accuracyOf(state.correctAnswers, state.questionsAnswered);
  const openMistakes = state.mistakes.filter((m) => !m.resolved).length;
  const lastExam = state.examResults[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.25rem] leading-none sm:text-[2.75rem]">
            English Exam Trainer
          </h1>
          <p className="mt-2 text-muted">Your goal: 10/10</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="tabular inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-gold">
            <Zap className="size-4" />
            {state.xp} XP
          </span>
          <span className="tabular inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold">
            <Flame className="size-4 text-warning" />
            {state.streak}
          </span>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="mt-7 p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                Exam Readiness
              </p>
              <p className="tabular mt-2 font-display text-6xl leading-none sm:text-7xl">
                {readiness}%
              </p>
              <p className="mt-2 text-lg text-muted">{readinessLabel(readiness)}</p>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[16rem]">
              <ProgressBar value={readiness} height="h-2.5" label="Exam readiness" />
              <p className="mt-2 text-xs text-muted">
                Average of your ten topic scores. Reach 95% to be safe for a 10.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Current score"
              value={`${scoreOutOfTen(readiness).toFixed(1)} / 10`}
              icon={<Target className="size-3.5" />}
            />
            <StatTile label="Accuracy" value={`${accuracy}%`} icon={<ClipboardCheck className="size-3.5" />} />
            <StatTile
              label="Questions answered"
              value={state.questionsAnswered}
              icon={<BookOpen className="size-3.5" />}
            />
            <StatTile label="Best streak" value={state.bestStreak} icon={<Flame className="size-3.5" />} />
          </div>
        </Card>
      </motion.div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ButtonLink href="/practice?mode=smart" size="lg" className="justify-between px-5">
          <span className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Smart Practice
          </span>
          <span className="text-sm opacity-70">15 questions</span>
        </ButtonLink>
        <ButtonLink
          href="/practice?mode=plan"
          size="lg"
          variant="accent"
          className="justify-between px-5"
        >
          <span className="flex items-center gap-2">
            <Target className="size-4" />
            Get Me to 10/10
          </span>
          <span className="text-sm opacity-70">personalized</span>
        </ButtonLink>
        <ButtonLink href="/exam" size="lg" variant="secondary" className="justify-between px-5">
          <span className="flex items-center gap-2">
            <Trophy className="size-4" />
            Exam Simulator
          </span>
          <span className="text-sm text-muted">30 questions</span>
        </ButtonLink>
        <ButtonLink href="/review" size="lg" variant="secondary" className="justify-between px-5">
          <span className="flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Review My Mistakes
          </span>
          <span className="text-sm text-muted">
            {openMistakes > 0 ? `${openMistakes} open` : "all clear"}
          </span>
        </ButtonLink>
      </div>

      {lastExam ? (
        <Card className="mt-4 flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Last exam simulation
            </p>
            <p className="tabular mt-1.5 text-2xl font-semibold">
              {lastExam.score.toFixed(1)} / 10
              <span className="ml-2 text-base font-normal text-muted">
                {lastExam.correct} of {lastExam.total} correct
              </span>
            </p>
          </div>
          <Link href="/exam" className="text-sm font-medium text-accent hover:underline">
            Take it again →
          </Link>
        </Card>
      ) : null}

      <section className="mt-12">
        <SectionTitle
          title="Your Skills"
          hint="Tap a topic to study the rules and practice it on its own."
          action={
            <Link href="/learn" className="text-sm font-medium text-accent hover:underline">
              All lessons →
            </Link>
          }
        />
        <SkillsGrid items={topics} />
      </section>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted">
        <p>Your progress is saved in this browser.</p>
        {confirmReset ? (
          <span className="flex items-center gap-3">
            <span>Delete all progress?</span>
            <button
              type="button"
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
              className="font-medium text-danger hover:underline"
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="hover:text-ink"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="transition-colors hover:text-ink"
          >
            Reset progress
          </button>
        )}
      </footer>
    </div>
  );
}
