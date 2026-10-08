import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { unlockWorldItem } from "@/lib/world";

export const CONNECTIONS_CONTENT = {
  title: "Little connections",
  groups: [
    { category: "Ways to unwind", items: ["TEA", "BOOK", "MUSIC", "NAP"] },
    { category: "Things that sparkle", items: ["STAR", "RING", "DISCO", "GLITTER"] },
    { category: "Sweet treats", items: ["CAKE", "COOKIE", "DONUT", "CANDY"] },
    { category: "Places to wander", items: ["BEACH", "MARKET", "MUSEUM", "GARDEN"] },
  ],
};

const allItems = CONNECTIONS_CONTENT.groups.flatMap((group) => group.items).sort(() => Math.random() - 0.5);

/** Data-driven four-by-four grouping activity. Replace CONNECTIONS_CONTENT to personalize it. */
export function Connections({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string[]>([]); const [solved, setSolved] = useState<number[]>([]); const [mistakes, setMistakes] = useState(0); const [message, setMessage] = useState("Find four things that belong together.");
  const complete = solved.length === CONNECTIONS_CONTENT.groups.length;
  const toggle = (item: string) => setSelected((current) => current.includes(item) ? current.filter((entry) => entry !== item) : current.length < 4 ? [...current, item] : current);
  const submit = () => {
    const found = CONNECTIONS_CONTENT.groups.findIndex((group, index) => !solved.includes(index) && group.items.every((item) => selected.includes(item)));
    if (found >= 0) { const next = [...solved, found]; setSolved(next); setSelected([]); setMessage(`${CONNECTIONS_CONTENT.groups[found].category} — lovely!`); if (next.length === 4) unlockWorldItem("constellation"); }
    else { setMistakes((count) => count + 1); setMessage("Not quite — rearrange those four and try again."); }
  };
  const reset = () => { setSelected([]); setSolved([]); setMistakes(0); setMessage("Find four things that belong together."); };
  const available = allItems.filter((item) => !solved.some((index) => CONNECTIONS_CONTENT.groups[index].items.includes(item)));
  return <GameShell eyebrow="CONNECTIONS" title={complete ? "Everything clicks." : CONNECTIONS_CONTENT.title} right={`${mistakes} ${mistakes === 1 ? "MISTAKE" : "MISTAKES"}`}>{complete ? <div className="day-one-copy items-center text-center"><div className="completion-mark"><Check className="h-8 w-8" /></div><p>Everything clicked. Ready for today’s letter?</p><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></div> : <><p className="game-message">{message}</p>{solved.map((index) => <div key={index} className="connection-solved"><strong>{CONNECTIONS_CONTENT.groups[index].category}</strong><span>{CONNECTIONS_CONTENT.groups[index].items.join(" · ")}</span></div>)}<div className="connection-grid">{available.map((item) => <button type="button" key={item} onClick={() => toggle(item)} className={`connection-tile ${selected.includes(item) ? "is-selected" : ""}`}>{item}</button>)}</div><button type="button" className="next-button mt-5" disabled={selected.length !== 4} onClick={submit}>Submit four <Check className="h-4 w-4" /></button><button type="button" className="mt-5 inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Start over</button></>}</GameShell>;
}

export function GameShell({ eyebrow, title, right, children }: { eyebrow: string; title: string; right?: string; children: React.ReactNode }) { return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link>{right && <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">{right}</span>}</header><section className="paper-card my-5 flex flex-1 flex-col p-5 text-center sm:p-7"><p className="day-one-eyebrow">{eyebrow}</p><h1 className="mt-2 font-script text-5xl leading-none">{title}</h1><div className="my-auto py-6">{children}</div></section></div></main>; }
