import { facepalm, sitting, smiling } from "./character-poses";
import type { StoryDefinition } from "./types";

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
      speakerId: "somto",
      speakerLabel: "Somto",
      characters: [facepalm],
      background: "/images/backgrounds/bedroom-at-night.png",
      text: "I'm so tired, I can't believe I stayed up this late.",
      next: 2,
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speakerId: "somto",
      speakerLabel: "Somto",
      characters: [sitting],
      text: "Alright. Time to get some sleep.",
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
