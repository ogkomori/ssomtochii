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

/** The puzzle layout and clues are customised in lib/mini-crossword.ts. */
export function MiniCrossword({ onComplete }: { onComplete: () => void }) {
  const cells = useMemo(makeCells, []);
  const [values, setValues] = useState<Record<string, string>>({});
  const complete = cells.size > 0 && [...cells.entries()].every(([key, cell]) => values[key] === cell.answer);

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link></header><section className="paper-card my-6 flex flex-1 flex-col p-5 text-center sm:p-8"><div className="day-one-copy"><p className="day-one-eyebrow">MINI CROSSWORD</p><h1 className="font-script text-5xl leading-none">{complete ? "Lovely work." : MINI_CROSSWORD_CONTENT.title}</h1><p>{complete ? "Every little square is in its right place." : MINI_CROSSWORD_CONTENT.intro}</p></div><div className="crossword-grid my-6" style={{ gridTemplateColumns: `repeat(${MINI_CROSSWORD_CONTENT.size}, 1fr)` }}>{Array.from({ length: MINI_CROSSWORD_CONTENT.size ** 2 }, (_, index) => { const row = Math.floor(index / MINI_CROSSWORD_CONTENT.size); const column = index % MINI_CROSSWORD_CONTENT.size; const key = `${row}-${column}`; const cell = cells.get(key); return cell ? <label className="crossword-cell" key={key}>{cell.number && <span>{cell.number}</span>}<input value={values[key] ?? ""} maxLength={1} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value.toUpperCase().replace(/[^A-Z]/g, "") }))} aria-label={`Row ${row + 1}, column ${column + 1}`} /></label> : <span className="crossword-block" key={key} />; })}</div>{!complete && <div className="crossword-clues text-left">{MINI_CROSSWORD_CONTENT.entries.map((entry) => { const number = getEntryNumbers(MINI_CROSSWORD_CONTENT.entries).get(`${entry.row}-${entry.column}`); return <p key={entry.id}><b>{number} {entry.direction}</b> · {entry.clue}</p>; })}</div>}{complete && <div className="mt-auto pt-7"><button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button></div>}</section></div></main>;
}
