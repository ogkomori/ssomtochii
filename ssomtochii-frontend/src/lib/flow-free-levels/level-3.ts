import type { FlowFreeLevel } from "@/lib/flow-free";

export const FLOW_FREE_LEVEL_3: FlowFreeLevel = {
  id: 3,
  title: "One last puzzle.",
  size: 5,
  pairs: [
    { id: "flow-a", start: 0, end: 4 },
    { id: "flow-b", start: 5, end: 10 },
    { id: "flow-c", start: 15, end: 20 },
  ],
};
