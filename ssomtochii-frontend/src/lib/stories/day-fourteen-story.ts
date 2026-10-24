import type { StoryDefinition } from "./types";
import { SOMTO, TEGA } from "./speakers";
import { neutral, sitting, speaking, smiling, pose8Thinking, pose11SeriousConcerned, facepalm } from "./character-poses";

const MELANIE = { id: "melanie", label: "Melanie · On the phone", color: "#526B91" };

/** Day 14: The thesis is nearly ready, but the party plans are unsettled. */
export const DAY_FOURTEEN_STORY: StoryDefinition = {
  title: "The Final Push",
  subtitle: "Day 14",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto's notes are finally starting to look like a finished thesis. There are still things she wants to improve, but she can see the end now.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose8Thinking],
      text: "One more read-through. Just one. Then I am not touching this document again unless something is actually wrong.",
      next: 3,
    },
    {
      id: 3, type: "dialogue", scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:05" },
      characters: [], speaker: MELANIE,
      text: "I've reviewed your latest draft. You're close, Somto. Focus on the final corrections and make sure your references and formatting are consistent.",
      next: 4,
    },
    {
      id: 4, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [speaking],
      text: "Okay. I can do that. Thank you.",
      next: 5,
    },
    {
      id: 5, type: "narration", scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [facepalm],
      text: "She closes the message and checks the birthday group chat. One detail has changed, and another still needs confirming. She feels the old panic rising again.",
      next: 6,
    },
    {
      id: 6, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:03" },
      characters: [], speaker: TEGA,
      text: "Tell me what happened.",
      next: 7,
    },
    {
      id: 7, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "The thesis is almost ready, but the party still has loose ends. I keep thinking I should be able to handle everything without needing help.",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:15" },
      characters: [], speaker: TEGA,
      text: "You don't get extra points for doing everything alone, baby. Let people help with the things that don't need to be yours to carry.",
      next: 9,
    },
    {
      id: 9, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "Fine. I'll delegate one thing. Don't make a big deal out of it.",
      next: 10,
    },
    {
      id: 10, type: "end", scene: "character",
      characters: [pose8Thinking],
      text: "Somto leaves one small party task in someone else's hands and returns to the thesis. It isn't perfect, but it is ready enough to face tomorrow.",
    },
  ],
};