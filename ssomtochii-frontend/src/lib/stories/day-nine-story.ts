import type { StoryCharacter, StoryDefinition } from "./types";
import {
  placeCharacter,
  smiling,
  neutral,
  speaking,
  pose8Thinking,
  pose11SeriousConcerned,
  zaraNeutral,
  zaraHappy,
  zaraSad,
  zaraHappyDialogueAlone,
  zaraThinking,
  zaraExplaining,
  zaraSurprised,
} from "./character-poses";
import { SOMTO, ZARA } from "./speakers";

export type PartySizeChoice = "party-size-10-pay-extra" | "party-size-5-total";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

const DAY_NINE_LARGE_PARTY_STORY: StoryDefinition = {
  title: "A Small Favour",
  subtitle: "Day 9",
  startAt: 1,
  beats: [
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: together(neutral, zaraNeutral),
      text: "The next day, Zara catches Somto between tasks and asks how the birthday plans are coming along.",
      next: 2,
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "So, birthday girl. Have the plans started coming together yet?",
      next: 3,
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose8Thinking, zaraNeutral),
      text: "Mostly. The venue has a booking for ten, but I only have six people confirmed. If I can't fill the other places, I'd have to pay for them myself.",
      next: 4,
    },
    {
      id: 4,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraThinking),
      text: "And how much is each place?",
      next: 5,
    },
    {
      id: 5,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(speaking, zaraNeutral),
      text: "Fifty euros. I can manage some of it, but paying for empty places feels ridiculous.",
      next: 6,
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "Then let me help you cover the gap. It's your birthday, not a financial stress test.",
      next: 7,
    },
    {
      id: 7,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraHappy),
      text: "Are you sure? I don't want you to feel like you have to.",
      next: 8,
    },
    {
      id: 8,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraExplaining),
      text: "I'm sure. But if I'm helping, let me help make the party amazing too. I know a place, I know a DJ, and I could bring a few people who'd make the night unforgettable.",
      next: 9,
    },
    {
      id: 9,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose8Thinking, zaraHappy),
      text: "That's generous of her. But if I accept, I might have to share control of the plans. What should I do?",
      choices: [
        { id: "zara-money-accept-influence", label: "Let Zara help shape the party", next: 10 },
        { id: "zara-money-boundary", label: "Accept the help, but keep the final say", next: 12 },
      ],
    },
    {
      id: 10,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraHappy),
      text: "Okay. Help me make it amazing, then. Just promise me we'll still make it feel like my birthday.",
      next: 11,
    },
    {
      id: 11,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "Obviously! Leave it to me. You're going to love what I come up with.",
      next: 13,
    },
    {
      id: 12,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(speaking, zaraNeutral),
      text: "I'd really appreciate the help. But I want to make the final decisions about my own birthday, okay?",
      next: 14,
    },
    {
      id: 14,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraThinking),
      text: "Of course, babe. It's your birthday. I'll just be your very expensive support system.",
      next: 13,
    },
    {
      id: 13,
      type: "end",
      scene: "character",
      characters: together(smiling, zaraHappy),
      text: "Zara is happy to help. Somto is grateful, though she wonders how much influence the favour will bring with it.",
    },
  ],
};

const DAY_NINE_SMALL_PARTY_STORY: StoryDefinition = {
  title: "The Smaller List",
  subtitle: "Day 9",
  startAt: 101,
  beats: [
    {
      id: 101,
      type: "narration",
      scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: together(neutral, zaraNeutral),
      text: "The next day, Zara catches Somto between tasks and asks about the birthday plans. Somto has reduced the booking to five people, which means she has to decide what to do about her newest invitation.",
      next: 102,
    },
    {
      id: 102,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "So, are we still celebrating together? I've been thinking about what I could wear.",
      next: 103,
    },
    {
      id: 103,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose8Thinking, zaraNeutral),
      text: "I had to reduce the booking to five people. I already had my original list before I invited you, so now I have to decide whether to change that list or tell you I'm sorry.",
      next: 104,
    },
    {
      id: 104,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose8Thinking, zaraThinking),
      text: "I do want Zara there. But I also don't want my birthday to become something I didn't plan. What should I do?",
      choices: [
        { id: "zara-keep-small-party", label: "Keep Zara and rethink the guest list", next: 105 },
        { id: "zara-uninvite-small-party", label: "Stick with my original five and uninvite Zara", next: 108 },
      ],
    },
    {
      id: 105,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraSurprised),
      text: "I want you there, Zara. I'll work out the guest list, but I need you to understand this is still my birthday.",
      next: 106,
    },
    {
      id: 106,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "Of course, babe! I can be chill. Mostly.",
      next: 107,
    },
    {
      id: 107,
      type: "end",
      scene: "character",
      characters: together(pose8Thinking, zaraHappy),
      text: "Somto keeps Zara on the list. She's glad to have her friend there, but she'll have to decide which of the original guests to leave out—and keep an eye on Zara's tendency to take over.",
    },
    {
      id: 108,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose11SeriousConcerned, zaraNeutral),
      text: "I'm sorry, Zara. The smaller booking means I have to stick with my original list. I shouldn't have invited you before I knew what I could afford.",
      next: 109,
    },
    {
      id: 109,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraSad),
      text: "Oh. Right. No, it's okay. I understand.",
      next: 110,
    },
    {
      id: 110,
      type: "end",
      scene: "character",
      characters: together(pose11SeriousConcerned, zaraSad),
      text: "Zara says it's fine, but her smile doesn't quite reach her eyes. Somto knows the decision may have changed their friendship.",
    },
  ],
};

/** Choose Day 9's scene based on the guest-count decision from Day 8. */
export function getDayNineStory(choice: PartySizeChoice | null): StoryDefinition {
  return choice === "party-size-10-pay-extra" ? DAY_NINE_LARGE_PARTY_STORY : DAY_NINE_SMALL_PARTY_STORY;
}

/** Default when Day 9 is opened without a saved Day 8 decision. */
export const DAY_NINE_STORY = DAY_NINE_SMALL_PARTY_STORY;
