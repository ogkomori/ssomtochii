/**
 * Replace each answer below with an Ayra Starr song title.
 * Keep the title in quotes; spaces and punctuation are supported.
 * Each level uses the same hint: "An Ayra Starr song."
 */
export const HANGMAN_LEVELS: { answer: string; hint: string }[] = [
  {
    answer: "SONG TITLE ONE",
    hint: "An Ayra Starr song.",
  },
  {
    answer: "SONG TITLE TWO",
    hint: "An Ayra Starr song.",
  },
  {
    answer: "SONG TITLE THREE",
    hint: "An Ayra Starr song.",
  },
];

export const HANGMAN_CONTENT = {
  title: "Name that song.",
  intro: "Guess the song title one letter at a time.",
  maxWrongGuesses: 6,
} as const;
