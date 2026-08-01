import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Create account — English Exam Trainer" };

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/");
  return <AuthForm mode="sign-up" action={signUp} configured={isSupabaseConfigured()} />;
}
