import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { PLINKO_CONTENT } from "@/lib/plinko";

const { width, height, binTop, prizes, rounds, title, intro, eyebrow } = PLINKO_CONTENT;
const binWidth = (width - 28) / prizes.length;
const boardLeft = 14;
const boardRight = width - 14;
const coinRadius = 8;
const pegRadius = 4.2;
const pegSpacing = 24;
type Coin = { x: number; y: number; vx: number; vy: number };
type Phase = "ready" | "moving" | "landed" | "finished";

const pegs = Array.from({ length: PLINKO_CONTENT.pegRows }, (_, row) => {
  const count = row + PLINKO_CONTENT.firstRowPegs;
  const y = PLINKO_CONTENT.firstPegY + row * PLINKO_CONTENT.pegRowGap;
  return Array.from({ length: count }, (_, col) => ({
    x: width / 2 + (col - (count - 1) / 2) * pegSpacing,
    y,
    row,
  }));
}).flat();

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/** A five-round, top-drop Plinko game. Board content and dimensions live in lib/plinko.ts. */
export function Plinko({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const coin = useRef<Coin>({ x: width / 2, y: 54, vx: 0, vy: 0 });
  const phaseRef = useRef<Phase>("ready");
  const resultsRef = useRef<number[]>([]);
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
        // Small substeps make the coin less likely to tunnel through a peg on mobile.
        for (let step = 0; step < 2; step++) {
          current.x += current.vx / 2;
          current.y += current.vy / 2;
          current.vy += 0.072;
          current.vx *= 0.999;

          for (const peg of pegs) {
            const dx = current.x - peg.x;
            const dy = current.y - peg.y;
            const distance = Math.hypot(dx, dy);
            const collisionDistance = coinRadius + pegRadius;
            if (distance < collisionDistance && distance > 0.001) {
              const nx = dx / distance;
              const ny = dy / distance;
              current.x = peg.x + nx * (collisionDistance + 0.3);
              current.y = peg.y + ny * (collisionDistance + 0.3);
              const normalVelocity = current.vx * nx + current.vy * ny;
              if (normalVelocity < 0) {
                current.vx -= 1.58 * normalVelocity * nx;
                current.vy -= 1.58 * normalVelocity * ny;
              }
              // A tiny, symmetric nudge makes peg contacts lively without choosing the prize directly.
              current.vx += (Math.random() - 0.5) * 0.34;
              current.vy = Math.max(0.35, current.vy);
            }
          }

          // Sloping outer rails keep the coin inside the triangular field.
          const railProgress = clamp((current.y - 66) / (PLINKO_CONTENT.binTop - 66), 0, 1);
          const halfRailWidth = 7 + railProgress * (width * 0.43);
          const leftRail = width / 2 - halfRailWidth;
          const rightRail = width / 2 + halfRailWidth;
          if (current.x - coinRadius < leftRail) {
            current.x = leftRail + coinRadius;
            current.vx = Math.abs(current.vx) * 0.72 + 0.12;
          }
          if (current.x + coinRadius > rightRail) {
            current.x = rightRail - coinRadius;
            current.vx = -Math.abs(current.vx) * 0.72 - 0.12;
          }
        }

        if (current.y >= binTop - coinRadius) {
          current.y = binTop - coinRadius;
          const prizeIndex = clamp(Math.floor((current.x - 14) / binWidth), 0, prizes.length - 1);
          const prize = prizes[prizeIndex]!;
          const nextResults = resultsRef.current.concat(prize);
          resultsRef.current = nextResults;
          setResults(nextResults);
          const nextPhase: Phase = nextResults.length >= rounds ? "finished" : "landed";
          phaseRef.current = nextPhase;
          setPhase(nextPhase);
        }
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f8f2e6";
      context.fillRect(0, 0, width, height);

      // Warm wooden frame and the triangular playfield.
      context.fillStyle = "#d8c4a1";
      context.beginPath();
      context.moveTo(width / 2, 62);
      context.lineTo(boardRight, binTop);
      context.lineTo(boardLeft, binTop);
      context.closePath();
      context.fill();

      context.beginPath();
      context.moveTo(width / 2, 65);
      context.lineTo(26, binTop - 7);
      context.moveTo(width / 2, 65);
      context.lineTo(width - 26, binTop - 7);
      context.strokeStyle = "#9e7957";
      context.lineWidth = 5;
      context.lineCap = "round";
      context.stroke();

      // Pegs have a soft shadow and a small highlight, like a physical board.
      for (const peg of pegs) {
        context.beginPath();
        context.arc(peg.x + 1, peg.y + 2, pegRadius + 0.5, 0, Math.PI * 2);
        context.fillStyle = "rgba(91, 65, 44, 0.14)";
        context.fill();
        context.beginPath();
        context.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        context.fillStyle = "#8f6c4f";
        context.fill();
        context.beginPath();
        context.arc(peg.x - 1.1, peg.y - 1.2, 1.25, 0, Math.PI * 2);
        context.fillStyle = "#fff3d9";
        context.fill();
      }

      // Five clearly separated prize cups at the bottom.
      context.fillStyle = "#b28c68";
      context.fillRect(10, binTop, width - 20, height - binTop - 8);
      for (let i = 0; i < prizes.length; i++) {
        const x = 14 + i * binWidth;
        const palette = ["#f0d8b8", "#edc9a8", "#e9b8a5", "#e5a5a0", "#d98c8a"];
        context.fillStyle = palette[i % palette.length]!;
        context.fillRect(x + 1.5, binTop + 2, binWidth - 3, height - binTop - 12);
        if (i > 0) {
          context.beginPath();
          context.moveTo(x, binTop + 1);
          context.lineTo(x, height - 8);
          context.strokeStyle = "#9e7957";
          context.lineWidth = 2;
          context.stroke();
        }
        context.fillStyle = "#573e32";
        context.font = "700 17px system-ui, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("£" + prizes[i], x + binWidth / 2, binTop + 29);
      }

      // The coin is always released from the apex; the dashed guide marks the launch point.
      if (phaseRef.current === "ready" || phaseRef.current === "landed") {
        context.beginPath();
        context.moveTo(width / 2, 25);
        context.lineTo(width / 2, 43);
        context.strokeStyle = "#b86e68";
        context.lineWidth = 2;
        context.setLineDash([3, 4]);
        context.stroke();
        context.setLineDash([]);
      }
      if (phaseRef.current !== "finished") {
        context.beginPath();
        context.arc(current.x, current.y, coinRadius, 0, Math.PI * 2);
        context.fillStyle = "#f9d56e";
        context.fill();
        context.strokeStyle = "#a77c31";
        context.lineWidth = 2;
        context.stroke();
        context.fillStyle = "#765321";
        context.font = "bold 10px system-ui, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("£", current.x, current.y + 0.5);
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const dropCoin = () => {
    if (phaseRef.current !== "ready") return;
    coin.current = { x: width / 2, y: 54, vx: (Math.random() - 0.5) * 0.3, vy: 0.8 };
    phaseRef.current = "moving";
    setPhase("moving");
  };

  const nextRound = () => {
    if (phaseRef.current !== "landed") return;
    phaseRef.current = "ready";
    coin.current = { x: width / 2, y: 54, vx: 0, vy: 0 };
    setPhase("ready");
  };

  const restart = () => {
    resultsRef.current = [];
    setResults([]);
    coin.current = { x: width / 2, y: 54, vx: 0, vy: 0 };
    phaseRef.current = "ready";
    setPhase("ready");
  };

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
    <header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{Math.min(results.length + (phase === "moving" ? 1 : 0), rounds)} / {rounds} ROUNDS</span></header>
    <section className="paper-card my-5 flex flex-1 flex-col p-5 text-center">
      <p className="day-one-eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-script text-4xl leading-none">{phase === "finished" ? "Look at you go! ♡" : title}</h1>
      <p className="mt-2 text-sm text-foreground/75">{phase === "finished" ? "You won £" + total + " across " + rounds + " rounds!" : intro}</p>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">{prizes.map((prize, index) => <span key={prize}>{index > 0 ? " · " : ""}£{prize}</span>)}<span> per round</span></div>
      <canvas ref={canvas} className="golf-canvas my-4 w-full" style={{ touchAction: "pan-y" }} width={width} height={height} aria-label="A triangular Plinko board. A coin drops from the top through rows of pegs into one of five prize slots." />
      <p className="mb-3 text-sm text-muted-foreground">{phase === "finished" ? "Your total: £" + total + " · Every round counts." : phase === "moving" ? "Here it goes… good luck! ♡" : phase === "landed" ? "Round " + results.length + ": £" + results[results.length - 1] + "!" : "Round " + (results.length + 1) + " of " + rounds + " · Drop your coin from the top and see where it lands."}</p>
      {results.length > 0 && <div className="mb-4 flex flex-wrap justify-center gap-2">{results.map((prize, index) => <span key={index} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">Round {index + 1}: £{prize}</span>)}</div>}
      <div className="mt-auto flex justify-center gap-3">
        {phase === "ready" && <button type="button" className="next-button" onClick={dropCoin}>Drop coin <ArrowRight className="h-4 w-4" /></button>}
        {phase === "landed" && <button type="button" className="next-button" onClick={nextRound}>Next round <ArrowRight className="h-4 w-4" /></button>}
        {phase === "finished" && <><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={restart}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></>}
      </div>
    </section>
  </div></main>;
}
