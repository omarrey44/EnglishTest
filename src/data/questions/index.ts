import type { Question, TopicId } from "@/types/question";
import { ordinalQuestions } from "./ordinals";
import { weatherQuestions } from "./weather";
import { dateQuestions } from "./dates";
import { yearQuestions } from "./years";
import { andButQuestions } from "./andBut";
import { pastVerbQuestions } from "./pastVerbs";
import { edSpellingQuestions } from "./edSpelling";
import { edPronunciationQuestions } from "./edPronunciation";
import { wasWereQuestions } from "./wasWere";
import { whQuestions } from "./whQuestions";

export const QUESTIONS: Question[] = [
  ...ordinalQuestions,
  ...weatherQuestions,
  ...dateQuestions,
  ...yearQuestions,
  ...andButQuestions,
  ...pastVerbQuestions,
  ...edSpellingQuestions,
  ...edPronunciationQuestions,
  ...wasWereQuestions,
  ...whQuestions,
];

export const QUESTION_MAP: Map<string, Question> = new Map(
  QUESTIONS.map((q) => [q.id, q]),
);

export function getQuestion(id: string): Question | undefined {
  return QUESTION_MAP.get(id);
}

export function questionsByTopic(topic: TopicId): Question[] {
  return QUESTIONS.filter((q) => q.topic === topic);
}

export function questionsBySubtopic(subtopic: string): Question[] {
  return QUESTIONS.filter((q) => q.subtopic === subtopic);
}
