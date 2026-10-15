export type FlowPair = { id: string; color: string; start: number; end: number };

/**
 * One editable 5x5 starter level. Cell indexes are row-major: row * 5 + column.
 * The rose path snakes through the first three rows; the other two paths fill
 * the bottom rows. All 25 cells are used in the solution.
 */
export const FLOW_FREE_CONTENT = {
  title: "Connect the colours.",
  intro: "Connect each matching pair. Paths cannot cross, and every square must be filled.",
  size: 5,
  pairs: [
    { id: "rose", color: "#d86f83", start: 0, end: 14 },
    { id: "green", color: "#6caa82", start: 15, end: 19 },
    { id: "purple", color: "#a083c9", start: 20, end: 24 },
  ] satisfies FlowPair[],
} as const;
