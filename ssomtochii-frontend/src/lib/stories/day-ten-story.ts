import type { StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA } from "./speakers";
import { neutral, smiling, speaking, pose8Thinking, pose11SeriousConcerned, zaraNeutral, zaraHappy, zaraHappyDialogue, zaraHappyDialogueAlone, zaraThinking, zaraSurprised, placeCharacter, behind, pose13ArmsCrossedAlone, facepalm, pose13ArmsCrossed, pose11SeriousConcernedAlone, pose10Explaining, pose7HappyDialogue, zaraHappyAlone, pose10ExplainingAlone, pose12ConfidentStanding, zaraExplainingAlone, zaraLaughing, upwards } from "./character-poses";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

export interface DayTwoPartyChoices {
  theme: string | null;
  vip: string | null;
  dressCode: string | null;
  music: string | null;
}

const themeText = (choice: string | null) => {
  if (choice === "party-theme-green") return "The green theme";
  if (choice === "party-theme-gold") return "The gold theme";
  if (choice === "party-theme-red") return "The red theme";
  return "The undecided theme";
};

const vipText = (choice: string | null) => {
  if (choice === "vip-alcohol-free") return "she wants the VIP section to be alcohol-free";
  if (choice === "vip-alcohol-allowed") return "there will be alcohol in the VIP section";
  return "she's still deciding on the VIP-section details";
};

const dressCodeText = (choice: string | null) => {
  if (choice === "dress-code-glam") return "the glam dress code";
  if (choice === "dress-code-smart-casual") return "the smart-casual dress code";
  if (choice === "dress-code-no-pressure") return "no pressure on the dress code";
  return "a dress code she's still deciding on";
};

const musicText = (choice: string | null) => {
  if (choice === "music-afrobeats") return "an afrobeats vibe";
  if (choice === "music-mixed") return "a mix of music so there's something for everybody";
  if (choice === "music-pop-rnb") return "a pop and R&B vibe";
  return "no specific music preferences";
};

/** Day 10 reflects the Day 2 party choices and the Day 9 guest-list decision. */
export const DAY_TEN_STORY: StoryDefinition = {
  title: "A Little Too Helpful",
  subtitle: "Day 10",
  startAt: 0,
  beats: [
    {
      id: 0,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom-at-night.png",
      characters: [neutral],
      text: "Later that evening, someone knocks at Somto's door.",
      next: 1
    },
    {
      id: 1,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [behind],
      text: "Who is it?",
      next: 20
    },
    {
      id: 20,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [behind],
      text: "It's me, Zara! Open up!",
      next: 21
    },
    {
      id: 21,
      type: "narration",
      scene: "character",
      characters: [facepalm],
      text: "\"What could this girl POSSIBLY want?\" Somto thinks to herself.",
      next: 22
    },
    {
      id: 22,
      type: "narration",
      scene: "character",
      characters: [zaraHappyAlone],
      text: "She opens the door and Zara steps inside, looking around the room.",
      next: 23
    },
    {
      id: 23,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcernedAlone],
      text: "Zara? What are you doing here?",
      next: 2
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraHappyDialogueAlone],
      text: "I've been thinking about your birthday all day! Come on, we need to talk about the plans.",
      next: 3
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose7HappyDialogue, zaraNeutral),
      text: "Oh, wow. You came all the way here at this time to discuss my party?",
      next: 4
    },
    {
      id: 4,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraHappyDialogueAlone],
      text: "The venue, the pictures, the music. Those little details are what separate a memorable party from one people forget by Monday.",
      next: 5
    },
    {
      id: 5,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose10ExplainingAlone],
      text: "I do have some ideas of my own, you know.",
      next: 24
    },
    {
      id: 24,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(pose12ConfidentStanding, zaraHappyDialogue),
      text: "Oh? Go on then. What have you decided so far? What's the vibe for the day?",
      next: 25
    },
    {
      id: 25,
      type: "narration",
      scene: "character",
      characters: together(pose7HappyDialogue, zaraNeutral),
      text: "Somto fills Zara in on the plans for the day. " + themeText(null) + " " + dressCodeText(null) + " " + musicText(null) + " " + vipText(null),
      next: 6
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraExplainingAlone],
      text: "Mhmm. Sure. Yeah. Or, you could do it this way...",
      next: 7
    },
    {
      id: 7,
      type: "narration",
      scene: "character",
      characters: together(pose13ArmsCrossed, zaraHappyDialogue),
      text: "Zara starts rambling about her own ideas for the party, and Somto listens politely, but she can't help but feel a little overwhelmed. Zara's suggestions are good, but they don't quite fit with what Somto had in mind.",
      next: 8
    },
    {
      id: 8,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose10ExplainingAlone],
      text: "Hmm. I hear you. I'll definitely take your advice into consideration.",
      next: 9
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(pose12ConfidentStanding, zaraLaughing),
      text: "You better! I want this party to be unforgettable. And I know you do too. Goodnight, Somto!",
      next: 10
    },
    {
      id: 10,
      type: "narration",
      scene: "character",
      characters: [behind],
      text: "Zara leaves after one last look around the room.",
      next: 15
    },
    {
      id: 15,
      type: "narration",
      scene: "character",
      characters: [neutral],
      text: "Somto tidies up, ready to get back to her own plans for the party.",
      next: 11
    },
    {
      id: 11,
      type: "narration",
      scene: "character",
      characters: [upwards],
      text: "All of a sudden, something catches her eye. The little stand on her dresser is empty. Her birthday tiara is gone.",
      next: 12
    },
    {
      id: 12,
      type: "end",
      scene: "character",
      characters: [facepalm],
      text: "Somto realizes that Zara has stolen her birthday tiara. She can't believe it. She had trusted Zara, and now she feels betrayed.",
    },
  ],
};

/** The Day 9 guest-list choice and Day 2 preferences shape Zara's conversation. */
export function getDayTenStory(
  dayNineInviteChoice: string | null,
  dayTwoChoices: DayTwoPartyChoices,
): StoryDefinition {
  const invited = dayNineInviteChoice === "invite-zara";
  return {
    ...DAY_TEN_STORY,
    beats: DAY_TEN_STORY.beats.map((beat) => {
      if (beat.id === 2 && beat.type === "dialogue") return {
        ...beat,
        text: invited
          ? "I've been thinking about our party all day! Come on, we need to talk about the plans."
          : "I know I'm not invited to your birthday anymore, but I still want to help you plan it! Someone has to make sure the party isn't ordinary.",
      };
      if (beat.id === 4 && beat.type === "dialogue") return {
        ...beat,
        text: invited
          ? "Yes girl! The new venue, the pictures, the music. I already have ideas for all of it. Honestly, people will be talking about this party for weeks."
          : "I won't even be there, but I can still help you make it memorable. The venue, the pictures, the music. You'd be silly to turn down my advice.",
      };
      if (beat.id === 25 && beat.type === "narration") return {
        ...beat,
        text: "Somto fills Zara in on the plans for the day. "
          + themeText(dayTwoChoices.theme) + ", "
          + dressCodeText(dayTwoChoices.dressCode) + ", and "
          + musicText(dayTwoChoices.music) + ". And of course, "
          + vipText(dayTwoChoices.vip) + ".",
      };
      return beat;
    }),
  };
}
