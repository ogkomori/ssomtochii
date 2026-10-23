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
    src: "/videos/day-one-introduction.mp4",
    poster: "",
    caption: "A tiny note before we begin.",
  },
  quiz: {
    question: "Why do you think I chose 16 days?",
    answers: [
      {
        text: "We met in JMC and we were admitted in 2016",
        feedback: "Not a bad guess. We didn't meet in 2016 tho...",
      },
      {
        text: "We were 16 the first time we got together",
        feedback: "Nope, we were actually 15 the first time we got together",
      },
      {
        text: "The Final 16 Minutes of High School Musical 3",
        feedback: "You got it!",
      },
      {
        text: "Our birthdays are 16 weeks apart",
        feedback: "The math isn't mathing babe, our birthdays are 19 weeks apart",
      },
      {
        text: "It was just random",
        feedback: "Haba. I know you don't believe that.",
      },
    ],
    correctAnswer: 2,
  },
  completion: {
    title: "Day one, done.",
    body: "That is the first little piece of this journey. Come back tomorrow for another surprise.",
  },
  award: {
    message: "The first piece of your birthday surprise. Keep it safe. ♡",
  },
} as const;
