import type { FlowFreeLevel } from "@/lib/flow-free";

/**
 * Customise this board independently from the other levels.
 * Cell indexes are row * size + column; on a 7x7 board the indexes are 0–48.
 */
export const FLOW_FREE_LEVEL_3: FlowFreeLevel = {
  id: 3,
  title: "One last puzzle.",
  size: 7,
  pairs: [
    { id: "flow-a", start: 0, end: 6 },
    { id: "flow-b", start: 21, end: 27 },
    { id: "flow-c", start: 42, end: 48 },
  ],
};
