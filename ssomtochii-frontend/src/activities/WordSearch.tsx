import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { WORD_SEARCH_CONTENT } from "@/lib/word-search";

type Point = { row: number; col: number };
const key = (p: Point) => p.row * WORD_SEARCH_CONTENT.size + p.col;
function getLine(start: Point, end: Point): number[] {
  const dr = end.row - start.row; const dc = end.col - start.col;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [key(start)];
  return Array.from({ length: steps + 1 }, (_, i) => key({ row: start.row + Math.sign(dr) * i, col: start.col + Math.sign(dc) * i }));
}
const placements: Record<string, [Point, Point]> = {
  LOVE: [{ row: 0, col: 0 }, { row: 0, col: 3 }],
  DREAM: [{ row: 1, col: 1 }, { row: 1, col: 5 }],
  HEART: [{ row: 2, col: 0 }, { row: 2, col: 4 }],
  SMILE: [{ row: 3, col: 0 }, { row: 3, col: 4 }],
  DANCE: [{ row: 4, col: 0 }, { row: 4, col: 4 }],
  MUSIC: [{ row: 0, col: 6 }, { row: 4, col: 6 }],
  TRAVEL: [{ row: 0, col: 7 }, { row: 5, col: 7 }],
  STAR: [{ row: 7, col: 0 }, { row: 7, col: 3 }],
};

export function WordSearch({ onComplete }: { onComplete: () => void }) {
  const [start, setStart] = useState<Point | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [message, setMessage] = useState("Tap the first and last letter of a word.");
  const words = WORD_SEARCH_CONTENT.words as readonly string[];
  const foundCells = new Set(found.flatMap((word) => getLine(placements[word]![0]!, placements[word]![1]!)));
  const choose = (point: Point) => {
    if (!start) { setStart(point); setMessage("Now tap the word’s last letter."); return; }
    const cells = getLine(start, point);
    const selectedWord = cells.map((cell) => WORD_SEARCH_CONTENT.grid[Math.floor(cell / WORD_SEARCH_CONTENT.size)]![cell % WORD_SEARCH_CONTENT.size]).join("");
    const reverse = selectedWord.split("").reverse().join("");
    const match = words.find((word) => (word === selectedWord || word === reverse) && !found.includes(word));
    if (match) { setFound((current) => [...current, match]); setMessage(`Found ${match}!`); }
    else setMessage("Not quite. Try another line.");
    setStart(null);
  };
  const reset = () => { setFound([]); setStart(null); setMessage("Tap the first and last letter of a word."); };
  const done = found.length === words.length;
  return <GameShell eyebrow="WORD SEARCH" title={done ? "Every word found." : WORD_SEARCH_CONTENT.title} right={`${found.length}/${words.length} WORDS`}>
    <p className="mb-4 text-sm text-foreground/75">{done ? "Nicely spotted. Every hidden word is yours." : WORD_SEARCH_CONTENT.intro}</p>
    <div className="mx-auto grid w-full max-w-[21rem] gap-1" style={{ gridTemplateColumns: `repeat(${WORD_SEARCH_CONTENT.size}, minmax(0, 1fr))` }}>
      {WORD_SEARCH_CONTENT.grid.flatMap((row, r) => row.map((letter, c) => {
        const cellKey = r * WORD_SEARCH_CONTENT.size + c;
        const isStart = start?.row === r && start.col === c;
        return <button key={cellKey} type="button" onClick={() => choose({ row: r, col: c })} className={`aspect-square rounded-md text-sm font-semibold transition-colors sm:text-base ${foundCells.has(cellKey) ? "bg-primary text-primary-foreground" : isStart ? "bg-amber-200 text-stone-900" : "bg-secondary text-foreground"}`}>{letter}</button>;
      }))}
    </div>
    <div className="mt-4 flex flex-wrap justify-center gap-2">{words.map((word) => <span key={word} className={`rounded-full px-3 py-1 text-xs font-semibold ${found.includes(word) ? "bg-primary/20 text-foreground line-through" : "bg-secondary text-muted-foreground"}`}>{word}</span>)}</div>
    <p className="mt-4 min-h-6 text-sm text-muted-foreground">{message}</p>
    <div className="mt-3 flex justify-center gap-3">{done ? <button className="next-button" type="button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button> : <button className="inline-flex items-center gap-1 text-sm text-muted-foreground" type="button" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</button>}</div>
  </GameShell>;
}
