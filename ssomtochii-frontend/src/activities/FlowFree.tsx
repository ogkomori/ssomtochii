import { useMemo, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { FLOW_FREE_CONTENT } from "@/lib/flow-free";

type Pair = (typeof FLOW_FREE_CONTENT.pairs)[number];
type Paths = Record<string, number[]>;
const size = FLOW_FREE_CONTENT.size;
const endpointMap = new Map<number, Pair>();
FLOW_FREE_CONTENT.pairs.forEach((pair) => { endpointMap.set(pair.start, pair); endpointMap.set(pair.end, pair); });
const neighbours = (a: number, b: number) => Math.abs(Math.floor(a / size) - Math.floor(b / size)) + Math.abs(a % size - b % size) === 1;

export function FlowFree({ onComplete }: { onComplete: () => void }) {
  const [paths, setPaths] = useState<Paths>({});
  const [drawing, setDrawing] = useState<string | null>(null);
  const [message, setMessage] = useState("Connect the matching dots.");
  const gridRef = useRef<HTMLDivElement>(null);
  const occupied = useMemo(() => {
    const map = new Map<number, string>();
    Object.entries(paths).forEach(([id, cells]) => cells.forEach((cell) => map.set(cell, id)));
    return map;
  }, [paths]);
  const covered = new Set(Object.values(paths).flat());
  const completedPairs = FLOW_FREE_CONTENT.pairs.filter((pair) => { const path = paths[pair.id] ?? []; return (path[0] === pair.start && path.at(-1) === pair.end) || (path[0] === pair.end && path.at(-1) === pair.start); }).length;
  const won = completedPairs === FLOW_FREE_CONTENT.pairs.length && covered.size === size * size;

  const extend = (cell: number) => {
    if (!drawing) return;
    setPaths((current) => {
      const path = current[drawing] ?? [];
      const last = path.at(-1);
      if (last === undefined || last === cell || !neighbours(last, cell)) return current;
      if (Object.entries(current).some(([id, cells]) => id !== drawing && cells.includes(cell))) return current;
      const ownIndex = path.indexOf(cell);
      if (ownIndex >= 0) return { ...current, [drawing]: path.slice(0, ownIndex + 1) };
      const endpoint = endpointMap.get(cell);
      if (endpoint && endpoint.id !== drawing) return current;
      const pair = FLOW_FREE_CONTENT.pairs.find((p) => p.id === drawing)!;
      if (path.at(-1) === pair.end && path[0] !== pair.end) return current;
      if (path.at(-1) === pair.start && path[0] === pair.end) return current;
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
    if (at >= 0) setPaths((current) => ({ ...current, [id]: current[id]!.slice(0, at + 1) }));
    else setPaths((current) => ({ ...current, [id]: pair ? [cell] : [...currentPath, cell] }));
    setDrawing(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drawing) { const cell = cellAt(event); if (cell !== null) extend(cell); }
  };
  const end = () => {
    setDrawing(null);
    setMessage("Every square must be covered, with each pair connected.");
  };
  const reset = () => { setPaths({}); setDrawing(null); setMessage("Connect the matching dots."); };

  return <GameShell eyebrow="FLOW FREE" title={won ? "All connected." : FLOW_FREE_CONTENT.title} right="LEVEL 1 · 5×5">
    <p className="mb-5 text-sm text-foreground/75">{won ? "Every colour is connected and every square is filled." : FLOW_FREE_CONTENT.intro}</p>
    <div ref={gridRef} className="mx-auto grid aspect-square w-full max-w-[19rem] touch-none select-none gap-1 rounded-xl bg-card p-2 shadow-inner" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
      {Array.from({ length: size * size }, (_, cell) => {
        const owner = occupied.get(cell);
        const pair = endpointMap.get(cell);
        const color = FLOW_FREE_CONTENT.pairs.find((item) => item.id === owner || item.id === pair?.id)?.color;
        return <div key={cell} data-cell={cell} className="relative flex min-h-0 min-w-0 items-center justify-center rounded-md" style={{ background: owner ? `${FLOW_FREE_CONTENT.pairs.find((p) => p.id === owner)!.color}55` : "var(--secondary)" }}>
          {owner && <span className="absolute inset-0 rounded-md" style={{ background: FLOW_FREE_CONTENT.pairs.find((p) => p.id === owner)!.color, opacity: .28 }} />}
          {pair && <span className="relative z-10 h-[58%] w-[58%] rounded-full border-[3px] border-white shadow-sm" style={{ backgroundColor: color }} />}
          {!pair && owner && <span className="relative z-10 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
        </div>;
      })}
    </div>
    <p className="mt-4 min-h-10 text-sm text-muted-foreground">{won ? "Perfectly filled!" : `${completedPairs}/${FLOW_FREE_CONTENT.pairs.length} pairs connected · ${covered.size}/25 squares filled`}</p>
    <p className="mt-2 text-xs text-muted-foreground">{message}</p>
    <div className="mt-4 flex justify-center gap-3">{won ? <button className="next-button" type="button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button> : <button className="inline-flex items-center gap-1 text-sm text-muted-foreground" type="button" onClick={reset}><RotateCcw className="h-4 w-4" /> Start over</button>}</div>
  </GameShell>;
}
