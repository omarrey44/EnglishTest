export function Loading({ label = "Preparing your questions…" }: { label?: string }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center px-4 sm:px-6">
      <div className="h-3 w-32 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-ink/8" />
      <div className="mt-3 h-10 w-4/5 animate-pulse rounded-lg bg-ink/8" />
      <div className="mt-8 space-y-2.5">
        <div className="h-14 animate-pulse rounded-xl bg-ink/5" />
        <div className="h-14 animate-pulse rounded-xl bg-ink/5" />
        <div className="h-14 animate-pulse rounded-xl bg-ink/5" />
      </div>
      <p className="mt-8 text-sm text-muted">{label}</p>
    </div>
  );
}
