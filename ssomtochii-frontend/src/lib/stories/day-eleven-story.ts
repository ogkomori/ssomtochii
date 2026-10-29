import type { StoryDefinition } from "./types";
import { SOMTO } from "./speakers";
import { pose8Thinking, pose11SeriousConcerned, facepalm, neutral, sitting, speaking } from "./character-poses";

const MELANIE = { id: "melanie", label: "Melanie · On the phone", color: "#526B91" };

const BASE_DAY_ELEVEN_STORY: StoryDefinition = {
  title: "The Worst Possible Date", subtitle: "Day 11", startAt: 0,
  beats: [
    {
      id: 0,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [neutral],
      text: "The next day, Somto opens her phone to call Tega and tell him about the missing tiara. Before she can press his name...",
      next: 1
    },
    {
      id: 1,
      type: "incoming-call",
      scene: "phone",
      callerName: "Melanie",
      interaction: "display-only",
      narration: "...another call comes through. It's Melanie, her supervisor.",
      next: 2
    },
    {
      id: 2,
      type: "narration",
      scene: "character",
      characters: [facepalm],
      text: "This can't be good. She has been putting off her thesis for as long as she can remember. She picks up, hoping everything is alright.",
      next: 3
    },
    {
      id: 3,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:03" },
      characters: [],
      speaker: MELANIE,
      text: "Hi, Somto. How are you doing? Hope you've been working on your thesis, because I have some news you might not like.",
      next: 30
    },
    {
      id: 30,
      type: "narration",
      scene: "character",
      characters: [facepalm],
      text: "Wow. Even MORE bad news???",
      next: 31
    },
    {
      id: 31,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "Hi Melanie. Honestly, no I haven't been working on it. I was planning to start this week actually. But what's the news?",
      next: 32
    },
    {
      id: 32,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:10" },
      characters: [],
      speaker: MELANIE,
      text: "Well that's not good, Somto. I'm calling because the department has just changed the submission schedule. Your final thesis deadline has been shifted back to November 7.",
      next: 33
    },
    {
      id: 33,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "Huhh? Please tell me you're joking. November 7 is literally my birthday!",
      next: 5
    },
    {
      id: 5,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:16" },
      characters: [],
      speaker: MELANIE,
      text: "I'm sorry Somto. I understand the timing is difficult, but the revised deadline applies to everyone. I wanted to give you as much notice as possible.",
      next: 6
    },
    {
      id: 6,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: [sitting],
      text: "Somto takes a breath. How should she respond?",
      choices: [
      {
        id: "day11-accept",
        label: "Accept it professionally",
        next: 7,
      },
      {
        id: "day11-plead",
        label: "Plead nicely for an exception",
        next: 9,
      },
      {
        id: "day11-tantrum",
        label: "Lose her temper",
        next: 11,
      },
      ],
    },
    {
      id: 7,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [neutral],
      text: "Okay Melanie, I understand. The timing is incredibly disappointing, but I'll reorganise my schedule and do my best to meet it.",
      next: 8
    },
    {
      id: 8,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:27" },
      characters: [],
      speaker: MELANIE,
      text: "Thank you for being professional about it. Please be realistic with your remaining work and contact me if you need any clarification on the final requirements.",
      next: 13
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "I know the schedule has changed for everyone, but is there any chance I could submit a little later or get an extension? My birthday plans have been in place for weeks.",
      next: 10
    },
    {
      id: 10,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:31" },
      characters: [],
      speaker: MELANIE,
      text: "I do sympathise, Somto, but I can't offer you a different deadline from the rest of the cohort. I need to apply the same schedule fairly to everyone. I do hope you understand.",
      next: 13
    },
    {
      id: 11,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "So you mean you couldn't even fight for me? You're moving it to MY birthday, after all the work we've done? How is that even fair?",
      next: 12
    },
    {
      id: 12,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:36" },
      characters: [],
      speaker: MELANIE,
      text: "Somto, I understand you're upset, but raising your voice won't change the schedule. I expect us to speak respectfully, even when the news is frustrating. The deadline will not be changed.",
      next: 13
    },
    {
      id: 13,
      type: "end",
      scene: "character",
      characters: [facepalm],
      text: "The call ends with the deadline unchanged: November 7, her birthday. Somto sets her phone down and lets out a long breath. She still needs to find out what to do about the tiara, but now the thesis has taken over her thoughts."
    },
  ],
};


export const DAY_ELEVEN_STORY = BASE_DAY_ELEVEN_STORY;

export function getDayElevenStory(
  dayThreeThesisChoice: string | null,
  daySevenThesisChoice: string | null,
): StoryDefinition {
  const liedOnDayThree = dayThreeThesisChoice === "lie";
  const liedOnDaySeven = liedOnDayThree
    ? daySevenThesisChoice === "day7-thesis-double-down"
    : daySevenThesisChoice === "day7-thesis-lie-now";

  const beats = BASE_DAY_ELEVEN_STORY.beats.map((beat) => {
    if (beat.id !== 2 || beat.type !== "narration") return beat;

    const historyText = liedOnDayThree && liedOnDaySeven
      ? " In fact, she lied to Tega twice about having been working on it."
      : liedOnDayThree || liedOnDaySeven
        ? " In fact, she had even lied to Tega about having been working on it."
        : "";

    return {
      ...beat,
      text: "This can't be good. She has been putting off her thesis for as long as she can remember."
        + historyText
        + " She picks up, hoping everything is alright.",
    };
  });

  return { ...BASE_DAY_ELEVEN_STORY, beats };
}
