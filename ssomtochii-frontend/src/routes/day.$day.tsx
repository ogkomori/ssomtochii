import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRef, useState } from "react";
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
import { Plinko } from "@/activities/Plinko";
import { MemoryLane } from "@/activities/MemoryLane";
import { Hangman } from "@/activities/Hangman";
import { Botanicals } from "@/components/Botanicals";
import { DayActivityFlow } from "@/components/DayActivityFlow";
import { StoryPlayer } from "@/components/StoryPlayer";
import { IncomingCallScreen } from "@/components/IncomingCallScreen";
import { STORY_ENGINE_DEMO } from "@/lib/stories/demo";
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
  const [callAnswered, setCallAnswered] = useState(false);
  const [daySevenStarted, setDaySevenStarted] = useState(false);
  const [daySevenVideoStarted, setDaySevenVideoStarted] = useState(false);
  const daySevenVideoRef = useRef<HTMLVideoElement>(null);

  if (day.day === 12 && !callAnswered) {
    return <IncomingCallScreen onAnswer={() => setCallAnswered(true)} />;
  }

  if (day.day === 12) {
    return <StoryPlayer story={STORY_ENGINE_DEMO} onExit={() => window.location.assign("/day/12")} />;
  }

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
            <div className="relative mt-6 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
              <video
                ref={daySevenVideoRef}
                className="block aspect-[9/16] max-h-[52dvh] w-full object-contain"
                src="/videos/day-07-67.mp4"
                loop
                playsInline
                controls
                aria-label="Day 7 video"
                onPlay={() => setDaySevenVideoStarted(true)}
              />
              {!daySevenVideoStarted && (
                <button
                  type="button"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25 text-white transition-colors hover:bg-black/35"
                  onClick={() => {
                    const video = daySevenVideoRef.current;
                    if (video) void video.play().catch(() => {});
                  }}
                  aria-label="Play Day 7 video with sound"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                  <span className="text-sm font-semibold drop-shadow">Tap to play with sound</span>
                </button>
              )}
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
        if (day.activity === "plinko") return <Plinko onComplete={complete} />;
        if (day.activity === "memory-lane") return <MemoryLane onComplete={complete} />;
        if (day.activity === "hangman") return <Hangman onComplete={complete} />;

        return <main className="page-shell"><Botanicals /><div className="relative mx-auto w-full max-w-md"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><div className="paper-card mt-6 p-8 text-center"><p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">DAY {day.day} · {day.label}</p><h1 className="mt-3 font-script text-5xl">Hello, you ♡</h1><p className="mt-4 text-foreground/80">This day is open for testing, but its surprise is still being wrapped.</p></div></div></main>;
      }}
    </DayActivityFlow>
  );
}
