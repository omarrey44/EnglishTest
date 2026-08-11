/**
 * Reading a passage out loud with the browser's own voice.
 *
 * Chrome drops an utterance that runs much past ~15 seconds, which a hundred
 * word passage comfortably exceeds, so the text is queued sentence by
 * sentence. speechSynthesis plays a queue back to back, so it still sounds
 * like one reading.
 */

/** Splits after . ! ? while keeping the punctuation with its sentence. */
export function toSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/**
 * Speaks `text` in English. `onDone` fires after the last sentence, or
 * immediately if speech is unavailable.
 */
export function speak(text: string, onDone: () => void): void {
  if (!canSpeak()) {
    onDone();
    return;
  }

  // Anything still queued from a previous press would play first.
  window.speechSynthesis.cancel();

  const sentences = toSentences(text);
  if (sentences.length === 0) {
    onDone();
    return;
  }

  sentences.forEach((sentence, i) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    // The browser picks a matching voice from the language alone; naming one
    // would mean handling the async voice list for very little gain.
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    if (i === sentences.length - 1) {
      utterance.onend = onDone;
      utterance.onerror = onDone;
    }
    window.speechSynthesis.speak(utterance);
  });
}
