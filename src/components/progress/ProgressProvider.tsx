"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ExamResult, ProgressState } from "@/types/progress";
import type { Question } from "@/types/question";
import { createInitialProgress, localProgressStorage } from "@/lib/storage";
import {
  applyAnswer,
  applyPerfectLesson,
  markDiagnosticDone,
  recordExamResult,
  type AnswerOutcome,
} from "@/lib/progressEngine";

interface ProgressContextValue {
  state: ProgressState;
  /** False until localStorage has been read (avoids hydration mismatches). */
  ready: boolean;
  answer: (question: Question, userAnswer: string, correct: boolean) => AnswerOutcome;
  perfectLesson: () => void;
  finishDiagnostic: () => void;
  saveExam: (result: Omit<ExamResult, "id" | "at">) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => createInitialProgress());
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);

  const commit = useCallback((next: ProgressState) => {
    stateRef.current = next;
    setState(next);
    void localProgressStorage.save(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    localProgressStorage.load().then((saved) => {
      if (cancelled) return;
      if (saved) {
        stateRef.current = saved;
        setState(saved);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const answer = useCallback<ProgressContextValue["answer"]>(
    (question, userAnswer, correct) => {
      const outcome = applyAnswer(stateRef.current, question, userAnswer, correct);
      commit(outcome.state);
      return outcome;
    },
    [commit],
  );

  const perfectLesson = useCallback(() => {
    commit(applyPerfectLesson(stateRef.current));
  }, [commit]);

  const finishDiagnostic = useCallback(() => {
    commit(markDiagnosticDone(stateRef.current));
  }, [commit]);

  const saveExam = useCallback<ProgressContextValue["saveExam"]>(
    (result) => {
      commit(recordExamResult(stateRef.current, result));
    },
    [commit],
  );

  const reset = useCallback(() => {
    const fresh = createInitialProgress();
    commit(fresh);
  }, [commit]);

  const value = useMemo(
    () => ({ state, ready, answer, perfectLesson, finishDiagnostic, saveExam, reset }),
    [state, ready, answer, perfectLesson, finishDiagnostic, saveExam, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
