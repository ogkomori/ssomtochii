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
  zaraSurprisedAlone,
  behind,
  pose10Explaining,
  pose10ExplainingAlone,
  zaraLaughing,
  pose1Neutral,
  pose3ShyAlone,
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
      background: "/images/backgrounds/lab.jpg",
      characters: [neutral],
      text: "At work the next day, Somto sits with the guest list in front of her, going over the names one last time. With the venue change leaving room for only five guests, inviting Zara means someone else has to go. She pauses at Zara's name, wondering whether letting her into the party is worth the risk.",
      next: 2,
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [behind],
      text: "Is that my newest frienddd?",
      next: 3,
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraHappyDialogueAlone],
      text: "Hey, Somto! I see you're locked in! I really enjoyed our coffee meetup you know. Funny enough, I was actually thinking about your birthday party eariler...",
      next: 4,
    },
    {
      id: 4,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose10Explaining, zaraNeutral),
      text: "Yeah, about the party...",
      next: 5,
    },
    {
      id: 5,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraThinking],
      text: "What about it?",
      next: 6,
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose10ExplainingAlone],
      text: "Due to some complications apparently, the venue can only accommodate five guests, and you were my sixth choice, so I have to remove someone from the list now.",
      next: 7,
    },
    {
      id: 7,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(pose1Neutral, zaraLaughing),
      text: "Oh, that's a shame. I already feel bad for the person who has to leave, haha!",
      next: 8,
    },
    {
      id: 8,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose3ShyAlone],
      text: "Umm...",
      next: 9,
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraSurprisedAlone],
      text: "What? Don't tell me you're thinking of removing me?!",
      next: 10,
    },
    {
      id: 10,
      type: "choice",
      scene: "character",
      characters: [pose8Thinking],
      text: "Somto has to make a choice now. Does she invite Zara to the party, or remove her from the guest list?",
      choices: [
      ],
    }
  ],
};

