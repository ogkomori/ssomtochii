import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { GameShell } from "@/activities/Connections";

export const EMOJI_PUZZLES = [
  { clue: ["🤿"], answer: "scuba", alternatives: ["scubaa", "scubaaa", "scubaaaa"] },
  { clue: ["〽️", "📖"], answer: "macbook", alternatives: ["mac book"] },
  { clue: ["💡", "🌍"], answer: "light of the world", alternatives: [] },
  { clue: ["🅾️", "🤝"], answer: "odeal", alternatives: [] },
  { clue: ["⬆️", "➡️", "⬇️"], answer: "upside down", alternatives: ["up side down", "upsidedown"] },
];

/** Data-driven emoji guessing activity. Update EMOJI_PUZZLES with personal clues. */
export function EmojiPictionary({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(0); const [answer, setAnswer] = useState(""); const [score, setScore] = useState(0); const [feedback, setFeedback] = useState(""); const done = round >= EMOJI_PUZZLES.length; const puzzle = EMOJI_PUZZLES[round];
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!puzzle || feedback) return;
    const guess = answer.trim().toLowerCase();
    const correct = [puzzle.answer, ...puzzle.alternatives].includes(guess);

    if (!correct) {
      setFeedback("Not quite! Try again.");
      return;
    }

    setFeedback("You got it!");
    setScore((value) => value + 1);
    window.setTimeout(() => {
      setRound((current) => current + 1);
      setAnswer("");
      setFeedback("");
    }, 700);
  };
  const reset = () => { setRound(0); setAnswer(""); setScore(0); setFeedback(""); };
  return <GameShell eyebrow="EMOJI PICTIONARY" title={done ? "You speak emoji!" : "Can you read this?"} right={done ? `${score}/${EMOJI_PUZZLES.length}` : `${round + 1} OF ${EMOJI_PUZZLES.length}`}>{done ? <div className="day-one-copy items-center text-center"><div className="completion-mark">♡</div><p>You're so intelligent baby! Ready for today’s compliment?</p><button type="button" className="next-button" onClick={onComplete}>Get today’s compliment</button></div> : <><p className="game-message">Translate these emojis into words.</p><form onSubmit={submit}><div className="emoji-clue">{puzzle.clue.map((emoji, index) => <span key={`${emoji}-${index}`}>{emoji}</span>)}</div><input autoFocus disabled={feedback === "You got it!"} value={answer} onChange={(event) => { setAnswer(event.target.value); if (feedback) setFeedback(""); }} className="game-input" placeholder="Your guess…" aria-label="Your guess" /><p className={`min-h-6 text-sm ${feedback ? (feedback === "You got it!" ? "text-primary" : "text-destructive") : "text-muted-foreground"}`}>{feedback}</p><button className="next-button mt-2" type="submit" disabled={!answer.trim() || feedback === "You got it!"}>Guess</button></form></>}</GameShell>;
}
