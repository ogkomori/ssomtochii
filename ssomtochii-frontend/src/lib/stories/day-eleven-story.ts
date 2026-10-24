import type { StoryDefinition } from "./types";
import { SOMTO, TEGA } from "./speakers";
import { pose8Thinking, pose11SeriousConcerned, facepalm, sitting, speaking, smiling } from "./character-poses";

const MELANIE = { id: "melanie", label: "Melanie · On the phone", color: "#526B91" };

/** Day 11: Melanie moves the thesis deadline to Somto's birthday. */
export const DAY_ELEVEN_STORY: StoryDefinition = {
  title: "An Unexpected Email",
  subtitle: "Day 11",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto has barely opened her laptop when an email from Melanie, her thesis supervisor, appears. She expects feedback. Instead, the message asks her to call as soon as she can.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:03" },
      characters: [], speaker: MELANIE,
      text: "Hi, Somto. I wanted to explain this directly. The submission schedule has changed, and your final deadline is now November 7.",
      next: 3,
    },
    {
      id: 3, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose8Thinking],
      text: "November seventh? As in… my birthday?",
      next: 4,
    },
    {
      id: 4, type: "dialogue", scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:16" },
      characters: [], speaker: MELANIE,
      text: "I'm afraid so. I know the timing is far from ideal. The schedule has shifted, but I still believe you can produce good work if you use the time carefully.",
      next: 5,
    },
    {
      id: 5, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "Okay. Thank you for letting me know. I'll work out what I need to do.",
      next: 6,
    },
    {
      id: 6, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [facepalm],
      text: "She ends the call and stares at the birthday plans she'd been so excited about. For a moment, the whole countdown feels like it's slipping away from her.",
      next: 7,
    },
    {
      id: 7, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:04" },
      characters: [], speaker: TEGA,
      text: "Hey, baby. You sound quiet. What's happened?",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [speaking],
      text: "My thesis deadline got moved to my birthday. I know I can work through it, but I really didn't want this hanging over everything.",
      next: 9,
    },
    {
      id: 9, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:18" },
      characters: [], speaker: TEGA,
      text: "That is genuinely rubbish timing. You don't have to pretend you're not upset, okay? We'll figure out what can move and what really matters.",
      next: 10,
    },
    {
      id: 10, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "I needed to hear that. I'm still going to complain about it for at least another five minutes, though.",
      next: 11,
    },
    {
      id: 11, type: "end", scene: "character",
      characters: [pose8Thinking],
      text: "Somto starts making a realistic plan. She can't control the deadline, but she can decide how to face it.",
    },
  ],
};