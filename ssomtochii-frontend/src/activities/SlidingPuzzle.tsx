import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
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

// For an odd-width grid (3x3), a puzzle is solvable when its inversion
// count is even. The blank tile is excluded from the inversion count.
function countInversions(tiles: number[]): number {
  let inversions = 0;
  const numberedTiles = tiles.filter((tile) => tile !== blankTile);
  for (let i = 0; i < numberedTiles.length; i += 1) {
    for (let j = i + 1; j < numberedTiles.length; j += 1) {
      if (numberedTiles[i]! > numberedTiles[j]!) inversions += 1;
    }
  }
  return inversions;
}

function isSolvable(tiles: number[]): boolean {
  return gridSize % 2 === 1
    ? countInversions(tiles) % 2 === 0
    : (countInversions(tiles) + gridSize - Math.floor(tiles.indexOf(blankTile) / gridSize)) % 2 === 1;
}

// Shuffle a random permutation, then use the inversion method to reject
// unsolvable layouts. Also reject the already-solved layout.
function makePuzzle(): number[] {
  while (true) {
    const tiles = [...solvedPuzzle];
    for (let i = tiles.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j]!, tiles[i]!];
    }
    if (isSolvable(tiles) && !tiles.every((tile, index) => tile === index)) return tiles;
  }
}

/** Reusable sliding-puzzle activity; assign `sliding-puzzle` to a day when ready. */
export function SlidingPuzzle({ onComplete }: { onComplete: () => void }) {
  const [tiles, setTiles] = useState(makePuzzle);
  const [revealStage, setRevealStage] = useState<"puzzle" | "final-piece" | "full-picture">("puzzle");
  const solvedLayout = tiles.every((tile, index) => tile === index);
  const complete = revealStage === "full-picture";

  useEffect(() => {
    if (!solvedLayout) return;
    setRevealStage("final-piece");
    const timer = window.setTimeout(() => setRevealStage("full-picture"), 950);
    return () => window.clearTimeout(timer);
  }, [solvedLayout]);
  const move = (index: number) => {
    const blankIndex = tiles.indexOf(blankTile);
    if (!areNeighbours(index, blankIndex) || solvedLayout) return;
    setTiles((current) => { const next = [...current]; [next[index], next[blankIndex]] = [next[blankIndex]!, next[index]!]; return next; });
  };
  const backgroundImage = SLIDING_PUZZLE_CONTENT.image ? `url("${SLIDING_PUZZLE_CONTENT.image}")` : "linear-gradient(135deg, var(--blossom-2), var(--secondary) 42%, var(--primary))";

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link></header><section className="paper-card my-6 flex flex-1 flex-col items-center p-6 text-center sm:p-8"><div className="day-one-copy items-center"><p className="day-one-eyebrow">SLIDING PUZZLE</p><h1 className="font-script text-5xl leading-none">{complete ? "A perfect picture." : SLIDING_PUZZLE_CONTENT.title}</h1><p>{complete ? "You put every little piece where it belongs." : SLIDING_PUZZLE_CONTENT.intro}</p></div><div className={`sliding-puzzle my-auto ${complete ? "is-complete" : ""}`} role="group" aria-label={SLIDING_PUZZLE_CONTENT.imageAlt}>{tiles.map((tile, index) => { if (tile === blankTile) { const finalPieceStyle = { backgroundImage, backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`, backgroundPosition: `${(gridSize - 1) * 50}% ${(gridSize - 1) * 50}%` }; return solvedLayout && revealStage !== "puzzle" ? <span className="puzzle-final-tile" key="blank" style={finalPieceStyle} role="img" aria-label="The final piece of the completed picture" /> : <span className="puzzle-blank" key="blank" />; } const sourceRow = Math.floor(tile / gridSize); const sourceColumn = tile % gridSize; return <button type="button" key={tile} className="puzzle-tile" onClick={() => move(index)} style={{ backgroundImage, backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`, backgroundPosition: `${sourceColumn * 50}% ${sourceRow * 50}%` }} aria-label={`Move picture tile ${tile + 1}`}><span>{SLIDING_PUZZLE_CONTENT.image ? "" : tile + 1}</span></button>; })}{complete && <div className="sliding-puzzle-full-image" style={{ backgroundImage, backgroundSize: "100% 100%" }} role="img" aria-label={SLIDING_PUZZLE_CONTENT.imageAlt} /> }</div><div className="mt-auto pt-8">{complete ? <button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button> : <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={() => { setRevealStage("puzzle"); setTiles(makePuzzle()); }}><RotateCcw className="h-4 w-4" /> Shuffle again</button>}</div></section></div></main>;
}
