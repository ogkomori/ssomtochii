export type WorldItemId = "bird" | "constellation" | "emoji-garden" | "ranking-ribbon";

export const WORLD_ITEMS: Record<WorldItemId, { name: string; emoji: string; description: string; position: string }> = {
  bird: { name: "Sky friend", emoji: "🐦", description: "Earned by taking flight.", position: "left-[17%] top-[18%]" },
  constellation: { name: "Connection constellation", emoji: "✨", description: "Four little worlds brought together.", position: "right-[13%] top-[26%]" },
  "emoji-garden": { name: "Emoji blooms", emoji: "🌼", description: "A garden of clues you understood.", position: "left-[28%] bottom-[17%]" },
  "ranking-ribbon": { name: "Your ribbon", emoji: "🎀", description: "A snapshot of your excellent opinions.", position: "right-[19%] bottom-[16%]" },
};

const EVENT = "somto-world-change";
const EMPTY: WorldItemId[] = [];
let unlockedItems: WorldItemId[] = EMPTY;

/** In-memory only: discoveries reset when the page is refreshed. */
export function getUnlockedWorldItems(): WorldItemId[] {
  return unlockedItems;
}

export function unlockWorldItem(item: WorldItemId) {
  if (typeof window === "undefined" || unlockedItems.includes(item)) return;
  unlockedItems = [...unlockedItems, item];
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeToWorld(listener: () => void) {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
