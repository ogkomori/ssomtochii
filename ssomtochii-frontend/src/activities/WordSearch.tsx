import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { WORD_SEARCH_CONTENT } from "@/lib/activities/word-search";

type Cell = { row: number; column: number };
type FoundPath = { word: string; cells: string[] };

function getLine(start: Cell, end: Cell): Cell[] | null {
  const rowDelta = end.row - start.row;
  const columnDelta = end.column - start.column;
  const distance = Math.max(Math.abs(rowDelta), Math.abs(columnDelta));
  if (distance === 0) return null;
  if (rowDelta !== 0 && columnDelta !== 0 && Math.abs(rowDelta) !== Math.abs(columnDelta)) return null;
  const rowStep = Math.sign(rowDelta);
  const columnStep = Math.sign(columnDelta);
  return Array.from({ length: distance + 1 }, (_, index) => ({
    row: start.row + rowStep * index,
    column: start.column + columnStep * index,
  }));
}

/** Day 13 word search. Tap the first and last letters of each hidden word. */
export function WordSearch({ onComplete }: { onComplete: () => void }) {
  const [start, setStart] = useState<Cell | null>(null);
  const [found, setFound] = useState<FoundPath[]>([]);
  const [message, setMessage] = useState("Tap the first letter, then the last letter of a word.");
  const grid = WORD_SEARCH_CONTENT.grid;
  const foundCells = new Set(found.flatMap((path) => path.cells));
  const complete = found.length === WORD_SEARCH_CONTENT.words.length;

  const chooseCell = (cell: Cell) => {
    if (!start) {
      setStart(cell);
      setMessage("Now tap the word's final letter.");
      return;
    }
    const line = getLine(start, cell);
    setStart(null);
    if (!line) {
      setMessage("Choose a straight line, horizontal, vertical or diagonal.");
      return;
    }
    const cellKeys = line.map(({ row, column }) => `${row}-${column}`);
    const candidate = line.map(({ row, column }) => grid[row]?.[column] ?? "").join("");
    const reversed = candidate.split("").reverse().join("");
    const word = WORD_SEARCH_CONTENT.words.find((item) =>
      (item === candidate || item === reversed) && !found.some((path) => path.word === item)
    );
    if (!word) {
      setMessage("Not quite. Try another word.");
      return;
    }
    setFound((current) => [...current, { word, cells: cellKeys }]);
    setMessage(`Found ${word}! Keep going.`);
  };

  const reset = () => {
    setStart(null);
    setFound([]);
    setMessage("Tap the first letter, then the last letter of a word.");
  };

  return (
    <GameShell
      eyebrow={`WORD SEARCH · ${found.length} OF ${WORD_SEARCH_CONTENT.words.length} FOUND`}
      title={complete ? "You found them all!" : WORD_SEARCH_CONTENT.title}
    >
      <div className="mx-auto w-full max-w-[26rem]">
        <p className="mb-4 text-sm text-foreground/75">{WORD_SEARCH_CONTENT.intro}</p>
        <p className="mb-3 min-h-10 text-sm font-medium text-primary" aria-live="polite">{complete ? "Every word found. Lovely work!" : message}</p>
        {!complete && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {WORD_SEARCH_CONTENT.words.map((word) => (
              <div key={word} className={`rounded-lg border px-2 py-1.5 text-xs font-semibold tracking-wide transition-colors ${found.some((path) => path.word === word) ? "border-primary/40 bg-primary/10 text-primary line-through" : "border-border/70 bg-background/60 text-foreground"}`}>
                {word}
              </div>
            ))}
          </div>
        )}
        <div
          className="mx-auto mt-4 grid w-full max-w-[24rem] gap-1 rounded-xl border border-border/70 bg-background/70 p-2 shadow-inner"
          style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 12}, minmax(0, 1fr))` }}
          aria-label="Word search letter grid"
        >
          {grid.flatMap((row, rowIndex) => row.map((letter, columnIndex) => {
            const key = `${rowIndex}-${columnIndex}`;
            const isFound = foundCells.has(key);
            const isStart = start?.row === rowIndex && start.column === columnIndex;
            return (
              <button
                type="button"
                key={key}
                onClick={() => chooseCell({ row: rowIndex, column: columnIndex })}
                disabled={complete || isFound}
                aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}, ${letter}`}
                className={`aspect-square min-w-0 rounded-md text-[clamp(.58rem,2.5vw,.9rem)] font-bold transition-colors sm:rounded-lg ${isFound ? "bg-primary text-primary-foreground" : isStart ? "bg-secondary text-secondary-foreground ring-2 ring-primary" : "bg-muted/70 text-foreground hover:bg-secondary"}`}
              >
                {letter}
              </button>
            );
          }))}
        </div>
        {complete ? (
          <button type="button" className="next-button mt-6 w-full" onClick={onComplete}>
            Get today’s compliment <Check className="h-4 w-4" />
          </button>
        ) : (
          <div className="mt-5 flex items-center justify-center">
            <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Start over
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
