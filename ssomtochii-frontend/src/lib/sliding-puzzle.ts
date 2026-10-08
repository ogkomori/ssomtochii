/**
 * Put an image in public/puzzles (or use a hosted URL), then set image to its
 * path, for example: "/puzzles/our-photo.jpg". A gentle placeholder is shown
 * until then.
 */
export const SLIDING_PUZZLE_CONTENT = {
  title: "Put the picture back together.",
  intro: "Tap a tile beside the empty space to slide it into place.",
  image: "",
  imageAlt: "A special photo",
  gridSize: 3,
} as const;
