"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GUEST_COOKIE } from "@/lib/auth/guest";
import { getServerSupabase } from "@/lib/supabase/server";
import {
  emailForUsername,
  normalizeUsername,
  usernameProblem,
} from "@/lib/auth/username";

export interface AuthFormState {
  error?: string;
  notice?: string;
}

const MIN_PASSWORD = 8;

function readCredentials(formData: FormData) {
  return {
    username: normalizeUsername(String(formData.get("username") ?? "")),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await getServerSupabase();
  if (!supabase) return { error: "Accounts are not set up on this deployment." };

  const { username, password } = readCredentials(formData);
  const problem = usernameProblem(username);
  if (problem) return { error: problem };
  if (!password) return { error: "Enter your password." };

  const { error } = await supabase.auth.signInWithPassword({
    email: emailForUsername(username),
    password,
  });

  if (error) {
    // "Email not confirmed" would be baffling to a student who never gave one.
    if (/not confirmed/i.test(error.message)) {
      return {
        error:
          "This account still needs to be activated. Ask your teacher to turn off email confirmation in Supabase.",
      };
    }
    // Otherwise report one message either way, so the form cannot be used to
    // find out which usernames exist.
    return { error: "Wrong username or password." };
  }

  (await cookies()).delete(GUEST_COOKIE);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await getServerSupabase();
  if (!supabase) return { error: "Accounts are not set up on this deployment." };

  const { username, password } = readCredentials(formData);
  const problem = usernameProblem(username);
  if (problem) return { error: problem };

  if (password.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters for your password.` };
  }
  if (password !== String(formData.get("confirm") ?? "")) {
    return { error: "The two passwords do not match." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: emailForUsername(username),
    password,
    // Kept so the username survives independently of how the address is built.
    options: { data: { username } },
  });

  if (error) {
    if (/already registered|already exists/i.test(error.message)) {
      return { error: "That username is taken. Try another one." };
    }
    if (/rate limit/i.test(error.message)) {
      return {
        error:
          "Sign-ups are rate limited because Supabase is still trying to send confirmation emails. Turn off email confirmation to fix it.",
      };
    }
    return { error: error.message };
  }

  // No session means Supabase wants the address confirmed — impossible here,
  // since the address is synthetic and nobody can read its inbox.
  if (!data.session) {
    return {
      error:
        "The account was created but cannot be used until email confirmation is turned off in Supabase (Authentication → Providers → Email).",
    };
  }

  (await cookies()).delete(GUEST_COOKIE);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function continueAsGuest() {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await getServerSupabase();
  if (supabase) await supabase.auth.signOut();
  (await cookies()).delete(GUEST_COOKIE);
  revalidatePath("/", "layout");
  redirect("/login");
}
