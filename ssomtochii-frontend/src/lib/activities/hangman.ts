/**
 * Replace each answer below with an Ayra Starr song title.
 * Keep the title in quotes; spaces and punctuation are supported.
 * Each level uses the same hint: "An Ayra Starr song."
 */
export const HANGMAN_LEVELS: { answer: string }[] = [
  {
    answer: "RUSH",
  },
  {
    answer: "WOMAN COMMANDO",
  },
  {
    answer: "MS PAPER",
  },
  {
    answer: "HEAVEN BABY",
  },
];

export const HANGMAN_CONTENT = {
  title: "Name the Ayra Starr song!",
  intro: "Guess the song title one letter at a time.",
  maxWrongGuesses: 6,
} as const;
