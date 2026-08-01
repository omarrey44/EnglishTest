"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Question, TopicId } from "@/types/question";
import { SessionRunner, type SessionSummary } from "@/components/questions/SessionRunner";
import { ResultsScreen } from "@/components/exam/ResultsScreen";
import { Loading } from "@/components/ui/Loading";
import { Eyebrow } from "@/components/ui/Card";
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
      <div className="mx-auto w-full max-w-2xl px-5 pt-20 sm:px-8">
        <Eyebrow>{TITLES[mode]}</Eyebrow>
        <h1 className="mt-4 font-display text-[2.5rem] leading-[0.92] tracking-[-0.03em] sm:text-[3rem]">
          Nothing to practice here yet
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-muted">
          {mode === "mistakes"
            ? "You have no open mistakes. Take a Smart Practice session to find new ones."
            : "Answer a few questions first so the trainer can build a session for you."}
        </p>
        <ButtonLink href="/" size="lg" className="mt-8">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </ButtonLink>
      </div>
    );
  }

  if (!started && planEntries) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 pt-12 pb-16 sm:px-8 sm:pt-20">
        <div className="rise">
          <div className="flex items-center gap-4">
            <Eyebrow tone="var(--accent)">Get me to 10/10</Eyebrow>
            <span aria-hidden className="leader" />
            <span className="index tabular text-muted">{questions.length} Q</span>
          </div>

          <h1 className="mt-5 font-display text-[3rem] leading-[0.88] tracking-[-0.03em] sm:text-[3.75rem]">
            Your <span className="marker">personalized</span> session
          </h1>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
            Built from your results right now. The weakest topics get the most questions.
          </p>

          {/* The prescription, written out line by line. */}
          <ul className="mt-10">
            {planEntries.map((entry, i) => (
              <li
                key={entry.topic}
                className="rise flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-line py-3.5 first:border-t"
                style={{ "--d": `${100 + i * 50}ms` } as React.CSSProperties}
              >
                <span
                  className="index tabular shrink-0"
                  style={{ color: TOPIC_MAP[entry.topic].accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{TOPIC_MAP[entry.topic].name}</span>
                <Badge className={MASTERY_TONE[entry.level]}>{MASTERY_LABEL[entry.level]}</Badge>
                <span aria-hidden className="leader" />
                <span className="index tabular shrink-0 text-muted">{entry.accuracy}%</span>
                <span className="tabular w-14 shrink-0 text-right font-display text-xl leading-none">
                  ×{entry.count}
                </span>
              </li>
            ))}
            <li className="flex items-baseline gap-3 border-b-2 border-ink py-4">
              <span className="font-semibold">Total</span>
              <span aria-hidden className="leader" />
              <span className="tabular font-display text-2xl leading-none tracking-[-0.02em]">
                {questions.length} questions
              </span>
            </li>
          </ul>

          <div className="mt-9 flex flex-col gap-2.5 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => setStarted(true)}>
              Start session
              <ArrowRight className="size-4" />
            </Button>
            <ButtonLink href="/" size="lg" variant="secondary" className="flex-1">
              <ArrowLeft className="size-4" />
              Back to dashboard
            </ButtonLink>
          </div>
        </div>
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
