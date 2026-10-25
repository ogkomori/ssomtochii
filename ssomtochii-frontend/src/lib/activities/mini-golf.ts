export type GolfWall = { x: number; y: number; width: number; height: number };
export type GolfHole = { name: string; start: { x: number; y: number }; cup: { x: number; y: number }; walls: GolfWall[] };

/** Four editable mini-golf holes. Coordinates use a 360 × 500 canvas. */
export const MINI_GOLF_CONTENT: { title: string; intro: string; holes: GolfHole[] } = {
  title: "A tiny round of mini golf.",
  intro: "Drag back from the ball to aim, then let go to putt. Watch your power, though. If the ball rolls too fast over the hole, it won't go in!",
  holes: [
    { name: "Level 1!", start: { x: 180, y: 415 }, cup: { x: 180, y: 90 }, walls: [{ x: 108, y: 260, width: 145, height: 16 }] },
    { name: "Level 2!", start: { x: 80, y: 415 }, cup: { x: 280, y: 100 }, walls: [{ x: 145, y: 145, width: 18, height: 250 }, { x: 163, y: 145, width: 108, height: 16 }] },
    { name: "Level 3!", start: { x: 70, y: 420 }, cup: { x: 290, y: 85 }, walls: [{ x: 75, y: 290, width: 185, height: 16 }, { x: 105, y: 175, width: 185, height: 16 }] },
    { name: "Final Level!", start: { x: 180, y: 420 }, cup: { x: 180, y: 75 }, walls: [{ x: 70, y: 300, width: 95, height: 16 }, { x: 195, y: 300, width: 95, height: 16 }, { x: 120, y: 165, width: 120, height: 16 }] },
  ],
};
