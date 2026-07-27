export type TopicId =
  | "ordinals"
  | "weather"
  | "dates"
  | "years"
  | "andBut"
  | "pastVerbs"
  | "edSpelling"
  | "edPronunciation"
  | "wasWere"
  | "whQuestions";

export type QuestionType =
  | "multiple-choice"
  | "text-input"
  | "fill-blank"
  | "word-order"
  | "error-detection"
  | "transformation"
  | "pronunciation";

export type Difficulty = 1 | 2 | 3;

export interface Question {
  id: string;
  topic: TopicId;
  /** Fine-grained rule this question tests. Used by adaptive repetition. */
  subtopic: string;
  difficulty: Difficulty;
  type: QuestionType;
  /** Short label shown above the question, e.g. "PAST SIMPLE". */
  label: string;
  /** Instruction line, e.g. "Complete the sentence". */
  instruction: string;
  /** The prompt the student reads. */
  question: string;
  correctAnswer: string;
  /** Extra spellings/forms accepted as correct. */
  acceptedAnswers?: string[];
  /** For multiple-choice / pronunciation questions. */
  options?: string[];
  /** For word-order questions: the shuffled tiles. */
  words?: string[];
  /** Always shown after answering (correct or not). */
  explanation: string;
  /** Optional short grammar rule, highlighted in the feedback panel. */
  rule?: string;
}

export interface TopicMeta {
  id: TopicId;
  name: string;
  spanishName: string;
  short: string;
  description: string;
  icon: string;
  accent: string;
}
