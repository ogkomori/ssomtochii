import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { WORD_SCRAMBLE_CONTENT } from "@/lib/word-scramble";

/**
 * Reusable Word Scramble activity. Its content is supplied from
 * lib/word-scramble.ts, so it can be assigned to any day in lib/days.ts.
 */
export function WordScramble() {
  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState(() => makeTiles(WORD_SCRAMBLE_CONTENT.words[0].scramble));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [complete, setComplete] = useState(false);
  const word = WORD_SCRAMBLE_CONTENT.words[wordIndex] ?? WORD_SCRAMBLE_CONTENT.words[0];

  if (complete) return <ScrambleComplete />;

  const check = () => setIsCorrect(letters.map((tile) => tile.letter).join("") === word.answer);
  const continueGame = () => {
    if (wordIndex === WORD_SCRAMBLE_CONTENT.words.length - 1) setComplete(true);
    else {
      const nextIndex = wordIndex + 1;
      setWordIndex(nextIndex);
      const nextWord = WORD_SCRAMBLE_CONTENT.words[nextIndex];
      if (nextWord) setLetters(makeTiles(nextWord.scramble));
      setIsCorrect(null);
    }
  };

  const moveTile = (draggedId: string, targetId: string) => setLetters((current) => {
    const from = current.findIndex((tile) => tile.id === draggedId);
    const to = current.findIndex((tile) => tile.id === targetId);
    if (from < 0 || to < 0 || from === to) return current;
    const next = [...current];
    const [dragged] = next.splice(from, 1);
    if (!dragged) return current;
    next.splice(to, 0, dragged);
    return next;
  });

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
    <header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{wordIndex + 1} / {WORD_SCRAMBLE_CONTENT.words.length}</span></header>
    <section className="paper-card my-6 flex flex-1 flex-col p-6 text-center sm:p-8"><div className="day-one-copy"><p className="day-one-eyebrow">WORD SCRAMBLE</p><h1 className="font-script text-5xl leading-none">{WORD_SCRAMBLE_CONTENT.title}</h1><p>{wordIndex === 0 ? WORD_SCRAMBLE_CONTENT.intro : "Here’s the next one."}</p><p className="scramble-clue">{word.clue}</p><p className="text-xs text-muted-foreground">Press and drag the letters into the right order.</p><div className="scramble-letters" aria-label={`Arrange the letters to answer: ${word.clue}`}>{letters.map((tile) => <button type="button" key={tile.id} data-letter-id={tile.id} className={`scramble-tile ${draggingId === tile.id ? "is-dragging" : ""}`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDraggingId(tile.id); setIsCorrect(null); }} onPointerMove={(event) => { if (!draggingId) return; const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-letter-id]")?.dataset["letterId"]; if (target) moveTile(draggingId, target); }} onPointerUp={() => setDraggingId(null)} onPointerCancel={() => setDraggingId(null)} aria-label={`Letter ${tile.letter}`}>{tile.letter}</button>)}</div></div>
      <div className="mt-auto pt-8">{isCorrect === true ? <><p className="quiz-feedback is-correct mb-4"><Check className="mr-1 inline h-4 w-4" /> That’s it.</p><div className="flex justify-end"><button type="button" className="next-button" onClick={continueGame}>{wordIndex === WORD_SCRAMBLE_CONTENT.words.length - 1 ? "Finish" : "Next word"} <ArrowRight className="h-4 w-4" /></button></div></> : <><p className="mb-4 min-h-5 text-sm text-destructive">{isCorrect === false ? "Not quite — try rearranging those letters again." : ""}</p><div className="flex items-center justify-between"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={() => { setLetters(makeTiles(word.scramble)); setIsCorrect(null); }}><RotateCcw className="h-4 w-4" /> Reset</button><button type="button" className="next-button" onClick={check}>Check arrangement <ArrowRight className="h-4 w-4" /></button></div></>}</div>
    </section>
  </div></main>;
}

function makeTiles(scramble: string) {
  return scramble.split("").map((letter, index) => ({ id: `${letter}-${index}`, letter }));
}

function ScrambleComplete() { return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link></header><section className="paper-card my-6 flex flex-1 flex-col items-center justify-center p-8 text-center"><div className="day-one-copy items-center"><div className="completion-mark"><Check className="h-8 w-8" /></div><p className="day-one-eyebrow">ALL SOLVED</p><h1 className="font-script text-5xl leading-none">{WORD_SCRAMBLE_CONTENT.completionTitle}</h1><p>{WORD_SCRAMBLE_CONTENT.completionBody}</p><Link to="/" className="next-button mt-4">Back to all days <ArrowRight className="h-4 w-4" /></Link></div></section></div></main>; }
