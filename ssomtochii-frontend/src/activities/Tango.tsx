import { useMemo, useState } from "react";
import { Check, Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { GameShell } from "@/activities/Connections";

type Cell = 0 | 1 | null;
type Edge = { row: number; col: number; direction: "right" | "down"; same: boolean };

const SIZE = 6;
const SUN = 0 as const;
const MOON = 1 as const;
const SOLUTION: Exclude<Cell, null>[][] = [
  [1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 1],
  [0, 1, 1, 0, 1, 0],
  [1, 1, 0, 1, 0, 0],
  [0, 0, 1, 1, 0, 1],
  [0, 0, 1, 0, 1, 1],
];
const START: Cell[][] = [
  [1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 1],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [0, null, null, null, null, null],
  [null, null, null, null, null, 1],
];
const EDGES: Edge[] = [
  { row: 4, col: 0, direction: "right", same: true },
  { row: 5, col: 0, direction: "right", same: true },
  { row: 4, col: 2, direction: "right", same: true },
  { row: 5, col: 2, direction: "right", same: false },
  { row: 4, col: 4, direction: "right", same: false },
  { row: 5, col: 4, direction: "right", same: true },
];

const key = (row: number, col: number) => `${row}-${col}`;
const edgeKey = (edge: Edge) => edge.direction === "right"
  ? `${key(edge.row, edge.col)}|${key(edge.row, edge.col + 1)}`
  : `${key(edge.row, edge.col)}|${key(edge.row + 1, edge.col)}`;

function violations(grid: Cell[][]) {
  const errors = new Set<string>();
  for (let r = 0; r < SIZE; r += 1) {
    const row = grid[r]!;
    const filled = row.filter((cell) => cell !== null);
    if (filled.length === SIZE && filled.filter((cell) => cell === SUN).length !== SIZE / 2) {
      row.forEach((cell, c) => errors.add(key(r, c)));
    }
    for (let c = 0; c < SIZE - 2; c += 1) {
      if (row[c] !== null && row[c] === row[c + 1] && row[c] === row[c + 2]) {
        errors.add(key(r, c)); errors.add(key(r, c + 1)); errors.add(key(r, c + 2));
      }
    }
  }
  for (let c = 0; c < SIZE; c += 1) {
    const column = grid.map((row) => row[c] ?? null);
    const filled = column.filter((cell) => cell !== null);
    if (filled.length === SIZE && filled.filter((cell) => cell === SUN).length !== SIZE / 2) {
      column.forEach((cell, r) => errors.add(key(r, c)));
    }
    for (let r = 0; r < SIZE - 2; r += 1) {
      if (column[r] !== null && column[r] === column[r + 1] && column[r] === column[r + 2]) {
        errors.add(key(r, c)); errors.add(key(r + 1, c)); errors.add(key(r + 2, c));
      }
    }
  }
  for (const edge of EDGES) {
    const nextRow = edge.row + (edge.direction === "down" ? 1 : 0);
    const nextCol = edge.col + (edge.direction === "right" ? 1 : 0);
    const a = grid[edge.row]![edge.col];
    const b = grid[nextRow]![nextCol];
    if (a !== null && b !== null && (edge.same ? a !== b : a === b)) {
      errors.add(key(edge.row, edge.col)); errors.add(key(nextRow, nextCol));
    }
  }
  return errors;
}

export function Tango({ onComplete }: { onComplete: () => void }) {
  const [grid, setGrid] = useState<Cell[][]>(() => START.map((row) => [...row]));
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [hinted, setHinted] = useState<string | null>(null);
  const [message, setMessage] = useState("Fill every cell with a sun or a moon. Follow all the clues.");
  const fixed = useMemo(() => new Set(START.flatMap((row, r) => row.map((cell, c) => cell !== null ? key(r, c) : null).filter((cell): cell is string => cell !== null))), []);
  const errors = violations(grid);
  const filled = grid.flat().filter((cell) => cell !== null).length;
  const complete = filled === SIZE * SIZE && errors.size === 0;

  const place = (row: number, col: number) => {
    const id = key(row, col);
    if (fixed.has(id) || complete) return;
    setHistory((items) => [...items, grid.map((line) => [...line])]);
    setGrid((current) => current.map((line, r) => line.map((cell, c) =>
      r !== row || c !== col ? cell : cell === null ? SUN : cell === SUN ? MOON : null
    )));
    setHinted(null);
    setMessage("Keep balancing each row and column.");
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setGrid(previous);
    setHistory((items) => items.slice(0, -1));
    setMessage("Last move undone.");
  };

  const reset = () => {
    setGrid(START.map((row) => [...row]));
    setHistory([]);
    setHinted(null);
    setMessage("Board reset. Take your time!");
  };

  const hint = () => {
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        if (grid[r]![c] === null) {
          setHinted(key(r, c));
          setMessage(`Hint: row ${r + 1}, column ${c + 1} needs a ${SOLUTION[r]![c] === SUN ? "sun" : "moon"}.`);
          return;
        }
      }
    }
  };

  const edgeMarks = new Map(EDGES.map((edge) => [edgeKey(edge), edge.same ? "=" : "×"]));

  return (
    <GameShell eyebrow="TANGO" title={complete ? "Perfectly in sync." : "A little sun and moon."} right={`${filled} / 36 CELLS`}>
      <p className="mb-4 text-sm text-foreground/75">Fill the grid with suns ☀️ and moons 🌙. Every row and column needs three of each. Never place three matching symbols in a line.</p>
      <div className="mx-auto w-full max-w-[340px]">
        <div className="grid grid-cols-6 gap-1">
          {grid.map((row, r) => row.map((cell, c) => {
            const id = key(r, c);
            const isFixed = fixed.has(id);
            const bad = errors.has(id);
            const isHint = hinted === id;
            return (
              <div key={id} className="relative">
                <button type="button" onClick={() => place(r, c)} disabled={isFixed || complete} aria-label={`Row ${r + 1}, column ${c + 1}, ${cell === SUN ? "sun" : cell === MOON ? "moon" : "empty"}`} className={`flex aspect-square w-full items-center justify-center rounded-lg border text-2xl transition-all ${isFixed ? "border-primary/20 bg-secondary/80" : "border-border bg-background hover:bg-secondary/50"} ${bad ? "border-red-500 bg-red-100/70" : ""} ${isHint ? "ring-4 ring-amber-400" : ""}`}>
                  {cell === SUN ? "☀️" : cell === MOON ? "🌙" : <span className="text-muted-foreground/30">·</span>}
                </button>
                {c < SIZE - 1 && edgeMarks.has(`${id}|${key(r, c + 1)}`) && <span className="pointer-events-none absolute -right-[7px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-background px-0.5 text-xs font-black">{edgeMarks.get(`${id}|${key(r, c + 1)}`)}</span>}
                {r < SIZE - 1 && edgeMarks.has(`${id}|${key(r + 1, c)}`) && <span className="pointer-events-none absolute -bottom-[7px] left-1/2 z-10 -translate-x-1/2 rounded-full bg-background px-0.5 text-xs font-black">{edgeMarks.get(`${id}|${key(r + 1, c)}`)}</span>}
              </div>
            );
          }))}
        </div>
      </div>
      <div className="my-3 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground"><span>= Same</span><span>× Different</span><span>☀️ Sun</span><span>🌙 Moon</span></div>
      <p className="min-h-10 text-sm text-muted-foreground" aria-live="polite">{message}</p>
      {complete ? (
        <div className="mt-3 flex flex-col items-center gap-3">
          <p className="font-semibold">You brought the whole grid into balance! ♡</p>
          <button type="button" className="next-button" onClick={onComplete}>Get today’s compliment <Check className="h-4 w-4" /></button>
        </div>
      ) : (
        <>
          <p className={`mb-2 text-xs ${errors.size ? "text-red-600" : "text-muted-foreground"}`} aria-live="polite">{errors.size ? `${errors.size} cells break one or more rules.` : "No rule violations so far."}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm" onClick={hint}><Lightbulb className="h-4 w-4" /> Hint</button>
            <button type="button" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm disabled:opacity-40" onClick={undo} disabled={!history.length}><Undo2 className="h-4 w-4" /> Undo</button>
            <button type="button" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</button>
          </div>
        </>
      )}
    </GameShell>
  );
}
