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
    "V A E Y Z A H A N K L X",
    "V N G S T I A A I D H T",
    "V R N E X C A B Q U O I",
    "R Y R E T F X K M K F K",
    "B G C S U N S H I N E T",
    "S W V J T R A M S M G O",
    "J U L W J I K X G R O K",
    "X L S D D X J T R W T H",
    "Y T L H Y K S P E E M B",
    "A S S L I P A Z E T O X",
    "D R A S T A J W N V S N",
    "S M E G I A Y B V N R U",
  ].map((row) => row.split(" ")),
} as const;
