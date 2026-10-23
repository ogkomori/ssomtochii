import { FLOW_FREE_LEVEL_1 } from "@/lib/flow-free-levels/level-1";
import { FLOW_FREE_LEVEL_2 } from "@/lib/flow-free-levels/level-2";
import { FLOW_FREE_LEVEL_3 } from "@/lib/flow-free-levels/level-3";
import { FLOW_FREE_LEVEL_4 } from "../flow-free-levels/level-4";
import { FLOW_FREE_LEVEL_5 } from "../flow-free-levels/level-5";

export type FlowFreePair = { id: string; start: number; end: number };
export type FlowFreeLevel = {
  id: number;
  title: string;
  size: number;
  pairs: FlowFreePair[];
};

/**
 * Levels are kept in separate files under src/lib/flow-free-levels/.
 * Cell indexes are row-major: row * size + column.
 * Example: on a 5x5 board, 0 is the top-left cell and 24 is bottom-right.
 */
export const FLOW_FREE_LEVELS: FlowFreeLevel[] = [
  FLOW_FREE_LEVEL_1,
  FLOW_FREE_LEVEL_2,
  FLOW_FREE_LEVEL_3,
  FLOW_FREE_LEVEL_4,
  FLOW_FREE_LEVEL_5
];

export const FLOW_FREE_INTRO =
  "Connect each matching pair. Paths cannot cross, and every square must be filled.";
