import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Check, RotateCcw } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { MEMORY_LANE_CONTENT, type MemoryLanePhoto } from "@/lib/activities/memory-lane";

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
  const [expandedPhoto, setExpandedPhoto] = useState<MemoryLanePhoto | null>(null);
  const round = MEMORY_LANE_CONTENT.rounds[roundIndex]!;
  useEffect(() => {
    if (!expandedPhoto) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpandedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedPhoto]);
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
          <button type="button" onClick={() => setExpandedPhoto(photo)} aria-label={`Expand photo: ${photo.caption}`} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <img src={photo.image} alt={photo.caption} className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} onLoad={(event) => { const next = event.currentTarget.nextElementSibling as HTMLElement | null; if (next) next.style.display = "none"; }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-xs text-muted-foreground"><span className="text-2xl">{photo.placeholder}</span><span>Photo placeholder</span></div>
            <span className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-1 text-center text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Click to expand</span>
          </button>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{index + 1}. {photo.caption}</p><p className="text-xs text-muted-foreground">Move this memory earlier or later.</p></div>
          <div className="flex flex-col gap-1"><button type="button" aria-label="Move earlier" className="rounded-md bg-secondary p-2 disabled:opacity-30" disabled={index === 0} onClick={() => swap(index, -1)}><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label="Move later" className="rounded-md bg-secondary p-2 disabled:opacity-30" disabled={index === order.length - 1} onClick={() => swap(index, 1)}><ArrowDown className="h-4 w-4" /></button></div>
        </div>)}
      </div>
      <p className="mt-4 min-h-6 text-sm text-muted-foreground">{message}</p>
      <div className="mt-3 flex justify-center gap-3"><button type="button" className="next-button" onClick={check}>Check order <Check className="h-4 w-4" /></button><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={resetRound}><RotateCcw className="h-4 w-4" /> Reset</button></div>
    </>}
    {complete && <button type="button" className="next-button" onClick={onComplete}>Get today’s compliment <Check className="h-4 w-4" /></button>}
    {expandedPhoto && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" role="presentation" onClick={() => setExpandedPhoto(null)}>
      <div role="dialog" aria-modal="true" aria-label={expandedPhoto.caption} className="relative flex max-h-[90vh] w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl bg-secondary" onClick={(event) => event.stopPropagation()}>
        <img src={expandedPhoto.image} alt={expandedPhoto.caption} className="max-h-[85vh] w-full object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} onLoad={(event) => { const next = event.currentTarget.nextElementSibling as HTMLElement | null; if (next) next.style.display = "none"; }} />
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 text-muted-foreground"><span className="text-7xl">{expandedPhoto.placeholder}</span><span className="text-sm">Photo placeholder</span></div>
        <button type="button" aria-label="Close expanded photo" onClick={() => setExpandedPhoto(null)} className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-2 text-sm font-semibold text-white">Close ✕</button>
      </div>
      <span className="sr-only">Click outside the photo or press Escape to close.</span>
    </div>}
  </GameShell>;
}
