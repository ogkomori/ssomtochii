import type { StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, TEGA, ZARA } from "./speakers";
import { neutral, sitting, speaking, smiling, pose8Thinking, pose11SeriousConcerned, pose12ConfidentStanding, pose13ArmsCrossed, zaraNeutral, zaraHappy, zaraHappyDialogueAlone, zaraThinking, zaraSurprised, placeCharacter } from "./character-poses";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

/** Day 15: Somto submits her thesis, then the birthday party begins. */
export const DAY_FIFTEEN_STORY: StoryDefinition = {
  title: "The Night Before",
  subtitle: "Day 15",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto checks the final file one last time. The deadline is tomorrow, her birthday, but she has worked ahead as much as she can. Today is her thesis presentation, and she is determined to get through it.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose8Thinking],
      text: "I've checked the references. I've checked the formatting. If I check them again, I might actually start seeing things.",
      next: 3,
    },
    {
      id: 3, type: "narration", scene: "character",
      background: "linear-gradient(180deg, #dce7e8 0%, #f7eee5 100%)",
      characters: [pose11SeriousConcerned],
      text: "At the presentation, Somto explains her work and answers the questions put to her. She is nervous, but she knows the project better than she thinks.",
      next: 4,
    },
    {
      id: 4, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose12ConfidentStanding],
      text: "The main finding is that the results support my conclusion, with a few limitations that I'd like to acknowledge rather than overstate.",
      next: 5,
    },
    {
      id: 5, type: "narration", scene: "character",
      characters: [smiling],
      text: "By the time it's over, Somto is exhausted. But she has done well. Melanie tells her the presentation was strong and that the final thesis is on track for a good result once the last submission checks are complete.",
      next: 6,
    },
    {
      id: 6, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "Wait. So I can stop assuming I've ruined my entire degree?",
      next: 7,
    },
    {
      id: 7, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [pose8Thinking],
      text: "She gets home, makes the final corrections, and submits the thesis ahead of the birthday deadline. When the confirmation appears, she just stares at it for a moment.",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:04" },
      characters: [], speaker: TEGA,
      text: "Baby? Did you submit it?",
      next: 9,
    },
    {
      id: 9, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "I submitted it. It's actually submitted. Nobody can ask me to change another comma tonight.",
      next: 10,
    },
    {
      id: 10, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:17" },
      characters: [], speaker: TEGA,
      text: "I'm so proud of you. Take a breath. You've earned tonight.",
      next: 11,
    },
    {
      id: 11, type: "narration", scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: [smiling],
      text: "The birthday celebration begins, and for a little while Somto lets herself enjoy it. Then Zara makes her entrance into the evening's drama.",
      next: 12,
    },
    {
      id: 12, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "Okay, everyone, I have to say, this place looks good. I did suggest a few things, you know.",
      next: 13,
    },
    {
      id: 13, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: together(pose8Thinking, zaraHappy),
      text: "You suggested a few things. You did not personally build the venue.",
      next: 14,
    },
    {
      id: 14, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "I'm just saying, people have taste. And some people know how to make an entrance.",
      next: 15,
    },
    {
      id: 15, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: together(pose13ArmsCrossed, zaraSurprised),
      text: "Zara, I invited people here to celebrate my birthday, not to watch you audition for the main character.",
      next: 16,
    },
    {
      id: 16, type: "dialogue", scene: "character", speaker: ZARA,
      characters: together(neutral, zaraThinking),
      text: "Wow. I was joking. You don't have to make everything a competition.",
      next: 17,
    },
    {
      id: 17, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: together(pose13ArmsCrossed, zaraNeutral),
      text: "Then don't make my birthday about you.",
      next: 18,
    },
    {
      id: 18, type: "end", scene: "character",
      characters: together(pose11SeriousConcerned, zaraNeutral),
      text: "The tension settles over the party. Somto has finally stood up for herself, but she doesn't want a fight to be the memory she takes away from tonight.",
    },
  ],
};