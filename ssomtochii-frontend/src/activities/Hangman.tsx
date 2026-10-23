import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { HANGMAN_CONTENT, HANGMAN_LEVELS } from "@/lib/activities/hangman";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function Hangman({ onComplete }: { onComplete: () => void }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [message, setMessage] = useState("Pick a letter.");

  const level = HANGMAN_LEVELS[levelIndex];
  const answer = level.answer.toUpperCase();
  const answerLetters = answer.replace(/[^A-Z]/g, "");
  const wrong = guesses.filter((letter) => !answerLetters.includes(letter)).length;
  const won = [...new Set(answerLetters.split(""))].every((letter) => guesses.includes(letter));
  const lost = wrong >= HANGMAN_CONTENT.maxWrongGuesses && !won;
  const finished = won || lost;
  const isFinalLevel = levelIndex === HANGMAN_LEVELS.length - 1;

  const guess = (letter: string) => {
    if (finished || guesses.includes(letter)) return;
    setGuesses((current) => [...current, letter]);
    setMessage(answerLetters.includes(letter) ? "Getting closer..." : "Nope!");
  };

  const reset = () => {
    setGuesses([]);
    setMessage("Pick a letter.");
  };

  const nextLevel = () => {
    if (!won || isFinalLevel) return;
    setLevelIndex((current) => current + 1);
    setGuesses([]);
    setMessage("Pick a letter.");
  };

  return <GameShell eyebrow={`HANGMAN · LEVEL ${levelIndex + 1} OF ${HANGMAN_LEVELS.length}`} title={won ? "You got it!" : lost ? "Nearly!" : HANGMAN_CONTENT.title} right={`${wrong}/${HANGMAN_CONTENT.maxWrongGuesses} MISSES`}>
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
    <div className="mb-6 flex flex-wrap items-end justify-center gap-x-3 gap-y-2" aria-label="Song title to guess">
      {answer.split(" ").filter(Boolean).map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex flex-nowrap items-end gap-x-1.5 whitespace-nowrap">
          {word.split("").map((character, index) => {
            if (!/[A-Z]/.test(character)) return <span key={index} className="px-0.5 text-lg font-bold">{character}</span>;
            return <span key={index} className="grid h-9 min-w-7 shrink-0 place-items-center border-b-2 border-primary px-1 text-lg font-bold">{guesses.includes(character) || finished ? character : ""}</span>;
          })}
        </span>
      ))}
    </div>
    <div className="mx-auto grid max-w-sm grid-cols-7 gap-1.5">{alphabet.map((letter) => <button key={letter} type="button" disabled={finished || guesses.includes(letter)} onClick={() => guess(letter)} className={`grid aspect-square place-items-center rounded-md text-sm font-semibold disabled:opacity-35 ${guesses.includes(letter) ? answerLetters.includes(letter) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground" : "bg-secondary text-foreground"}`}>{letter}</button>)}</div>
    <p className="mt-4 min-h-6 text-sm text-muted-foreground">{won ? (isFinalLevel ? "You guessed all three songs!" : "Song guessed! Ready for the next one?") : lost ? `The song was ${answer}.` : message}</p>
    {finished && <div className="mt-4 flex justify-center gap-3">
      {(!won || isFinalLevel) && <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Play again</button>}
      {won && (isFinalLevel
        ? <button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button>
        : <button type="button" className="next-button" onClick={nextLevel}>Next song <Check className="h-4 w-4" /></button>)}
    </div>}
  </GameShell>;
}
