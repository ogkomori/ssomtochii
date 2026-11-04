import { useState } from "react";
import { Check, Lightbulb, RotateCcw, Undo2 } from "lucide-react";
import { GameShell } from "@/activities/Connections";

type Shape = "square" | "wide" | "tall";
type Clue = { id: string; row: number; col: number; size: number; shape: Shape };
type Patch = { clueId: string; cells: string[] };

const SIZE = 6;
const CLUES: Clue[] = [
  { id: "A", row: 0, col: 0, size: 4, shape: "square" },
  { id: "B", row: 0, col: 4, size: 8, shape: "wide" },
  { id: "C", row: 4, col: 0, size: 8, shape: "tall" },
  { id: "D", row: 3, col: 2, size: 4, shape: "square" },
  { id: "E", row: 2, col: 5, size: 4, shape: "square" },
  { id: "F", row: 5, col: 3, size: 8, shape: "wide" },
];
const REGION_STYLES = [
  "bg-rose-200/80 text-rose-950 border-rose-300",
  "bg-amber-200/80 text-amber-950 border-amber-300",
  "bg-emerald-200/80 text-emerald-950 border-emerald-300",
  "bg-sky-200/80 text-sky-950 border-sky-300",
  "bg-violet-200/80 text-violet-950 border-violet-300",
  "bg-pink-200/80 text-pink-950 border-pink-300",
];

const cellId = (row: number, col: number) => `${row}-${col}`;
const shapeLabel = (shape: Shape) => shape === "square" ? "□" : shape === "wide" ? "↔" : "↕";

