import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { MEMORY_MATCH_CONTENT } from "@/lib/memory-match";

type Card = (typeof MEMORY_MATCH_CONTENT.pairs)[number] & { cardId: string };

function makeCards() {
  return [...MEMORY_MATCH_CONTENT.pairs, ...MEMORY_MATCH_CONTENT.pairs]
    .map((card, index) => ({ ...card, cardId: `${card.id}-${index}` }))
    .sort(() => Math.random() - 0.5);
}

/** Reusable card-matching activity; replace pair image URLs in lib/memory-match.ts. */
export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(makeCards);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const complete = matched.length === MEMORY_MATCH_CONTENT.pairs.length;
  const cardById = useMemo(() => new Map(cards.map((card) => [card.cardId, card])), [cards]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    if (first === undefined || second === undefined) return;
    const isMatch = cardById.get(first)?.id === cardById.get(second)?.id;
    const timer = window.setTimeout(() => {
      if (isMatch) setMatched((current) => [...current, cardById.get(first)?.id ?? ""]);
      setFlipped([]);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [cardById, flipped]);

  const flip = (card: Card) => {
    if (flipped.length === 2 || flipped.includes(card.cardId) || matched.includes(card.id)) return;
    setFlipped((current) => [...current, card.cardId]);
    if (flipped.length === 1) setMoves((current) => current + 1);
  };
  const reset = () => { setCards(makeCards()); setFlipped([]); setMatched([]); setMoves(0); };

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{moves} MOVES</span></header><section className="paper-card my-6 flex flex-1 flex-col p-5 text-center sm:p-8"><div className="day-one-copy"><p className="day-one-eyebrow">MEMORY MATCH</p><h1 className="font-script text-5xl leading-none">{complete ? "You found them all." : MEMORY_MATCH_CONTENT.title}</h1><p>{complete ? "A sweet little collection, all uncovered." : MEMORY_MATCH_CONTENT.intro}</p></div><div className="memory-grid my-auto py-7">{cards.map((card) => { const visible = flipped.includes(card.cardId) || matched.includes(card.id); return <button type="button" key={card.cardId} className={`memory-card ${visible ? "is-visible" : ""} ${matched.includes(card.id) ? "is-matched" : ""}`} onClick={() => flip(card)} disabled={complete} aria-label={visible ? card.label : "Hidden memory card"}>{visible ? card.image ? <img src={card.image} alt={card.label} /> : <span aria-hidden>{card.emoji}</span> : <span className="memory-card-back">♡</span>}</button>; })}</div><div className="mt-auto flex justify-center">{complete ? <Link to="/" className="next-button">Back to all days</Link> : <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Shuffle again</button>}</div></section></div></main>;
}
