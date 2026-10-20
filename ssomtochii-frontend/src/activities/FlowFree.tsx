import { useMemo, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { FLOW_FREE_INTRO, FLOW_FREE_LEVELS } from "@/lib/flow-free";

type Paths = Record<string, number[]>;

const EMOJI_OPTIONS = [
  { emoji: "☀️", colour: "#F4A62A" },
  { emoji: "💚", colour: "#35A86B" },
  { emoji: "🍣", colour: "#E56B6F" },
  { emoji: "🧸", colour: "#9B7653" },
  { emoji: "🌼", colour: "#8D7BC8" },
  { emoji: "💌", colour: "#D66BB1" },
  { emoji: "🎶", colour: "#5488D9" },
];

type FlowEmoji = (typeof EMOJI_OPTIONS)[number];

function assignRandomEmojis(count: number): FlowEmoji[] {
  const shuffled = [...EMOJI_OPTIONS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// Pick each level's emoji set once at module load, outside React rendering.
// This keeps the initial render stable even when Strict Mode invokes initializers twice.
const EMOJIS_BY_LEVEL = FLOW_FREE_LEVELS.map((level) => assignRandomEmojis(level.pairs.length));

export function FlowFree({ onComplete }: { onComplete: () => void }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = FLOW_FREE_LEVELS[levelIndex];
  const [paths, setPaths] = useState<Paths>({});
  const [drawing, setDrawing] = useState<string | null>(null);
  const [message, setMessage] = useState("Connect the matching emojis.");
  const [emojis, setEmojis] = useState<FlowEmoji[]>(EMOJIS_BY_LEVEL[0]);
  const gridRef = useRef<HTMLDivElement>(null);

  const endpointMap = useMemo(() => {
    const map = new Map<number, (typeof level.pairs)[number]>();
    level.pairs.forEach((pair) => {
      map.set(pair.start, pair);
      map.set(pair.end, pair);
    });
    return map;
  }, [level]);

  const pairEmojis = useMemo(
    () => Object.fromEntries(level.pairs.map((pair, index) => [pair.id, emojis[index]])),
    [level.pairs, emojis],
  );

  const dotColours = useMemo(() => {
    const map = new Map<number, string>();
    level.pairs.forEach((pair) => {
      const colour = pairEmojis[pair.id].colour;
      map.set(pair.start, colour);
      map.set(pair.end, colour);
    });
    return map;
  }, [level.pairs, pairEmojis]);

  const occupied = useMemo(() => {
    const map = new Map<number, string>();
    Object.entries(paths).forEach(([id, cells]) => cells.forEach((cell) => map.set(cell, id)));
    return map;
  }, [paths]);
  const covered = new Set(Object.values(paths).flat());
  const completedPairs = level.pairs.filter((pair) => {
    const path = paths[pair.id] ?? [];
    return (path[0] === pair.start && path.at(-1) === pair.end)
      || (path[0] === pair.end && path.at(-1) === pair.start);
  }).length;
  const won = completedPairs === level.pairs.length && covered.size === level.size * level.size;

  const neighbours = (a: number, b: number) =>
    Math.abs(Math.floor(a / level.size) - Math.floor(b / level.size))
      + Math.abs((a % level.size) - (b % level.size)) === 1;

  const extend = (cell: number) => {
    if (!drawing) return;
    setPaths((current) => {
      const path = current[drawing] ?? [];
      const last = path.at(-1);
      if (last === undefined || last === cell || !neighbours(last, cell)) return current;
      const pair = level.pairs.find((item) => item.id === drawing);
      if (!pair) return current;
      if (path.length > 1 && (last === pair.start || last === pair.end)) return current;
      if (Object.entries(current).some(([id, cells]) => id !== drawing && cells.includes(cell))) return current;

      const ownIndex = path.indexOf(cell);
      if (ownIndex >= 0) return { ...current, [drawing]: path.slice(0, ownIndex + 1) };

      const endpoint = endpointMap.get(cell);
      if (endpoint && endpoint.id !== drawing) return current;
      return { ...current, [drawing]: [...path, cell] };
    });
  };

  const cellAt = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const cell = element?.closest<HTMLElement>("[data-cell]");
    if (cell && gridRef.current?.contains(cell)) return Number(cell.dataset.cell);
    return null;
  };

  const begin = (event: React.PointerEvent<HTMLDivElement>) => {
    const cell = cellAt(event);
    if (cell === null) return;
    const pair = endpointMap.get(cell);
    const owner = Object.entries(paths).find(([, cells]) => cells.includes(cell));
    const id = pair?.id ?? owner?.[0];
    if (!id) return;
    const currentPath = paths[id] ?? [];
    const at = currentPath.indexOf(cell);
    if (pair) {
      // Tapping either endpoint always restarts that flow from the selected emoji.
      setPaths((current) => ({ ...current, [id]: [cell] }));
    } else if (at >= 0) {
      // Tapping a cell along a path rewinds the flow to that point.
      setPaths((current) => ({ ...current, [id]: current[id]!.slice(0, at + 1) }));
    } else {
      setPaths((current) => ({ ...current, [id]: [...currentPath, cell] }));
    }
    setDrawing(id);
    setMessage("Follow the grid one square at a time.");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drawing) {
      const cell = cellAt(event);
      if (cell !== null) extend(cell);
    }
  };
  const end = () => {
    setDrawing(null);
    setMessage("Every square must be covered, with each pair connected.");
  };
  const reset = () => {
    setPaths({});
    setDrawing(null);
    setMessage("Connect the matching emojis.");
  };
  const nextLevel = () => {
    if (levelIndex === FLOW_FREE_LEVELS.length - 1) {
      onComplete();
      return;
    }
    const next = FLOW_FREE_LEVELS[levelIndex + 1];
    setLevelIndex((current) => current + 1);
    setPaths({});
    setDrawing(null);
    setEmojis(EMOJIS_BY_LEVEL[levelIndex + 1]);
    setMessage("Connect the matching emojis.");
  };

  return <GameShell eyebrow="FLOW FREE" title={won ? "All connected." : level.title} right={`LEVEL ${level.id} · ${level.size}×${level.size}`}>
    <p className="mb-5 text-sm text-foreground/75">{won ? "Every emoji is connected and every square is filled." : FLOW_FREE_INTRO}</p>
    <div
      ref={gridRef}
      className="relative mx-auto grid aspect-square w-full max-w-[19rem] touch-none select-none gap-0 overflow-hidden rounded-xl bg-card p-2 shadow-inner"
      style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${level.size}, minmax(0, 1fr))` }}
      onPointerDown={begin}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {Array.from({ length: level.size * level.size }, (_, cell) => {
        const pair = endpointMap.get(cell);
        return <div
          key={cell}
          data-cell={cell}
          className="relative flex min-h-0 min-w-0 items-center justify-center border border-card/70 bg-secondary"
        >
          {pair && <span
            className="relative z-10 flex h-[82%] w-[82%] items-center justify-center rounded-full bg-white shadow-sm"
            aria-label={pairEmojis[pair.id]?.emoji}
          >
            <span className="text-[clamp(1rem,4vw,1.5rem)] leading-none">{pairEmojis[pair.id]?.emoji}</span>
          </span>}
        </div>;
      })}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 z-[5] h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-visible"
        viewBox={`0 0 ${level.size} ${level.size}`}
        preserveAspectRatio="none"
      >
        {level.pairs.map((pair) => {
          const path = paths[pair.id] ?? [];
          if (path.length < 2) return null;
          const points = path.map((cell) =>
            `${(cell % level.size) + 0.5},${Math.floor(cell / level.size) + 0.5}`
          ).join(" ");
          return <polyline
            key={pair.id}
            points={points}
            fill="none"
            stroke={dotColours.get(pair.start)}
            strokeWidth="0.42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />;
        })}
      </svg>
    </div>
    <p className="mt-4 min-h-10 text-sm text-muted-foreground">
      {won ? "Puzzle solved!" : `${completedPairs}/${level.pairs.length} pairs connected · ${covered.size}/${level.size * level.size} squares filled`}
    </p>
    <p className="mt-2 text-xs text-muted-foreground">{message}</p>
    <div className="mt-4 flex justify-center gap-3">
      {won
        ? <button className="next-button" type="button" onClick={nextLevel}>
            {levelIndex === FLOW_FREE_LEVELS.length - 1 ? "Get today’s letter" : "Next level"} <Check className="h-4 w-4" />
          </button>
        : <button className="inline-flex items-center gap-1 text-sm text-muted-foreground" type="button" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Start over
          </button>}
    </div>
  </GameShell>;
}
