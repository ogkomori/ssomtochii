import type { FlowFreeLevel } from "@/lib/activities/flow-free";

export const FLOW_FREE_LEVEL_2: FlowFreeLevel = {
  id: 2,
  title: "Level 2!",
  size: 7,
  pairs: [
    { id: "flow-a", start: 0, end: 15 },
    { id: "flow-b", start: 1, end: 6 },
    { id: "flow-c", start: 13, end: 27 },
    { id: "flow-d", start: 14, end: 34 },
    { id: "flow-e", start: 20, end: 24 },
    { id: "flow-f", start: 22, end: 38 },
    { id: "flow-g", start: 41, end: 47 },
  ],
};
