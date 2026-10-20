/**
 * CUSTOMISE THE MINI CROSSWORD HERE.
 *
 * 1. Set `size` to the width/height of your square grid.
 * 2. Add one object per answer in `entries`.
 * 3. `answer` is the word the player must enter; use A-Z letters.
 * 4. `clue` is the hint shown to the player.
 * 5. `row` and `column` are zero-based: the top-left cell is 0, 0.
 * 6. `direction` is either "across" or "down".
 *
 * Place crossing answers so every shared square has the same letter.
 * Every answer must fit inside the grid. Keep each `id` unique.
 * Replace the sample entries below with your own words and hints.
 */
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
