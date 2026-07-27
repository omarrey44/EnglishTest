"use client";

import { useMemo, useState } from "react";
import { SessionRunner, type SessionSummary } from "@/components/questions/SessionRunner";
import { ResultsScreen } from "@/components/exam/ResultsScreen";
import { Loading } from "@/components/ui/Loading";
import { useProgress } from "@/components/progress/ProgressProvider";
import { generateDiagnostic } from "@/lib/examGenerator";

export default function DiagnosticPage() {
  const { ready, finishDiagnostic } = useProgress();
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  // Questions are randomised on the client only, so the server render matches.
  const questions = useMemo(() => (ready ? generateDiagnostic() : null), [ready]);

  if (summary) {
    return <ResultsScreen summary={summary} title="Diagnostic complete — here is your level" />;
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
