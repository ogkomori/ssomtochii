import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DayOneJourney } from "@/activities/DayOneJourney";
import { CupPong } from "@/activities/CupPong";
import { MemoryMatch } from "@/activities/MemoryMatch";
import { MiniCrossword } from "@/activities/MiniCrossword";
import { MiniGolf } from "@/activities/MiniGolf";
import { SlidingPuzzle } from "@/activities/SlidingPuzzle";
import { WordScramble } from "@/activities/WordScramble";
import { Connections } from "@/activities/Connections";
import { EmojiPictionary } from "@/activities/EmojiPictionary";
import { TierList } from "@/activities/TierList";
import { Botanicals } from "@/components/Botanicals";
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
  if (day.activity === "day-one-journey") return <DayOneJourney />;
  if (day.activity === "cup-pong") return <CupPong />;
  if (day.activity === "word-scramble") return <WordScramble />;
  if (day.activity === "memory-match") return <MemoryMatch />;
  if (day.activity === "mini-crossword") return <MiniCrossword />;
  if (day.activity === "mini-golf") return <MiniGolf />;
  if (day.activity === "sliding-puzzle") return <SlidingPuzzle />;
  if (day.activity === "connections") return <Connections />;
  if (day.activity === "emoji-pictionary") return <EmojiPictionary />;
  if (day.activity === "tier-list") return <TierList />;

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto w-full max-w-md"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><div className="paper-card mt-6 p-8 text-center"><p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">DAY {day.day} · {day.label}</p><h1 className="mt-3 font-script text-5xl">Hello, you ♡</h1><p className="mt-4 text-foreground/80">This day is open for testing, but its surprise is still being wrapped.</p></div></div></main>;
}
