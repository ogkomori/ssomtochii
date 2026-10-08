/**
 * Day 1's editable content lives here. This deliberately stays separate from
 * the screen components so personal copy, the video, quiz answers, and the
 * award can later come from the API without redesigning the flow.
 */
export const DAY_ONE_CONTENT = {
  introduction: {
    eyebrow: "DAY 1 · OCTOBER 23",
    title: "A little something, just for you.",
    body: "For the next sixteen days, a small surprise will be waiting here for you. Some will be silly, some will be sweet, and all of them are made with you in mind.",
  },
  video: {
    // Put the file in public/videos, then change this to "/videos/day-one-introduction.mp4".
    // A hosted video URL works here too.
    src: "",
    poster: "",
    caption: "A tiny note before we begin.",
  },
  quiz: {
    question: "Why do you think I chose 16 days?",
    answers: [
      "Because it is your lucky number",
      "Because of High School Musical 3 — 16 minutes left",
      "Because I wanted a very long countdown",
      "Because 16 is a nice even number",
    ],
    correctAnswer: 1,
    correctFeedback: "Exactly. A very specific nod to the opening basketball scene in High School Musical 3. ♡",
    incorrectFeedback: "A very fair guess — but think High School Musical 3 and the opening basketball scene.",
  },
  plant: {
    title: "Let’s grow something together.",
    body: "This little plant will keep you company through the sixteen days. Give it its first bit of care, and it will have somewhere to grow from.",
    choices: [
      { label: "A little water", emoji: "💧", response: "A gentle start. Your seed is feeling looked after." },
      { label: "Some sunshine", emoji: "☀️", response: "Warm and bright. Your seed is ready to wake up." },
      { label: "A kind word", emoji: "💬", response: "That was exactly what it needed to hear." },
    ],
  },
  completion: {
    title: "Day one, done.",
    body: "You have planted the first little piece of this journey. Come back to see it change with you.",
  },
  award: {
    message: "The first piece of a surprise that is still growing. Keep it safe. ♡",
  },
} as const;

export type DayOnePlantChoice = (typeof DAY_ONE_CONTENT.plant.choices)[number];

// Each entry is a separate wheel slot. Repeated letters intentionally remain
// separate so the complete collection can eventually spell the final gift.
export const CHARACTER_POOL = ["A", "G", "I", "A", "N", "T", "T", "E", "D", "D", "Y", "B", "E", "A", "R", "!"] as const;
