import type { StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA } from "./speakers";
import { neutral, smiling, speaking, pose8Thinking, pose11SeriousConcerned, zaraNeutral, zaraHappy, zaraHappyDialogueAlone, zaraThinking, zaraSurprised, placeCharacter, behind, pose13ArmsCrossedAlone, facepalm, pose13ArmsCrossed, pose11SeriousConcernedAlone, pose10Explaining, pose7HappyDialogue, zaraHappyAlone } from "./character-poses";

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
  if (choice === "party-theme-green") return "I've gone with green for the theme. It's my favourite colour, so I want that to be the main look.";
  if (choice === "party-theme-gold") return "I've gone with gold for the theme. I want the whole thing to feel a little special.";
  if (choice === "party-theme-red") return "The theme is red. I've been told I look good in red, so I thought, why not make a whole party of it?";
  return "I'm still settling on the colour theme, but I've got a few ideas.";
};

const vipText = (choice: string | null) => {
  if (choice === "vip-alcohol-free") return "And I've asked them to keep the VIP section alcohol-free.";
  if (choice === "vip-alcohol-allowed") return "Alcohol is allowed in the VIP section too. I told them not to hold back there.";
  return "I still need to settle the VIP details.";
};

const dressCodeText = (choice: string | null) => {
  if (choice === "dress-code-glam") return "Dress code is dress to impress. It's my birthday, so I want everyone looking good!";
  if (choice === "dress-code-smart-casual") return "I've picked smart casual. I want everyone looking nice without being uncomfortable all night.";
  if (choice === "dress-code-no-pressure") return "There's no strict dress code. I want everyone to feel comfortable and come as themselves.";
  return "I haven't settled on a dress code yet.";
};

const musicText = (choice: string | null) => {
  if (choice === "music-afrobeats") return "Music-wise, it's Afrobeats all night. You know I love me some Wizkid.";
  if (choice === "music-mixed") return "For music, I've asked for a bit of everything. I want there to be something for everybody.";
  if (choice === "music-pop-rnb") return "I'm going with pop and R&B. That's more my kind of vibe.";
  return "I'm still deciding what sort of music I want.";
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
      characters: together(speaking, zaraThinking),
      text: "I do have some ideas of my own, you know.",
      next: 24
    },
    {
      id: 24,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraSurprised),
      text: "Oh? Go on then. What have you decided so far? What's the vibe for the day?",
      next: 25
    },
    {
      id: 25,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraNeutral),
      text: "I've gone with green for the theme. It's my favourite colour, so I want that to be the main look.",
      next: 26
    },
    {
      id: 26,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "Okay, green. I can already see how the pictures will look. And what's the dress code?",
      next: 27
    },
    {
      id: 27,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(speaking, zaraNeutral),
      text: "Dress code is dress to impress. It's my birthday, so I want everyone looking good!",
      next: 28
    },
    {
      id: 28,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "I like that. People need to make an effort. What are we listening to?",
      next: 29
    },
    {
      id: 29,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraThinking),
      text: "Music-wise, it's Afrobeats all night. You know I love me some Wizkid.",
      next: 30
    },
    {
      id: 30,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "Naturally. And what about the VIP section? Are you allowing alcohol?",
      next: 31
    },
    {
      id: 31,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(speaking, zaraNeutral),
      text: "And I've asked them to keep the VIP section alcohol-free.",
      next: 32
    },
    {
      id: 32,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "Interesting. Well, I've got plenty of ideas for how to bring all of this together.",
      next: 6
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappyDialogueAlone),
      text: "And I'm sure they're lovely. I'm only helping you make them better. You should be thanking me.",
      next: 7
    },
    {
      id: 7,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(smiling, zaraSurprised),
      text: "You have a gift for making help sound like an insult.",
      next: 8
    },
    {
      id: 8,
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: together(neutral, zaraHappy),
      text: "It's a gift. Anyway, I should go. Don't make any big decisions without thinking about my suggestions first.",
      next: 9
    },
    {
      id: 9,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [pose8Thinking],
      text: "Zara leaves after one last look around the room. Somto tidies up, ready to get back to her own plans, when something catches her eye. The little stand on her dresser is empty.",
      next: 10
    },
    {
      id: 10,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "Wait... where's my birthday tiara?",
      next: 11
    },
    {
      id: 11,
      type: "end",
      scene: "character",
      characters: [pose8Thinking],
      text: "Somto searches the dresser and the nearby drawers, but the tiara is nowhere to be found. She tries to remember the last time she saw it, then shakes her head. Zara had only been here a few minutes ago. Surely that doesn't mean anything... does it?"
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
      if (beat.id === 25 && beat.type === "dialogue") return { ...beat, text: themeText(dayTwoChoices.theme) };
      if (beat.id === 27 && beat.type === "dialogue") return { ...beat, text: dressCodeText(dayTwoChoices.dressCode) };
      if (beat.id === 29 && beat.type === "dialogue") return { ...beat, text: musicText(dayTwoChoices.music) };
      if (beat.id === 31 && beat.type === "dialogue") return { ...beat, text: vipText(dayTwoChoices.vip) };
      return beat;
    }),
  };
}
