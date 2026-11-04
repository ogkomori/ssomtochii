import type { StoryDefinition } from "./types";
import { SOMTO, PARTY_PLANNERS } from "./speakers";
import { sitting, speaking, pose8Thinking, pose11SeriousConcerned, facepalm, neutral, pose6Walking } from "./character-poses";

export const DAY_FOURTEEN_STORY: StoryDefinition = {
  title: "A Choice to Make", subtitle: "Day 14", startAt: 0,
  beats: [
    {
      id: 0,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [facepalm],
      text: "Somto is still thinking about her confrontation with Zara. She's very sure that Zara took that tiara, but she has bigger problems to deal with today. She has a thesis deadline around the corner.",
      next: 1
    },
    {
      id: 1,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [neutral],
      text: "She sits down and takes a deep breath, trying to focus on the task at hand. This thesis is due tomorrow, and she needs to cover as much ground as possible. However, I think you already know what happens next.",
      next: 2
    },
    {
      id: 2,
      type: "incoming-call",
      callerName: "Party Planners",
      narration: "ANOTHER phone call. It's the party planners...",
      interaction: "display-only",
      next: 3
    },
    {
      id: 3,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "This better be some good news, or I'm going to be very upset.",
      next: 40
    },
    {
      id: 40,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "Hi, is everything okay?",
      next: 41
    },
    {
      id: 41,
      type: "dialogue",
      scene: "phone",
      speaker: PARTY_PLANNERS,
      phone: { contactName: "Party Planners", contactInitial: "PP", statusText: "00:00:04" },
      characters: [],
      text: "Well you can be the judge of that. We're calling to remind you that you need to confirm the venue for your birthday party today.",
      next: 42
    },
    {
      id: 42,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [facepalm],
      text: "Somto's heart sinks. She had completely forgotten about the venue confirmation. Worst part is, she has to be there in person. It would take her the whole day to get there and back.",
      next: 43
    },
    {
      id: 43,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "Do I really HAVE to go there in person? I have so much work to do on my thesis. I can't afford to waste a whole day on this.",
      next: 44
    },
    {
      id: 44,
      type: "dialogue",
      scene: "phone",
      speaker: PARTY_PLANNERS,
      phone: { contactName: "Party Planners", contactInitial: "PP", statusText: "00:00:16" },
      characters: [],
      text: "I hear and feel your pain, but unfortunately, yes. The venue requires a confirmation in person. If you don't confirm today, there is every possibility that they will give your space away to someone else.",
      next: 45
    },
    {
      id: 45,
      type: "choice",
      scene: "character",
      characters: [sitting],
      text: "Big choice to make here. If Somto goes to the venue, then her birthday party will go as planned, but her thesis might suffer. If she stays home, she can focus on her thesis, but the party plans are at risk. Does Somto go confirm the birthday venue, or stay home and work on her thesis?",
      choices: [
      {
        id: "day14-confirm-venue",
        label: "Go confirm the venue and protect the party plans",
        next: 10,
      },
      {
        id: "day14-work-thesis",
        label: "Stay home and prioritise the thesis",
        next: 20,
      },
      ],
    },
    {
      id: 10,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "Alright. I'll be on my way there now. Thanks for the reminder.",
      next: 11
    },
    {
      id: 11,
      type: "dialogue",
      scene: "character",
      background: "/images/backgrounds/road.jpg",
      speaker: SOMTO,
      characters: [pose6Walking],
      text: "Somto rushes to the venue to confirm the booking. The visit takes longer than expected though: she checks the layout, confirms the guest limit, and sorts out the final arrangements.",
      next: 12
    },
    {
      id: 12,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom-at-night.png",
      characters: [sitting],
      text: "By the time Somto gets home, the afternoon is gone. She's frustrated that the party has taken time she needed for her final corrections. The venue is safe, but her thesis is not.",
      next: 13
    },
    {
      id: 13,
      type: "narration",
      scene: "character",
      characters: [neutral],
      text: "She spends the next hour doing her best to catch up on her thesis, but it's too late. She has to submit it as is, and present it tomorrow. Somto is disappointed that she couldn't do better.",
      next: 14
    },
    {
      id: 14,
      type: "end",
      scene: "character",
      characters: [speaking],
      text: "Before going to bed though, she calls Tega and explains the choice she made today. She practices her presentation on the call, Tega gives her some feedback, and Somto goes to bed still a bit worried about her thesis.",
    },
    {
      id: 20,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "I can't go to the venue today. I have to focus on my thesis. I hope you understand.",
      next: 21
    },
    {
      id: 21,
      type: "dialogue",
      scene: "phone",
      speaker: PARTY_PLANNERS,
      phone: { contactName: "Party Planners", contactInitial: "PP", statusText: "00:00:24" },
      characters: [],
      text: "Alright. I trust that you do understand the implication of that. Goodluck with your thesis!",
      next: 22
    },
    {
      id: 22,
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [sitting],
      text: "Can't say I regret that. This thesis is very important to me.",
      next: 23
    },
    {
      id: 23,
      type: "narration",
      scene: "character",
      characters: [neutral],
      text: "And she's back to her work. We haven't seen Somto this locked in since Day 12. See what I did there, haha. Don't worry, I won't get carried away this time.",
      next: 24
    },
    {
      id: 24,
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom-at-night.png",
      characters: [neutral],
      text: "Quick timelapse, and it's already nighttime. Somto has done her best to finish her thesis, and she is very confident that she has done well. She is ready to submit and present it tomorrow.",
      next: 25
    },
    {
      id: 25,
      type: "end",
      scene: "character",
      characters: [speaking],
      text: "Before going to bed though, she calls Tega and explains the choice she made today. She practices her presentation on the call, Tega gives her some feedback, and Somto goes to bed still a bit worried about her birthday party.",
    },
  ],
};
