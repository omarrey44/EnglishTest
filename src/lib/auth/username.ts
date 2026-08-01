/**
 * Students sign in with a username, not an email.
 *
 * Supabase Auth always needs an email (or phone) as the identity, so a
 * username is mapped to a synthetic address behind the scenes. The domain is a
 * non-routable `.local` one on purpose: nothing addressed to it can ever reach
 * a real person, even if email confirmation gets switched back on by mistake.
 *
 * The mapping is deterministic, so username uniqueness comes for free from the
 * uniqueness Supabase already enforces on the email column.
 */
export const USERNAME_DOMAIN = "englishexam.local";

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;

/** Lowercase letters, digits and underscores — safe inside an email local part. */
const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Null when the username is fine, otherwise the reason to show the student. */
export function usernameProblem(username: string): string | null {
  if (!username) return "Enter a username.";
  if (username.length < USERNAME_MIN) {
    return `Your username needs at least ${USERNAME_MIN} characters.`;
  }
  if (username.length > USERNAME_MAX) {
    return `Keep your username under ${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Use only lowercase letters, numbers and underscores — no spaces or accents.";
  }
  return null;
}

export function emailForUsername(username: string): string {
  return `${username}@${USERNAME_DOMAIN}`;
}

/** Turns the stored address back into something worth showing on screen. */
export function usernameFromEmail(email: string | undefined | null): string | null {
  if (!email) return null;
  const [local, domain] = email.split("@");
  return domain === USERNAME_DOMAIN ? local : email;
}
