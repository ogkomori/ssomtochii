import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Botanicals } from "@/components/Botanicals";
import { getUnlockedWorldItems, subscribeToWorld, WORLD_ITEMS, type WorldItemId } from "@/lib/world";

const EMPTY_WORLD: WorldItemId[] = [];

export const Route = createFileRoute("/world")({ component: WorldPage, head: () => ({ meta: [{ title: "Your World · 16 Days of Somto" }] }) });

function WorldPage() {
  const unlocked = useSyncExternalStore(subscribeToWorld, getUnlockedWorldItems, () => EMPTY_WORLD);
  return <main className="page-shell"><Botanicals /><div className="relative mx-auto w-full max-w-xl"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">{unlocked.length} FOUND</span></header><section className="paper-card mt-5 p-5 text-center sm:p-8"><p className="day-one-eyebrow">YOUR WORLD</p><h1 className="mt-2 font-script text-5xl">A place becoming yours.</h1><p className="mx-auto mt-3 max-w-sm text-sm text-foreground/75">Each finished surprise leaves something small and lovely behind.</p><div className="world-scene" aria-label="Your growing world"><span className="world-cloud cloud-one">☁</span><span className="world-cloud cloud-two">☁</span><span className="world-house">🏡</span><span className="world-tree">🌳</span>{unlocked.map((id) => { const item = WORLD_ITEMS[id]; return <div className={`world-item ${item.position}`} key={id} title={`${item.name}: ${item.description}`}><span>{item.emoji}</span><small>{item.name}</small></div>; })}{unlocked.length === 0 && <p className="world-empty">Your first little discovery is waiting in a game.</p>}</div><div className="mt-5 flex flex-wrap justify-center gap-2">{Object.entries(WORLD_ITEMS).map(([id, item]) => <span key={id} className={`world-key ${unlocked.includes(id as keyof typeof WORLD_ITEMS) ? "is-found" : ""}`}>{unlocked.includes(id as keyof typeof WORLD_ITEMS) ? item.emoji : "○"} {item.name}</span>)}</div></section></div></main>;
}
