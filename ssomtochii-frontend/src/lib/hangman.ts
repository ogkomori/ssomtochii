/**
 * Edit answer and hint to make a new Hangman puzzle.
 * The number of letter slots is generated from answer.length automatically.
 * Use letters only in answer; spaces and punctuation are not supported yet.
 */
export const HANGMAN_CONTENT = {
  title: "A little word guessing.",
  intro: "Guess the word one letter at a time.",
  answer: "BIRTHDAY",
  hint: "A special day worth celebrating.",
  maxWrongGuesses: 6,
} as const;
