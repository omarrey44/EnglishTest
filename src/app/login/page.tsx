import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { continueAsGuest, signIn } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Sign in — English Exam Trainer" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  return (
    <AuthForm
      mode="sign-in"
      action={signIn}
      guestAction={continueAsGuest}
      configured={isSupabaseConfigured()}
    />
  );
}
