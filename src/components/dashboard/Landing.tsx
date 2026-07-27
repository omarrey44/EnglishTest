"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock3, Sparkles, Target } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { TOPICS } from "@/data/topics";
import { AppHeader } from "./AppHeader";

export function Landing() {
  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12">
        <section className="relative mt-5 min-h-[650px] overflow-hidden rounded-[32px] border border-white shadow-[0_24px_80px_rgba(46,43,53,.14)]">
          <Image
            src="/images/generated/study-hero.png"
            alt="A calm study space with a laptop, books and a notebook"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(249,246,239,.99)_0%,rgba(249,246,239,.92)_42%,rgba(249,246,239,.22)_72%,rgba(249,246,239,.04)_100%)]" />
          <div className="relative z-10 flex min-h-[650px] max-w-2xl flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="rise flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <Sparkles className="size-4 text-warning" />
              Your English exam, made simpler
            </p>
            <h1 className="rise mt-5 font-display text-[2.75rem] leading-[.94] tracking-[-.04em] min-[430px]:text-[3.2rem] sm:text-[5.2rem]">
              Practice with
              <br />
              <span className="italic text-[#0b389a]">a plan that</span>
              <br className="sm:hidden" />
              <span className="italic text-[#0b389a]"> adapts.</span>
            </h1>
            <p className="rise mt-7 max-w-xl text-lg leading-8 text-ink-soft">
              Start with a quick diagnostic. We&apos;ll identify your weak spots and build focused sessions to get you closer to 10/10.
            </p>
            <div className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/diagnostic" size="lg" className="px-8">
                Start free diagnostic
                <ArrowRight className="size-4" />
              </ButtonLink>
              <span className="inline-flex items-center gap-2 px-3 text-sm text-muted">
                <Clock3 className="size-4" /> About 6 minutes
              </span>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> No account needed</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Instant feedback</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Saved locally</span>
            </div>
          </div>
        </section>

        <section className="relative z-20 -mt-12 mx-3 grid gap-4 rounded-[28px] border border-white bg-white/92 p-5 shadow-[0_22px_70px_rgba(24,39,78,.14)] backdrop-blur-xl lg:p-7">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-br from-[#075ee8] to-[#101f88] p-5 text-white">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/12"><Target className="size-6" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">One clear goal</p>
              <p className="mt-1 font-display text-3xl">Your 10/10 plan</p>
            </div>
            <span className="ml-auto rounded-full bg-white/12 px-3.5 py-1.5 text-sm font-semibold">
              {TOPICS.length} topics covered
            </span>
          </div>

          {/* Every topic on the exam, not a sample. */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {TOPICS.map((topic, index) => (
              <div key={topic.id} className="rounded-2xl border border-line bg-surface-2 p-3">
                <span className="index" style={{ color: topic.accent }}>{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-sm font-semibold leading-tight">{topic.name}</p>
                <p className="mt-1 text-xs text-muted">{topic.spanishName}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
