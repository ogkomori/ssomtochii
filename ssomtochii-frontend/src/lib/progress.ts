import type { Day, DayState } from "@/lib/days";

export const PROGRESS_STORAGE_KEY = "ssomtochii-progress-v1";
export const PARTY_SIZE_CHOICE_KEY = "ssomtochii-party-size-choice";

export interface LocalProgress {
  completedDays: number[];
  lettersByDay: Record<string, string>;
}

const EMPTY_PROGRESS: LocalProgress = { completedDays: [], lettersByDay: {} };

export function readProgress(): LocalProgress {
  if (typeof window === "undefined") return { ...EMPTY_PROGRESS, lettersByDay: {} };

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROGRESS, lettersByDay: {} };
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return {
      completedDays: Array.isArray(parsed.completedDays)
        ? parsed.completedDays.filter((day): day is number => Number.isInteger(day) && day >= 1 && day <= 16)
        : [],
      lettersByDay: parsed.lettersByDay && typeof parsed.lettersByDay === "object"
        ? Object.fromEntries(
            Object.entries(parsed.lettersByDay).filter(([day, letter]) =>
              /^([1-9]|1[0-6])$/.test(day) && typeof letter === "string" && letter.length > 0,
            ),
          )
        : {},
    };
  } catch {
    return { ...EMPTY_PROGRESS, lettersByDay: {} };
  }
}

export function writeProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // The experience remains playable when browser storage is disabled or full.
  }
}

export function getBerlinDateKey(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isDayUnlocked(day: Pick<Day, "date">, today = getBerlinDateKey()): boolean {
  return day.date <= today;
}

export function getDayState(
  day: Pick<Day, "date" | "day">,
  completedDays: number[],
  today: string,
): DayState {
  if (completedDays.includes(day.day)) return "completed";
  return isDayUnlocked(day, today) ? "available" : "locked";
}

export function markDayCompleted(day: number): LocalProgress {
  const progress = readProgress();
  const next: LocalProgress = {
    ...progress,
    completedDays: progress.completedDays.includes(day)
      ? progress.completedDays
      : [...progress.completedDays, day].sort((a, b) => a - b),
  };
  writeProgress(next);
  return next;
}

export function saveDayLetter(day: number, letter: string): LocalProgress {
  const progress = readProgress();
  const next: LocalProgress = {
    ...progress,
    lettersByDay: { ...progress.lettersByDay, [String(day)]: letter },
  };
  writeProgress(next);
  return next;
}
