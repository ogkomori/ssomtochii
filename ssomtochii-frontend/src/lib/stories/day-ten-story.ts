import type { StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA } from "./speakers";
import { neutral, smiling, speaking, pose8Thinking, pose11SeriousConcerned, zaraNeutral, zaraHappy, zaraHappyDialogue, zaraThinking, zaraSurprised, placeCharacter } from "./character-poses";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

/** Day 10: Zara's charm and competitiveness show through in small ways. */
export const DAY_TEN_STORY: StoryDefinition = {
  title: "A Little Too Helpful",
  subtitle: "Day 10",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: together(neutral, zaraNeutral),
      text: "The next day, Somto catches up with Zara about the birthday plans. Whatever happened with the guest list, Zara has made it clear that she has opinions.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraHappyDialogue),
      text: "I've been thinking about your party all night. I have so many ideas. You're welcome, by the way.",
      next: 3,
    },
    {
      id: 3, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: together(pose8Thinking, zaraHappy),
      text: "I didn't ask you to lose sleep over my birthday.",
      next: 4,
    },
    {
      id: 4, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "And yet, here I am, saving you from a painfully ordinary party.",
      next: 5,
    },
    {
      id: 5, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: together(speaking, zaraThinking),
      text: "You know, some people might just say they want to help.",
      next: 6,
    },
    {
      id: 6, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraHappyDialogue),
      text: "Some people don't have my taste. Besides, you like that I say what I think.",
      next: 7,
    },
    {
      id: 7, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: together(smiling, zaraSurprised),
      text: "I like that you have confidence. That's not the same as letting you plan my entire birthday.",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraThinking),
      text: "Fair enough. Your birthday, your rules.",
      next: 9,
    },
    {
      id: 9, type: "end", scene: "character",
      characters: together(pose11SeriousConcerned, zaraHappy),
      text: "Zara laughs it off, and the conversation stays friendly. Still, Somto gets the feeling Zara enjoys being the person with the best idea a little too much.",
    },
  ],
};