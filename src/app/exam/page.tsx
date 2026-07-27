"use client";

import { useMemo, useState } from "react";
import { ArrowRight, EyeOff, ListChecks, Timer } from "lucide-react";
import { SessionRunner, type SessionSummary } from "@/components/questions/SessionRunner";
import { ResultsScreen } from "@/components/exam/ResultsScreen";
import { Loading } from "@/components/ui/Loading";
import { Eyebrow } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useProgress } from "@/components/progress/ProgressProvider";
import { generateExam } from "@/lib/examGenerator";
import { AppHeader } from "@/components/dashboard/AppHeader";

export default function ExamPage() {
  const { ready, saveExam } = useProgress();
  const [started, setStarted] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [round, setRound] = useState(0);

  // A fresh exam is generated on the client for every round.
  const questions = useMemo(
    () => (ready ? generateExam() : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, round],
  );

  if (summary) {
    return (
      <ResultsScreen
        summary={summary}
        title="Exam simulator · final result"
        retryLabel="Take another exam"
        onRetry={() => {
          setSummary(null);
          setStarted(false);
          setRound((r) => r + 1);
        }}
      />
    );
  }

  if (!questions) return <Loading label="Building your exam…" />;

  if (!started) {
    return (
      <>
      <AppHeader />
      <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10">
        <div className="rise">
          <div className="flex items-center gap-4">
            <Eyebrow>Exam simulator</Eyebrow>
            <span aria-hidden className="leader" />
            <span className="index tabular text-muted">30 Q</span>
          </div>

          <h1 className="mt-5 font-display text-[3rem] leading-[0.88] tracking-[-0.03em] sm:text-[4rem]">
            30 questions.
            <br />
            <span className="marker">All topics.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            This works like the real written exam: you answer everything first and only see your
            score at the end.
          </p>

          <ul className="mt-10">
            {[
              {
                icon: ListChecks,
                lead: "One question per screen",
                body: "Ordinals, dates, years, and/but, past verbs, -ed spelling and pronunciation, was/were and WH questions.",
              },
              {
                icon: EyeOff,
                lead: "No feedback during the exam",
                body: "No answers, no explanations, no right/wrong marks until you are done.",
              },
              {
                icon: Timer,
                lead: "No time limit",
                body: "But answer as if there were one. Your score out of 10 appears at the end.",
              },
            ].map((rule, i) => {
              const Icon = rule.icon;
              return (
                <li
                  key={rule.lead}
                  className="rise flex items-start gap-4 border-b border-line py-4 first:border-t"
                  style={{ "--d": `${100 + i * 70}ms` } as React.CSSProperties}
                >
                  <span className="index tabular mt-1 shrink-0 text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">{rule.lead}</span>
                    <span className="text-muted"> — {rule.body}</span>
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-9 flex flex-col gap-2.5 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => setStarted(true)}>
              Start exam
              <ArrowRight className="size-4" />
            </Button>
            <ButtonLink href="/" size="lg" variant="secondary" className="flex-1">
              Back to dashboard
            </ButtonLink>
          </div>
        </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <SessionRunner
      key={round}
      questions={questions}
      mode="exam"
      title="Exam simulator"
      onFinish={(result) => {
        saveExam({
          total: result.total,
          correct: result.correct,
          accuracy: result.accuracy,
          score: result.score,
          topicBreakdown: result.byTopic,
        });
        setSummary(result);
      }}
    />
  );
}
