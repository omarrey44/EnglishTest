"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import type { Question, TopicId } from "@/types/question";
import { SessionRunner, type SessionSummary } from "@/components/questions/SessionRunner";
import { ResultsScreen } from "@/components/exam/ResultsScreen";
import { Loading } from "@/components/ui/Loading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useProgress } from "@/components/progress/ProgressProvider";
import {
  buildMistakeSession,
  buildPersonalizedPlan,
  buildSmartPractice,
  buildTopicSession,
  type PlanEntry,
} from "@/lib/adaptiveLearning";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { TOPIC_MAP, TOPIC_IDS } from "@/data/topics";

type Mode = "smart" | "plan" | "topic" | "mistakes";

const TITLES: Record<Mode, string> = {
  smart: "Smart Practice",
  plan: "Your personalized session",
  topic: "Topic practice",
  mistakes: "Mistake practice",
};

function PracticeInner() {
  const params = useSearchParams();
  const { state, ready } = useProgress();

  const modeParam = (params.get("mode") ?? "smart") as Mode;
  const mode: Mode = ["smart", "plan", "topic", "mistakes"].includes(modeParam)
    ? modeParam
    : "smart";
  const topicParam = params.get("topic") as TopicId | null;
  const topic = topicParam && TOPIC_IDS.includes(topicParam) ? topicParam : null;

  const [started, setStarted] = useState(mode !== "plan");
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [round, setRound] = useState(0);

  // Built once per round from the progress at that moment: the question list
  // must not change while the student is answering it.
  const session = useMemo<{ questions: Question[]; planEntries: PlanEntry[] | null } | null>(() => {
    if (!ready) return null;
    if (mode === "plan") {
      const plan = buildPersonalizedPlan(state, 15);
      return { questions: plan.questions, planEntries: plan.entries };
    }
    if (mode === "topic" && topic) {
      return { questions: buildTopicSession(topic, 10, state), planEntries: null };
    }
    if (mode === "mistakes") {
      return { questions: buildMistakeSession(state, 10), planEntries: null };
    }
    return { questions: buildSmartPractice(state, 15), planEntries: null };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, mode, topic, round]);

  const questions = session?.questions ?? null;
  const planEntries = session?.planEntries ?? null;

  if (summary) {
    return (
      <ResultsScreen
        summary={summary}
        title={`${TITLES[mode]} · results`}
        retryLabel="New session"
        onRetry={() => {
          setSummary(null);
          setStarted(mode !== "plan");
          setRound((r) => r + 1);
        }}
      />
    );
  }

  if (!questions) return <Loading />;

  if (questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-16 sm:px-6">
        <h1 className="font-display text-3xl">Nothing to practice here yet</h1>
        <p className="mt-3 text-muted">
          {mode === "mistakes"
            ? "You have no open mistakes. Take a Smart Practice session to find new ones."
            : "Answer a few questions first so the trainer can build a session for you."}
        </p>
        <ButtonLink href="/" size="lg" className="mt-7">
          Back to dashboard
        </ButtonLink>
      </div>
    );
  }

  if (!started && planEntries) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            <Target className="size-3.5" />
            Get me to 10/10
          </p>
          <h1 className="mt-4 font-display text-4xl leading-none sm:text-5xl">
            Your personalized session
          </h1>
          <p className="mt-4 text-muted">
            Built from your results right now. The weakest topics get the most questions.
          </p>

          <Card className="mt-7 divide-y divide-line">
            {planEntries.map((entry) => (
              <div key={entry.topic} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{TOPIC_MAP[entry.topic].name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {entry.accuracy}% accuracy so far
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={MASTERY_TONE[entry.level]}>{MASTERY_LABEL[entry.level]}</Badge>
                  <span className="tabular w-20 text-right text-sm font-semibold">
                    {entry.count} {entry.count === 1 ? "question" : "questions"}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-4">
              <span className="font-medium">Total</span>
              <span className="tabular font-semibold">{questions.length} questions</span>
            </div>
          </Card>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => setStarted(true)}>
              Start session
              <ArrowRight className="size-4" />
            </Button>
            <ButtonLink href="/" size="lg" variant="secondary" className="flex-1">
              Not now
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
      mode="practice"
      title={TITLES[mode]}
      onFinish={setSummary}
    />
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PracticeInner />
    </Suspense>
  );
}
