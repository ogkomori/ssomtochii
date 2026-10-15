import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { DayOneJourney } from "@/activities/DayOneJourney";
import { CupPong } from "@/activities/CupPong";
import { MemoryMatch } from "@/activities/MemoryMatch";
import { MiniCrossword } from "@/activities/MiniCrossword";
import { MiniGolf } from "@/activities/MiniGolf";
import { SlidingPuzzle } from "@/activities/SlidingPuzzle";
import { WordScramble } from "@/activities/WordScramble";
import { Connections } from "@/activities/Connections";
import { EmojiPictionary } from "@/activities/EmojiPictionary";
import { Wordle } from "@/activities/Wordle";
import { FlowFree } from "@/activities/FlowFree";
import { SkeeBall } from "@/activities/SkeeBall";
import { WordSearch } from "@/activities/WordSearch";
import { MemoryLane } from "@/activities/MemoryLane";
import { Hangman } from "@/activities/Hangman";
import { Botanicals } from "@/components/Botanicals";
import { DayActivityFlow } from "@/components/DayActivityFlow";
import { getDay } from "@/lib/days";

export const Route = createFileRoute("/day/$day")({
  loader: ({ params }) => {
    const day = getDay(Number(params.day));
    if (!day) throw notFound();
    return day;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Day ${loaderData?.day ?? ""} · 16 Days of Somto` },
      { name: "description", content: "Today's little surprise." },
    ],
  }),
  component: DayPage,
});

/** Change a day's `activity` field in lib/days.ts to move an activity. */
function DayPage() {
  const day = Route.useLoaderData();
  const [daySevenStarted, setDaySevenStarted] = useState(false);

  if (day.day === 7 && !daySevenStarted) {
    return (
      <main className="page-shell">
        <Botanicals />
        <div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
          <header className="flex items-center justify-between pt-2">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link>
            <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">DAY 7 · {day.label}</span>
          </header>
          <section className="paper-card my-5 flex flex-1 flex-col items-center p-5 text-center sm:p-7">
            <p className="day-one-eyebrow">A LITTLE MILESTONE</p>
            <h1 className="mt-3 font-script text-5xl leading-none">Welcome to Day 7 ♡</h1>
            <p className="mt-3 text-foreground/80">from day 6 to 7</p>
            <div className="mt-6 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
              <video
                className="block aspect-[9/16] max-h-[52dvh] w-full object-contain"
                src="/videos/day-07-67.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                aria-label="Day 7 video"
              />
            </div>
            <button type="button" className="next-button mt-6" onClick={() => setDaySevenStarted(true)}>
              Let’s go <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <DayActivityFlow day={day.day}>
      {(complete) => {
        if (day.activity === "day-one-journey") return <DayOneJourney onComplete={complete} />;
        if (day.activity === "cup-pong") return <CupPong onComplete={complete} />;
        if (day.activity === "word-scramble") return <WordScramble onComplete={complete} />;
        if (day.activity === "memory-match") return <MemoryMatch onComplete={complete} />;
        if (day.activity === "mini-crossword") return <MiniCrossword onComplete={complete} />;
        if (day.activity === "mini-golf") return <MiniGolf onComplete={complete} />;
        if (day.activity === "sliding-puzzle") return <SlidingPuzzle onComplete={complete} />;
        if (day.activity === "connections") return <Connections onComplete={complete} />;
        if (day.activity === "emoji-pictionary") return <EmojiPictionary onComplete={complete} />;
        if (day.activity === "wordle") return <Wordle onComplete={complete} />;
        if (day.activity === "flow-free") return <FlowFree onComplete={complete} />;
        if (day.activity === "skee-ball") return <SkeeBall onComplete={complete} />;
        if (day.activity === "word-search") return <WordSearch onComplete={complete} />;
        if (day.activity === "memory-lane") return <MemoryLane onComplete={complete} />;
        if (day.activity === "hangman") return <Hangman onComplete={complete} />;

        return <main className="page-shell"><Botanicals /><div className="relative mx-auto w-full max-w-md"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><div className="paper-card mt-6 p-8 text-center"><p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">DAY {day.day} · {day.label}</p><h1 className="mt-3 font-script text-5xl">Hello, you ♡</h1><p className="mt-4 text-foreground/80">This day is open for testing, but its surprise is still being wrapped.</p></div></div></main>;
      }}
    </DayActivityFlow>
  );
}
