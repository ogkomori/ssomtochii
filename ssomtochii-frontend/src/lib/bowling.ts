export const BOWLING_CONTENT = {
  title: "A little bowling.",
  intro: "Drag back from the ball to aim, then release to roll. Turn the gutter guards on whenever you want a kinder lane.",
  maxRolls: 10,
  // Canvas coordinates are 360 × 500. Pin positions are reset for a new game.
  lane: { left: 62, right: 298, top: 24, bottom: 474 },
} as const;
