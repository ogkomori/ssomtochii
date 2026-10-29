import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Botanicals } from "@/components/Botanicals";
import { MINI_CROSSWORD_CONTENT } from "@/lib/activities/mini-crossword";

type Cell = { row: number; column: number; answer: string; number?: number };
type Entry = (typeof MINI_CROSSWORD_CONTENT.entries)[number];
type Direction = "across" | "down";

function getEntryNumbers(entries: readonly Entry[]) {
  const starts = [...new Set(entries.map((entry) => `${entry.row}-${entry.column}`))]
    .map((key) => {
      const [row, column] = key.split("-").map(Number);
      return { key, row, column };
    })
    .sort((a, b) => a.row - b.row || a.column - b.column);

  return new Map(starts.map((start, index) => [start.key, index + 1]));
}

function getEntryCellKeys(entry: Entry) {
  return entry.answer.toUpperCase().split("").map((_, index) => {
    const row = entry.row + (entry.direction === "down" ? index : 0);
    const column = entry.column + (entry.direction === "across" ? index : 0);
    return `${row}-${column}`;
  });
}

function makeCells() {
  const cells = new Map<string, Cell>();
  const entryNumbers = getEntryNumbers(MINI_CROSSWORD_CONTENT.entries);

  for (const entry of MINI_CROSSWORD_CONTENT.entries) {
    entry.answer.toUpperCase().split("").forEach((letter, index) => {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const column = entry.column + (entry.direction === "across" ? index : 0);
      const key = `${row}-${column}`;
      const previous = cells.get(key);
      cells.set(key, {
        row,
        column,
        answer: letter,
        ...(index === 0 ? { number: entryNumbers.get(key) } : previous?.number ? { number: previous.number } : {}),
      });
    });
  }

  return cells;
}

function ClueSection({
  title,
  entries,
  numbers,
  activeEntryId,
}: {
  title: string;
  entries: readonly Entry[];
  numbers: Map<string, number>;
  activeEntryId?: number;
}) {
  return (
    <section className="crossword-clues min-w-0">
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{title}</h2>
      {entries.length ? entries.map((entry) => {
        const number = numbers.get(`${entry.row}-${entry.column}`);
        return (
          <p className={`crossword-clue ${entry.id === activeEntryId ? "is-active" : ""}`} key={entry.id}>
            <b>{number}.</b> {entry.clue || <span className="italic text-muted-foreground">Add your hint in mini-crossword.ts.</span>}
          </p>
        );
      }) : <p className="text-xs text-muted-foreground">No {title.toLowerCase()} entries.</p>}
    </section>
  );
}

