import type { StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA } from "./speakers";
import { neutral, smiling, speaking, pose8Thinking, pose11SeriousConcerned, zaraNeutral, zaraHappy, zaraHappyDialogueAlone, zaraThinking, zaraSurprised, placeCharacter } from "./character-poses";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

export const DAY_TEN_STORY: StoryDefinition = {
  title: "A Little Too Helpful",
  subtitle: "Day 10",
  startAt: 1,
  beats: [
    { id: 1, type: "narration", scene: "character", background: "/images/backgrounds/bedroom.png", characters: [neutral], text: "It's late that evening when someone knocks at Somto's door. She opens it to find Zara, who says she only wants to talk through the birthday plans for a few minutes.", next: 2 },
    { id: 2, type: "dialogue", scene: "character", speaker: ZARA, characters: together(neutral, zaraHappyDialogueAlone), text: "I've been thinking about your birthday all day. Come on, let me in. We need to talk about the plans.", next: 3 },
    { id: 3, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(pose8Thinking, zaraHappy), text: "You came all the way here at this time to discuss a party?", next: 4 },
    { id: 4, type: "dialogue", scene: "character", speaker: ZARA, characters: together(neutral, zaraHappy), text: "The venue, the pictures, the music. Those little details are what separate a memorable party from one people forget by Monday.", next: 5 },
    { id: 5, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(speaking, zaraThinking), text: "I do have some ideas of my own, you know.", next: 6 },
    { id: 6, type: "dialogue", scene: "character", speaker: ZARA, characters: together(neutral, zaraHappyDialogueAlone), text: "And I'm sure they're lovely. I'm only helping you make them better. You should be thanking me.", next: 7 },
    { id: 7, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(smiling, zaraSurprised), text: "You have a gift for making help sound like an insult.", next: 8 },
    { id: 8, type: "dialogue", scene: "character", speaker: ZARA, characters: together(neutral, zaraHappy), text: "It's a gift. Anyway, I should go. Don't make any big decisions without thinking about my suggestions first.", next: 9 },
    { id: 9, type: "narration", scene: "character", background: "/images/backgrounds/bedroom.png", characters: [pose8Thinking], text: "Zara leaves after one last look around the room. Somto tidies up, ready to get back to her own plans, when something catches her eye. The little stand on her dresser is empty.", next: 10 },
    { id: 10, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose11SeriousConcerned], text: "Wait... where's my birthday tiara?", next: 11 },
    { id: 11, type: "end", scene: "character", characters: [pose8Thinking], text: "Somto searches the dresser and the nearby drawers, but the tiara is nowhere to be found. She tries to remember the last time she saw it, then shakes her head. Zara had only been here a few minutes ago. Surely that doesn't mean anything... does it?" },
  ],
};

/** The Day 9 guest-list choice changes how Zara frames her late-night visit. */
export function getDayTenStory(dayNineInviteChoice: string | null): StoryDefinition {
  const invited = dayNineInviteChoice === "invite-zara";
  return {
    ...DAY_TEN_STORY,
    beats: DAY_TEN_STORY.beats.map((beat) => {
      if (beat.id === 2 && beat.type === "dialogue") return { ...beat, text: invited
        ? "I've been thinking about our party all day. Come on, let me in. We need to talk about the plans."
        : "I know I'm not on the guest list, but I'm still happy to help you plan. Someone has to make sure the party isn't ordinary. Come on, let me in." };
      if (beat.id === 4 && beat.type === "dialogue") return { ...beat, text: invited
        ? "The venue, the pictures, the music. I already have ideas for all of it. Honestly, people will be talking about this party for weeks."
        : "I won't even be there, but I can still help you make it memorable. The venue, the pictures, the music. You'd be silly to turn down my advice." };
      return beat;
    }),
  };
}
