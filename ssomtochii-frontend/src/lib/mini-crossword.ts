/**
 * CUSTOMISE THE MINI CROSSWORD HERE.
 *
 * 1. Set `rows` and `columns` to the fixed grid dimensions.
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
  rows: 9,
  columns: 12,
  entries: [
    { id: 1, answer: "OBSESSED", clue: "", row: 0, column: 0, direction: "across" },
    { id: 2, answer: "OSMO", clue: "", row: 0, column: 0, direction: "down" },
    { id: 3, answer: "SPIDERMAN", clue: "", row: 0, column: 4, direction: "down" },
    { id: 4, answer: "ADIDAS", clue: "", row: 3, column: 3, direction: "across" },
    { id: 5, answer: "SUMMER", clue: "", row: 3, column: 8, direction: "down" },
    { id: 6, answer: "IRENE", clue: "", row: 4, column: 1, direction: "down" },
    { id: 7, answer: "DRONE", clue: "", row: 4, column: 10, direction: "down" },
    { id: 8, answer: "SMART", clue: "", row: 5, column: 7, direction: "across" },
    { id: 9, answer: "ENGLAND", clue: "", row: 7, column: 0, direction: "across" },
    { id: 10, answer: "GREEN", clue: "", row: 8, column: 7, direction: "across" },
  ],
} as const;
