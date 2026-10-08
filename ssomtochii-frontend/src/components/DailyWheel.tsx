import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { CHARACTER_POOL } from "@/lib/day-one";

const slots = Array.from({ length: 10 }, () => CHARACTER_POOL).flat();
const height = 54;
const REWARD_KEY = "somto-daily-rewards";

function getStoredReward(day: number) {
  if (typeof window === "undefined") return null;
  try {
    const stored = JSON.parse(window.localStorage.getItem(REWARD_KEY) ?? "{}");
    return typeof stored?.[day] === "string" ? stored[day] : null;
  } catch {
    return null;
  }
}

/** Shared end-of-day reward. The character is randomly chosen once per day and then persisted. */
export function DailyWheel({ day }: { day: number }) {
  const [characterIndex, setCharacterIndex] = useState(() => {
    const stored = getStoredReward(day);
    return stored ? CHARACTER_POOL.indexOf(stored as (typeof CHARACTER_POOL)[number]) : -1;
  });
  const [spinning, setSpinning] = useState(false);
  const [letter, setLetter] = useState<string | null>(() => getStoredReward(day));
  const [stopAt, setStopAt] = useState(0);

  const spin = () => {
    if (spinning || letter) return;

    const nextIndex = Math.floor(Math.random() * CHARACTER_POOL.length);
    setCharacterIndex(nextIndex);
    setStopAt(7 * CHARACTER_POOL.length + nextIndex);
    setSpinning(true);

    window.setTimeout(() => {
      const character = CHARACTER_POOL[nextIndex];
      setLetter(character);
      const stored = JSON.parse(window.localStorage.getItem(REWARD_KEY) ?? "{}") as Record<string, string>;
      stored[day] = character;
      window.localStorage.setItem(REWARD_KEY, JSON.stringify(stored));
      setSpinning(false);
    }, 4200);
  };

  const offset = stopAt ? stopAt * height - height : 0;

  return <div className="day-one-copy items-center text-center">
    <Trophy className="h-8 w-8 text-blossom" />
    <p className="day-one-eyebrow">DAY {day} REWARD</p>
    {letter ? <>
      <div className="award-letter">{letter}</div>
      <h2 className="font-script text-4xl leading-none">Keep this one safe.</h2>
      <p>Another piece of the surprise is yours. ♡</p>
      <Link to="/" className="next-button">Back to all days</Link>
    </> : <>
      <h2 className="font-script text-4xl leading-none">Give the wheel a spin.</h2>
      <p>One character is yours for today.</p>
      <div className="reel-machine">
        <span className="reel-label">LUCKY LETTER</span>
        <div className="reel-window">
          <div className="reel-track" style={{ transform: `translateY(-${offset}px)` }}>
            {slots.map((value, index) => <span className="reel-character" key={`${value}-${index}`}>{value}</span>)}
          </div>
          <span className="reel-marker" aria-hidden />
        </div>
      </div>
      <button type="button" className="next-button" onClick={spin} disabled={spinning}>{spinning ? "Spinning…" : "Spin the wheel"}</button>
    </>}
  </div>;
}
