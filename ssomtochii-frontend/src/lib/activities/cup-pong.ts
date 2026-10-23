export type PongCup = { id: string; x: number; y: number };

/** Editable cup placement and copy for the Cup Pong activity. Canvas: 360 × 500. */
export const CUP_PONG_CONTENT = {
  title: "A very serious game of cup pong.",
  intro: "Drag back from the ball, then let go to toss. Sink every cup if you can.",
  cups: [
    { id: "a", x: 180, y: 105 },
    { id: "b", x: 153, y: 145 }, { id: "c", x: 207, y: 145 },
    { id: "d", x: 126, y: 185 }, { id: "e", x: 180, y: 185 }, { id: "f", x: 234, y: 185 },
  ] as PongCup[],
};
