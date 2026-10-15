import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { CHARACTER_POOL } from "@/lib/day-one";

const slots = Array.from({ length: 10 }, () => CHARACTER_POOL).flat();
const height = 54;

/** End-of-day reward. The character only lives in component state while testing. */
export function DailyWheel({ day }: { day: number }) {
  const [spinning, setSpinning] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [stopAt, setStopAt] = useState(0);

  const spin = () => {
    if (spinning || letter) return;

    const nextIndex = Math.floor(Math.random() * CHARACTER_POOL.length);
    setStopAt(7 * CHARACTER_POOL.length + nextIndex);
    setSpinning(true);

    window.setTimeout(() => {
      setLetter(CHARACTER_POOL[nextIndex]);
      setSpinning(false);
    }, 4200);
  };

  const offset = stopAt ? stopAt * height - height : 0;

  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-md">
        <div className="day-one-copy reward-page-shell items-center text-center">
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
        </div>
      </div>
    </main>
  );
}
