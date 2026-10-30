import type { StoryBeat, StoryDefinition } from "./types";
import { SOMTO, TEGA, ALEXA } from "./speakers";
import { sitting, smiling, facepalm, upwards, neutral, speaking, behind } from "./character-poses";

const BASE_DAY_TWELVE_STORY: StoryDefinition = {
  title: "One Thing After Another", subtitle: "Day 12", startAt: 1,
  beats: [
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto has been sitting at her desk for about 30 minutes, staring into space. She has been trying to figure out what to do about the tiara, but her mind keeps wandering back to the thesis deadline.",
      next: 2
    },
    {
      id: 2,
      type: "dialogue",
      scene: "character",
      characters: [upwards],
      speaker: SOMTO,
      text: "You know what? I'm just going to focus on my thesis for the rest of the day. The tiara can wait. This is my future I'm dealing with here.",
      next: 3
    },
    {
      id: 3,
      type: "narration",
      scene: "character",
      characters: [neutral],
      text: "And so it begins. We haven't seen Somto this locked in since she was studying for WAEC. Hours and hours of intense focus, genuinely impressive. She's so intelligent, hardworking, beautiful... sorry I'm getting carried away. Back to the story.",
      next: 4
    },
    {
      id: 4,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom-at-night.png",
      characters: [neutral],
      text: "Well would you look at that. Looks like I'm not the only one who got carried away. Somto has been at her desk for hours, and it's now dark outside. She has been working on her thesis for so long that she hasn't even noticed the time passing. She hasn't even eaten.",
      next: 5
    },
    {
      id: 5,
      type: "dialogue",
      scene: "character",
      characters: [upwards],
      speaker: SOMTO,
      text: "Alexa, what time is it?",
      next: 6
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      characters: [neutral],
      speaker: ALEXA,
      text: "It's 11:30 PM.",
      next: 7
    },
    {
      id: 7,
      type: "dialogue",
      scene: "character",
      characters: [upwards],
      speaker: SOMTO,
      text: "Chai. Sha, I've made some progress on this thesis finally. It's not enough but I can continue it later. Alexa, call Tega.",
      next: 8
    },
    {
      id: 8,
      type: "outgoing-call",
      callerName: "Tega",
      narration: "Somto calls Tega, planning to update him on her thesis progress and to ask for his help with the tiara.",
      next: 9
    },
    {
      id: 9,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:00" },
      speaker: TEGA,
      text: "If it isn't my favorite person in the world! How are you doing my love?",
      next: 10
    },
    {
      id: 10,
      type: "dialogue",
      scene: "character",
      characters: [facepalm],
      speaker: SOMTO,
      text: "I'm not very good to be honest. I have been working on my thesis for so many hours and I haven't even eaten. I feel like I'm going to pass out.",
      next: 11
    },
    {
      id: 11,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:06" },
      speaker: TEGA,
      text: "Oh, sorry baby. Don't worry, some sushi is on the way to you right now.",
      next: 12
    },
    {
      id: 12,
      type: "dialogue",
      scene: "character",
      characters: [smiling],
      speaker: SOMTO,
      text: "Awww, thanks baby!",
      next: 13
    },
  ],
};


