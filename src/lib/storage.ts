import type { ProgressState } from "@/types/progress";
import type { TopicId } from "@/types/question";
import { TOPIC_IDS } from "@/data/topics";

export const STORAGE_KEY = "english-exam-trainer:progress";
export const STORAGE_VERSION = 1;

export function createInitialProgress(): ProgressState {
  const now = Date.now();
  const topicStats = TOPIC_IDS.reduce(
    (acc, id) => {
      acc[id] = { attempted: 0, correct: 0 };
      return acc;
    },
    {} as Record<TopicId, { attempted: number; correct: number }>,
  );

  return {
    version: STORAGE_VERSION,
    createdAt: now,
    updatedAt: now,
    diagnosticDone: false,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    topicStats,
    masteredTopics: [],
    mistakes: [],
    weakConcepts: [],
    recentQuestionIds: [],
    examResults: [],
  };
}

/** Fills in anything missing so old saves keep working after an update. */
function migrate(raw: Partial<ProgressState> | null): ProgressState {
  const base = createInitialProgress();
  if (!raw || typeof raw !== "object") return base;

  const topicStats = { ...base.topicStats };
  if (raw.topicStats) {
    for (const id of TOPIC_IDS) {
      const stat = raw.topicStats[id];
      if (stat && typeof stat.attempted === "number" && typeof stat.correct === "number") {
        topicStats[id] = { attempted: stat.attempted, correct: stat.correct };
      }
    }
  }

  return {
    ...base,
    ...raw,
    version: STORAGE_VERSION,
    topicStats,
    masteredTopics: raw.masteredTopics ?? [],
    mistakes: raw.mistakes ?? [],
    weakConcepts: raw.weakConcepts ?? [],
    recentQuestionIds: raw.recentQuestionIds ?? [],
    examResults: raw.examResults ?? [],
  };
}

/**
 * Storage abstraction. The app only talks to this interface, so swapping
 * localStorage for Supabase later means writing one new adapter.
 */
export interface ProgressStorage {
  load(): Promise<ProgressState | null>;
  save(state: ProgressState): Promise<void>;
  clear(): Promise<void>;
}

export const localProgressStorage: ProgressStorage = {
  async load() {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return migrate(JSON.parse(raw) as Partial<ProgressState>);
    } catch {
      return null;
    }
  },
  async save(state) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, updatedAt: Date.now() }),
      );
    } catch {
      /* quota or private mode — progress stays in memory for this session */
    }
  },
  async clear() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};
