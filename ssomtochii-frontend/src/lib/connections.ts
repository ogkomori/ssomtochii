export type ConnectionsGroup = {
  category?: string;
  items: string[];
};

export type ConnectionsRound = {
  category?: string;
  groups: ConnectionsGroup[];
};

export const CONNECTIONS_CONTENT: {
  title: string;
  rounds: ConnectionsRound[];
} = {
  title: "Little connections",
  rounds: [
    {
      category: "Words that describe you",
      groups: [
        { items: ["SUNSHINE", "SMART", "INTELLIGENT", "BEAUTIFUL"] },
        { items: ["LOYAL", "LOVING", "GENUINE", "SUPPORTIVE"] },
        { items: ["CREATIVE", "FUNNY", "TALENTED", "SPECIAL"] },
        { items: ["SUPERMODEL", "INFLUENCER", "KIND", "UNIQUE"] },
      ],
    },
    {
      groups: [
        { category: "Names of Wizkid songs", items: ["TURBULENCE", "GINGER", "FINAL", "RECKLESS"] },
        { category: "Words that come before \"light\"", items: ["SUN", "SPOT", "MOON", "DAY"] },
        { category: "Things that are green", items: ["MATCHA", "GRASS", "MONEY", "SPOTIFY"] },
        { category: "Things that have a shot", items: ["ESPRESSO", "BASKETBALL", "TEQUILA", "CAMERA"] },
      ],
    },
  ],
};

export function shuffledConnectionsItems(roundIndex: number) {
  return CONNECTIONS_CONTENT.rounds[roundIndex]!.groups
    .flatMap((group) => group.items)
    .sort(() => Math.random() - 0.5);
}
