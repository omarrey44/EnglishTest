import type { Question, TopicId } from "@/types/question";
import { questionsByTopic } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";
import { shuffle } from "./adaptiveLearning";

/** How many diagnostic questions each topic gets (15 total, every topic covered). */
const DIAGNOSTIC_WEIGHTS: Record<TopicId, number> = {
  ordinals: 1,
  weather: 1,
  dates: 2,
  years: 1,
  andBut: 1,
  pastVerbs: 2,
  edSpelling: 1,
  edPronunciation: 2,
  wasWere: 3,
  whQuestions: 1,
};

/** Exam simulator distribution (30 questions, every topic covered). */
const EXAM_WEIGHTS: Record<TopicId, number> = {
  ordinals: 2,
  weather: 2,
  dates: 4,
  years: 2,
  andBut: 2,
  pastVerbs: 4,
  edSpelling: 2,
  edPronunciation: 4,
  wasWere: 5,
  whQuestions: 3,
};

function draw(topic: TopicId, count: number, used: Set<string>): Question[] {
  const pool = shuffle(questionsByTopic(topic)).filter((q) => !used.has(q.id));
  // Mix difficulties: easy first, then harder ones.
  const byDifficulty = [
    ...pool.filter((q) => q.difficulty === 1),
    ...pool.filter((q) => q.difficulty === 2),
    ...pool.filter((q) => q.difficulty === 3),
  ];
  const picked: Question[] = [];
  const step = Math.max(1, Math.floor(byDifficulty.length / Math.max(count, 1)));
  for (let i = 0; picked.length < count && i < byDifficulty.length; i += step) {
    const q = byDifficulty[i];
    if (!used.has(q.id)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  for (const q of byDifficulty) {
    if (picked.length >= count) break;
    if (!used.has(q.id)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  return picked;
}

function build(weights: Record<TopicId, number>): Question[] {
  const used = new Set<string>();
  const questions = TOPIC_IDS.flatMap((topic) => draw(topic, weights[topic], used));
  return questions;
}

/** 15 questions covering every topic, ordered from easy to hard. */
export function generateDiagnostic(): Question[] {
  const questions = build(DIAGNOSTIC_WEIGHTS);
  return shuffle(questions).sort((a, b) => a.difficulty - b.difficulty);
}

/** 30 mixed questions, no feedback during the exam. */
export function generateExam(): Question[] {
  return shuffle(build(EXAM_WEIGHTS));
}
