import { facepalm, sitting } from "./character-poses";
import type { StoryDefinition } from "./types";
import { SOMTO } from "./speakers";

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
      characters: [facepalm],
      background: "/images/backgrounds/bedroom-at-night.png",
      text: "I'm so tired, I can't believe I stayed up this late.",
      next: 2,
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [sitting],
      text: "Alright. Time to get some sleep.",
      next: 3,
    },
    {
      id: 3,
      type: "incoming-call",
      callerName: "Melanie",
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
