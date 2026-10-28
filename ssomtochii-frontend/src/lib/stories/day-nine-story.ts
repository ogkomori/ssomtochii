import type { StoryCharacter, StoryDefinition } from "./types";
import {
  placeCharacter,
  neutral,
  smiling,
  pose8Thinking,
  pose11SeriousConcerned,
  zaraNeutral,
  zaraHappy,
  zaraSad,
  zaraHappyDialogueAlone,
  zaraThinking,
  zaraSurprised,
} from "./character-poses";
import { SOMTO, ZARA } from "./speakers";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

export const DAY_NINE_STORY: StoryDefinition = {
  title: "The Smaller List",
  subtitle: "Day 9",
  startAt: 1,
  beats: [
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: together(neutral, zaraNeutral),
      text: "Somto sits with the guest list in front of her, going over the names one last time. With the venue change leaving room for only five guests, inviting Zara means someone else has to go. She pauses at Zara's name, wondering whether letting her into the party is worth the risk.",
      next: 2,
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "So, are we still celebrating together? I've been thinking about what I could wear.",
      next: 3,
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose8Thinking, zaraNeutral),
      text: "I had to reduce the booking to five people. I already had my original list before I invited you, so now I have to decide whether to change that list or tell you I'm sorry.",
      next: 4,
    },
    {
      id: 4,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose8Thinking, zaraThinking),
      text: "I do want Zara there. But I also don't want my birthday to become something I didn't plan. What should I do?",
      choices: [
        { id: "zara-keep-small-party", label: "Keep Zara and rethink the guest list", next: 5 },
        { id: "zara-uninvite-small-party", label: "Stick with my original five and uninvite Zara", next: 8 },
      ],
    },
    {
      id: 5,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraSurprised),
      text: "I want you there, Zara. I'll work out the guest list, but I need you to understand this is still my birthday.",
      next: 6,
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "Of course, babe! I can be chill. Mostly.",
      next: 7,
    },
    {
      id: 7,
      type: "end",
      scene: "character",
      characters: together(pose8Thinking, zaraHappy),
      text: "Somto keeps Zara on the list. She's glad to have her friend there, but she'll have to decide which of the original guests to leave out—and keep an eye on Zara's tendency to take over.",
    },
    {
      id: 8,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose11SeriousConcerned, zaraNeutral),
      text: "I'm sorry, Zara. The smaller booking means I have to stick with my original list. I shouldn't have invited you before I knew what I could afford.",
      next: 9,
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraSad),
      text: "Oh. Right. No, it's okay. I understand.",
      next: 10,
    },
    {
      id: 10,
      type: "end",
      scene: "character",
      characters: together(pose11SeriousConcerned, zaraSad),
      text: "Zara says it's fine, but her smile doesn't quite reach her eyes. Somto knows the decision may have changed their friendship.",
    },
  ],
};