export function Patches({ onComplete }: { onComplete: () => void }) {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [firstCell, setFirstCell] = useState<{ row: number; col: number } | null>(null);
  const [message, setMessage] = useState("Tap two opposite corners to draw a patch around one clue.");
  const [mistakes, setMistakes] = useState(0);
  const [hintedClue, setHintedClue] = useState<string | null>(null);

  const covered = new Set(patches.flatMap((patch) => patch.cells));
  const solvedClues = new Set(patches.map((patch) => patch.clueId));
  const complete = patches.length === CLUES.length && covered.size === SIZE * SIZE;
  const owners = new Map<string, number>();
  patches.forEach((patch, index) => patch.cells.forEach((cell) => owners.set(cell, index)));

  const chooseCell = (row: number, col: number) => {
    const id = cellId(row, col);
    if (covered.has(id)) return;
    if (!firstCell) {
      setFirstCell({ row, col });
      setMessage("Now tap the opposite corner of your rectangle.");
      return;
    }

    const top = Math.min(firstCell.row, row);
    const bottom = Math.max(firstCell.row, row);
    const left = Math.min(firstCell.col, col);
    const right = Math.max(firstCell.col, col);
    const cells: string[] = [];
    for (let r = top; r <= bottom; r += 1) {
      for (let c = left; c <= right; c += 1) cells.push(cellId(r, c));
    }

    const clueMatches = CLUES.filter((clue) => cells.includes(cellId(clue.row, clue.col)));
    const overlaps = cells.some((cell) => covered.has(cell));
    setFirstCell(null);

    if (overlaps) {
      setMistakes((count) => count + 1);
      setMessage("That rectangle overlaps a patch you've already placed. Try another.");
      return;
    }
    if (clueMatches.length !== 1) {
      setMistakes((count) => count + 1);
      setMessage(clueMatches.length === 0 ? "Every patch needs exactly one clue." : "A patch must not contain two clues.");
      return;
    }

    const clue = clueMatches[0]!;
    if (solvedClues.has(clue.id)) {
      setMistakes((count) => count + 1);
      setMessage("You've already placed the patch for this clue.");
      return;
    }
    const height = bottom - top + 1;
    const width = right - left + 1;
    const shapeFits = clue.shape === "square" ? height === width : clue.shape === "wide" ? width > height : height > width;
    if (cells.length !== clue.size || !shapeFits) {
      setMistakes((count) => count + 1);
      setMessage(`Not quite. Clue ${clue.size}${shapeLabel(clue.shape)} needs a ${clue.shape} patch with the right number of cells.`);
      return;
    }

    setPatches((current) => [...current, { clueId: clue.id, cells }]);
    setHintedClue(null);
    const nextCount = patches.length + 1;
    setMessage(nextCount === CLUES.length ? "Every cell is covered. You solved Patches!" : "Lovely! That patch fits. Keep going.");
  };

  const undo = () => {
    if (!patches.length) return;
    const last = patches[patches.length - 1]!;
    setPatches((current) => current.slice(0, -1));
    setMessage(`Undid the patch for clue ${CLUES.find((clue) => clue.id === last.clueId)!.size}.`);
    setFirstCell(null);
    setHintedClue(null);
  };

  const reset = () => {
    setPatches([]);
    setFirstCell(null);
    setMistakes(0);
    setHintedClue(null);
    setMessage("Tap two opposite corners to draw a patch around one clue.");
  };

  const hint = () => {
    const clue = CLUES.find((item) => !solvedClues.has(item.id));
    if (!clue) return;
    setHintedClue(clue.id);
    setMessage(`Hint: find a ${clue.shape} patch containing the ${clue.size}${shapeLabel(clue.shape)} clue.`);
  };

  return (
    <GameShell eyebrow="PATCHES" title="Fit every little piece." right={`${patches.length} / ${CLUES.length} PATCHES`}>
      <p className="mb-3 text-sm text-foreground/75">Divide the grid into rectangles. Each patch needs exactly one clue, must match its size and shape, and every cell must be used.</p>
      <div className="mb-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span>□ Square</span><span>↔ Wide</span><span>↕ Tall</span>
      </div>
      <div className="mx-auto grid w-full max-w-[340px] grid-cols-6 gap-1 rounded-xl bg-secondary/70 p-2">
        {Array.from({ length: SIZE * SIZE }, (_, index) => {
          const row = Math.floor(index / SIZE);
          const col = index % SIZE;
          const id = cellId(row, col);
          const clue = CLUES.find((item) => item.row === row && item.col === col);
          const owner = owners.get(id);
          const isFirst = firstCell?.row === row && firstCell?.col === col;
          const isHinted = clue?.id === hintedClue;
          return (
            <button
              type="button"
              key={id}
              onClick={() => chooseCell(row, col)}
              disabled={covered.has(id) || complete}
              aria-label={clue ? `Clue ${clue.size}, ${clue.shape} shape, row ${row + 1}, column ${col + 1}` : `Row ${row + 1}, column ${col + 1}`}
              className={`relative flex aspect-square min-w-0 items-center justify-center rounded-md border text-sm font-bold transition-all disabled:cursor-default ${owner !== undefined ? REGION_STYLES[owner % REGION_STYLES.length] : "border-border bg-background/80 text-foreground"} ${isFirst ? "ring-4 ring-primary ring-offset-1" : ""} ${isHinted ? "animate-pulse ring-4 ring-amber-400" : ""}`}
            >
              {clue && <span>{clue.size}<span className="ml-0.5 text-xs">{shapeLabel(clue.shape)}</span></span>}
              {!clue && owner === undefined && <span className="text-[10px] text-muted-foreground/35">·</span>}
              {owner !== undefined && !clue && <span className="text-[10px] opacity-50">✓</span>}
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-10 text-sm text-muted-foreground" aria-live="polite">{message}</p>
      <p className="mb-3 text-xs text-muted-foreground">{firstCell ? "Choose the opposite corner now." : "Tap any cell, then its opposite corner."} · {mistakes} {mistakes === 1 ? "mistake" : "mistakes"}</p>
      {complete ? (
        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold text-foreground">Perfect fit. Every cell belongs! ♡</p>
          <button type="button" className="next-button" onClick={onComplete}>Get today’s compliment <Check className="h-4 w-4" /></button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm" onClick={hint}><Lightbulb className="h-4 w-4" /> Hint</button>
          <button type="button" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm disabled:opacity-40" onClick={undo} disabled={!patches.length}><Undo2 className="h-4 w-4" /> Undo</button>
          <button type="button" className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-sm" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</button>
        </div>
      )}
    </GameShell>
  );
}
