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
  if (typeof window === "undefined") return { ...EMPTY_PROGRESS };
  try {
    const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return { ...EMPTY_PROGRESS };
    const parsed = JSON.parse(stored) as Partial<LocalProgress>;
    return {
      unlockedDays: Array.isArray(parsed.unlockedDays) ? parsed.unlockedDays.filter(Number.isInteger) : [],
      completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays.filter(Number.isInteger) : [],
      lettersByDay: parsed.lettersByDay && typeof parsed.lettersByDay === "object" ? parsed.lettersByDay : {},
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function writeProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Keep the app usable if browser storage is unavailable or full.
  }
}

export const STORY_CHOICES_STORAGE_KEY = "ssomtochii-story-choices-v1";

export type SavedStoryChoices = Record<string, string>;

export function readStoryChoices(): SavedStoryChoices {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(STORY_CHOICES_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as SavedStoryChoices : {};
  } catch {
    return {};
  }
}

export function readStoryChoice(key: string): string | null {
  return readStoryChoices()[key] ?? null;
}

export function saveStoryChoice(key: string, choiceId: string): void {
  if (typeof window === "undefined") return;
  try {
    const choices = readStoryChoices();
    choices[key] = choiceId;
    window.localStorage.setItem(STORY_CHOICES_STORAGE_KEY, JSON.stringify(choices));
  } catch {
    // Story playback should continue even if storage is unavailable.
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
  return new URLSearchParams(window.location.search).get("preview") === "1";
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
