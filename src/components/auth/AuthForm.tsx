"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import type { AuthFormState } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";

const FIELD =
  "min-h-12 w-full rounded-xl border border-line bg-white px-4 text-[1rem] outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

export function AuthForm({
  mode,
  action,
  configured,
}: {
  mode: "sign-in" | "sign-up";
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  configured: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const signingUp = mode === "sign-up";

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-10 pb-16 sm:pt-16">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <Eyebrow>{signingUp ? "Create account" : "Welcome back"}</Eyebrow>
        <h1 className="mt-3 font-display text-[2.5rem] leading-[0.92] tracking-[-0.03em]">
          {signingUp ? "Save your progress." : "Sign in."}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {signingUp
            ? "An account keeps your scores, mistakes and streak on every device you use."
            : "Pick up where you left off, on any device."}
        </p>

        {!configured ? (
          <p className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/8 p-4 text-sm leading-relaxed text-ink-soft">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
            Accounts are not set up on this deployment yet. You can still practice as a guest —
            your progress stays in this browser.
          </p>
        ) : null}

        <form action={formAction} className="mt-7 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="index text-muted">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              disabled={!configured}
              placeholder="you@example.com"
              className={FIELD}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="index text-muted">Password</span>
            <input
              type="password"
              name="password"
              autoComplete={signingUp ? "new-password" : "current-password"}
              required
              minLength={signingUp ? 8 : undefined}
              disabled={!configured}
              placeholder={signingUp ? "At least 8 characters" : "Your password"}
              className={FIELD}
            />
          </label>

          {signingUp ? (
            <label className="flex flex-col gap-2">
              <span className="index text-muted">Repeat password</span>
              <input
                type="password"
                name="confirm"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={!configured}
                placeholder="Type it again"
                className={FIELD}
              />
            </label>
          ) : null}

          {state.error ? (
            <p role="alert" className="rounded-xl border border-danger/25 bg-danger/8 px-4 py-3 text-sm text-danger">
              {state.error}
            </p>
          ) : null}

          {state.notice ? (
            <p role="status" className="rounded-xl border border-success/25 bg-success/8 px-4 py-3 text-sm text-success">
              {state.notice}
            </p>
          ) : null}

          <Button type="submit" size="lg" fullWidth disabled={!configured || pending}>
            {pending ? "One moment…" : signingUp ? "Create account" : "Sign in"}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {signingUp ? "Already have an account? " : "No account yet? "}
          <Link
            href={signingUp ? "/login" : "/signup"}
            className="font-semibold text-accent underline underline-offset-4"
          >
            {signingUp ? "Sign in" : "Create one"}
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Or{" "}
        <Link href="/" className="font-semibold text-accent underline underline-offset-4">
          keep practicing as a guest
        </Link>
        .
      </p>
    </div>
  );
}
