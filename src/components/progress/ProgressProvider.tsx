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
import { createInitialProgress, localProgressStorage, type ProgressStorage } from "@/lib/storage";
import { createSupabaseProgressStorage } from "@/lib/supabase/progressStorage";
import { useSession } from "@/components/auth/SessionProvider";
import {
  applyAnswer,
  applyPerfectLesson,
  markDiagnosticDone,
  recordExamResult,
  type AnswerOutcome,
} from "@/lib/progressEngine";

interface ProgressContextValue {
  state: ProgressState;
  /** False until the store has been read (avoids hydration mismatches). */
  ready: boolean;
  /** True when progress is saved to the signed-in account, not the browser. */
  synced: boolean;
  answer: (question: Question, userAnswer: string, correct: boolean) => AnswerOutcome;
  perfectLesson: () => void;
  finishDiagnostic: () => void;
  saveExam: (result: Omit<ExamResult, "id" | "at">) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, supabase, ready: sessionReady } = useSession();
  const [state, setState] = useState<ProgressState>(() => createInitialProgress());
  const [loadedFrom, setLoadedFrom] = useState<ProgressStorage | null>(null);
  const stateRef = useRef(state);

  // Signed in: the account's row. Guest: this browser's localStorage.
  const storage = useMemo<ProgressStorage>(() => {
    if (supabase && user) return createSupabaseProgressStorage(supabase, user.id);
    return localProgressStorage;
  }, [supabase, user]);

  const commit = useCallback(
    (next: ProgressState) => {
      stateRef.current = next;
      setState(next);
      void storage.save(next);
    },
    [storage],
  );

  // Reloads whenever the store changes, which is what signing in and out do.
  // `ready` is derived from which store the loaded state came from, so it
  // flips to false for free while a new one is being read.
  useEffect(() => {
    let cancelled = false;

    storage.load().then((saved) => {
      if (cancelled) return;
      // A fresh account starts empty rather than inheriting the guest's
      // progress from this browser.
      const next = saved ?? createInitialProgress();
      stateRef.current = next;
      setState(next);
      setLoadedFrom(storage);
    });

    return () => {
      cancelled = true;
    };
  }, [storage]);

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
    commit(createInitialProgress());
  }, [commit]);

  const synced = Boolean(supabase && user);
  const ready = sessionReady && loadedFrom === storage;

  const value = useMemo(
    () => ({ state, ready, synced, answer, perfectLesson, finishDiagnostic, saveExam, reset }),
    [state, ready, synced, answer, perfectLesson, finishDiagnostic, saveExam, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
