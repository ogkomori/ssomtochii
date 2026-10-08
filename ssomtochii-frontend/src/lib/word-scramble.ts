/**
 * Content for the Word Scramble activity. Keep this data personal: swap the
 * placeholder answers, clues, and end note once you have chosen the details.
 * This object can be assigned to any day without changing the game component.
 */
export const WORD_SCRAMBLE_CONTENT = {
  title: "A little word mix-up.",
  intro: "Unscramble a few things that feel very you. No timer, no pressure — just follow the clues.",
  completionTitle: "You know your stuff.",
  completionBody: "Every answer is a small thing that makes the world feel more like yours.",
  words: [
    { answer: "SUNSHINE", clue: "A soft, bright thing to keep close.", scramble: "NUSHSIEN" },
    { answer: "MUSIC", clue: "The beginning of a very good soundtrack.", scramble: "CSIUM" },
    { answer: "GARDEN", clue: "Where our tiny new plant will live.", scramble: "DANGER" },
  ],
} as const;
