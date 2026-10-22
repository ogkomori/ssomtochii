import type { Day, DayState } from "@/lib/days";

export const PROGRESS_STORAGE_KEY = "ssomtochii-progress-v1";
export const PARTY_SIZE_CHOICE_KEY = "ssomtochii-party-size-choice";

export interface LocalProgress {
  unlockedDays: number[];
  completedDays: number[];
  lettersByDay: Record<string, string>;
}

const EMPTY_PROGRESS: LocalProgress = { unlockedDays: [], completedDays: [], lettersByDay: {} };

export function readProgress(): LocalProgress {
  if (typeof window === "undefined") return { ...EMPTY_PROGRESS, unlockedDays: [], completedDays: [], lettersByDay: {} };

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROGRESS, lettersByDay: {} };
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return {
      unlockedDays: Array.isArray(parsed.unlockedDays)
        ? parsed.unlockedDays.filter((day): day is number => Number.isInteger(day) && day >= 1 && day <= 16)
        : [],
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

export function isPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("preview") === "1") return true;
  try {
    return window.sessionStorage.getItem("ssomtochii-preview-unlock") === "1";
  } catch {
    return false;
  }
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
