/** Editable copy and board settings for the Lucky Drop / Plinko activity. */
export const PLINKO_CONTENT = {
  title: "Drop a little luck.",
  eyebrow: "LUCKY DROP",
  intro: "Drop a coin from the top and watch it bounce through the pegs. Its landing spot wins that round.",
  rounds: 5,
  prizes: [1, 2, 3, 4, 5],
  width: 360,
  height: 500,
  binTop: 420,
  pegRows: 10,
  firstRowPegs: 3,
  firstPegY: 95,
  pegRowGap: 28,
} as const;
