import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DAYS } from "@/lib/days";
import { DayCard } from "@/components/DayCard";
import { Botanicals } from "@/components/Botanicals";
import { PwaInstall } from "@/components/PwaInstall";
import { getBerlinDateKey, getDayState, readProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "16 Days of Somto ♡" },
      { name: "description", content: "A little something for you, one day at a time. October 23 — November 7, 2026." },
      { property: "og:title", content: "16 Days of Somto ♡" },
      { property: "og:description", content: "A little something for you, one day at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});


function Index() {
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [progress, setProgress] = useState(() => ({ unlockedDays: [] as number[], completedDays: [] as number[], lettersByDay: {} as Record<string, string> }));
  const [previewMode] = useState(true);

  useEffect(() => {
    const refreshProgress = () => {
      setCalendarDate(getBerlinDateKey());
      setProgress(readProgress());
    };
    refreshProgress();
    const interval = window.setInterval(refreshProgress, 60_000);
    return () => window.clearInterval(interval);
  }, []);


  useEffect(() => {
    // Warm only the first few cards. The remaining photos stay lazy-loaded so
    // the home screen doesn't compete with itself for bandwidth or memory.
    const sources = Array.from(new Set(DAYS.slice(0, 3).map((day) => day.image).filter(Boolean))) as string[];
    let cancelled = false;
    let nextIndex = 0;

    const warmImage = (src: string, priority: boolean) => new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      if ("fetchPriority" in image) image.fetchPriority = priority ? "high" : "low";
      const finish = () => resolve();
      image.onload = finish;
      image.onerror = finish;
      image.src = src;
      if (image.complete) finish();
    });

    const workers = Array.from({ length: Math.min(2, sources.length) }, async () => {
      while (!cancelled && nextIndex < sources.length) {
        const sourceIndex = nextIndex++;
        const src = sources[sourceIndex];
        if (src) await warmImage(src, sourceIndex === 0);
      }
    });

    void Promise.all(workers);
    return () => { cancelled = true; };
  }, []);

  const displayDays = DAYS.map((day) => ({
    ...day,
    state: calendarDate ? getDayState(day, progress, calendarDate) : "locked" as const,
  }));
  const allDaysUnlocked = calendarDate !== null && calendarDate >= "2026-11-07";


  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col">
        <header className="mb-2 pt-11 text-center sm:mb-8 sm:pt-0">
          <h1 className="font-script text-5xl leading-none text-foreground sm:text-6xl">
            16 Days of Somto <span className="text-blossom">♡</span>
          </h1>
          <p className="mt-1 text-sm text-foreground/80 sm:mt-2 sm:text-base">A little something for you, one day at a time.</p>
          <p className="mt-1 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground sm:mt-1.5">{previewMode ? "PREVIEW MODE · ALL DAYS UNLOCKED" : allDaysUnlocked ? "ALL 16 DAYS ARE OPEN" : "DAY 16 UNLOCKS NOVEMBER 7"}</p>
        </header>
        <section
          className="day-carousel"
          aria-label="Sixteen days. Swipe horizontally from Day 1 through Day 16."
        >
          {displayDays.map((d, i) => (
            <div className="day-carousel-slide" key={d.day}>
              <DayCard day={d} index={i} eager={i <= 1 || i === 15} priority={i === 0} />
            </div>
          ))}
        </section>
        <p className="mt-6 text-center font-script text-base text-muted-foreground sm:mt-6 sm:text-xl">A little surprise, one day at a time. ♡</p>
        <PwaInstall />
      </div>
    </main>
  );
}
