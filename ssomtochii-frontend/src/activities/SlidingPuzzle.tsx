import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { SLIDING_PUZZLE_CONTENT } from "@/lib/sliding-puzzle";

const { gridSize } = SLIDING_PUZZLE_CONTENT;
const blankTile = gridSize * gridSize - 1;
const solvedPuzzle = Array.from({ length: gridSize * gridSize }, (_, index) => index);

function areNeighbours(first: number, second: number) {
  const firstRow = Math.floor(first / gridSize); const firstColumn = first % gridSize;
  const secondRow = Math.floor(second / gridSize); const secondColumn = second % gridSize;
  return Math.abs(firstRow - secondRow) + Math.abs(firstColumn - secondColumn) === 1;
}

// Shuffle by making legal moves from the solved state, which guarantees a solvable puzzle.
function makePuzzle(): number[] {
  const tiles = [...solvedPuzzle]; let blankIndex = blankTile;
  for (let move = 0; move < 100; move += 1) {
    const candidates = tiles.map((_, index) => index).filter((index) => areNeighbours(index, blankIndex));
    const nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    if (nextIndex === undefined) continue;
    [tiles[blankIndex], tiles[nextIndex]] = [tiles[nextIndex]!, tiles[blankIndex]!];
    blankIndex = nextIndex;
  }
  return tiles.every((tile, index) => tile === index) ? makePuzzle() : tiles;
}

/** Reusable sliding-puzzle activity; assign `sliding-puzzle` to a day when ready. */
export function SlidingPuzzle() {
  const [tiles, setTiles] = useState(makePuzzle); const complete = tiles.every((tile, index) => tile === index);
  const move = (index: number) => {
    const blankIndex = tiles.indexOf(blankTile);
    if (!areNeighbours(index, blankIndex) || complete) return;
    setTiles((current) => { const next = [...current]; [next[index], next[blankIndex]] = [next[blankIndex]!, next[index]!]; return next; });
  };
  const backgroundImage = SLIDING_PUZZLE_CONTENT.image ? `url("${SLIDING_PUZZLE_CONTENT.image}")` : "linear-gradient(135deg, var(--blossom-2), var(--secondary) 42%, var(--primary))";

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link></header><section className="paper-card my-6 flex flex-1 flex-col items-center p-6 text-center sm:p-8"><div className="day-one-copy items-center"><p className="day-one-eyebrow">SLIDING PUZZLE</p><h1 className="font-script text-5xl leading-none">{complete ? "A perfect picture." : SLIDING_PUZZLE_CONTENT.title}</h1><p>{complete ? "You put every little piece where it belongs." : SLIDING_PUZZLE_CONTENT.intro}</p></div><div className="sliding-puzzle my-auto" role="group" aria-label={SLIDING_PUZZLE_CONTENT.imageAlt}>{tiles.map((tile, index) => { if (tile === blankTile) return <span className="puzzle-blank" key="blank" />; const sourceRow = Math.floor(tile / gridSize); const sourceColumn = tile % gridSize; return <button type="button" key={tile} className="puzzle-tile" onClick={() => move(index)} style={{ backgroundImage, backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`, backgroundPosition: `${sourceColumn * 50}% ${sourceRow * 50}%` }} aria-label={`Move picture tile ${tile + 1}`}><span>{SLIDING_PUZZLE_CONTENT.image ? "" : tile + 1}</span></button>; })}</div><div className="mt-auto pt-8">{complete ? <Link to="/" className="next-button">Back to all days <Check className="h-4 w-4" /></Link> : <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={() => setTiles(makePuzzle())}><RotateCcw className="h-4 w-4" /> Shuffle again</button>}</div></section></div></main>;
}
