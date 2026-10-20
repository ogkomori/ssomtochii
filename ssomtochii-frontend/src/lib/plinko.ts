/** Editable copy and board settings for the Lucky Drop / Plinko activity. */
export const PLINKO_CONTENT = {
  title: "Drop a little luck.",
  eyebrow: "LUCKY DROP",
  intro: "Drop a coin through the pegs. Wherever it lands is what you win that round.",
  rounds: 5,
  prizes: [1, 2, 3, 4, 5],
  width: 360,
  height: 500,
  binTop: 420,
  pegRows: 8,
  evenRowPegs: 4,
  oddRowPegs: 5,
  firstPegY: 100,
  pegRowGap: 39,
} as const;
