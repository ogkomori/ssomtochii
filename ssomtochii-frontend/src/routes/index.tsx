import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DAYS } from "@/lib/days";
import { DayCard } from "@/components/DayCard";
import { Botanicals } from "@/components/Botanicals";
import { PwaInstall } from "@/components/PwaInstall";
import { getBerlinDateKey, getDayState, isPreviewMode, readProgress, recordUnlockedDays } from "@/lib/progress";

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

function centeredScrollLeft(carousel: HTMLElement, slide: HTMLElement) {
  const carouselRect = carousel.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  return carousel.scrollLeft + slideRect.left - carouselRect.left + slideRect.width / 2 - carousel.clientWidth / 2;
}

function Index() {
  const carouselRef = useRef<HTMLElement>(null);
  const recenterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [progress, setProgress] = useState(() => ({ unlockedDays: [] as number[], completedDays: [] as number[], lettersByDay: {} as Record<string, string> }));
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const previewFromUrl = new URLSearchParams(window.location.search).get("preview") === "1";
    try {
      if (previewFromUrl) window.sessionStorage.setItem("ssomtochii-preview-unlock", "1");
      setPreviewMode(previewFromUrl || window.sessionStorage.getItem("ssomtochii-preview-unlock") === "1");
    } catch {
      setPreviewMode(previewFromUrl);
    }
    const refreshProgress = () => {
      const today = getBerlinDateKey();
      if (!isPreviewMode()) {
        recordUnlockedDays(DAYS.filter((day) => day.date <= today).map((day) => day.day));
      }
      setCalendarDate(today);
      setProgress(readProgress());
    };
    refreshProgress();
    const interval = window.setInterval(refreshProgress, 60_000);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "ssomtochii-progress-v1" || event.key === null) refreshProgress();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const displayDays = DAYS.map((day) => ({
    ...day,
    state: calendarDate ? getDayState(day, progress, calendarDate) : "locked" as const,
  }));
  const allDaysUnlocked = calendarDate !== null && calendarDate >= "2026-11-07";

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstMiddleSlide = carousel.querySelector<HTMLElement>('[data-carousel-index="16"]');
    if (firstMiddleSlide) {
      carousel.scrollLeft = centeredScrollLeft(carousel, firstMiddleSlide);
    }
    return () => {
      if (recenterTimer.current) clearTimeout(recenterTimer.current);
    };
  }, []);

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    if (recenterTimer.current) clearTimeout(recenterTimer.current);
    recenterTimer.current = setTimeout(() => {
      const slides = Array.from(carousel.querySelectorAll<HTMLElement>(".day-carousel-slide"));
      if (!slides.length) return;
      const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
      let nearest = slides[0];
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const slide of slides) {
        const center = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(center - carouselCenter);
        if (distance < nearestDistance) {
          nearest = slide;
          nearestDistance = distance;
        }
      }
      const index = Number(nearest.dataset.carouselIndex);
      if (index < 16 || index >= 32) {
        const targetIndex = 16 + (index % 16);
        const target = slides.find((slide) => Number(slide.dataset.carouselIndex) === targetIndex);
        if (target) {
          carousel.scrollLeft = centeredScrollLeft(carousel, target);
        }
      }
    }, 140);
  };

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
          ref={carouselRef}
          className="day-carousel"
          aria-label="Sixteen days. Swipe horizontally to explore each day, looping from the last day back to the first."
          onScroll={handleCarouselScroll}
        >
          {[0, 1, 2].flatMap((cycle) => displayDays.map((d, i) => (
            <div
              className="day-carousel-slide"
              key={`${cycle}-${d.day}`}
              data-carousel-index={cycle * DAYS.length + i}
              aria-hidden={cycle !== 1 ? true : undefined}
            >
              <DayCard day={d} index={i} eager={cycle === 1 && (i === 15 || i === 0 || i === 1)} priority={cycle === 1 && i === 0} />
            </div>
          )))}
        </section>
        <p className="mt-6 text-center font-script text-base text-muted-foreground sm:mt-6 sm:text-xl">A little surprise, one day at a time. ♡</p>
        <PwaInstall />
      </div>
    </main>
  );
}
