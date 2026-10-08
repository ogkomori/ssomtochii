import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { GameShell } from "@/activities/Connections";
import { DailyWheel } from "@/components/DailyWheel";
import { unlockWorldItem } from "@/lib/world";

export const EMOJI_PUZZLES = [
  { clue: ["🌙", "🚶", "🏙️"], answer: "night walk", alternatives: ["a night walk", "walking at night"] },
  { clue: ["🍕", "🎬", "🛋️"], answer: "movie night", alternatives: ["a movie night"] },
  { clue: ["🌸", "☕", "📖"], answer: "a cozy morning", alternatives: ["cozy morning", "morning coffee"] },
];

/** Data-driven emoji guessing activity. Update EMOJI_PUZZLES with personal clues. */
export function EmojiPictionary() {
  const [round, setRound] = useState(0); const [answer, setAnswer] = useState(""); const [score, setScore] = useState(0); const [feedback, setFeedback] = useState(""); const done = round >= EMOJI_PUZZLES.length; const puzzle = EMOJI_PUZZLES[round];
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!puzzle) return; const guess = answer.trim().toLowerCase(); const correct = [puzzle.answer, ...puzzle.alternatives].includes(guess); setFeedback(correct ? "You got it!" : `So close — it was “${puzzle.answer}.”`); setScore((value) => value + Number(correct)); window.setTimeout(() => { const next = round + 1; setRound(next); setAnswer(""); setFeedback(""); if (next === EMOJI_PUZZLES.length) unlockWorldItem("emoji-garden"); }, 700); };
  const reset = () => { setRound(0); setAnswer(""); setScore(0); setFeedback(""); };
  return <GameShell eyebrow="EMOJI PICTIONARY" title={done ? "You speak emoji." : "Can you read this?"} right={done ? `${score}/${EMOJI_PUZZLES.length}` : `${round + 1} OF ${EMOJI_PUZZLES.length}`}>{done ? <DailyWheel day={11} /> : <><p className="game-message">Translate the tiny scene into words.</p><form onSubmit={submit}><div className="emoji-clue">{puzzle.clue.map((emoji, index) => <span key={`${emoji}-${index}`}>{emoji}</span>)}</div><input autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} className="game-input" placeholder="Your guess…" aria-label="Your guess" /><p className={`min-h-6 text-sm ${feedback ? "text-primary" : "text-muted-foreground"}`}>{feedback}</p><button className="next-button mt-2" type="submit" disabled={!answer.trim()}>Guess</button></form></>}</GameShell>;
}
