import { createFileRoute, Link } from "@tanstack/react-router";
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
  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-xl">
        <header className="mb-2 pt-11 text-center sm:mb-8 sm:pt-0">
          <h1 className="font-script text-5xl leading-none text-foreground sm:text-6xl">
            16 Days of Somto <span className="text-blossom">♡</span>
          </h1>
          <p className="mt-1 text-sm text-foreground/80 sm:mt-2 sm:text-base">A little something for you, one day at a time.</p>
          <p className="mt-1 text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground sm:mt-1.5">ALL 16 DAYS ARE OPEN</p>
        </header>
        <section className="grid grid-cols-4 gap-1.5 sm:gap-4" aria-label="Sixteen days">
          {DAYS.map((d, i) => (
            <DayCard key={d.day} day={d} index={i} />
          ))}
        </section>
        <p className="mt-1 text-center font-script text-base text-muted-foreground sm:mt-6 sm:text-xl">Come back tomorrow for the next one. ♡</p>
        <div className="mt-4 text-center"><Link to="/world" className="world-link">🌱 Enter Your World</Link></div>
      </div>
    </main>
  );
}
