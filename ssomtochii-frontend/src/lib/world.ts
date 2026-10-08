export type WorldItemId = "bird" | "constellation" | "emoji-garden" | "ranking-ribbon";

export const WORLD_ITEMS: Record<WorldItemId, { name: string; emoji: string; description: string; position: string }> = {
  bird: { name: "Sky friend", emoji: "🐦", description: "Earned by taking flight.", position: "left-[17%] top-[18%]" },
  constellation: { name: "Connection constellation", emoji: "✨", description: "Four little worlds brought together.", position: "right-[13%] top-[26%]" },
  "emoji-garden": { name: "Emoji blooms", emoji: "🌼", description: "A garden of clues you understood.", position: "left-[28%] bottom-[17%]" },
  "ranking-ribbon": { name: "Your ribbon", emoji: "🎀", description: "A snapshot of your excellent opinions.", position: "right-[19%] bottom-[16%]" },
};

const KEY = "somto-world-unlocks";
const EVENT = "somto-world-change";
const EMPTY: WorldItemId[] = [];
let lastStoredValue: string | null = null;
let lastSnapshot: WorldItemId[] = EMPTY;

export function getUnlockedWorldItems(): WorldItemId[] {
  if (typeof window === "undefined") return EMPTY;
  const stored = window.localStorage.getItem(KEY) ?? "[]";
  if (stored === lastStoredValue) return lastSnapshot;
  try {
    const parsed = JSON.parse(stored);
    lastSnapshot = Array.isArray(parsed) ? parsed.filter((id): id is WorldItemId => typeof id === "string" && id in WORLD_ITEMS) : EMPTY;
  } catch { lastSnapshot = EMPTY; }
  lastStoredValue = stored;
  return lastSnapshot;
}

export function unlockWorldItem(item: WorldItemId) {
  if (typeof window === "undefined") return;
  const unlocked = new Set(getUnlockedWorldItems());
  unlocked.add(item);
  const value = JSON.stringify([...unlocked]); window.localStorage.setItem(KEY, value); lastStoredValue = value; lastSnapshot = [...unlocked];
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeToWorld(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener("storage", listener); };
}
