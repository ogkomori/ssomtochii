import { Link } from "@tanstack/react-router";
import { Heart, Volume2 } from "lucide-react";
import { useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { COMPLIMENTS } from "@/lib/compliments";

const slots = Array.from({ length: 10 }, () => COMPLIMENTS).flat();
const height = 54;

/** End-of-day reward: one randomly selected dictionary-style compliment. */
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

  const speakWord = (word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-GB";
    utterance.rate = 0.82;
    const britishVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase() === "en-gb");
    if (britishVoice) utterance.voice = britishVoice;
    window.speechSynthesis.speak(utterance);
  };

  const offset = stopAt ? stopAt * height - height : 0;
  const prize = prizeIndex === null ? null : COMPLIMENTS[prizeIndex];

  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-md">
        <div className="day-one-copy reward-page-shell items-center text-center">
          {prize ? (
            <>
              <article className="dictionary-page" aria-label={`Dictionary entry for ${prize.word}`}>
                <header className="dictionary-header">
                  <span>COMPLIMENT OF THE DAY</span>
                  <Heart aria-hidden="true" />
                </header>

                <div className="dictionary-word-block">
                  <h1>{prize.word}</h1>
                  <div className="dictionary-pronunciation-row">
                    <span className="dictionary-pronunciation">{prize.pronunciation}</span>
                    <button
                      type="button"
                      className="dictionary-speak-button"
                      onClick={() => speakWord(prize.word)}
                      aria-label={`Hear ${prize.word} pronounced`}
                      title="Hear pronunciation"
                    >
                      <Volume2 aria-hidden="true" />
                    </button>
                  </div>
                  <span className="dictionary-part-of-speech">{prize.partOfSpeech}</span>
                </div>

                <section className="dictionary-definition">
                  <p className="dictionary-section-label">DEFINITION</p>
                  <p>{prize.definition}</p>
                </section>

                <section className="dictionary-personal-note">
                  <div className="dictionary-note-heading">
                    <Heart aria-hidden="true" />
                  </div>
                  <p className={prize.message ? "" : "dictionary-note-placeholder"}>
                    {prize.message || "Your personal message for this word will go here. ♡"}
                  </p>
                  {prize.message && <p className="dictionary-signoff">— yours truly ♡</p>}
                </section>
              </article>
              <Link to="/" className="next-button mt-5">Back to all days</Link>
            </>
          ) : (
            <>
              <h2 className="font-script text-4xl leading-none">A little gift, just for you.</h2>
              <p>Every box holds a compliment. Let&apos;s see which one is yours today. ♡</p>
              <div className="reel-machine">
                <span className="reel-label">COMPLIMENT OF THE DAY</span>
                <div className="reel-window" aria-label="Gift boxes spinning">
                  <div className="reel-track" style={{ transform: `translateY(-${offset}px)` }}>
                    {slots.map((_, index) => (
                      <span className="reel-character" key={index} aria-hidden="true">
                        <span className="reel-gift-box"><span className="reel-gift-ribbon" /><span className="reel-gift-bow" /></span>
                      </span>
                    ))}
                  </div>
                  <span className="reel-marker" aria-hidden="true" />
                </div>
              </div>
              <button type="button" className="next-button" onClick={spin} disabled={spinning}>
                {spinning ? "Unwrapping…" : "Open a gift"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
