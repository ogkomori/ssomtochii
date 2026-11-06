import { Botanicals } from "@/components/Botanicals";

const OPENING_LETTER = `Dear Somto,

Happy Birthday my love!
I hope you've been enjoying the story and the compliments so far, but here is where it all ends.
As always, I want to make this day extra special for you, because you are extra special to me.
Hope you're ready for today's gifts!

Love you forever,
Tega`;
const CLOSING_LETTER = ``;

export function Day16Letter({ kind, onContinue }: { kind: "opening" | "closing"; onContinue: () => void }) {
  const isOpening = kind === "opening";
  const letterText = isOpening ? OPENING_LETTER : CLOSING_LETTER;

  return (
    <main className="page-shell min-h-[100dvh] px-4 py-6">
      <Botanicals />
      <section className="relative mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-xl flex-col items-center justify-center">
        <p className="mb-4 text-xs font-bold tracking-[0.24em] text-muted-foreground">{isOpening ? "A LETTER FOR YOU" : "ONE LAST THING"}</p>
        <div className="w-full rounded-[22px] border border-border/70 bg-card/95 px-5 py-7 shadow-[0_18px_55px_rgba(45,65,45,0.14)] sm:px-9">
          <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-3">
            <span className="font-script text-2xl text-foreground/75">A little note, from me to you</span>
            <span aria-hidden="true" className="font-script text-3xl text-blossom">♡</span>
          </div>
          <div className="relative min-h-[48vh] rounded-sm" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 35px, color-mix(in oklch, var(--foreground) 17%, transparent) 36px, transparent 37px)", backgroundPosition: "0 5px" }}>
            <p className="min-h-[48vh] whitespace-pre-wrap px-1 pt-1 font-script text-[25px] leading-[36px] text-foreground sm:text-[28px]">{letterText || (isOpening ? "Your opening birthday letter will appear here..." : "Your closing birthday letter will appear here...")}</p>
          </div>
          <p className="mt-4 text-right font-script text-2xl text-foreground/70">With all my love ♡</p>
        </div>
        <button type="button" onClick={onContinue} className="next-button mt-6">{isOpening ? "Continue to your story" : "Finish Day 16"} ♡</button>
      </section>
    </main>
  );
}
