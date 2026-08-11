"use client";

import { AppHeader } from "@/components/dashboard/AppHeader";
import { ReadAloud } from "@/components/reading/ReadAloud";
import { BackLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";

export default function ReadingPage() {
  return (
    <>
      <AppHeader />
      <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
        <BackLink href="/">Dashboard</BackLink>

        <header className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
          <Eyebrow>Read out loud and I will follow along</Eyebrow>
          <h1 className="mt-3 font-display text-[2.75rem] leading-[0.9] tracking-[-0.03em] sm:text-[3.5rem]">
            Reading aloud
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Press the microphone and read the passage. Every word that does not come through gets
            marked, so you can see exactly where you rushed or went quiet.
          </p>
        </header>

        <ReadAloud />
      </div>
    </>
  );
}
