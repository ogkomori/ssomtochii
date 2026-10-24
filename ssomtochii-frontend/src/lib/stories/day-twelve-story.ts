import type { StoryDefinition } from "./types";
import { SOMTO, TEGA } from "./speakers";
import { neutral, pose8Thinking, pose11SeriousConcerned, sitting, speaking, smiling } from "./character-poses";

/** Day 12: Somto accepts that one birthday plan has to give. */
export const DAY_TWELVE_STORY: StoryDefinition = {
  title: "Something Has to Give",
  subtitle: "Day 12",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto lays out her thesis notes beside the birthday plans. She can keep trying to do everything, or she can be honest about the time she has left.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose8Thinking],
      text: "If I leave everything until the last minute, neither the thesis nor the birthday is going to be what I want.",
      next: 3,
    },
    {
      id: 3, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:05" },
      characters: [], speaker: TEGA,
      text: "So what are you thinking, baby?",
      next: 4,
    },
    {
      id: 4, type: "choice", scene: "character", speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "There was one little birthday plan I was especially excited about doing with Tega. I think I need to give it up for now and use that time to finish the thesis. How do I tell him?",
      choices: [
        { id: "day12-honest", label: "Tell him honestly that I'm disappointed", next: 5 },
        { id: "day12-downplay", label: "Play it down so he doesn't worry", next: 7 },
      ],
    },
    {
      id: 5, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [speaking],
      text: "I wanted us to have that time together, and I'm sad we have to move it. I know the thesis comes first right now, but I'm allowed to be disappointed too.",
      next: 6,
    },
    {
      id: 6, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:17" },
      characters: [], speaker: TEGA,
      text: "Of course you are. I wanted it too. But this is a delay, not a cancellation. Let's get you through this week, and we'll find our moment.",
      next: 9,
    },
    {
      id: 7, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "It's fine. I'll just move the plan. The thesis needs me more right now.",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:17" },
      characters: [], speaker: TEGA,
      text: "You don't have to make it sound like it means nothing. I know you were looking forward to it. I'm proud of you for making the hard call, baby.",
      next: 9,
    },
    {
      id: 9, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "Okay. One sacrifice. Not the whole birthday. I'm holding you to that.",
      next: 10,
    },
    {
      id: 10, type: "end", scene: "character",
      characters: [pose8Thinking],
      text: "The plan is postponed, not lost. Somto turns back to her work with a little less guilt and a clearer idea of what matters first.",
    },
  ],
};