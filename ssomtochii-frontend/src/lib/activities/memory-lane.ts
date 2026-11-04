export type MemoryLanePhoto = {
  id: string;
  caption: string;
  image: string;
  placeholder: string;
};

/**
 * Replace each image with a file in public/memory-lane/, for example:
 * "/memory-lane/round-1-first.jpg".
 * Within each round, photos are listed in chronological order here; the game
 * shuffles them for the player. Keep each round's three IDs and their order
 * aligned with the real chronological sequence.
 */
export const MEMORY_LANE_CONTENT = {
  title: "A little trip down memory lane!",
  intro: "Put the three pictures in chronological order, earliest first, to the latest. You can click on each picture to view it in full size.",
  rounds: [
    {
      title: "Round 1",
      photos: [
        { id: "r1-early", caption: "A pretty black dress", image: "/memory-lane/round-1-first.jpg", placeholder: "🌼" },
        { id: "r1-middle", caption: "Day 2's photo", image: "/memory-lane/round-1-middle.jpg", placeholder: "🎵" },
        { id: "r1-late", caption: "The dress you never bought", image: "/memory-lane/round-1-last.jpg", placeholder: "☀️" },
      ],
    },
    {
      title: "Round 2",
      photos: [
        { id: "r2-early", caption: "Flexing your medals", image: "/memory-lane/round-2-first.jpg", placeholder: "✈️" },
        { id: "r2-middle", caption: "A meme you made", image: "/memory-lane/round-2-middle.jpg", placeholder: "📚" },
        { id: "r2-late", caption: "iPad selfie", image: "/memory-lane/round-2-last.jpg", placeholder: "🍓" },
      ],
    },
    {
      title: "Round 3",
      photos: [
        { id: "r3-early", caption: "Spazieren gehen", image: "/memory-lane/round-3-first.jpg", placeholder: "⭐" },
        { id: "r3-middle", caption: "Mirror selfie", image: "/memory-lane/round-3-middle.jpg", placeholder: "🌷" },
        { id: "r3-late", caption: "Dance class", image: "/memory-lane/round-3-last.jpg", placeholder: "🎬" },
      ],
    },
  ] satisfies { title: string; photos: MemoryLanePhoto[] }[],
} as const;
