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
        { items: ["TEA", "BOOK", "MUSIC", "NAP"] },
        { items: ["STAR", "RING", "DISCO", "GLITTER"] },
        { items: ["CAKE", "COOKIE", "DONUT", "CANDY"] },
        { items: ["BEACH", "MARKET", "MUSEUM", "GARDEN"] },
      ],
    },
    {
      groups: [
        { category: "Things in the sky", items: ["CLOUD", "MOON", "SUN", "RAINBOW"] },
        { category: "Things you can wear", items: ["SCARF", "HAT", "BOOTS", "RING"] },
        { category: "Words before “cake”", items: ["BIRTHDAY", "CHEESE", "PAN", "CUP"] },
        { category: "Things with pages", items: ["NOVEL", "DIARY", "ATLAS", "COMIC"] },
      ],
    },
  ],
};

export function shuffledConnectionsItems(roundIndex: number) {
  return CONNECTIONS_CONTENT.rounds[roundIndex]!.groups
    .flatMap((group) => group.items)
    .sort(() => Math.random() - 0.5);
}
