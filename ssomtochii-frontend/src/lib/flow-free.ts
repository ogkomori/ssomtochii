export type FlowPair = { id: string; color: string; start: number; end: number };

/**
 * One editable 5x5 starter level.
 * Cells are row-major: index = row * 5 + column.
 * This first level intentionally uses full-width paths to validate drawing,
 * endpoint matching, and the classic requirement that every cell be filled.
 */
export const FLOW_FREE_CONTENT = {
  title: "Connect the colours.",
  intro: "Connect each matching pair. Paths cannot cross, and every square must be filled.",
  size: 5,
  pairs: [
    { id: "rose", color: "#d86f83", start: 0, end: 4 },
    { id: "gold", color: "#d4a63d", start: 5, end: 9 },
    { id: "blue", color: "#6596d6", start: 10, end: 14 },
    { id: "green", color: "#6caa82", start: 15, end: 19 },
    { id: "purple", color: "#a083c9", start: 20, end: 24 },
  ] satisfies FlowPair[],
} as const;
