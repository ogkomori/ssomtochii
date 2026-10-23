/** Memory Match uses the first eight daily photos; each photo appears on two cards. */
export const MEMORY_MATCH_CONTENT = {
  title: "A few things worth finding.",
  intro: "Find all eight pairs from the first eight days.",
  pairs: [
    { id: "day-1", label: "Day 1", emoji: "♡", image: "/images/days/day-01.jpg" },
    { id: "day-2", label: "Day 2", emoji: "♡", image: "/images/days/day-02.jpg" },
    { id: "day-3", label: "Day 3", emoji: "♡", image: "/images/days/day-03.jpg" },
    { id: "day-4", label: "Day 4", emoji: "♡", image: "/images/days/day-04.jpg" },
    { id: "day-5", label: "Day 5", emoji: "♡", image: "/images/days/day-05.jpg" },
    { id: "day-6", label: "Day 6", emoji: "♡", image: "/images/days/day-06.jpg" },
    { id: "day-7", label: "Day 7", emoji: "♡", image: "/images/days/day-07.jpg" },
    { id: "day-8", label: "Day 8", emoji: "♡", image: "/images/days/day-08.jpg" },
  ],
} as const;
