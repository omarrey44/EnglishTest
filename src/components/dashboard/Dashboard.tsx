"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProgress } from "@/components/progress/ProgressProvider";
import { SkillsGrid } from "@/components/progress/SkillCard";
import { Eyebrow, SectionTitle } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TextLink } from "@/components/ui/Button";
import { getReadiness, getTopicProgress } from "@/lib/adaptiveLearning";
import { accuracyOf, readinessLabel, scoreOutOfTen } from "@/lib/scoring";
import { AppHeader } from "./AppHeader";

const ACTIONS = [
  { href: "/practice?mode=smart", title: "Start smart practice", meta: "Personalized exercises", icon: Sparkles, primary: true },
  { href: "/exam", title: "Take exam simulator", meta: "Real exam experience", icon: Trophy, primary: false },
  { href: "/review", title: "Review my mistakes", meta: "Learn from your errors", icon: AlertTriangle, primary: false },
  { href: "/learn", title: "Browse all topics", meta: "Practice by subject", icon: BookOpen, primary: false },
] as const;

export function Dashboard() {
  const { state, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const topics = getTopicProgress(state);
  const readiness = getReadiness(state);
  const accuracy = accuracyOf(state.correctAnswers, state.questionsAnswered);
  const openMistakes = state.mistakes.filter((m) => !m.resolved).length;
  const lastExam = state.examResults[0];

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12">
        <section className="relative mt-5 min-h-[440px] overflow-hidden rounded-[32px] border border-white bg-[#f2eadd] shadow-[0_24px_80px_rgba(46,43,53,.12)]">
          <Image
            src="/images/generated/study-hero.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover object-[58%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,244,236,.98)_0%,rgba(248,244,236,.9)_34%,rgba(248,244,236,.15)_67%,rgba(248,244,236,.05)_100%)]" />

          <div className="relative z-10 grid min-h-[440px] items-center gap-8 p-6 sm:p-10 lg:grid-cols-[.95fr_1.05fr] lg:p-12">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <Sparkles className="size-4 text-warning" />
                Keep going, Omar!
              </p>
              <h1 className="mt-4 font-display text-[2.7rem] leading-[0.95] tracking-[-0.04em] sm:text-[4rem]">
                Master English,
                <br />
                <span className="italic text-[#0b389a]">one practice at a time.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-ink-soft">
                Focused exercises, instant feedback and realistic exam simulations—all built around your progress.
              </p>
              <div className="mt-7 inline-flex max-w-md items-start gap-3 rounded-2xl border border-white/80 bg-white/65 px-4 py-3 text-sm text-ink-soft backdrop-blur">
                <span className="font-display text-3xl leading-5 text-muted">“</span>
                Small steps every day lead to big results.
              </div>
            </div>

            <div className="glass rounded-[28px] p-5 sm:p-7 lg:ml-auto lg:max-w-[620px]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Eyebrow>Your current level</Eyebrow>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="tabular font-display text-[5.8rem] leading-[.8] tracking-[-.06em]">{readiness}</p>
                    <span className="pb-1 text-xl font-semibold">%</span>
                  </div>
                  <p className="mt-3 font-display text-xl">{readinessLabel(readiness)}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-accent">
                  B1 · Intermediate
                </span>
              </div>

              <div className="mt-7">
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <span className="font-semibold">You&apos;re getting close!</span>
                  <span className="tabular font-bold text-accent">{readiness}%</span>
                </div>
                <ProgressBar value={readiness} height="h-3" label="Exam readiness" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <StatTile label="Score" value={`${scoreOutOfTen(readiness).toFixed(1)}/10`} icon={<Target className="size-4" />} />
                <StatTile label="Accuracy" value={`${accuracy}%`} icon={<ClipboardCheck className="size-4" />} />
                <StatTile label="Answered" value={state.questionsAnswered} icon={<BookOpen className="size-4" />} />
                <StatTile label="Best streak" value={state.bestStreak} icon={<Flame className="size-4" />} />
              </div>
            </div>
          </div>
        </section>

        <nav className="-mt-5 relative z-20 grid gap-3 px-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Quick actions">
          {ACTIONS.map((action, i) => {
            const Icon = action.icon;
            const meta = action.href === "/review" ? (openMistakes ? `${openMistakes} mistakes waiting` : "Everything is clear") : action.meta;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`rise press-soft group flex min-h-[92px] items-center gap-4 rounded-2xl border p-4 ${
                  action.primary
                    ? "border-blue-700 bg-gradient-to-br from-[#075ee8] to-[#111e88] text-white"
                    : "border-line bg-white text-ink"
                }`}
                style={{ "--d": `${i * 55}ms` } as React.CSSProperties}
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${action.primary ? "bg-white/12" : "bg-blue-50 text-accent"}`}>
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{action.title}</span>
                  <span className={`mt-1 block text-xs ${action.primary ? "text-blue-100" : "text-muted"}`}>{meta}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </nav>

        {lastExam ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-card">
            <span className="index text-muted">Last exam</span>
            <strong className="tabular font-display text-2xl">{lastExam.score.toFixed(1)}/10</strong>
            <span className="text-sm text-muted">{lastExam.correct} of {lastExam.total} correct</span>
            <span className="leader" aria-hidden />
            <TextLink href="/exam">Take it again</TextLink>
          </div>
        ) : null}

        <section className="mt-14">
          <SectionTitle
            index="Your learning journey"
            title="Ten topics. One clear path."
            hint="Continue where you left off, or focus on the topics that need the most attention."
            action={<TextLink href="/learn">All lessons</TextLink>}
          />
          <SkillsGrid items={topics} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_.9fr]">
          <div className="flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#071a55] to-[#111f63] p-6 text-white sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-white/10"><Flame className="size-6 text-orange-400" /></span>
              <div>
                <p className="font-display text-2xl">Build your daily streak</p>
                <p className="mt-1 text-sm text-blue-100">Practice a little every day and see real progress.</p>
              </div>
            </div>
            <div className="flex gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <span key={`${day}-${i}`} className={`grid size-8 place-items-center rounded-full text-xs font-bold ${i < Math.min(state.streak, 7) ? "bg-accent text-white" : "bg-white/8 text-blue-200"}`}>
                  {i < Math.min(state.streak, 7) ? "✓" : day}
                </span>
              ))}
            </div>
          </div>
          <Link href="/practice?mode=plan" className="press-soft flex items-center justify-between rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-[#ffe4bd] p-6">
            <div>
              <p className="font-display text-2xl">Your goal: 10/10</p>
              <p className="mt-1 text-sm text-ink-soft">A focused plan is ready for you.</p>
            </div>
            <Zap className="size-8 text-warning" />
          </Link>
        </section>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
          <p>Progress is saved in this browser.</p>
          {confirmReset ? (
            <span className="flex items-center gap-4">
              <span>Delete all progress?</span>
              <button type="button" onClick={() => { reset(); setConfirmReset(false); }} className="min-h-11 font-semibold text-danger">Yes, reset</button>
              <button type="button" onClick={() => setConfirmReset(false)} className="min-h-11 font-semibold text-ink">Cancel</button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmReset(true)} className="min-h-11 font-semibold hover:text-ink">Reset progress</button>
          )}
        </footer>
      </main>
    </div>
  );
}
