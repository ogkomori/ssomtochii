import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Botanicals } from "@/components/Botanicals";

export const CONNECTIONS_CONTENT = {
  title: "Little connections",
  rounds: [
    {
      groups: [
        { category: "Ways to unwind", items: ["TEA", "BOOK", "MUSIC", "NAP"] },
        { category: "Things that sparkle", items: ["STAR", "RING", "DISCO", "GLITTER"] },
        { category: "Sweet treats", items: ["CAKE", "COOKIE", "DONUT", "CANDY"] },
        { category: "Places to wander", items: ["BEACH", "MARKET", "MUSEUM", "GARDEN"] },
      ],
    },
    {
      groups: [
        { category: "Things in the sky", items: ["CLOUD", "MOON", "SUN", "RAINBOW"] },
        { category: "Things you can wear", items: ["SCARF", "HAT", "BOOTS", "RING"] },
        { category: "Words before “cake”", items: ["BIRTHDAY", "CHEESE", "PAN", "CUP"] },
        { category: "Things with pages", items: ["NOVEL", "DIARY", "ATLAS", "COMIC"] },
      ],
    },
  ],
};

function shuffledItems(roundIndex: number) {
  return CONNECTIONS_CONTENT.rounds[roundIndex]!.groups
    .flatMap((group) => group.items)
    .sort(() => Math.random() - 0.5);
}

/** Two-round, data-driven four-by-four grouping activity. */
export function Connections({ onComplete }: { onComplete: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [allItems, setAllItems] = useState(() => shuffledItems(0));
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("Find four things that belong together.");
  const round = CONNECTIONS_CONTENT.rounds[roundIndex]!;
  const complete = solved.length === round.groups.length;
  const finalRound = roundIndex === CONNECTIONS_CONTENT.rounds.length - 1;

  useEffect(() => {
    setAllItems(shuffledItems(roundIndex));
  }, [roundIndex]);

  const toggle = (item: string) => setSelected((current) =>
    current.includes(item) ? current.filter((entry) => entry !== item) : current.length < 4 ? [...current, item] : current
  );

  const submit = () => {
    const found = round.groups.findIndex((group, index) =>
      !solved.includes(index) && group.items.every((item) => selected.includes(item))
    );
    if (found >= 0) {
      setSolved((current) => [...current, found]);
      setSelected([]);
      setMessage(`${round.groups[found]!.category} — lovely!`);
    } else {
      setMistakes((count) => count + 1);
      setMessage("Not quite — rearrange those four and try again.");
    }
  };

  const reset = () => {
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setMessage("Find four things that belong together.");
    setAllItems(shuffledItems(roundIndex));
  };

  const nextRound = () => {
    setRoundIndex((current) => current + 1);
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setMessage("Find four things that belong together.");
  };

  const available = allItems.filter((item) =>
    !solved.some((index) => round.groups[index]!.items.includes(item))
  );

  return <GameShell eyebrow={`CONNECTIONS · ROUND ${roundIndex + 1} OF ${CONNECTIONS_CONTENT.rounds.length}`} title={complete ? (finalRound ? "Everything clicks." : "Round one complete!") : CONNECTIONS_CONTENT.title} right={`${mistakes} ${mistakes === 1 ? "MISTAKE" : "MISTAKES"}`}>
    {complete ? (
      <div className="day-one-copy items-center text-center">
        <div className="completion-mark"><Check className="h-8 w-8" /></div>
        <p>{finalRound ? "Everything clicked. Ready for today’s letter?" : "Lovely work! One more round to go."}</p>
        {finalRound
          ? <button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button>
          : <button type="button" className="next-button" onClick={nextRound}>Next round <ArrowRight className="h-4 w-4" /></button>}
      </div>
    ) : (
      <>
        <p className="game-message">{message}</p>
        {solved.map((index) => <div key={index} className="connection-solved"><strong>{round.groups[index]!.category}</strong><span>{round.groups[index]!.items.join(" · ")}</span></div>)}
        <div className="connection-grid">
          {available.map((item) => <button type="button" key={item} onClick={() => toggle(item)} className={`connection-tile ${selected.includes(item) ? "is-selected" : ""}`}>{item}</button>)}
        </div>
        <div className="mt-5 flex items-center justify-center gap-4">
          <button type="button" className="next-button" disabled={selected.length !== 4} onClick={submit}>Submit four <Check className="h-4 w-4" /></button>
          <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Start over</button>
        </div>
      </>
    )}
  </GameShell>;
}

export function GameShell({ eyebrow, title, right, children }: { eyebrow: string; title: string; right?: string; children: React.ReactNode }) { return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link>{right && <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">{right}</span>}</header><section className="paper-card my-5 flex flex-1 flex-col p-5 text-center sm:p-7"><p className="day-one-eyebrow">{eyebrow}</p><h1 className="mt-2 font-script text-5xl leading-none">{title}</h1><div className="my-auto py-6">{children}</div></section></div></main>; }
