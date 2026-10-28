import type { StoryDefinition } from "./types";
import { SOMTO, TEGA } from "./speakers";
import { pose8Thinking, pose11SeriousConcerned, sitting, smiling, facepalm } from "./character-poses";

export const DAY_TWELVE_STORY: StoryDefinition = {
  title: "One Thing After Another", subtitle: "Day 12", startAt: 1,
  beats: [
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "Somto finally calls Tega. She intends to tell him about the tiara first, but as soon as he asks how she's doing, everything about Melanie's call comes spilling out.",
      next: 2
    },
    {
      id: 2,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:04" },
      characters: [],
      speaker: TEGA,
      text: "Baby, slow down. Start from the beginning. What happened?",
      next: 3
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "Melanie called and moved my thesis deadline to November seventh. My birthday, Tega. My actual birthday. Who does that?",
      next: 4
    },
    {
      id: 4,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:16" },
      characters: [],
      speaker: TEGA,
      text: "That's awful timing, and you're allowed to be upset. But this doesn't erase all the work you've already done. We'll work out a plan so the deadline doesn't swallow your whole birthday.",
      next: 5
    },
    {
      id: 5,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "I don't want to spend my birthday thinking about references and formatting. I wanted one day where I could just enjoy myself.",
      next: 6
    },
    {
      id: 6,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:25" },
      characters: [],
      speaker: TEGA,
      text: "I know, sunshine. And you still deserve to celebrate. We'll take the work seriously without letting it convince you you've done nothing else worth celebrating.",
      next: 7
    },
    {
      id: 7,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [smiling],
      text: "You always know how to make me feel a little less dramatic.",
      next: 8
    },
    {
      id: 8,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [pose8Thinking],
      text: "As Somto starts explaining why she was already stressed before Melanie called, another thought comes back to her. Zara's visit. The empty stand on her dresser. The missing tiara.",
      next: 9
    },
    {
      id: 9,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose11SeriousConcerned],
      text: "Wait. I never told you the other thing. My birthday tiara disappeared after Zara came over last night.",
      next: 10
    },
    {
      id: 10,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:34" },
      characters: [],
      speaker: TEGA,
      text: "That's a pretty specific coincidence. Did you check everywhere? I wouldn't accuse her without proof, but I wouldn't ignore how strange the timing is either.",
      next: 11
    },
    {
      id: 11,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [pose8Thinking],
      text: "I checked my drawers twice. I don't want to believe she took it, but who else was in my room?",
      next: 12
    },
    {
      id: 12,
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:43" },
      characters: [],
      speaker: TEGA,
      text: "Talk to her calmly first. Give her a chance to explain, and keep your head if you don't like what she says. You don't need another problem on top of the thesis.",
      next: 13
    },
    {
      id: 13,
      type: "end",
      scene: "character",
      characters: [pose11SeriousConcerned],
      text: "Somto agrees to speak to Zara before deciding what to believe. She hangs up feeling supported, but the thought of her missing tiara refuses to leave her alone."
    },
  ],
};
