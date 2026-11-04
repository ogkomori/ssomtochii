import { useState } from "react";

const OPENING_LETTER = ``;
const CLOSING_LETTER = ``;

export function Day16Letter({ kind, onContinue }: { kind: "opening" | "closing"; onContinue: () => void }) {
  const [draft, setDraft] = useState(kind === "opening" ? OPENING_LETTER : CLOSING_LETTER);
  const isOpening = kind === "opening";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#fff7e9] px-4 py-6 text-[#583d35]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 12% 15%, #f3c76b 0 2px, transparent 3px), radial-gradient(circle at 85% 22%, #e8a4a4 0 2px, transparent 3px), radial-gradient(circle at 25% 82%, #d6a85e 0 2px, transparent 3px), radial-gradient(circle at 78% 76%, #e8a4a4 0 2px, transparent 3px)", backgroundSize: "130px 130px" }} />
      <section className="relative mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-xl flex-col items-center justify-center">
        <p className="mb-4 text-xs font-bold tracking-[0.24em] text-[#a46b35]">{isOpening ? "A LETTER FOR YOU" : "ONE LAST THING"}</p>
        <div className="w-full rounded-[22px] border border-[#e8d6b5] bg-[#fffdf7] px-5 py-7 shadow-[0_18px_55px_rgba(117,75,38,0.14)] sm:px-9">
          <div className="mb-5 flex items-center justify-between border-b border-[#eadfc9] pb-3">
            <span className="font-serif text-sm italic text-[#9c7651]">A little note, from me to you</span>
            <span aria-hidden="true" className="text-xl text-[#c78b52]">♡</span>
          </div>
          <div className="relative min-h-[48vh] rounded-sm" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 35px, #e8d9c4 36px, transparent 37px)", backgroundPosition: "0 5px" }}>
            <p className="min-h-[48vh] whitespace-pre-wrap px-1 pt-1 font-serif text-[17px] leading-[36px] text-[#68483d]">{letterText || (isOpening ? "Your opening birthday letter will appear here..." : "Your closing birthday letter will appear here...")}</p>
          </div>
          <p className="mt-4 text-right font-serif text-sm italic text-[#a47b59]">With all my love ♡</p>
        </div>
        <button type="button" onClick={onContinue} className="next-button mt-6">{isOpening ? "Continue to your story" : "Finish Day 16"} ♡</button>
      </section>
    </main>
  );
}
