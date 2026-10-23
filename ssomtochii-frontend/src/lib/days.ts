export type DayState = "locked" | "available" | "completed";
export type DayIcon = "flower" | "star" | "music" | "butterfly" | "mail" | "leaf" | "moon" | "sparkle";
export type ActivityId = "day-one-journey" | "word-scramble" | "memory-match" | "mini-crossword" | "rhythm-game" | "sliding-puzzle" | "mini-golf" | "cup-pong" | "sky-hop" | "connections" | "emoji-pictionary" | "tier-list" | "flow-free" | "plinko" | "memory-lane" | "hangman" | "wordle" | "coming-soon";
export type StoryId =
  | "day-one-story"
  | "day-two-story"
  | "day-three-story"
  | "day-four-story"
  | "day-five-story"
  | "day-six-story"
  | "day-seven-story"
  | "day-eight-story"
  | "day-nine-story"
  | "day-ten-story"
  | "day-eleven-story"
  | "day-twelve-story"
  | "day-thirteen-story"
  | "day-fourteen-story"
  | "day-fifteen-story"
  | "day-sixteen-story";

export interface Day {
  day: number;
  date: string; // ISO
  label: string; // "OCT 23"
  icon: DayIcon;
  image?: string;
  state: DayState;
  story: StoryId;
  activity: ActivityId;
}

const icons: DayIcon[] = ["flower", "star", "music", "butterfly", "mail", "leaf", "moon", "sparkle"];
const storyIds: StoryId[] = [
  "day-one-story", "day-two-story", "day-three-story", "day-four-story",
  "day-five-story", "day-six-story", "day-seven-story", "day-eight-story",
  "day-nine-story", "day-ten-story", "day-eleven-story", "day-twelve-story",
  "day-thirteen-story", "day-fourteen-story", "day-fifteen-story", "day-sixteen-story",
];

export const DAYS: Day[] = Array.from({ length: 16 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 9, 23 + i));
  const label = `${d.toLocaleString("en-US", { month: "long", timeZone: "UTC" })} ${d.getUTCDate()}`;
  return {
    day: i + 1,
    date: d.toISOString().slice(0, 10),
    label,
    icon: icons[i % icons.length] as DayIcon,
    // Drop each photo into public/images/days using the matching filename.
    image: `/images/days/day-${String(i + 1).padStart(2, "0")}.jpg`,
    // The home screen calculates the real state in the browser using the Berlin date.
    // Keep the server-rendered default locked to avoid build-time date drift.
    state: "locked",
    story: storyIds[i],
    activity: i === 0 ? "day-one-journey" :
              i === 1 ? "hangman" :
              i === 2 ? "sliding-puzzle" :
              i === 3 ? "emoji-pictionary" :
              i === 4 ? "mini-golf" :
              i === 5 ? "wordle" :
              i === 6 ? "flow-free" :
              i === 7 ? "memory-match" :
              i === 8 ? "cup-pong" :
              i === 9 ? "connections" :
              i === 10 ? "mini-crossword" :
              i === 11 ? "word-scramble" :
              i === 12 ? "memory-lane" :
              i === 13 ? "plinko":
              "coming-soon",
  };
});

export const getDay = (n: number) => DAYS.find((d) => d.day === n);

// Days still to come: every day that hasn't been opened yet.
export const DAYS_LEFT = DAYS.filter((d) => d.state !== "completed").length;
