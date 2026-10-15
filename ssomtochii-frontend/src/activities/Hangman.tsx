import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { HANGMAN_CONTENT } from "@/lib/hangman";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export function Hangman({ onComplete }: { onComplete: () => void }) {
  const answer = HANGMAN_CONTENT.answer.toUpperCase();
  const [guesses, setGuesses] = useState<string[]>([]);
  const [message, setMessage] = useState("Pick a letter.");
  const wrong = guesses.filter((letter) => !answer.includes(letter)).length;
  const won = [...new Set(answer.split(""))].every((letter) => guesses.includes(letter));
  const lost = wrong >= HANGMAN_CONTENT.maxWrongGuesses && !won;
  const finished = won || lost;
  const guess = (letter: string) => {
    if (finished || guesses.includes(letter)) return;
    setGuesses((current) => [...current, letter]);
    setMessage(answer.includes(letter) ? "Yes, that letter is in the word." : "Not this time.");
  };
  const reset = () => { setGuesses([]); setMessage("Pick a letter."); };
  return <GameShell eyebrow="HANGMAN" title={won ? "You got it!" : lost ? "Nearly!" : HANGMAN_CONTENT.title} right={`${wrong}/${HANGMAN_CONTENT.maxWrongGuesses} MISSES`}>
    <p className="mb-5 text-sm text-foreground/75">{HANGMAN_CONTENT.intro}</p>
    <div className="mx-auto mb-5 flex h-24 w-32 items-end justify-center" aria-label={`${wrong} incorrect guesses`}>
      <svg viewBox="0 0 120 100" className="h-full w-full" role="img" aria-label="Hangman drawing">
        <path d="M10 94 H92 M28 94 V8 H76 V20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {wrong >= 1 && <circle cx="76" cy="31" r="11" fill="none" stroke="currentColor" strokeWidth="3" />}
        {wrong >= 2 && <path d="M76 42 V67" stroke="currentColor" strokeWidth="3" />}
        {wrong >= 3 && <path d="M76 48 L60 59" stroke="currentColor" strokeWidth="3" />}
        {wrong >= 4 && <path d="M76 48 L91 59" stroke="currentColor" strokeWidth="3" />}
        {wrong >= 5 && <path d="M76 67 L62 84" stroke="currentColor" strokeWidth="3" />}
        {wrong >= 6 && <path d="M76 67 L91 84" stroke="currentColor" strokeWidth="3" />}
      </svg>
    </div>
    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hint: {HANGMAN_CONTENT.hint}</p>
    <div className="mb-6 flex flex-wrap justify-center gap-1.5" aria-label="Word to guess">
      {answer.split("").map((letter, index) => <span key={index} className="grid h-9 min-w-7 place-items-center border-b-2 border-primary px-1 text-lg font-bold">{guesses.includes(letter) || finished ? letter : ""}</span>)}
    </div>
    <div className="mx-auto grid max-w-sm grid-cols-7 gap-1.5">{alphabet.map((letter) => <button key={letter} type="button" disabled={finished || guesses.includes(letter)} onClick={() => guess(letter)} className={`grid aspect-square place-items-center rounded-md text-sm font-semibold disabled:opacity-35 ${guesses.includes(letter) ? answer.includes(letter) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground" : "bg-secondary text-foreground"}`}>{letter}</button>)}</div>
    <p className="mt-4 min-h-6 text-sm text-muted-foreground">{won ? "You saved the word!" : lost ? `The word was ${answer}.` : message}</p>
    {finished && <div className="mt-4 flex justify-center gap-3"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Play again</button>{won && <button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button>}</div>}
  </GameShell>;
}
