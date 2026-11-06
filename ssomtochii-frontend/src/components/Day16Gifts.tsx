import { useState } from "react";
import { Day16Letter } from "@/components/Day16Letter";
import { Botanicals } from "@/components/Botanicals";
import { markDayCompleted } from "@/lib/progress";

const GIFT_VIDEOS = [
  "/videos/day-16-gift-1.mp4",
  "/videos/day-16-gift-2.mp4",
  "/videos/day-16-gift-3.mp4",
  "/videos/day-16-gift-4.mp4",
];

// Edit these messages to change what appears beneath each opened present.
const GIFT_MESSAGES = [
  "From Tega ♡",
  "From Chidinma ♡",
  "From Divine ♡",
  "From Chidera ♡",
];

const GIFT_POSITIONS = ["gift-orbit-top", "gift-orbit-right", "gift-orbit-bottom", "gift-orbit-left"];

function GiftBox({
  number,
  position,
  selected,
  opened,
  message,
  onClick,
}: {
  number: number;
  position: string;
  selected: boolean;
  opened: boolean;
  message: string;
  onClick: () => void;
}) {
  return (
    <div className={`gift-orbit-position ${position}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={opened ? `Replay gift ${number}` : `Open gift ${number}`}
        className={`gift-orbit-counter group flex flex-col items-center gap-2 transition-all duration-500 ${selected ? "scale-110 opacity-0" : "opacity-100 hover:-translate-y-1"}`}
      >
        <span className={`relative block h-20 w-20 rounded-md border-2 border-[#8d171d] bg-gradient-to-br from-[#e8464d] to-[#a90e20] shadow-[0_12px_18px_rgba(85,20,20,.22)] sm:h-24 sm:w-24 ${opened ? "opacity-70" : ""}`}>
          <span className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2 bg-[#e5bd55] shadow-sm" />
          <span className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 bg-[#e5bd55] shadow-sm" />
          <span className="absolute -top-3 left-1/2 h-5 w-9 -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-[#e5bd55]" />
          <span className="absolute -top-3 left-1/2 h-5 w-9 -translate-x-1/2 -scale-x-100 rounded-t-full border-[5px] border-b-0 border-[#e5bd55]" />
        </span>
        <span className="max-w-28 text-center text-xs font-semibold leading-tight text-[#7d2630]">
          {opened ? message : "Tap to open!"}
        </span>
      </button>
    </div>
  );
}

export function Day16Gifts() {
  const [opened, setOpened] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  if (finished) return <Day16Letter kind="closing" onContinue={() => { markDayCompleted(16); window.location.href = "/"; }} />;

  const openGift = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    window.setTimeout(() => setPlaying(true), 1300);
  };

  const finishVideo = () => {
    if (selected === null) return;
    setOpened((current) => current.includes(selected) ? current : [...current, selected]);
    setSelected(null);
    setPlaying(false);
  };

  return (
    <main className="page-shell min-h-[100dvh] overflow-hidden px-4 py-8 text-center">
      <Botanicals />
      <section className="relative mx-auto flex min-h-[85dvh] w-full max-w-xl flex-col items-center justify-center">
        <p className="text-xs font-bold tracking-[0.24em] text-[#a46b35]">FOUR LITTLE SURPRISES</p>
        <h1 className="mt-3 font-script text-4xl text-[#7d2630] sm:text-5xl">
          {selected === null ? "Pick a present, birthday girl ♡" : "A little surprise for you…"}
        </h1>

        {selected === null ? (
          <>
            <p className="mt-3 text-sm text-[#875f50]">Choose any gift. Then come back for the others. Tap again to open.</p>
            <div className="gift-orbit mt-8" aria-label="Four rotating birthday presents">
              {GIFT_POSITIONS.map((position, index) => (
                <GiftBox
                  key={index}
                  number={index + 1}
                  position={position}
                  selected={false}
                  opened={opened.includes(index)}
                  message={GIFT_MESSAGES[index]!}
                  onClick={() => openGift(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 flex w-full flex-col items-center">
            {!playing && (
              <div className="gift-focus-in relative h-44 w-44 rounded-xl border-2 border-[#8d171d] bg-gradient-to-br from-[#e8464d] to-[#a90e20] shadow-[0_20px_40px_rgba(85,20,20,.3)]">
                <span className="gift-lid-open absolute -left-1 -top-5 z-10 h-8 w-[calc(100%+8px)] rounded-md border-2 border-[#8d171d] bg-gradient-to-br from-[#f15b60] to-[#b41427] shadow-md"><span className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-[#e5bd55]" /></span>
                <span className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-[#e5bd55]" />
                <span className="absolute left-0 top-1/2 h-7 w-full -translate-y-1/2 bg-[#e5bd55]" />
                <span className="absolute -top-5 left-1/2 h-8 w-16 -translate-x-full rounded-t-full border-[8px] border-b-0 border-[#e5bd55]" />
                <span className="absolute -top-5 left-1/2 h-8 w-16 rounded-t-full border-[8px] border-b-0 border-[#e5bd55]" />
              </div>
            )}
            {playing && selected !== null && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" role="presentation">
                <div role="dialog" aria-modal="true" aria-label={`Birthday surprise ${selected + 1}`} className="relative flex max-h-[90vh] w-full max-w-3xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-secondary" onClick={(event) => event.stopPropagation()}>
                  <video
                    key={selected}
                    className="block max-h-[80vh] w-full object-contain"
                    src={GIFT_VIDEOS[selected]}
                    controls
                    autoPlay
                    playsInline
                    onEnded={finishVideo}
                  />
                  <button type="button" onClick={finishVideo} className="w-full shrink-0 bg-[#7d2630] px-4 py-3 text-sm font-semibold text-white">Continue ♡</button>
                </div>
              </div>
            )}
            {!playing && <p className="mt-8 text-sm text-[#875f50]">Your surprise is opening…</p>}
          </div>
        )}

        {selected === null && (
          <>
            <p className="mt-8 text-xs text-[#a47b59]">{opened.length} of 4 gifts opened</p>
            {opened.length === 4 && <button type="button" className="next-button mt-5" onClick={() => setFinished(true)}>Continue ♡</button>}
          </>
        )}
      </section>
      <style>{`
        .gift-orbit { position:relative; width:min(82vw, 22rem); aspect-ratio:1; animation:giftOrbit 32s linear infinite; }
        .gift-orbit-position { position:absolute; width:7.25rem; min-height:7.25rem; display:flex; align-items:center; justify-content:center; }
        .gift-orbit-top { top:0; left:50%; transform:translateX(-50%); }
        .gift-orbit-right { right:0; top:50%; transform:translateY(-50%); }
        .gift-orbit-bottom { bottom:0; left:50%; transform:translateX(-50%); }
        .gift-orbit-left { left:0; top:50%; transform:translateY(-50%); }
        .gift-orbit-counter { animation:giftOrbitCounter 32s linear infinite; }
        @keyframes giftOrbit { to { transform:rotate(360deg); } }
        @keyframes giftOrbitCounter { to { transform:rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) { .gift-orbit,.gift-orbit-counter { animation:none; } }
        @keyframes giftFocusIn { from { transform:scale(.35); opacity:0; } to { transform:scale(1); opacity:1; } }
        .gift-focus-in { animation:giftFocusIn .65s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes giftLidOpen { to { transform:perspective(500px) rotateX(68deg) translateY(-26px); transform-origin:bottom center; opacity:.9; } }
        .gift-lid-open { animation:giftLidOpen .7s .35s ease-out forwards; transform-origin:bottom center; }
      `}</style>
    </main>
  );
}
