/** The personal word list and fixed letter grid for Day 13's word search. */
export const WORD_SEARCH_CONTENT = {
  title: "A little word hunt.",
  intro: "Find the words hidden in the grid. Each one has a little connection to you.",
  words: [
    "SUNSHINE",
    "SMART",
    "GREEN",
    "SOMTO",
    "SUSHI",
    "TEGA",
    "TIKTOK",
  ],
  grid: [
    "E C R G X J A N E V T A",
    "I E C Z T Z Z I O X N E",
    "Z I S L H I P S Y R S N",
    "V L N U U K K U M D L T",
    "Z T S U N I W T O A R T",
    "X E E O O S V X O O R R",
    "F J G G M F H Q L K I T",
    "L S O I A T T I I M E G",
    "S U P R H S O H N G W R",
    "L S E C N U U O M E A E",
    "X H N B H E P Z W O U E",
    "I I F X N X I Y Z L G N",
  ].map((row) => row.split(" ")),
} as const;
