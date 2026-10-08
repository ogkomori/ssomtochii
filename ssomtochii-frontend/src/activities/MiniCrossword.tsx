import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { MINI_CROSSWORD_CONTENT } from "@/lib/mini-crossword";

type Cell = { row: number; column: number; answer: string; number?: number };

function makeCells() {
  const cells = new Map<string, Cell>(); let number = 1;
  for (const entry of MINI_CROSSWORD_CONTENT.entries) entry.answer.split("").forEach((letter, index) => {
    const row = entry.row + (entry.direction === "down" ? index : 0); const column = entry.column + (entry.direction === "across" ? index : 0); const key = `${row}-${column}`;
    cells.set(key, { row, column, answer: letter, ...(index === 0 ? { number: number++ } : {}) });
  });
  return cells;
}

/** Compact crossword with editable entries and clues in lib/mini-crossword.ts. */
export function MiniCrossword() {
  const cells = useMemo(makeCells, []); const [values, setValues] = useState<Record<string, string>>({});
  const complete = [...cells.entries()].every(([key, cell]) => values[key] === cell.answer);
  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link></header><section className="paper-card my-6 flex flex-1 flex-col p-5 text-center sm:p-8"><div className="day-one-copy"><p className="day-one-eyebrow">MINI CROSSWORD</p><h1 className="font-script text-5xl leading-none">{complete ? "Lovely work." : MINI_CROSSWORD_CONTENT.title}</h1><p>{complete ? "Every little square is in its right place." : MINI_CROSSWORD_CONTENT.intro}</p></div><div className="crossword-grid my-6" style={{ gridTemplateColumns: `repeat(${MINI_CROSSWORD_CONTENT.size}, 1fr)` }}>{Array.from({ length: MINI_CROSSWORD_CONTENT.size ** 2 }, (_, index) => { const row = Math.floor(index / MINI_CROSSWORD_CONTENT.size); const column = index % MINI_CROSSWORD_CONTENT.size; const key = `${row}-${column}`; const cell = cells.get(key); return cell ? <label className="crossword-cell" key={key}>{cell.number && <span>{cell.number}</span>}<input value={values[key] ?? ""} maxLength={1} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value.toUpperCase() }))} aria-label={`Row ${row + 1}, column ${column + 1}`} /></label> : <span className="crossword-block" key={key} />; })}</div>{!complete && <div className="crossword-clues text-left">{MINI_CROSSWORD_CONTENT.entries.map((entry, index) => <p key={entry.id}><b>{index + 1} {entry.direction}</b> · {entry.clue}</p>)}</div>}{complete && <div className="mt-auto pt-7"><Link to="/" className="next-button">Back to all days <Check className="h-4 w-4" /></Link></div>}</section></div></main>;
}
