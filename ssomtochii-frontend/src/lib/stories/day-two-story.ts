import { facepalm, neutral, sitting, upwards } from "./character-poses";
import type { StoryDefinition } from "./types";
import { SOMTO, ALEXA } from "./speakers";

/** Day 2 story. Replace this starter beat with the story for Day 2. */
export const DAY_TWO_STORY: StoryDefinition = {
  title: "Day 2 Story",
  subtitle: "Day 2",
  startAt: 1,
  beats: [
    {
      id: 1,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [neutral],
      background: "/images/backgrounds/bedroom-at-night.png",
      text: "Alexa! What's the time?",
      next: 2,
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: ALEXA,
      characters: [upwards],
      text: "It's 2:03 AM.",
      next: 3,
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [neutral],
      text: "Ugh, I can't believe I stayed up this late.",
      next: 4,
    },
    {
      id: 4,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [sitting],
      text: "Alright. Time to get some sleep.",
      next: 5,
    },
    {
      id: 5,
      type: "incoming-call",
      callerName: "Melanie",
      next: 6,
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "Huh? Why on earth would she call me at this time?",
      next: 14,
    },
    {
      id: 14,
      type: "end",
      scene: "character",
      characters: [sitting],
      text: "The end of day 2",
    },
  ],
};
