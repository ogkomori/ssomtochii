import type { StoryDefinition } from "./types";
import { SOMTO, TEGA, ZARA } from "./speakers";
import { neutral, sitting, speaking, smiling, pose8Thinking, pose11SeriousConcerned, facepalm, zaraNeutral, zaraHappy, zaraHappyDialogue, zaraThinking, zaraSurprised } from "./character-poses";

/** Day 13: Somto gets through the work with help from people who care. */
export const DAY_THIRTEEN_STORY: StoryDefinition = {
  title: "One Step at a Time",
  subtitle: "Day 13",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "The next day is mostly thesis work: notes, revisions, and a laptop that has been open for far too long. Somto is tired enough to start doubting paragraphs she was happy with yesterday.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [facepalm],
      text: "I've read this section so many times that the words have stopped looking like words.",
      next: 3,
    },
    {
      id: 3, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:04" },
      characters: [], speaker: TEGA,
      text: "Have you eaten anything that wasn't a snack beside your laptop?",
      next: 4,
    },
    {
      id: 4, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [neutral],
      text: "I don't appreciate this line of questioning.",
      next: 5,
    },
    {
      id: 5, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:12" },
      characters: [], speaker: TEGA,
      text: "So that's a no. Please take a break, baby. Rest is not academic misconduct.",
      next: 6,
    },
    {
      id: 6, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "Fine. Ten minutes. And I'm not admitting you were right.",
      next: 7,
    },
    {
      id: 7, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "A little later, Somto returns to her work. The messages from people checking on her are small things, but they make the room feel less lonely.",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "character", speaker: ZARA,
      characters: [neutral, zaraHappyDialogue],
      text: "How's the thesis panic going? And the party? Tell me you haven't let the whole thing become boring.",
      next: 9,
    },
    {
      id: 9, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose8Thinking, zaraHappy],
      text: "I'm trying to keep both alive. The thesis is the priority, so I might need people to be patient with me.",
      next: 10,
    },
    {
      id: 10, type: "dialogue", scene: "character", speaker: ZARA,
      characters: [neutral, zaraThinking],
      text: "Of course. I can handle the party details. Honestly, everyone will be asking me for the plan anyway.",
      next: 11,
    },
    {
      id: 11, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [speaking, zaraSurprised],
      text: "They can ask me. It's my birthday.",
      next: 12,
    },
    {
      id: 12, type: "dialogue", scene: "character", speaker: ZARA,
      characters: [neutral, zaraHappy],
      text: "Relax, I'm joking. Mostly.",
      next: 13,
    },
    {
      id: 13, type: "end", scene: "character",
      characters: [pose11SeriousConcerned, zaraHappy],
      text: "The exchange ends on a laugh, but Somto doesn't forget the feeling that Zara wants to be in charge. She turns back to her thesis, choosing not to spend the evening arguing about it.",
    },
  ],
};