import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { COMPLIMENTS } from "@/lib/compliments";

const slots = Array.from({ length: 10 }, () => COMPLIMENTS).flat();
const height = 54;

/** End-of-day reward: one randomly selected compliment, with a personal note. */
export function DailyWheel({ day }: { day: number }) {
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [stopAt, setStopAt] = useState(0);

  const spin = () => {
    if (spinning || prizeIndex !== null) return;

    // Every compliment entry is a distinct, equally likely prize.
    const nextIndex = Math.floor(Math.random() * COMPLIMENTS.length);
    setStopAt(7 * COMPLIMENTS.length + nextIndex);
    setSpinning(true);

    window.setTimeout(() => {
      setPrizeIndex(nextIndex);
      setSpinning(false);
    }, 4200);
  };

  const offset = stopAt ? stopAt * height - height : 0;
  const prize = prizeIndex === null ? null : COMPLIMENTS[prizeIndex];

  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-md">
        <div className="day-one-copy reward-page-shell items-center text-center">
          <Trophy className="h-8 w-8 text-blossom" />
          <p className="day-one-eyebrow">DAY {day} REWARD</p>
          {prize ? <>
            <div className="compliment-prize" aria-label={`Your compliment is ${prize.word}`}>
              <span className="compliment-prize-eyebrow">TODAY'S COMPLIMENT</span>
              <h1 className="font-script text-5xl leading-tight">{prize.word}</h1>
              <span className="compliment-prize-letter">A little word for the letter {prize.letter}</span>
            </div>
            <p className="mt-4 max-w-sm text-foreground/80">{prize.message || "Your little message goes here. ♡"}</p>
            <h2 className="mt-3 font-script text-3xl leading-none">A little reminder of how lovely you are. ♡</h2>
            <Link to="/" className="next-button mt-5">Back to all days</Link>
          </> : <>
            <h2 className="font-script text-4xl leading-none">A little gift, just for you.</h2>
            <p>Every box holds a compliment. Let&apos;s see which one is yours today. ♡</p>
            <div className="reel-machine">
              <span className="reel-label">COMPLIMENT OF THE DAY</span>
              <div className="reel-window" aria-label="Gift boxes spinning">
                <div className="reel-track" style={{ transform: `translateY(-${offset}px)` }}>
                  {slots.map((_, index) => <span className="reel-character" key={index} aria-hidden="true">
                    <span className="reel-gift-box"><span className="reel-gift-ribbon" /><span className="reel-gift-bow" /></span>
                  </span>)}
                </div>
                <span className="reel-marker" aria-hidden="true" />
              </div>
            </div>
            <button type="button" className="next-button" onClick={spin} disabled={spinning}>{spinning ? "Unwrapping…" : "Open a gift"}</button>
          </>}
        </div>
      </div>
    </main>
  );
}
