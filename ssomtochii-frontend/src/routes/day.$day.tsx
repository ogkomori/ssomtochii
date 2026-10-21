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
import type { StoryDefinition } from "@/lib/stories/types";
import type { StoryId } from "@/lib/days";
import { DAY_TWO_STORY } from "@/lib/stories/day-two-story";
import { DAY_THREE_STORY } from "@/lib/stories/day-three-story";
import { DAY_FOUR_STORY } from "@/lib/stories/day-four-story";
import { DAY_FIVE_STORY } from "@/lib/stories/day-five-story";
import { DAY_SIX_STORY } from "@/lib/stories/day-six-story";
import { DAY_SEVEN_STORY } from "@/lib/stories/day-seven-story";
import { DAY_EIGHT_STORY } from "@/lib/stories/day-eight-story";
import { DAY_NINE_STORY } from "@/lib/stories/day-nine-story";
import { DAY_TEN_STORY } from "@/lib/stories/day-ten-story";
import { DAY_ELEVEN_STORY } from "@/lib/stories/day-eleven-story";
import { DAY_TWELVE_STORY } from "@/lib/stories/day-twelve-story";
import { DAY_THIRTEEN_STORY } from "@/lib/stories/day-thirteen-story";
import { DAY_FOURTEEN_STORY } from "@/lib/stories/day-fourteen-story";
import { DAY_FIFTEEN_STORY } from "@/lib/stories/day-fifteen-story";
import { DAY_SIXTEEN_STORY } from "@/lib/stories/day-sixteen-story";
import { getDay } from "@/lib/days";

const STORIES: Record<Exclude<StoryId, "day-one-story">, StoryDefinition> = {
  "day-two-story": DAY_TWO_STORY,
  "day-three-story": DAY_THREE_STORY,
  "day-four-story": DAY_FOUR_STORY,
  "day-five-story": DAY_FIVE_STORY,
  "day-six-story": DAY_SIX_STORY,
  "day-seven-story": DAY_SEVEN_STORY,
  "day-eight-story": DAY_EIGHT_STORY,
  "day-nine-story": DAY_NINE_STORY,
  "day-ten-story": DAY_TEN_STORY,
  "day-eleven-story": DAY_ELEVEN_STORY,
  "day-twelve-story": DAY_TWELVE_STORY,
  "day-thirteen-story": DAY_THIRTEEN_STORY,
  "day-fourteen-story": DAY_FOURTEEN_STORY,
  "day-fifteen-story": DAY_FIFTEEN_STORY,
  "day-sixteen-story": DAY_SIXTEEN_STORY,
};

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

/** Each day starts with its welcome, then its story, then the day's activity. */
function DayPage() {
  const day = Route.useLoaderData();
  const [welcomeStarted, setWelcomeStarted] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);
  const [daySevenStarted, setDaySevenStarted] = useState(false);
  const [daySevenVideoStarted, setDaySevenVideoStarted] = useState(false);
  const daySevenVideoRef = useRef<HTMLVideoElement>(null);

  // Day 1 has its own welcome, introduction video, story, and remaining journey.
  if (day.day === 1) {
    return <DayOneJourney onComplete={() => window.location.assign("/")} />;
  }

  if (!welcomeStarted) {
    return (
      <main className="page-shell day-one-shell">
        <Botanicals />
        <div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
          <header className="flex items-center justify-between pt-2">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link>
            <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">DAY {day.day} · {day.label}</span>
          </header>
          <section className="paper-card day-one-card my-6 flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-8">
            <p className="day-one-eyebrow">DAY {day.day} · {day.label}</p>
            <h1 className="font-script text-5xl leading-none sm:text-6xl">Welcome to Day {day.day} ♡</h1>
            <p className="mt-5 min-h-6 whitespace-pre-wrap text-foreground/80">{/* Optional message: add it here when desired. */}</p>
            <button type="button" className="next-button mt-8" onClick={() => setWelcomeStarted(true)}>Start Day {day.day} <ArrowRight className="h-4 w-4" /></button>
          </section>
        </div>
      </main>
    );
  }

  if (!storyComplete) {
    const story = STORIES[day.story as Exclude<StoryId, "day-one-story">];
    return (
      <StoryPlayer
        story={story}
        exitLabel="Back to welcome"
        onExit={() => setWelcomeStarted(false)}
        onComplete={() => setStoryComplete(true)}
        continueLabel={`Continue to Day ${day.day}'s activity ♡`}
      />
    );
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
              <video ref={daySevenVideoRef} className="block aspect-[9/16] max-h-[52dvh] w-full object-contain" src="/videos/day-07-67.mp4" loop playsInline controls aria-label="Day 7 video" onPlay={() => setDaySevenVideoStarted(true)} />
              {!daySevenVideoStarted && <button type="button" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25 text-white transition-colors hover:bg-black/35" onClick={() => { const video = daySevenVideoRef.current; if (video) void video.play().catch(() => {}); }} aria-label="Play Day 7 video with sound"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg"><Play className="ml-1 h-7 w-7 fill-current" /></span><span className="text-sm font-semibold drop-shadow">Tap to play with sound</span></button>}
            </div>
            <button type="button" className="next-button mt-6" onClick={() => setDaySevenStarted(true)}>Let’s go <ArrowRight className="h-4 w-4" /></button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <DayActivityFlow day={day.day}>
      {(complete) => {
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
