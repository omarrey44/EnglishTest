import { notFound } from "next/navigation";
import type { TopicId } from "@/types/question";
import { TOPIC_IDS, TOPIC_MAP } from "@/data/topics";
import { TopicLesson } from "@/components/learn/TopicLesson";

export function generateStaticParams() {
  return TOPIC_IDS.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const meta = TOPIC_MAP[topic as TopicId];
  return {
    title: meta ? `${meta.name} — English Exam Trainer` : "Lesson — English Exam Trainer",
  };
}

export default async function LessonPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!TOPIC_IDS.includes(topic as TopicId)) notFound();
  return <TopicLesson topic={topic as TopicId} />;
}
