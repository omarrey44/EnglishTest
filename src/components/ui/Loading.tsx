export function Loading({ label = "Preparing your questions…" }: { label?: string }) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center px-5 sm:px-8"
      aria-busy
    >
      <div className="index text-muted">{label}</div>
      <div className="ink-load mt-6 h-3 w-24 rounded-[2px]" />
      <div className="ink-load mt-8 h-9 w-full rounded-[3px]" />
      <div className="ink-load mt-3 h-9 w-4/5 rounded-[3px]" />
      <div className="mt-10 space-y-2.5">
        <div className="ink-load h-14 rounded-lg" />
        <div className="ink-load h-14 rounded-lg" />
        <div className="ink-load h-14 rounded-lg" />
      </div>
    </div>
  );
}
