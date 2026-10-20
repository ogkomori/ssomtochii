import type { FlowFreeLevel } from "@/lib/flow-free";

export const FLOW_FREE_LEVEL_1: FlowFreeLevel = {
  id: 1,
  title: "Level 1!",
  size: 6,
  pairs: [
    { id: "flow-a", start: 0, end: 4 },
    { id: "flow-b", start: 3, end: 20 },
    { id: "flow-c", start: 5, end: 7 },
  ],
};
