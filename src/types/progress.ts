import type { TopicId } from "./question";

export type MasteryLevel = "weak" | "practice" | "good" | "mastered" | "new";

export interface TopicStat {
  attempted: number;
  correct: number;
}

export interface MistakeRecord {
  questionId: string;
  topic: TopicId;
  subtopic: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  at: number;
  /** Set to true once the student answers a follow-up on the same rule correctly. */
  resolved: boolean;
}

/** A rule the student failed; scheduled to come back after N more questions. */
export interface WeakConcept {
  topic: TopicId;
  subtopic: string;
  failures: number;
  /** Value of `questionsAnswered` after which this concept should be re-tested. */
  dueAt: number;
}

export interface ExamResult {
  id: string;
  at: number;
  total: number;
  correct: number;
  accuracy: number;
  score: number;
  topicBreakdown: Partial<Record<TopicId, TopicStat>>;
}

export interface ProgressState {
  version: number;
  createdAt: number;
  updatedAt: number;
  diagnosticDone: boolean;
  xp: number;
  streak: number;
  bestStreak: number;
  questionsAnswered: number;
  correctAnswers: number;
  topicStats: Record<TopicId, TopicStat>;
  masteredTopics: TopicId[];
  mistakes: MistakeRecord[];
  weakConcepts: WeakConcept[];
  /** Ids of the last questions seen, so we do not repeat them right away. */
  recentQuestionIds: string[];
  examResults: ExamResult[];
}

export interface TopicProgress {
  topic: TopicId;
  attempted: number;
  correct: number;
  accuracy: number;
  level: MasteryLevel;
}
