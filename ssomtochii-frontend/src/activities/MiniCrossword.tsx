import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { MINI_CROSSWORD_CONTENT } from "@/lib/mini-crossword";

type Cell = { row: number; column: number; answer: string; number?: number };
type Entry = (typeof MINI_CROSSWORD_CONTENT.entries)[number];

function getEntryNumbers(entries: readonly Entry[]) {
  const starts = [...new Set(entries.map((entry) => `${entry.row}-${entry.column}`))]
    .map((key) => {
      const [row, column] = key.split("-").map(Number);
      return { key, row, column };
    })
    .sort((a, b) => a.row - b.row || a.column - b.column);

  return new Map(starts.map((start, index) => [start.key, index + 1]));
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

function ClueSection({ title, entries, numbers }: { title: string; entries: readonly Entry[]; numbers: Map<string, number> }) {
  return (
    <section className="crossword-clues min-w-0">
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{title}</h2>
      {entries.length ? entries.map((entry) => {
        const number = numbers.get(`${entry.row}-${entry.column}`);
        return (
          <p className="crossword-clue" key={entry.id}>
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
  const complete = cells.size > 0 && [...cells.entries()].every(([key, cell]) => values[key] === cell.answer);
  const rows = MINI_CROSSWORD_CONTENT.rows;
  const columns = MINI_CROSSWORD_CONTENT.columns;
  const gridWidth = `min(100%, ${Math.min(columns * 34, 442)}px)`;

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
            <h1 className="font-script text-4xl leading-none sm:text-5xl">{complete ? "Lovely work." : MINI_CROSSWORD_CONTENT.title}</h1>
            <p className="text-sm">{complete ? "Every little square is in its right place." : MINI_CROSSWORD_CONTENT.intro}</p>
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

                  return cell ? (
                    <label className="crossword-cell" key={key}>
                      {cell.number && <span>{cell.number}</span>}
                      <input
                        value={values[key] ?? ""}
                        maxLength={1}
                        onChange={(event) => setValues((current) => ({
                          ...current,
                          [key]: event.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                        }))}
                        aria-label={`Row ${row + 1}, column ${column + 1}`}
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
                <ClueSection title="Across" entries={across} numbers={entryNumbers} />
                <ClueSection title="Down" entries={down} numbers={entryNumbers} />
              </div>
            ) : (
              <div className="flex min-h-32 flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-foreground/75">You found every word. Here's a little something for you.</p>
                <button type="button" className="next-button" onClick={onComplete}>
                  Get today’s letter <Check className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
