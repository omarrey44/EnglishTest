import {
  AudioLines,
  CalendarDays,
  Clock,
  CloudSun,
  GitMerge,
  Hash,
  HelpCircle,
  ListOrdered,
  MinusCircle,
  PenLine,
  Rewind,
  Shirt,
  Shuffle,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";
import type { TopicId } from "@/types/question";

/**
 * Keyed by topic id, not by position, so reordering TOPICS cannot shuffle the
 * icons. Being a Record<TopicId, …> also means a new topic will not compile
 * until it has an icon here.
 */
const TOPIC_ICONS: Record<TopicId, LucideIcon> = {
  ordinals: Hash,
  weather: CloudSun,
  dates: CalendarDays,
  years: Clock,
  andBut: GitMerge,
  pastVerbs: Rewind,
  irregularVerbs: Shuffle,
  pastNegative: MinusCircle,
  edSpelling: PenLine,
  edPronunciation: AudioLines,
  wasWere: ToggleLeft,
  whQuestions: HelpCircle,
  sequenceWords: ListOrdered,
  clothes: Shirt,
};

export function TopicIcon({ topic, className }: { topic: TopicId; className?: string }) {
  const Icon = TOPIC_ICONS[topic];
  return <Icon className={className} />;
}
