export const MINI_CROSSWORD_CONTENT = {
  title: "A tiny crossword, made for you.",
  intro: "Fill the little crossings with things that belong in your world.",
  size: 7,
  entries: [
    { id: "smile", answer: "SMILE", clue: "Something you make very easily.", row: 2, column: 0, direction: "across" },
    { id: "music", answer: "MUSIC", clue: "The beginning of a good soundtrack.", row: 2, column: 1, direction: "down" },
    { id: "leaf", answer: "LEAF", clue: "A small piece of the garden.", row: 2, column: 3, direction: "down" },
  ],
} as const;
