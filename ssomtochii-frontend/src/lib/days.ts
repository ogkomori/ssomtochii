export type DayState = "locked" | "available" | "completed";
export type DayIcon = "flower" | "star" | "music" | "butterfly" | "mail" | "leaf" | "moon" | "sparkle";
export type ActivityId = "day-one-journey" | "word-scramble" | "memory-match" | "mini-crossword" | "rhythm-game" | "sliding-puzzle" | "mini-golf" | "cup-pong" | "sky-hop" | "connections" | "emoji-pictionary" | "tier-list" | "coming-soon";

export interface Day {
  day: number;
  date: string; // ISO
  label: string; // "OCT 23"
  icon: DayIcon;
  image?: string;
  state: DayState;
  activity: ActivityId;
}

const icons: DayIcon[] = ["flower", "star", "music", "butterfly", "mail", "leaf", "moon", "sparkle"];

export const DAYS: Day[] = Array.from({ length: 16 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 9, 23 + i));
  const label = `${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase()} ${d.getUTCDate()}`;
  return {
    day: i + 1,
    date: d.toISOString().slice(0, 10),
    label,
    icon: icons[i % icons.length] as DayIcon,
    // Every day is open while we prototype individual activities. Date locking
    // will be restored through the journey API before the experience launches.
    state: "available",
    activity: i === 0 ? "day-one-journey" :
              i === 1 ? "word-scramble" :
              i === 2 ? "memory-match" :
              i === 3 ? "mini-crossword" :
              // i === 4 ? "rhythm-game" :
              i === 5 ? "sliding-puzzle" :
              i === 6 ? "mini-golf" :
              i === 7 ? "cup-pong" :
              // i === 8 ? "sky-hop" :
              i === 9 ? "connections" :
              i === 10 ? "emoji-pictionary" :
              i === 11 ? "tier-list" :
              "coming-soon",
  };
});

export const getDay = (n: number) => DAYS.find((d) => d.day === n);

// Days still to come: every day that hasn't been opened yet.
export const DAYS_LEFT = DAYS.filter((d) => d.state !== "completed").length;
