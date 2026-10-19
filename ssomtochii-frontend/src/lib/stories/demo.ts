import type { StoryDefinition } from "./types";

/**
 * A small implementation test, not the final Day 12 story.
 * Replace the demo gradients and character asset with approved story assets.
 */
export const STORY_ENGINE_DEMO: StoryDefinition = {
  title: "A little story test",
  subtitle: "Testing backgrounds, sprites, dialogue and choices",
  startAt: "opening",
  beats: [
    {
      id: "opening",
      type: "narration",
      background: "linear-gradient(180deg, #b9d7df 0%, #e9e9d5 62%, #a6c4a1 100%)",
      characters: [
        {
          id: "girlfriend",
          name: "Her",
          image: "/images/character-reference/pose-13-arms-crossed.png",
          position: "right",
          alt: "Character reference sprite",
        },
      ],
      text: "After school, she pauses outside and checks her phone. Someone has sent her a message.",
      next: "message",
    },
    {
      id: "message",
      type: "dialogue",
      speakerId: "girlfriend",
      text: "Okay… why are they being so mysterious?",
      next: "choice",
    },
    {
      id: "choice",
      type: "choice",
      speakerId: "girlfriend",
      text: "What should she do?",
      choices: [
        { id: "reply", label: "Reply immediately", next: "reply-result" },
        { id: "wait", label: "Play it cool and wait", next: "wait-result" },
      ],
    },
    {
      id: "reply-result",
      type: "dialogue",
      background: "linear-gradient(180deg, #f0d9d5 0%, #f8ebdf 58%, #c9d9b8 100%)",
      speakerId: "girlfriend",
      text: "No point overthinking it. If I want to know, I'll just ask.",
      next: "ending",
    },
    {
      id: "wait-result",
      type: "dialogue",
      background: "linear-gradient(180deg, #d5d8f0 0%, #eee8dc 60%, #a7c5b5 100%)",
      speakerId: "girlfriend",
      text: "I'll wait a little. Let them wonder what I'm thinking for once.",
      next: "ending",
    },
    {
      id: "ending",
      type: "end",
      background: "linear-gradient(180deg, #d4e6d6 0%, #f6e9d8 100%)",
      text: "End of test scene. Your selected choice led to its own response, and both branches reached the same ending.",
    },
  ],
};