/** Day 12 adapts Tega's thesis conversation to Somto's honesty on Day 7. */
export function getDayTwelveStory(daySevenThesisChoice: string | null): StoryDefinition {
  const liedOnDaySeven =
    daySevenThesisChoice === "day7-thesis-double-down" ||
    daySevenThesisChoice === "day7-thesis-lie-now";

  const addedBeats: StoryBeat[] = [
    {
      id: 13,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:12" },
      speaker: TEGA,
      text: "By the way, why have you been studying for so long? What happened?",
      next: 14,
    },
    {
      id: 14,
      type: "dialogue",
      scene: "character",
      characters: [speaking],
      speaker: SOMTO,
      text: "Melanie moved the thesis deadline back. It's now on my birthday, so I've been trying to make up for all the time I've lost. I didn't even realise how late it got.",
      next: 15,
    },
    {
      id: 15,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:24" },
      speaker: TEGA,
      text: liedOnDaySeven
        ? "Wait, I'm confused, baby. If you'd already been working on your thesis, why did you need to spend the entire day catching up? You should have made some progress by now. Unless this was a panic attempt to cover some ground, which would mean you weren't honest with me before."
        : "Oh, baby. That must be awful, especially when you know you haven't been working on it the way you wanted to. I can understand why you felt you had to spend the whole day trying to catch up. That's a lot to carry at once.",
      next: 16,
    },
    {
      id: 16,
      type: "dialogue",
      scene: "character",
      characters: [facepalm],
      speaker: SOMTO,
      text: liedOnDaySeven
        ? "Okay fine. The truth is that I hadn't been working on it like I said I was. I panicked and lied because I didn't want you to worry or think I wasn't taking my future seriously."
        : "I know. I kept putting it off, and now I'm paying for it. I hate that I let it get this far, but I can't change what I did. I can only try to make the best of the time I've got left.",
      next: 17,
    },
    {
      id: 17,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:38" },
      speaker: TEGA,
      text: liedOnDaySeven
        ? "Hmm. Well I hope lying to me isn't going to become regular, but I'm glad you told me now. You don't have to pretend everything is fine with me. I'd rather know the truth so I can support you any way I can."
        : "I know you're disappointed in yourself, but beating yourself up won't give you those hours back. Make a plan and take it one step at a time. And please remember you can talk to me when things get overwhelming.",
      next: 18,
    },
    {
      id: 18,
      type: "narration",
      scene: "character",
      characters: [speaking],
      text: "Somto takes a breath, grateful that Tega is listening. Then she remembers why she'd called him in the first place. The night Zara visited. She tells him how it all went down.",
      next: 19,
    },
    {
      id: 19,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:01:02" },
      speaker: TEGA,
      text: "Well I'll be damned. This is one shady lady. You definitely need to confront her.",
      next: 20,
    },
    {
      id: 20,
      type: "dialogue",
      scene: "character",
      characters: [speaking],
      speaker: SOMTO,
      text: "I don't even know how to approach her. Part of me wants to go straight to her and demand to know what she did. But if I come at her aggressively, she'll probably cause a scene. I don't know whether to be calm or let her know how angry I am.",
      next: 21,
    },
    {
      id: 21,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:01:18" },
      speaker: TEGA,
      text: "You know that normally I'm a pacifist, but here I can't say. You know how you feel sha, so just try to be clear about what happened and why you're asking. You deserve an answer.",
      next: 22,
    },
    {
      id: 22,
      type: "narration",
      scene: "character",
      characters: [behind],
      text: "Before Somto can reply, there's a knock on her door. Her sushi has arrived at last.",
      next: 23,
    },
    {
      id: 23,
      type: "dialogue",
      scene: "character",
      characters: [smiling],
      speaker: SOMTO,
      text: "My sushi is here! Thank you for listening to me, babe. I feel a little better now.",
      next: 24,
    },
    {
      id: 24,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:01:36" },
      speaker: TEGA,
      text: "Only a little? Chai. Sha, no worries. Eat, get some rest, and don't try to solve everything tonight. We'll talk tomorrow, okay? Goodnight, my love.",
      next: 25,
    },
    {
      id: 25,
      type: "dialogue",
      scene: "character",
      characters: [smiling],
      speaker: SOMTO,
      text: "Goodnight, baby. Love you.",
      next: 26,
    },
    {
      id: 26,
      type: "end",
      scene: "character",
      background: "/images/backgrounds/bedroom-at-night.png",
      characters: [sitting],
      text: "Somto ends the call and settles down to eat her sushi. Tomorrow, she'll speak to Zara about the tiara. She still doesn't know how the conversation will go, but at least she's decided not to keep avoiding it.",
    },
  ];

  const beats = BASE_DAY_TWELVE_STORY.beats.map((beat) =>
    beat.id === 12 ? { ...beat, next: 13 } : beat
  );

  return {
    ...BASE_DAY_TWELVE_STORY,
    beats: [...beats, ...addedBeats],
  };
}

export const DAY_TWELVE_STORY = getDayTwelveStory(null);
