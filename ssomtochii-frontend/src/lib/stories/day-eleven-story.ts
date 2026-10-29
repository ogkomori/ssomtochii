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
      narration: "...another call comes through. It's Melanie, her supervisor.",
      next: 2
    },
    {
      id: 2,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [pose8Thinking],
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
      text: "Hi, Somto. I'm calling because the department has changed the submission schedule. Your final thesis deadline is now November 7.",
      next: 4
    },
    {
      id: 4,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "November seventh? As in... my birthday?",
      next: 5
    },
    {
      id: 5,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:16" },
      characters: [],
      speaker: MELANIE,
      text: "I'm afraid so. I understand the timing is difficult, but the revised deadline applies to everyone. I wanted to give you as much notice as possible.",
      next: 6
    },
    {
      id: 6,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcerned],
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
      characters: [speaking],
      text: "I understand. I'm disappointed about the timing, but I'll reorganise my schedule and do my best to meet it.",
      next: 8
    },
    {
      id: 8,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:27" },
      characters: [],
      speaker: MELANIE,
      text: "Thank you for being professional about it. Please be realistic with your remaining work and contact me if you need clarification on the final requirements.",
      next: 13
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "I know the schedule has changed for everyone, but is there any chance I could submit a little earlier or get a short extension? My birthday plans have been in place for weeks.",
      next: 10
    },
    {
      id: 10,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:31" },
      characters: [],
      speaker: MELANIE,
      text: "I do sympathise, Somto, but I can't offer you a different deadline from the rest of the cohort. I need to apply the same schedule fairly to everyone.",
      next: 13
    },
    {
      id: 11,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "You're moving it to my birthday? After all the work we've done? How is that remotely fair?",
      next: 12
    },
    {
      id: 12,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:36" },
      characters: [],
      speaker: MELANIE,
      text: "Somto, I understand you're upset, but raising your voice won't change the schedule. I expect us to speak respectfully, even when the news is frustrating.",
      next: 13
    },
    {
      id: 13,
      type: "end",
      scene: "character",
      characters: [pose11SeriousConcerned],
      text: "The call ends with the deadline unchanged: November 7, her birthday. Somto sets her phone down and lets out a long breath. She still needs to tell Tega about the tiara, but now the thesis has taken over her thoughts."
    },
  ],
};


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
