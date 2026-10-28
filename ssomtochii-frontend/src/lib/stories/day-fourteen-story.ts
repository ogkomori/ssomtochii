import type { StoryDefinition } from "./types";
import { SOMTO } from "./speakers";
import { sitting, speaking, pose8Thinking, pose11SeriousConcerned, facepalm } from "./character-poses";

export const DAY_FOURTEEN_STORY: StoryDefinition = {
  title: "A Choice to Make", subtitle: "Day 14", startAt: 1,
  beats: [
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto's birthday venue has emailed again. They need her to come in person and confirm the final details today. If she leaves it too long, the space could be booked by someone else. Her thesis still needs hours of focused work, and the deadline is closing in.",
      next: 2
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "If I go, I'll lose a good chunk of the day. If I stay here, I might lose the venue. Why does everything have to happen at once?",
      next: 3
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "I need to decide what I'm willing to risk.",
      next: 4
    },
    {
      id: 4,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "Does Somto go confirm the birthday venue, or stay home and work on her thesis?",
      choices: [
      {
        id: "day14-confirm-venue",
        label: "Go confirm the venue and protect the party plans",
        next: 5,
      },
      {
        id: "day14-work-thesis",
        label: "Stay home and prioritise the thesis",
        next: 8,
      },
      ],
    },
    {
      id: 5,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [facepalm],
      text: "Somto heads out to confirm the venue. The visit takes longer than expected: she checks the layout, confirms the guest limit, and sorts out the final arrangements.",
      next: 6
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "At least the venue is secured. Now I have to make up for the hours I lost.",
      next: 7
    },
    {
      id: 7,
      type: "end",
      scene: "character",
      characters: [pose11SeriousConcerned],
      text: "By the time Somto gets home, the afternoon is gone. She opens her thesis and works into the evening, frustrated that the party has taken time she needed for her final corrections. The venue is safe, but her academic margin has shrunk."
    },
    {
      id: 8,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto stays home and works. She gets through several pages of corrections and finally feels the thesis moving forward, but the venue remains unconfirmed.",
      next: 9
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "I needed that progress. Please let the venue still be available when I call them.",
      next: 10
    },
    {
      id: 10,
      type: "end",
      scene: "character",
      characters: [pose11SeriousConcerned],
      text: "Somto contacts the venue before closing. They haven't given the space away yet, but they can't promise it will remain available without her confirmation. She has protected her thesis time for today, though the party plans are now hanging in the balance."
    },
  ],
};
