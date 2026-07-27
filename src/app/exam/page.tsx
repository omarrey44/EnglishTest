"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, EyeOff, ListChecks, Timer } from "lucide-react";
import { SessionRunner, type SessionSummary } from "@/components/questions/SessionRunner";
import { ResultsScreen } from "@/components/exam/ResultsScreen";
import { Loading } from "@/components/ui/Loading";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useProgress } from "@/components/progress/ProgressProvider";
import { generateExam } from "@/lib/examGenerator";

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
      <div className="mx-auto w-full max-w-2xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Exam Simulator
          </p>
          <h1 className="mt-4 font-display text-4xl leading-none sm:text-5xl">
            30 questions. All topics.
          </h1>
          <p className="mt-4 text-muted">
            This works like the real written exam: you answer everything first and only see
            your score at the end.
          </p>

          <Card className="mt-7 divide-y divide-line">
            <div className="flex items-start gap-3 p-4">
              <ListChecks className="mt-0.5 size-4 text-accent" />
              <p className="text-sm">
                <span className="font-medium">One question per screen</span> — ordinals, dates,
                years, and/but, past verbs, -ed spelling and pronunciation, was/were and WH
                questions.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <EyeOff className="mt-0.5 size-4 text-accent" />
              <p className="text-sm">
                <span className="font-medium">No feedback during the exam</span> — no answers, no
                explanations, no right/wrong marks.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <Timer className="mt-0.5 size-4 text-accent" />
              <p className="text-sm">
                <span className="font-medium">No time limit</span> — but answer as if there were
                one. Your score out of 10 appears at the end.
              </p>
            </div>
          </Card>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => setStarted(true)}>
              Start exam
              <ArrowRight className="size-4" />
            </Button>
            <ButtonLink href="/" size="lg" variant="secondary" className="flex-1">
              Back to dashboard
            </ButtonLink>
          </div>
        </motion.div>
      </div>
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
