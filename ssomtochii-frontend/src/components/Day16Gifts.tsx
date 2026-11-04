import { useState } from "react";
import { Day16Letter } from "@/components/Day16Letter";
import { markDayCompleted } from "@/lib/progress";

const GIFT_VIDEOS = [
  "/videos/day-16-gift-1.mp4",
  "/videos/day-16-gift-2.mp4",
  "/videos/day-16-gift-3.mp4",
];

function GiftBox({ number, selected, opened, onClick }: { number: number; selected: boolean; opened: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={opened} aria-label={opened ? `Gift ${number} opened` : `Open gift ${number}`} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${selected ? "scale-110 opacity-0" : "opacity-100 hover:-translate-y-2"}`}>
      <span className={`relative block h-24 w-24 rounded-md border-2 border-[#8d171d] bg-gradient-to-br from-[#e8464d] to-[#a90e20] shadow-[0_12px_18px_rgba(85,20,20,.22)] sm:h-28 sm:w-28 ${opened ? "opacity-35" : ""}`}>
        <span className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-[#e5bd55] shadow-sm" />
        <span className="absolute left-0 top-1/2 h-4 w-full -translate-y-1/2 bg-[#e5bd55] shadow-sm" />
        <span className="absolute -top-3 left-1/2 h-5 w-10 -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-[#e5bd55]" />
        <span className="absolute -top-3 left-1/2 h-5 w-10 -translate-x-1/2 -scale-x-100 rounded-t-full border-[5px] border-b-0 border-[#e5bd55]" />
      </span>
      <span className="text-sm font-semibold text-[#7d2630]">{opened ? "Opened ♡" : `Gift ${number}`}</span>
    </button>
  );
}

export function Day16Gifts() {
  const [opened, setOpened] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  if (finished) return <Day16Letter kind="closing" onContinue={() => { markDayCompleted(16); window.location.href = "/"; }} />;

  const openGift = (index: number) => {
    if (selected !== null || opened.includes(index)) return;
    setSelected(index);
    window.setTimeout(() => setPlaying(true), 1300);
  };

  const finishVideo = () => {
    setOpened((current) => [...current, selected!]);
    setSelected(null);
    setPlaying(false);
    if (opened.length + 1 === 3) setFinished(true);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#fff7e9] px-4 py-8 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 12% 15%, #f3c76b 0 2px, transparent 3px), radial-gradient(circle at 85% 22%, #e8a4a4 0 2px, transparent 3px), radial-gradient(circle at 25% 82%, #d6a85e 0 2px, transparent 3px)", backgroundSize: "130px 130px" }} />
      <section className="relative mx-auto flex min-h-[85dvh] w-full max-w-xl flex-col items-center justify-center">
        <p className="text-xs font-bold tracking-[0.24em] text-[#a46b35]">THREE LITTLE SURPRISES</p>
        <h1 className="mt-3 font-script text-4xl text-[#7d2630] sm:text-5xl">{selected === null ? "Pick a present, birthday girl ♡" : "A little surprise for you…"}</h1>
        {selected === null ? (
          <>
            <p className="mt-3 text-sm text-[#875f50]">Choose any gift. Then come back for the others.</p>
            <div className="mt-14 grid w-full grid-cols-3 items-end gap-3">
              {[0, 1, 2].map((index) => <GiftBox key={index} number={index + 1} selected={false} opened={opened.includes(index)} onClick={() => openGift(index)} />)}
            </div>
          </>
        ) : (
          <div className="mt-8 flex w-full flex-col items-center">
            {!playing && <div className="gift-focus-in relative h-44 w-44 rounded-xl border-2 border-[#8d171d] bg-gradient-to-br from-[#e8464d] to-[#a90e20] shadow-[0_20px_40px_rgba(85,20,20,.3)]">
              <span className="gift-lid-open absolute -left-1 -top-5 z-10 h-8 w-[calc(100%+8px)] rounded-md border-2 border-[#8d171d] bg-gradient-to-br from-[#f15b60] to-[#b41427] shadow-md"><span className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-[#e5bd55]" /></span>
              <span className="absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 bg-[#e5bd55]" />
              <span className="absolute left-0 top-1/2 h-7 w-full -translate-y-1/2 bg-[#e5bd55]" />
              <span className="absolute -top-5 left-1/2 h-8 w-16 -translate-x-full rounded-t-full border-[8px] border-b-0 border-[#e5bd55]" />
              <span className="absolute -top-5 left-1/2 h-8 w-16 rounded-t-full border-[8px] border-b-0 border-[#e5bd55]" />
            </div>}
            {playing && <div className="w-full overflow-hidden rounded-2xl bg-black shadow-xl">
              <video key={selected} className="block max-h-[68dvh] w-full object-contain" src={GIFT_VIDEOS[selected]} controls autoPlay playsInline onEnded={finishVideo} />
              <button type="button" onClick={finishVideo} className="w-full bg-[#7d2630] px-4 py-3 text-sm font-semibold text-white">Continue ♡</button>
            </div>}
            {!playing && <p className="mt-8 text-sm text-[#875f50]">Your surprise is opening…</p>}
          </div>
        )}
        {selected === null && <p className="mt-10 text-xs text-[#a47b59]">{opened.length} of 3 gifts opened</p>}
      </section>
      <style>{`@keyframes giftFocusIn { from { transform: scale(.35); opacity:0; } to { transform:scale(1); opacity:1; } } .gift-focus-in { animation:giftFocusIn .65s cubic-bezier(.2,.8,.2,1) both; } @keyframes giftLidOpen { to { transform: perspective(500px) rotateX(68deg) translateY(-26px); transform-origin: bottom center; opacity:.9; } } .gift-lid-open { animation:giftLidOpen .7s .35s ease-out forwards; transform-origin:bottom center; }`}</style>
    </main>
  );
}
