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
      {
        text: "We met in JMC and we were admitted in 2016",
        feedback: "The JMC and 2016 connection is a cute guess, but that isn't the reason I picked this countdown. ♡",
      },
      {
        text: "We were 16 the first time we got together",
        feedback: "That would make a lovely story, wouldn't it? But the number 16 came from something a little more cinematic.",
      },
      {
        text: "The Final 16 Minutes of High School Musical 3",
        feedback: "YESSS, you got it! It's a nod to the final 16 minutes of High School Musical 3. You know me too well. ♡",
      },
      {
        text: "Our birthdays are 16 weeks apart",
        feedback: "The birthday maths was tempting, I'll give you that — but this one is actually a High School Musical 3 reference.",
      },
      {
        text: "It was just random",
        feedback: "You really thought I'd choose 16 days for no reason? 😭 There's a High School Musical 3 reference behind it.",
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
