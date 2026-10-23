/**
 * Day 1's editable content lives here. This deliberately stays separate from
 * the screen components so personal copy, the video, quiz answers, and the
 * award can later come from the API without redesigning the flow.
 */
export const DAY_ONE_CONTENT = {
  introduction: {
    eyebrow: "DAY 1 · OCTOBER 23",
    title: "Welcome to Day 1 ♡",
    // Leave this empty if you don't want an extra message on the welcome screen.
    body: "",
    buttonLabel: "Start Day 1",
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
  completion: {
    title: "Day one, done.",
    body: "That is the first little piece of this journey. Come back tomorrow for another surprise.",
  },
  award: {
    message: "The first piece of your birthday surprise. Keep it safe. ♡",
  },
} as const;
