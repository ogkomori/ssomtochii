import { ArrowLeft, Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { GameShell } from "@/activities/Connections";
import { WORDLE_CONTENT } from "@/lib/wordle";

type TileState = "empty" | "correct" | "present" | "absent";
type Guess = { word: string; states: TileState[] };

const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function scoreGuess(guess: string, answer: string): TileState[] {
  const states: TileState[] = Array(5).fill("absent");
  const remaining = answer.split("");

  for (let index = 0; index < 5; index += 1) {
    if (guess[index] === answer[index]) {
      states[index] = "correct";
      remaining[index] = "";
    }
  }

  for (let index = 0; index < 5; index += 1) {
    if (states[index] === "correct") continue;
    const match = remaining.indexOf(guess[index] ?? "");
    if (match >= 0) {
      states[index] = "present";
      remaining[match] = "";
    }
  }

  return states;
}

export function Wordle({ onComplete }: { onComplete: () => void }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const answer = WORDLE_CONTENT.words[wordIndex]?.answer ?? "";

  const submit = () => {
    if (current.length !== 5 || finished) {
      if (current.length !== 5) setMessage("Five letters first.");
      return;
    }

    const word = current.toUpperCase();
    const states = scoreGuess(word, answer);
    const nextGuesses = [...guesses, { word, states }];
    setGuesses(nextGuesses);
    setCurrent("");
    setMessage("");

    if (word === answer) {
      if (wordIndex === WORDLE_CONTENT.words.length - 1) {
        setFinished(true);
      } else {
        window.setTimeout(() => {
          setWordIndex((index) => index + 1);
          setGuesses([]);
          setMessage("Got it. Here is the next one.");
        }, 650);
      }
      return;
    }

    if (nextGuesses.length === 6) {
      if (wordIndex === WORDLE_CONTENT.words.length - 1) {
        setFinished(true);
      } else {
        window.setTimeout(() => {
          setWordIndex((index) => index + 1);
          setGuesses([]);
          setMessage(`The word was ${answer}. Next one.`);
        }, 650);
      }
    }
  };

  useEffect(() => {
    if (finished) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") submit();
      else if (event.key === "Backspace") setCurrent((value) => value.slice(0, -1));
      else if (/^[a-zA-Z]$/.test(event.key)) setCurrent((value) => value.length < 5 ? `${value}${event.key.toUpperCase()}` : value);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (finished) return <GameShell eyebrow="WORDLE" title="Four little words." right="COMPLETE"><div className="day-one-copy items-center text-center"><div className="completion-mark">♡</div><p>That is the whole little Wordle challenge. Nicely done.</p><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></div></GameShell>;

  return <GameShell eyebrow="WORDLE" title={WORDLE_CONTENT.title} right={`${wordIndex + 1}/${WORDLE_CONTENT.words.length}`}><div className="day-one-copy"><p>{wordIndex === 0 ? WORDLE_CONTENT.intro : "One more little word."}</p><div className="space-y-2">{Array.from({ length: 6 }, (_, row) => { const guess = guesses[row]; return <div key={row} className="flex justify-center gap-1.5">{Array.from({ length: 5 }, (_, column) => { const letter = guess?.word[column] ?? (row === guesses.length ? current[column] : ""); const state = guess?.states[column] ?? "empty"; return <span key={column} className={`wordle-tile wordle-${state}`}>{letter}</span>; })}</div>; })}</div><p className="mt-4 min-h-6 text-sm text-muted-foreground">{message}</p><div className="mt-4 space-y-2">{KEYBOARD_ROWS.map((row) => <div key={row} className="flex justify-center gap-1">{row.split("").map((letter) => <button type="button" key={letter} className="wordle-key" onClick={() => setCurrent((value) => value.length < 5 ? `${value}${letter}` : value)}>{letter}</button>)}</div>)}<div className="flex justify-center gap-1"><button type="button" className="wordle-key wordle-wide-key" onClick={submit}>ENTER</button><button type="button" className="wordle-key wordle-wide-key" onClick={() => setCurrent((value) => value.slice(0, -1))}><Delete className="mx-auto h-4 w-4" /></button></div></div></div></GameShell>;
}
