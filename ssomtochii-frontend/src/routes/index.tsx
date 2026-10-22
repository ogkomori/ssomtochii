import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DAYS } from "@/lib/days";
import { DayCard } from "@/components/DayCard";
import { Botanicals } from "@/components/Botanicals";

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
  const carouselRef = useRef<HTMLElement>(null);
  const recenterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstMiddleSlide = carousel.querySelector<HTMLElement>('[data-carousel-index="16"]');
    if (firstMiddleSlide) {
      carousel.scrollLeft = firstMiddleSlide.offsetLeft + firstMiddleSlide.offsetWidth / 2 - carousel.clientWidth / 2;
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
          carousel.scrollTo({
            left: target.offsetLeft + target.offsetWidth / 2 - carousel.clientWidth / 2,
            behavior: "instant",
          });
        }
      }
    }, 140);
  };

  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-xl">
        <header className="mb-2 pt-11 text-center sm:mb-8 sm:pt-0">
          <h1 className="font-script text-5xl leading-none text-foreground sm:text-6xl">
            16 Days of Somto <span className="text-blossom">♡</span>
          </h1>
          <p className="mt-1 text-sm text-foreground/80 sm:mt-2 sm:text-base">A little something for you, one day at a time.</p>
          <p className="mt-1 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground sm:mt-1.5">DAY 16 IS LOCKED FOR NOW</p>
        </header>
        <section
          ref={carouselRef}
          className="day-carousel"
          aria-label="Sixteen days. Swipe horizontally to explore each day, looping from the last day back to the first."
          onScroll={handleCarouselScroll}
        >
          {[0, 1, 2].flatMap((cycle) => DAYS.map((d, i) => (
            <div
              className="day-carousel-slide"
              key={`${cycle}-${d.day}`}
              data-carousel-index={cycle * DAYS.length + i}
              aria-hidden={cycle !== 1 ? true : undefined}
            >
              <DayCard day={d} index={i} />
            </div>
          )))}
        </section>
        <p className="mt-1 text-center font-script text-base text-muted-foreground sm:mt-6 sm:text-xl">Come back tomorrow for the next one. ♡</p>
      </div>
    </main>
  );
}
