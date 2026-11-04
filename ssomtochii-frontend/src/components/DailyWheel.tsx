import { Link } from "@tanstack/react-router";
import { Heart, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { COMPLIMENTS } from "@/lib/compliments";

const slots = Array.from({ length: 10 }, () => COMPLIMENTS).flat();
const height = 54;
const DAILY_COMPLIMENTS_STORAGE_KEY = "ssomtochii-daily-compliments-v1";

type SavedCompliments = Record<string, string>;

function readSavedCompliments(): SavedCompliments {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DAILY_COMPLIMENTS_STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as SavedCompliments
      : {};
  } catch {
    return {};
  }
}

function saveCompliment(day: number, word: string) {
  if (typeof window === "undefined") return;
  try {
    const saved = readSavedCompliments();
    saved[String(day)] = word;
    window.localStorage.setItem(DAILY_COMPLIMENTS_STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Keep the reward usable when browser storage is unavailable.
  }
}

/** End-of-day reward: one randomly selected dictionary-style compliment. */
export function DailyWheel({ day, onDay16Continue }: { day: number; onDay16Continue?: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [poolExhausted, setPoolExhausted] = useState(false);
  const [prizeWord, setPrizeWord] = useState<string | null>(() => {
    const savedWord = readSavedCompliments()[String(day)];
    return savedWord && COMPLIMENTS.some((item) => item.word === savedWord) ? savedWord : null;
  });
  const [stopAt, setStopAt] = useState(0);
  const wordHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = wordHeadingRef.current;
    const container = heading?.parentElement;
    if (!heading || !container) return;

    const fitWord = () => {
      heading.style.fontSize = "";
      const availableWidth = container.clientWidth;
      const textWidth = heading.scrollWidth;
      if (textWidth > availableWidth && availableWidth > 0) {
        const currentSize = Number.parseFloat(window.getComputedStyle(heading).fontSize);
        heading.style.fontSize = `${Math.max(18, currentSize * availableWidth / textWidth * 0.96)}px`;
      }
    };

    fitWord();
    const observer = new ResizeObserver(fitWord);
    observer.observe(container);
    return () => observer.disconnect();
  }, [prizeWord]);

  const prizeIndex = prizeWord === null ? null : COMPLIMENTS.findIndex((item) => item.word === prizeWord);
  const prize = prizeIndex === null || prizeIndex < 0 ? null : COMPLIMENTS[prizeIndex];

  const spin = () => {
    if (spinning || prize !== null) return;

    const saved = readSavedCompliments();
    const usedWords = new Set(
      Object.entries(saved)
        .filter(([savedDay]) => savedDay !== String(day) && savedDay !== "16")
        .map(([, word]) => word),
    );
    // Never repeat a compliment. Add another entry to COMPLIMENTS if the pool runs out.
    const candidates = COMPLIMENTS
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !usedWords.has(item.word));
    if (candidates.length === 0) {
      setPoolExhausted(true);
      return;
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    setStopAt(7 * COMPLIMENTS.length + selected.index);
    setSpinning(true);

    window.setTimeout(() => {
      saveCompliment(day, selected.item.word);
      setPrizeWord(selected.item.word);
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


  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-md">
        <div className={`day-one-copy reward-page-shell items-center text-center ${day === 16 ? "relative" : ""}`}>
          {day === 16 && <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-[#d69b43]/70"><span className="absolute left-2 top-4 text-xl">✦</span><span className="absolute right-3 top-16 text-2xl">✧</span><span className="absolute bottom-12 left-4 text-2xl">✧</span><span className="absolute bottom-4 right-5 text-xl">✦</span></div>}
          {prize ? (
            <>
              <article className={`dictionary-page ${day === 16 ? "relative z-10 border-[#e6c17b] shadow-[0_16px_45px_rgba(150,90,35,.14)]" : ""}`} aria-label={`Dictionary entry for ${prize.word}`}>
                <header className="dictionary-header">
                  <span>COMPLIMENT OF THE DAY</span>
                  <Heart aria-hidden="true" />
                </header>

                <div className="dictionary-word-block">
                  <h1 ref={wordHeadingRef}>{prize.word}</h1>
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
              {day === 16 && onDay16Continue ? (
                <button type="button" className="next-button mt-5" onClick={onDay16Continue}>Open your presents ♡</button>
              ) : (
                <Link to="/" className="next-button mt-5">Back to all days</Link>
              )}
            </>
          ) : (
            <>
              <h2 className="relative z-10 font-script text-4xl leading-none">{day === 16 ? "A little birthday gift, just for you." : "A little gift, just for you."}</h2>
              <p>{poolExhausted ? "We need one more compliment for this day. ♡" : "Every box holds a compliment. Let's see which one is yours today. ♡"}</p>
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
              <button type="button" className="next-button" onClick={spin} disabled={spinning || poolExhausted}>
                {poolExhausted ? "Add another compliment" : spinning ? "Unwrapping…" : "Open a gift"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
