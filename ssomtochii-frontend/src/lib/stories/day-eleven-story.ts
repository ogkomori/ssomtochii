import type { StoryDefinition } from "./types";
import { SOMTO } from "./speakers";
import { pose8Thinking, pose11SeriousConcerned, facepalm, sitting, speaking } from "./character-poses";

const MELANIE = { id: "melanie", label: "Melanie · On the phone", color: "#526B91" };

export const DAY_ELEVEN_STORY: StoryDefinition = {
  title: "The Worst Possible Date", subtitle: "Day 11", startAt: 1,
  beats: [
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "The next day, Somto opens her phone to call Tega and tell him about the missing tiara. Before she can press his name, another call comes through. It's Melanie, her thesis supervisor.",
      next: 2
    },
    {
      id: 2,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:03" },
      characters: [],
      speaker: MELANIE,
      text: "Hi, Somto. I'm calling because the department has changed the submission schedule. Your final thesis deadline is now November 7.",
      next: 3
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "November seventh? As in... my birthday?",
      next: 4
    },
    {
      id: 4,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:16" },
      characters: [],
      speaker: MELANIE,
      text: "I'm afraid so. I understand the timing is difficult, but the revised deadline applies to everyone. I wanted to give you as much notice as possible.",
      next: 5
    },
    {
      id: 5,
      type: "choice",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "Somto takes a breath. How should she respond?",
      choices: [
      {
        id: "day11-accept",
        label: "Accept it professionally",
        next: 6,
      },
      {
        id: "day11-plead",
        label: "Plead nicely for an exception",
        next: 8,
      },
      {
        id: "day11-tantrum",
        label: "Lose her temper",
        next: 10,
      },
      ],
    },
    {
      id: 6,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "I understand. I'm disappointed about the timing, but I'll reorganise my schedule and do my best to meet it.",
      next: 7
    },
    {
      id: 7,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:27" },
      characters: [],
      speaker: MELANIE,
      text: "Thank you for being professional about it. Please be realistic with your remaining work and contact me if you need clarification on the final requirements.",
      next: 12
    },
    {
      id: 8,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "I know the schedule has changed for everyone, but is there any chance I could submit a little earlier or get a short extension? My birthday plans have been in place for weeks.",
      next: 9
    },
    {
      id: 9,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:31" },
      characters: [],
      speaker: MELANIE,
      text: "I do sympathise, Somto, but I can't offer you a different deadline from the rest of the cohort. I need to apply the same schedule fairly to everyone.",
      next: 12
    },
    {
      id: 10,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "You're moving it to my birthday? After all the work we've done? How is that remotely fair?",
      next: 11
    },
    {
      id: 11,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:36" },
      characters: [],
      speaker: MELANIE,
      text: "Somto, I understand you're upset, but raising your voice won't change the schedule. I expect us to speak respectfully, even when the news is frustrating.",
      next: 12
    },
    {
      id: 12,
      type: "end",
      scene: "character",
      characters: [pose11SeriousConcerned],
      text: "The call ends with the deadline unchanged: November 7, her birthday. Somto sets her phone down and lets out a long breath. She still needs to tell Tega about the tiara, but now the thesis has taken over her thoughts."
    },
  ],
};
