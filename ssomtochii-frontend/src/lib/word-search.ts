export const WORD_SEARCH_CONTENT = {
  title: "A little word hunt.",
  intro: "Find each word hidden horizontally, vertically, or diagonally. Tap its first letter, then its last.",
  size: 8,
  grid: [
    "L O V E Q X M T",
    "A D R E A M U R",
    "H E A R T N S A",
    "S M I L E I I V",
    "D A N C E C C E",
    "P L K J J B T L",
    "G R E A M O X Y",
    "S T A R W P Y Z",
  ].map((row) => row.split(" ")),
  words: ["LOVE", "DREAM", "HEART", "SMILE", "DANCE", "MUSIC", "TRAVEL", "STAR", "JOY"],
} as const;