/** Edit the grid, answers, clues, and positions in lib/mini-crossword.ts. */
export function MiniCrossword({ onComplete }: { onComplete: () => void }) {
  const cells = useMemo(makeCells, []);
  const entryNumbers = useMemo(() => getEntryNumbers(MINI_CROSSWORD_CONTENT.entries), []);
  // A clue is identified by its direction and starting square. If the config
  // accidentally contains duplicate entries for the same start, show that clue once.
  const uniqueEntries = useMemo(() => {
    const seen = new Set<string>();
    return MINI_CROSSWORD_CONTENT.entries.filter((entry) => {
      const key = `${entry.direction}-${entry.row}-${entry.column}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);
  const across = uniqueEntries.filter((entry) => entry.direction === "across");
  const down = uniqueEntries.filter((entry) => entry.direction === "down");
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [activeDirection, setActiveDirection] = useState<Direction>("across");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // Unlock the reward only when every configured word is fully and correctly entered.
  const complete = uniqueEntries.length > 0 && uniqueEntries.every((entry) =>
    getEntryCellKeys(entry).every((key, index) => values[key] === entry.answer.toUpperCase()[index]),
  );
  const rows = MINI_CROSSWORD_CONTENT.rows;
  const columns = MINI_CROSSWORD_CONTENT.columns;
  const gridWidth = `min(100%, ${Math.min(columns * 34, 442)}px)`;

  const entriesAtCell = (key: string) => uniqueEntries.filter((entry) => getEntryCellKeys(entry).includes(key));
  const activeEntry = activeCell
    ? uniqueEntries.find((entry) => entry.direction === activeDirection && getEntryCellKeys(entry).includes(activeCell))
      ?? uniqueEntries.find((entry) => getEntryCellKeys(entry).includes(activeCell))
    : undefined;
  const activeKeys = activeEntry ? getEntryCellKeys(activeEntry) : [];
  const activeEntryId = activeEntry?.id;

  useEffect(() => {
    if (activeCell) inputRefs.current[activeCell]?.focus();
  }, [activeCell]);

  const chooseCell = (key: string) => {
    const entries = entriesAtCell(key);
    if (!entries.length) return;
    if (key === activeCell) {
      const otherDirection = entries.find((entry) => entry.direction !== activeDirection);
      if (otherDirection) setActiveDirection(otherDirection.direction);
      return;
    }
    const preferred = entries.find((entry) => entry.direction === "across") ?? entries[0];
    setActiveDirection(preferred.direction);
    setActiveCell(key);
  };

  const moveWithinEntry = (key: string, offset: number) => {
    const index = activeKeys.indexOf(key);
    const target = activeKeys[index + offset];
    if (target) setActiveCell(target);
  };

  const handleLetter = (key: string, rawValue: string) => {
    const letter = rawValue.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
    if (!letter) return;
    setValues((current) => ({ ...current, [key]: letter }));
    const index = activeKeys.indexOf(key);
    const next = activeKeys[index + 1];
    if (next) setActiveCell(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, key: string) => {
    const keyMoves: Record<string, [number, number]> = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    };
    if (event.key in keyMoves) {
      event.preventDefault();
      const [rowDelta, columnDelta] = keyMoves[event.key];
      const [row, column] = key.split("-").map(Number);
      const target = `${row + rowDelta}-${column + columnDelta}`;
      if (cells.has(target)) {
        setActiveCell(target);
        const options = entriesAtCell(target);
        if (!options.some((entry) => entry.direction === activeDirection)) {
          setActiveDirection(options[0]?.direction ?? activeDirection);
        }
      }
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      if (values[key]) {
        setValues((current) => ({ ...current, [key]: "" }));
      } else {
        const index = activeKeys.indexOf(key);
        const previous = activeKeys[index - 1];
        if (previous) {
          setValues((current) => ({ ...current, [previous]: "" }));
          setActiveCell(previous);
        }
      }
    }
  };

  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-6xl flex-col">
        <header className="pt-2">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> All days
          </Link>
        </header>

        <section className="paper-card my-3 flex flex-1 flex-col p-3 sm:my-4 sm:p-5 lg:p-6">
          <div className="day-one-copy mb-3 gap-2 text-center">
            <p className="day-one-eyebrow">MINI CROSSWORD</p>
            <h1 className="font-script text-4xl leading-none sm:text-5xl">{complete ? "Great work!" : MINI_CROSSWORD_CONTENT.title}</h1>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6">
            <div className="flex min-w-0 justify-center lg:sticky lg:top-4">
              <div
                className="crossword-grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  width: gridWidth,
                }}
              >
                {Array.from({ length: rows * columns }, (_, index) => {
                  const row = Math.floor(index / columns);
                  const column = index % columns;
                  const key = `${row}-${column}`;
                  const cell = cells.get(key);
                  const isActiveWord = activeKeys.includes(key);
                  const isCurrentCell = activeCell === key;

                  return cell ? (
                    <label className={`crossword-cell ${isActiveWord ? "is-active-word" : ""} ${isCurrentCell ? "is-current-cell" : ""}`} key={key}>
                      {cell.number && <span>{cell.number}</span>}
                      <input
                        ref={(node) => { inputRefs.current[key] = node; }}
                        value={values[key] ?? ""}
                        maxLength={1}
                        onClick={() => chooseCell(key)}
                        onChange={(event) => handleLetter(key, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event, key)}
                        aria-label={`Row ${row + 1}, column ${column + 1}`}
                        aria-current={isCurrentCell ? "true" : undefined}
                        autoCapitalize="characters"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </label>
                  ) : <span className="crossword-block" key={key} />;
                })}
              </div>
            </div>

            {!complete ? (
              <div className="flex min-w-0 flex-col gap-3">
                <ClueSection title="Across" entries={across} numbers={entryNumbers} activeEntryId={activeDirection === "across" ? activeEntryId : undefined} />
                <ClueSection title="Down" entries={down} numbers={entryNumbers} activeEntryId={activeDirection === "down" ? activeEntryId : undefined} />
              </div>
            ) : (
              <div className="flex min-h-32 flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-foreground/75">You found every word! Ready for today's compliment?</p>
                <button type="button" className="next-button" onClick={onComplete}>
                  Get today’s compliment <Check className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
