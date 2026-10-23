import type { Day, DayState } from "@/lib/days";

export const PROGRESS_STORAGE_KEY = "ssomtochii-progress-v1";
export const PARTY_SIZE_CHOICE_KEY = "ssomtochii-party-size-choice";

export interface LocalProgress {
  unlockedDays: number[];
  completedDays: number[];
  lettersByDay: Record<string, string>;
}

const EMPTY_PROGRESS: LocalProgress = { unlockedDays: [], completedDays: [], lettersByDay: {} };

// TEMPORARY TEST MODE: progress is kept only in the current React view.
// Nothing is read from or written to browser storage. Remove this override
// when persistent progress is ready to be re-enabled.
export function readProgress(): LocalProgress {
  return { ...EMPTY_PROGRESS, unlockedDays: [], completedDays: [], lettersByDay: {} };
}

export function writeProgress(_progress: LocalProgress): void {
  // Persistence intentionally disabled while testing the full experience.
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

export function isPreviewMode(): boolean {
  // TEMPORARY TEST MODE: allow every day to be opened regardless of date.
  return true;
}

export function isDayUnlocked(day: Pick<Day, "date" | "day">, today = getBerlinDateKey()): boolean {
  return isPreviewMode() || day.date <= today || readProgress().unlockedDays.includes(day.day);
}

export function getDayState(
  day: Pick<Day, "date" | "day">,
  progress: LocalProgress,
  today: string,
): DayState {
  if (progress.completedDays.includes(day.day)) return "completed";
  if (progress.unlockedDays.includes(day.day) || isDayUnlocked(day, today)) return "available";
  return "locked";
}

export function recordUnlockedDays(dayNumbers: number[]): LocalProgress {
  const progress = readProgress();
  const unlockedDays = [...new Set([...progress.unlockedDays, ...dayNumbers])].sort((a, b) => a - b);
  if (unlockedDays.length === progress.unlockedDays.length && unlockedDays.every((day, index) => day === progress.unlockedDays[index])) return progress;
  const next: LocalProgress = { ...progress, unlockedDays };
  writeProgress(next);
  return next;
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
