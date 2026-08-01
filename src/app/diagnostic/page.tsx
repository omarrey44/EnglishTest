"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Sparkles, Target } from "lucide-react";
import type { TopicId } from "@/types/question";
import { SessionRunner, type SessionSummary } from "@/components/questions/SessionRunner";
import { ResultsScreen } from "@/components/exam/ResultsScreen";
import { TopicPicker } from "@/components/questions/TopicPicker";
import { Loading } from "@/components/ui/Loading";
import { Eyebrow } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useProgress } from "@/components/progress/ProgressProvider";
import {
  MAX_DIAGNOSTIC_TOPICS,
  defaultDiagnosticTopics,
  diagnosticLengthFor,
  generateDiagnostic,
} from "@/lib/examGenerator";
import { AppHeader } from "@/components/dashboard/AppHeader";

export default function DiagnosticPage() {
  const { ready, finishDiagnostic } = useProgress();
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<TopicId[]>(defaultDiagnosticTopics);

  const length = useMemo(() => diagnosticLengthFor(selected), [selected]);

  // Questions are randomised on the client only, so the server render matches.
  const questions = useMemo(
    () => (ready && started ? generateDiagnostic(selected) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, started],
  );

  if (summary) {
    return <ResultsScreen summary={summary} title="Diagnostic complete — here is your level" />;
  }

  if (!ready) return <Loading label="Let's find your level." />;

  if (!started) {
    return (
      <>
        <AppHeader />
        <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10">
            <div className="rise">
              <div className="flex items-center gap-4">
                <Eyebrow>Free diagnostic</Eyebrow>
                <span aria-hidden className="leader" />
                <span className="index tabular text-muted">{length} Q</span>
              </div>

              <h1 className="mt-5 font-display text-[3rem] leading-[0.88] tracking-[-0.03em] sm:text-[4rem]">
                Let&apos;s find
                <br />
                <span className="marker">your level.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
                {length} questions, from easy to hard. Your answers decide which topics your
                practice plan starts with.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-4 text-accent" /> About 6 minutes
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" /> Feedback after every answer
                </span>
                <span className="inline-flex items-center gap-2">
                  <Target className="size-4 text-accent" /> No account needed
                </span>
              </div>

              <div className="mt-10">
                <TopicPicker
                  selected={selected}
                  onChange={setSelected}
                  max={MAX_DIAGNOSTIC_TOPICS}
                  title="Topics to test"
                  hint={
                    selected.length === 0
                      ? "Pick at least one topic to start."
                      : `Pick up to ${MAX_DIAGNOSTIC_TOPICS} topics — the diagnostic stays short on purpose. You can practice the rest afterwards.`
                  }
                />
              </div>

              <div className="mt-9 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={selected.length === 0}
                  onClick={() => {
                    setStarted(true);
                    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
                  }}
                >
                  Start diagnostic · {length} questions
                  <ArrowRight className="size-4" />
                </Button>
                <ButtonLink href="/" size="lg" variant="secondary" className="flex-1">
                  <ArrowLeft className="size-4" />
                  Back to dashboard
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!questions) return <Loading label="Let's find your level." />;

  return (
    <SessionRunner
      questions={questions}
      mode="diagnostic"
      title="Diagnostic"
      onFinish={(result) => {
        finishDiagnostic();
        setSummary(result);
      }}
    />
  );
}
