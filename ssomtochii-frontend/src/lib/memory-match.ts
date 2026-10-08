/** Replace each empty image URL with a photo path or hosted image when ready. */
export const MEMORY_MATCH_CONTENT = {
  title: "A few things worth finding.",
  intro: "Find the pairs. For now, these are friendly placeholders waiting for photos and inside references.",
  pairs: [
    { id: "sun", label: "Sunny day", emoji: "☀️", image: "" },
    { id: "music", label: "A favourite song", emoji: "♫", image: "" },
    { id: "flower", label: "A flower", emoji: "✿", image: "" },
    { id: "treat", label: "A little treat", emoji: "🍓", image: "" },
  ],
} as const;
