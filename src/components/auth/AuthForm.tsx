"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CloudOff,
  LockKeyhole,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import type { AuthFormState } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";
import { USERNAME_MAX, USERNAME_MIN } from "@/lib/auth/username";

const FIELD =
  "min-h-12 w-full rounded-xl border border-line bg-surface-2 py-3 pr-4 pl-11 text-[1rem] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted/55 hover:border-accent/25 focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgba(19,86,232,.1)] disabled:cursor-not-allowed disabled:opacity-55";

function GuestSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" size="lg" fullWidth disabled={pending}>
      <UserRound className="size-4 text-accent" />
      {pending ? "Opening guest mode…" : "Continue as guest"}
      <ArrowRight className="size-4" />
    </Button>
  );
}

export function AuthForm({
  mode,
  action,
  guestAction,
  configured,
}: {
  mode: "sign-in" | "sign-up";
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  guestAction: () => Promise<void>;
  configured: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const signingUp = mode === "sign-up";

  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-[#071a55]">
      <Image
        src="/images/generated/study-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(4,20,66,.98)_0%,rgba(7,39,119,.93)_42%,rgba(7,32,91,.58)_70%,rgba(4,16,49,.38)_100%)]" />
      <div className="absolute -top-40 -left-36 -z-10 size-[34rem] rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -right-32 -bottom-44 -z-10 size-[34rem] rounded-full bg-orange-300/20 blur-3xl" />

      <div className="mx-auto grid min-h-dvh w-full max-w-[1440px] lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden flex-col justify-between px-10 py-10 text-white lg:flex xl:px-16 xl:py-14">
          <Link href="/login" className="flex w-fit items-center gap-3" aria-label="English Exam Trainer login">
            <span className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-white/12 shadow-[0_12px_32px_rgba(0,0,0,.18)] backdrop-blur">
              <BookOpen className="size-5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-xl font-semibold tracking-[-0.025em]">
              English Exam Trainer
            </span>
          </Link>

          <div className="max-w-[38rem] py-14">
            <p className="index text-blue-200">Your goal · 10/10</p>
            <h2 className="mt-5 font-display text-[4.7rem] leading-[0.92] tracking-[-0.045em] xl:text-[5.4rem]">
              Practice with
              <br />
              <span className="italic text-[#8fc3ff]">a plan that adapts.</span>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100/90">
              Focused lessons, instant feedback and realistic practice built around the topics you need most.
            </p>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-50">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#f6bc55]" /> Personalized practice
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#f6bc55]" /> Progress that stays with you
              </span>
            </div>
          </div>

          <p className="text-sm text-blue-200/80">A calmer way to prepare for your English exam.</p>
        </section>

        <section className="flex min-h-dvh flex-col items-center justify-center px-4 py-5 sm:px-8 sm:py-8 lg:px-10 xl:px-16">
          <Link
            href="/login"
            className="mb-5 flex items-center gap-3 self-start text-white lg:hidden"
            aria-label="English Exam Trainer login"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/12 backdrop-blur">
              <BookOpen className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">English Exam Trainer</span>
          </Link>

          <div className="w-full max-w-[31rem] rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_30px_90px_rgba(3,13,45,.32)] backdrop-blur-xl sm:p-8">
            <Eyebrow className="border-accent/15 bg-blue-50 text-accent shadow-none">
              {signingUp ? "Create your account" : "Welcome back"}
            </Eyebrow>
            <h1 className="mt-4 font-display text-[2.65rem] leading-[0.94] tracking-[-0.04em] sm:text-[3.15rem]">
              {signingUp ? "Start your study plan." : "Ready to keep learning?"}
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted">
              {signingUp
                ? "Create an account to keep your scores, mistakes and streak in sync on every device."
                : "Sign in to continue with your scores, mistakes and personalized practice."}
            </p>

            {!configured ? (
              <p className="mt-5 flex gap-3 rounded-xl border border-warning/30 bg-warning/8 p-4 text-sm leading-relaxed text-ink-soft">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                Accounts are unavailable right now. You can still continue as a guest below.
              </p>
            ) : null}

            <form action={formAction} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="index text-muted">Username</span>
                <span className="relative">
                  <UserRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    minLength={USERNAME_MIN}
                    maxLength={USERNAME_MAX}
                    pattern="[A-Za-z0-9_]+"
                    disabled={!configured}
                    placeholder="maria_lopez"
                    className={FIELD}
                  />
                </span>
                {signingUp ? (
                  <span className="text-xs leading-relaxed text-muted">
                    Use lowercase letters, numbers or underscores. No email needed.
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="index text-muted">Password</span>
                <span className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
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
                </span>
              </label>

              {signingUp ? (
                <label className="flex flex-col gap-2">
                  <span className="index text-muted">Repeat password</span>
                  <span className="relative">
                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
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
                  </span>
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

            <p className="mt-5 text-center text-sm text-muted">
              {signingUp ? "Already have an account? " : "New here? "}
              <Link
                href={signingUp ? "/login" : "/signup"}
                className="font-semibold text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {signingUp ? "Sign in" : "Create an account"}
              </Link>
            </p>

            <div className="my-5 flex items-center gap-3" aria-hidden>
              <span className="h-px flex-1 bg-line" />
              <span className="index text-muted">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <form action={guestAction}>
              <GuestSubmit />
            </form>
            <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs leading-5 text-muted">
              <CloudOff className="size-3.5 shrink-0" />
              Guest progress is saved only in this browser.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
