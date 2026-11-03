/**
 * Content for the Word Scramble activity. Keep this data personal: swap the
 * placeholder answers, clues, and end note once you have chosen the details.
 * This object can be assigned to any day without changing the game component.
 */
export const WORD_SCRAMBLE_CONTENT = {
  title: "A little word mix-up.",
  intro: "Unscramble a few things that feel related to you.",
  completionTitle: "You know your stuff!",
  words: [
    { answer: "SUNSHINE", scramble: "SNUHEISN" },
    { answer: "MUSIC", scramble: "UCSMI" },
    { answer: "TRAVEL", scramble: "VRALET" },
    { answer: "BIRTHDAY", scramble: "YRDTIHBA" },
    { answer: "SOMTOCHI", scramble: "IHCTOMSO" },
  ],
} as const;
