"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";

export interface AuthFormState {
  error?: string;
  notice?: string;
}

const MIN_PASSWORD = 8;

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

function validate(email: string, password: string): string | null {
  if (!email) return "Enter your email.";
  if (!email.includes("@")) return "That does not look like an email address.";
  if (!password) return "Enter your password.";
  return null;
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await getServerSupabase();
  if (!supabase) return { error: "Accounts are not set up on this deployment." };

  const { email, password } = readCredentials(formData);
  const invalid = validate(email, password);
  if (invalid) return { error: invalid };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Supabase deliberately does not say which half was wrong; keep it that way
    // so the form cannot be used to discover which emails have accounts.
    return { error: "Wrong email or password." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const supabase = await getServerSupabase();
  if (!supabase) return { error: "Accounts are not set up on this deployment." };

  const { email, password } = readCredentials(formData);
  const invalid = validate(email, password);
  if (invalid) return { error: invalid };
  if (password.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters for your password.` };
  }
  if (password !== String(formData.get("confirm") ?? "")) {
    return { error: "The two passwords do not match." };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  // With "Confirm email" on in Supabase, signUp returns no session — the user
  // has to click the link first.
  if (!data.session) {
    return { notice: `Almost there. Check ${email} for a confirmation link, then sign in.` };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await getServerSupabase();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
