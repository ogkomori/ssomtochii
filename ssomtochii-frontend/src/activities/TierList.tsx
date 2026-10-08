import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { GameShell } from "@/activities/Connections";
import { DailyWheel } from "@/components/DailyWheel";
import { unlockWorldItem } from "@/lib/world";

export const TIER_LIST_CONTENT = { items: ["Late-night talks", "Plant shopping", "Movie marathons", "Dancing in the kitchen", "Beach days", "Good pasta"], predictions: { "Late-night talks": "S", "Plant shopping": "A", "Movie marathons": "S", "Dancing in the kitchen": "A", "Beach days": "B", "Good pasta": "S" } as Record<string, string> };
const tiers = ["S", "A", "B", "C", "D"];

/** Data-driven tier list with a prediction reveal. Touch users tap an item then tap a tier. */
export function TierList() {
  const [choices, setChoices] = useState<Record<string, string>>({}); const [selected, setSelected] = useState<string | null>(null); const [revealed, setRevealed] = useState(false); const complete = Object.keys(choices).length === TIER_LIST_CONTENT.items.length; const matches = TIER_LIST_CONTENT.items.filter((item) => choices[item] === TIER_LIST_CONTENT.predictions[item]).length;
  const assign = (tier: string) => { if (!selected) return; setChoices((current) => ({ ...current, [selected]: tier })); setSelected(null); };
  const reset = () => { setChoices({}); setSelected(null); setRevealed(false); };
  return <GameShell eyebrow="TIER LIST" title={revealed ? "Do I know you?" : "Rank your favourites."} right={`${Object.keys(choices).length}/${TIER_LIST_CONTENT.items.length}`}>{revealed ? <DailyWheel day={12} /> : <><p className="game-message">Tap a card, then tap the tier it deserves.</p><div className="tier-board">{tiers.map((tier) => <button type="button" key={tier} className={`tier-row tier-${tier.toLowerCase()} ${selected ? "is-ready" : ""}`} onClick={() => assign(tier)}><strong>{tier}</strong><span>{TIER_LIST_CONTENT.items.filter((item) => choices[item] === tier).map((item) => <em key={item}>{item}</em>)}</span></button>)}</div><div className="tier-items">{TIER_LIST_CONTENT.items.filter((item) => !choices[item]).map((item) => <button type="button" key={item} className={selected === item ? "is-selected" : ""} onClick={() => setSelected(item)}>{item}</button>)}</div>{complete && <button type="button" className="next-button mt-5" onClick={() => { setRevealed(true); unlockWorldItem("ranking-ribbon"); }}>See my prediction</button>}</>}</GameShell>;
}
