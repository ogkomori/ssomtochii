import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";

const width = 360;
const height = 500;
const binTop = 420;
const binWidth = width / 5;
const coinRadius = 8;
type Coin = { x: number; y: number; vx: number; vy: number };
type Phase = "ready" | "moving" | "landed" | "finished";
const pegs = Array.from({ length: 8 }, (_, row) => {
  const count = row % 2 === 0 ? 4 : 5;
  const spacing = width / (count + 1);
  return Array.from({ length: count }, (_, col) => ({ x: spacing * (col + 1) + (row % 2 === 0 ? 0 : -spacing / 2), y: 100 + row * 39 }));
}).flat();

/** Five-round Plinko-style prize game. Each drop awards £1–£5. */
export function Plinko({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const coin = useRef<Coin>({ x: width / 2, y: 65, vx: 0, vy: 0 });
  const dropX = useRef(width / 2);
  const phaseRef = useRef<Phase>("ready");
  const resultsRef = useRef<number[]>([]);
  const [selectedX, setSelectedX] = useState(width / 2);
  const [phase, setPhase] = useState<Phase>("ready");
  const [results, setResults] = useState<number[]>([]);
  const total = results.reduce((sum, prize) => sum + prize, 0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const context = canvas.current?.getContext("2d");
      if (!context) { frame = requestAnimationFrame(tick); return; }
      const current = coin.current;
      if (phaseRef.current === "moving") {
        current.x += current.vx;
        current.y += current.vy;
        current.vy += 0.105;
        current.vx *= 0.998;
        if (current.x < coinRadius + 5 || current.x > width - coinRadius - 5) {
          current.x = Math.max(coinRadius + 5, Math.min(width - coinRadius - 5, current.x));
          current.vx *= -0.65;
        }
        for (const peg of pegs) {
          const dx = current.x - peg.x;
          const dy = current.y - peg.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 12 && distance > 0) {
            const nx = dx / distance;
            const ny = dy / distance;
            current.x = peg.x + nx * 12;
            current.y = peg.y + ny * 12;
            current.vx += nx * 0.9 + (Math.random() - 0.5) * 0.45;
            current.vy = Math.max(0.9, Math.abs(current.vy) * 0.55);
          }
        }
        if (current.y >= binTop - coinRadius) {
          current.y = binTop - coinRadius;
          const prize = Math.max(1, Math.min(5, Math.floor(current.x / binWidth) + 1));
          const nextResults = [...resultsRef.current, prize];
          resultsRef.current = nextResults;
          setResults(nextResults);
          const nextPhase: Phase = nextResults.length >= 5 ? "finished" : "landed";
          phaseRef.current = nextPhase;
          setPhase(nextPhase);
        }
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f7f0df";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#e9ddc2";
      context.fillRect(8, 12, width - 16, binTop - 12);
      context.strokeStyle = "#b5a17c";
      context.lineWidth = 3;
      context.strokeRect(8, 12, width - 16, height - 20);
      context.fillStyle = "#d9c9a7";
      context.fillRect(8, binTop, width - 16, height - binTop - 8);
      for (const peg of pegs) {
        context.beginPath(); context.arc(peg.x, peg.y, 4.5, 0, Math.PI * 2);
        context.fillStyle = "#9d8966"; context.fill();
        context.beginPath(); context.arc(peg.x - 1, peg.y - 1, 1.5, 0, Math.PI * 2);
        context.fillStyle = "#fff8e9"; context.fill();
      }
      for (let i = 0; i < 5; i++) {
        context.fillStyle = ["#f0d4b7", "#eac7a5", "#e6b5a2", "#e2a49b", "#d98e8b"][i]!;
        context.fillRect(i * binWidth + 2, binTop + 2, binWidth - 4, height - binTop - 12);
        if (i > 0) { context.beginPath(); context.moveTo(i * binWidth, binTop); context.lineTo(i * binWidth, height - 8); context.strokeStyle = "#b5a17c"; context.lineWidth = 2; context.stroke(); }
        context.fillStyle = "#553d35"; context.font = "bold 18px system-ui, sans-serif"; context.textAlign = "center";
        context.fillText(`£${i + 1}`, i * binWidth + binWidth / 2, binTop + 38);
      }
      if (phaseRef.current === "ready" || phaseRef.current === "landed") {
        context.beginPath(); context.moveTo(dropX.current, 25); context.lineTo(dropX.current, 48);
        context.strokeStyle = "#b86e68"; context.lineWidth = 2; context.setLineDash([3, 4]); context.stroke(); context.setLineDash([]);
      }
      if (phaseRef.current !== "finished") {
        context.beginPath(); context.arc(current.x, current.y, coinRadius, 0, Math.PI * 2);
        context.fillStyle = "#f9d56e"; context.fill(); context.strokeStyle = "#a77c31"; context.lineWidth = 2; context.stroke();
        context.fillStyle = "#765321"; context.font = "bold 10px system-ui, sans-serif"; context.textAlign = "center"; context.fillText("£", current.x, current.y + 3.5);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const chooseDrop = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current === "moving" || phaseRef.current === "finished") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(22, Math.min(width - 22, (event.clientX - rect.left) * width / rect.width));
    dropX.current = x;
    coin.current = { x, y: 65, vx: 0, vy: 0 };
    setSelectedX(x);
  };
  const dropCoin = () => {
    if (phaseRef.current !== "ready") return;
    coin.current = { x: dropX.current, y: 65, vx: (Math.random() - 0.5) * 0.55, vy: 1.15 };
    phaseRef.current = "moving";
    setPhase("moving");
  };
  const nextRound = () => {
    if (phaseRef.current !== "landed") return;
    phaseRef.current = "ready";
    coin.current = { x: dropX.current, y: 65, vx: 0, vy: 0 };
    setPhase("ready");
  };
  const restart = () => {
    resultsRef.current = [];
    setResults([]);
    dropX.current = width / 2;
    setSelectedX(width / 2);
    coin.current = { x: width / 2, y: 65, vx: 0, vy: 0 };
    phaseRef.current = "ready";
    setPhase("ready");
  };

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
    <header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{Math.min(results.length + (phase === "moving" ? 1 : 0), 5)} / 5 ROUNDS</span></header>
    <section className="paper-card my-5 flex flex-1 flex-col p-5 text-center">
      <p className="day-one-eyebrow">LUCKY DROP</p>
      <h1 className="mt-2 font-script text-4xl leading-none">{phase === "finished" ? "Look at you go! ♡" : "Drop a little luck."}</h1>
      <p className="mt-2 text-sm text-foreground/75">{phase === "finished" ? `You won £${total} across five rounds!` : "Drop a coin through the pegs. Wherever it lands is what you win that round."}</p>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground"><span>£1</span><span>·</span><span>£2</span><span>·</span><span>£3</span><span>·</span><span>£4</span><span>·</span><span>£5 per round</span></div>
      <canvas ref={canvas} className="golf-canvas my-4 w-full" style={{ touchAction: "pan-y" }} width={width} height={height} onPointerDown={chooseDrop} aria-label="Coin drop board. Tap near the top to choose where the coin starts." />
      <p className="mb-3 text-sm text-muted-foreground">{phase === "finished" ? `Your total: £${total} · Every round counts.` : phase === "moving" ? "Here it goes… good luck! ♡" : phase === "landed" ? `Round ${results.length}: £${results[results.length - 1]}!` : `Round ${results.length + 1} of 5 · Tap the board to choose your drop point.`}</p>
      {results.length > 0 && <div className="mb-4 flex flex-wrap justify-center gap-2">{results.map((prize, index) => <span key={index} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">Round {index + 1}: £{prize}</span>)}</div>}
      <div className="mt-auto flex justify-center gap-3">
        {phase === "ready" && <button type="button" className="next-button" onClick={dropCoin}>Drop coin <ArrowRight className="h-4 w-4" /></button>}
        {phase === "landed" && <button type="button" className="next-button" onClick={nextRound}>Next round <ArrowRight className="h-4 w-4" /></button>}
        {phase === "finished" && <><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={restart}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></>}
      </div>
    </section>
  </div></main>;
}
