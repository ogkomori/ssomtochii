import type { StoryDefinition } from "./types";
import { SOMTO, TEGA, ZARA } from "./speakers";
import { neutral, sitting, speaking, smiling, pose8Thinking, pose11SeriousConcerned, pose12ConfidentStanding, zaraNeutral, zaraHappy, zaraSad, zaraThinking } from "./character-poses";

/** Day 16: Somto's birthday becomes a reminder of how many people care about her. */
export const DAY_SIXTEEN_STORY: StoryDefinition = {
  title: "All for You",
  subtitle: "Day 16",
  startAt: 1,
  beats: [
    {
      id: 1, type: "narration", scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: [pose8Thinking],
      text: "It's Somto's birthday. After the tension of the night before, she wakes up wondering whether the drama has taken the shine off everything she'd been looking forward to.",
      next: 2,
    },
    {
      id: 2, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose8Thinking],
      text: "Happy birthday to me, I guess. I just wanted one day where everything went to plan.",
      next: 3,
    },
    {
      id: 3, type: "narration", scene: "character",
      characters: [smiling],
      text: "Then the messages start arriving. Some are funny, some are sentimental, and some are from people who remember tiny things Somto mentioned weeks ago. Each one makes her smile a little more.",
      next: 4,
    },
    {
      id: 4, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:05" },
      characters: [], speaker: TEGA,
      text: "Happy birthday, baby. Before you tell me about the party, I want you to know that I'm proud of you. You carried a lot this week, and you still showed up.",
      next: 5,
    },
    {
      id: 5, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "I'm not crying. My face is just reacting to the emotional damage you've caused.",
      next: 6,
    },
    {
      id: 6, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:18" },
      characters: [], speaker: TEGA,
      text: "Good. Because I also want you to remember that one postponed plan isn't gone forever. We'll get our time together.",
      next: 7,
    },
    {
      id: 7, type: "narration", scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: [smiling],
      text: "Later, Somto returns to the people celebrating her. Someone has saved her favourite song. Someone else has brought a small gift. The details aren't grand, but every one of them says the same thing: they thought of her.",
      next: 8,
    },
    {
      id: 8, type: "dialogue", scene: "character", speaker: ZARA,
      characters: [neutral, zaraThinking],
      text: "I still think I could've made this party unforgettable.",
      next: 9,
    },
    {
      id: 9, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose12ConfidentStanding, zaraNeutral],
      text: "It is unforgettable. Not because everything went perfectly, but because the people I care about showed up for me.",
      next: 10,
    },
    {
      id: 10, type: "dialogue", scene: "character", speaker: ZARA,
      characters: [neutral, zaraSad],
      text: "You really think I was trying to make it about me?",
      next: 11,
    },
    {
      id: 11, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [pose12ConfidentStanding, zaraThinking],
      text: "I think you like being noticed. I even like that you're confident. But when you need every room to revolve around you, you stop seeing the people standing beside you.",
      next: 12,
    },
    {
      id: 12, type: "dialogue", scene: "character", speaker: ZARA,
      characters: [neutral, zaraSad],
      text: "I didn't think you saw it that way.",
      next: 13,
    },
    {
      id: 13, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [speaking, zaraNeutral],
      text: "I don't hate you, Zara. But I'm not going to keep pretending it doesn't bother me.",
      next: 14,
    },
    {
      id: 14, type: "narration", scene: "character",
      characters: [smiling],
      text: "Zara doesn't have a clever answer. For once, Somto doesn't wait around for one. She turns back to the people who came to celebrate her.",
      next: 15,
    },
    {
      id: 15, type: "dialogue", scene: "phone",
      phone: { contactName: "Tega", contactInitial: "T", statusText: "00:00:04" },
      characters: [], speaker: TEGA,
      text: "One last thing, birthday girl. Look around you. That's what happens when you let people love you.",
      next: 16,
    },
    {
      id: 16, type: "dialogue", scene: "character", speaker: SOMTO,
      characters: [smiling],
      text: "I think I finally get it.",
      next: 17,
    },
    {
      id: 17, type: "end", scene: "character",
      background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
      characters: [smiling],
      text: "The thesis is submitted. Her birthday is here. The week was messy, the party wasn't perfect, and not everyone behaved the way she hoped. But Somto is surrounded by people who care about her—and she doesn't have to be perfect to deserve it.",
    },
  ],
};