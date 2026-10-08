export type GolfWall = { x: number; y: number; width: number; height: number };
export type GolfHole = { name: string; start: { x: number; y: number }; cup: { x: number; y: number }; walls: GolfWall[] };

/** Four editable mini-golf holes. Coordinates use a 360 × 500 canvas. */
export const MINI_GOLF_CONTENT: { title: string; intro: string; holes: GolfHole[] } = {
  title: "A tiny round of mini golf.",
  intro: "Drag back from the ball to aim, then let go to putt. It is meant to be fun, not professional sport.",
  holes: [
    { name: "The Warm-Up", start: { x: 180, y: 415 }, cup: { x: 180, y: 90 }, walls: [{ x: 72, y: 260, width: 145, height: 16 }] },
    { name: "Around the Bend", start: { x: 80, y: 415 }, cup: { x: 280, y: 100 }, walls: [{ x: 145, y: 145, width: 18, height: 250 }, { x: 163, y: 145, width: 108, height: 16 }] },
    { name: "Little Zigzag", start: { x: 70, y: 420 }, cup: { x: 290, y: 85 }, walls: [{ x: 75, y: 290, width: 185, height: 16 }, { x: 105, y: 175, width: 185, height: 16 }] },
    { name: "The Grand Finale", start: { x: 180, y: 420 }, cup: { x: 180, y: 75 }, walls: [{ x: 70, y: 300, width: 95, height: 16 }, { x: 195, y: 300, width: 95, height: 16 }, { x: 120, y: 165, width: 120, height: 16 }] },
  ],
};
