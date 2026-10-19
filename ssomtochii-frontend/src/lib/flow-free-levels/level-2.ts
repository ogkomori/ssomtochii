import type { FlowFreeLevel } from "@/lib/flow-free";

/**
 * Customise this board independently from the other levels.
 * Cell indexes are row * size + column; on a 6x6 board the indexes are 0–35.
 */
export const FLOW_FREE_LEVEL_2: FlowFreeLevel = {
  id: 2,
  title: "A new pattern.",
  size: 6,
  pairs: [
    { id: "flow-a", start: 0, end: 5 },
    { id: "flow-b", start: 12, end: 17 },
    { id: "flow-c", start: 30, end: 35 },
  ],
};
