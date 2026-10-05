export type DayState = "locked" | "available" | "completed";
export type DayIcon = "flower" | "star" | "music" | "butterfly" | "mail" | "leaf" | "moon" | "sparkle";

export interface Day {
  day: number;
  date: string; // ISO
  label: string; // "OCT 23"
  icon: DayIcon;
  image?: string;
  state: DayState;
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
    state: i === 0 ? "available" : "locked",
  };
});

export const getDay = (n: number) => DAYS.find((d) => d.day === n);

// Days still to come: every day that hasn't been opened yet.
export const DAYS_LEFT = DAYS.filter((d) => d.state !== "completed").length;
