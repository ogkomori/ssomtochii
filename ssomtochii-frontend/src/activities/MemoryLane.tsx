import { useState } from "react";
import { ArrowDown, ArrowUp, Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { MEMORY_LANE_CONTENT, type MemoryLanePhoto } from "@/lib/memory-lane";

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j]!, result[i]!]; }
  if (result.every((item, index) => item === items[index]) && result.length > 1) [result[0], result[1]] = [result[1]!, result[0]!];
  return result;
}
export function MemoryLane({ onComplete }: { onComplete: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [order, setOrder] = useState<MemoryLanePhoto[]>(() => shuffled(MEMORY_LANE_CONTENT.rounds[0]!.photos));
  const [message, setMessage] = useState("Arrange from earliest to latest.");
  const [roundsWon, setRoundsWon] = useState<number[]>([]);
  const round = MEMORY_LANE_CONTENT.rounds[roundIndex]!;
  const complete = roundsWon.length === MEMORY_LANE_CONTENT.rounds.length;
  const solved = order.every((photo, index) => photo.id === round.photos[index]!.id);
  const swap = (index: number, direction: -1 | 1) => {
    const other = index + direction; if (other < 0 || other >= order.length) return;
    setOrder((current) => { const next = [...current]; [next[index], next[other]] = [next[other]!, next[index]!]; return next; });
    setMessage("Keep going — earliest to latest.");
  };
  const check = () => {
    if (!solved) { setMessage("Not quite yet. Try changing the order."); return; }
    setRoundsWon((current) => current.includes(roundIndex) ? current : [...current, roundIndex]);
    if (roundIndex === MEMORY_LANE_CONTENT.rounds.length - 1) { setMessage("All three timelines reconstructed!"); return; }
    setRoundIndex((current) => current + 1);
    setOrder(shuffled(MEMORY_LANE_CONTENT.rounds[roundIndex + 1]!.photos));
    setMessage("Round complete. On to the next memory.");
  };
  const resetRound = () => { setOrder(shuffled(round.photos)); setMessage("Arrange from earliest to latest."); };
  return <GameShell eyebrow="MEMORY LANE" title={complete ? "A timeline of little moments." : MEMORY_LANE_CONTENT.title} right={`ROUND ${Math.min(roundIndex + 1, 3)} OF 3`}>
    <p className="mb-4 text-sm text-foreground/75">{complete ? "You put all three sets of memories in order." : MEMORY_LANE_CONTENT.intro}</p>
    {!complete && <>
      <h2 className="mb-3 text-sm font-semibold">{round.title}</h2>
      <div className="space-y-3">
        {order.map((photo, index) => <div key={photo.id} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2 text-left">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
            <img src={photo.image} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} onLoad={(event) => { const next = event.currentTarget.nextElementSibling as HTMLElement | null; if (next) next.style.display = "none"; }} />
            <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs text-muted-foreground">Photo placeholder</div>
          </div>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{index + 1}. {photo.caption}</p><p className="text-xs text-muted-foreground">Move this memory earlier or later.</p></div>
          <div className="flex flex-col gap-1"><button type="button" aria-label="Move earlier" className="rounded-md bg-secondary p-2 disabled:opacity-30" disabled={index === 0} onClick={() => swap(index, -1)}><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label="Move later" className="rounded-md bg-secondary p-2 disabled:opacity-30" disabled={index === order.length - 1} onClick={() => swap(index, 1)}><ArrowDown className="h-4 w-4" /></button></div>
        </div>)}
      </div>
      <p className="mt-4 min-h-6 text-sm text-muted-foreground">{message}</p>
      <div className="mt-3 flex justify-center gap-3"><button type="button" className="next-button" onClick={check}>Check order <Check className="h-4 w-4" /></button><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={resetRound}><RotateCcw className="h-4 w-4" /> Reset</button></div>
    </>}
    {complete && <button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button>}
  </GameShell>;
}
