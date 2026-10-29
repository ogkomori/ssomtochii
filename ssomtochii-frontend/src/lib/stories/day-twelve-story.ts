import type { StoryDefinition } from "./types";
import { SOMTO, TEGA, ALEXA } from "./speakers";
import { pose8Thinking, pose11SeriousConcerned, sitting, smiling, facepalm, upwards, neutral } from "./character-poses";

export const DAY_TWELVE_STORY: StoryDefinition = {
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
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:00" },
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
      text: "Awww, thanks babe!",
      next: 13
    },
  ],
};
