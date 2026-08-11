/**
 * Minimal typings for the Web Speech API. TypeScript's DOM library still does
 * not ship them, and only the handful of members used here are declared.
 */
export interface SpeechAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<ArrayLike<SpeechAlternative> & { isFinal: boolean }>;
}

export interface SpeechErrorEvent {
  error: string;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/** Null on Firefox and anywhere else without the API. */
export function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * The API exists on an insecure origin but fails once you press record, with
 * an error that says nothing useful. Opening the dev server on a LAN address
 * such as http://192.168.x.x is the usual way to land here — localhost counts
 * as secure, a bare IP does not.
 */
export function isInsecureOrigin(): boolean {
  if (typeof window === "undefined") return false;
  return !window.isSecureContext;
}

/** Human-readable reason, so the UI never shows a bare error code. */
export function describeSpeechError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "The microphone is blocked. Allow it in your browser and try again.";
    case "no-speech":
      return "I didn't hear anything. Try again a little louder.";
    case "audio-capture":
      return "No microphone found. Check that one is connected.";
    case "network":
      // Chrome sends the audio to Google to transcribe it, so "network" means
      // that service was unreachable — not that the page failed to load.
      return "Could not reach the speech service. Check your connection, and note that Brave and some Chromium builds ship without it — plain Chrome, Edge or Safari work.";
    case "aborted":
      return "Recording stopped.";
    default:
      return "Recording failed. Try again.";
  }
}
