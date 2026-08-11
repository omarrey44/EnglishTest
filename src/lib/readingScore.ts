/**
 * Trimmed to what a spoken word needs: case and punctuation folded away,
 * apostrophes kept so "don't" and "dont" both land on the same key. Close to
 * normalizeAnswer in scoring.ts, but this file stays dependency-free so its
 * checks can run straight from node.
 */
function normalizeWord(word: string): string {
  return word
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[^\p{L}\p{N}']/gu, "")
    .replace(/'/g, "")
    .toLowerCase();
}

export interface ScoredWord {
  /** The word as written in the passage, punctuation and all. */
  word: string;
  /** True when the recogniser heard this word. */
  ok: boolean;
}

export interface ReadingScore {
  words: ScoredWord[];
  matched: number;
  total: number;
  /** Percentage of the passage that came through, 0–100. */
  accuracy: number;
}

/**
 * Longest common subsequence, marking which of `a` survives in `b`.
 *
 * Comparing word by word on index would be shorter, but one skipped word
 * would then mark the whole rest of the sentence wrong. Readers skip, repeat
 * and stumble constantly, so the alignment has to tolerate it.
 */
function alignedMatches(a: string[], b: string[]): boolean[] {
  const n = a.length;
  const m = b.length;

  // dp[i][j] = length of the LCS of a[i..] and b[j..]
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ok = new Array<boolean>(n).fill(false);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ok[i] = true;
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return ok;
}

function tokenize(text: string): { word: string; key: string }[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ word, key: normalizeWord(word) }))
    // Stray punctuation normalises to nothing and would never match.
    .filter((t) => t.key.length > 0);
}

/** Marks each word of `target` as heard or missed in `transcript`. */
export function scoreReading(target: string, transcript: string): ReadingScore {
  const targetTokens = tokenize(target);
  const heard = tokenize(transcript).map((t) => t.key);

  const ok = alignedMatches(
    targetTokens.map((t) => t.key),
    heard,
  );

  const words = targetTokens.map((t, i) => ({ word: t.word, ok: ok[i] }));
  const matched = ok.filter(Boolean).length;
  const total = words.length;

  return {
    words,
    matched,
    total,
    accuracy: total === 0 ? 0 : Math.round((matched / total) * 100),
  };
}
