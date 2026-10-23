import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { PLINKO_CONTENT } from "@/lib/activities/plinko";

const { width, height, binTop, prizes, rounds, title, intro, eyebrow } = PLINKO_CONTENT;
const boardInset = 13;
const bucketWidth = (width - boardInset * 2) / prizes.length;
const coinRadius = 8;

type Point = { x: number; y: number };
type PhysicsBody = {
  label: string;
  position: Point;
  velocity: Point;
  angle: number;
  circleRadius?: number;
  vertices: Point[];
  isStatic: boolean;
  render: { fillStyle?: string; strokeStyle?: string; lineWidth?: number };
};
type PhysicsEngine = {
  world: object;
  gravity: { x: number; y: number; scale: number };
};
type MatterApi = {
  Engine: { create: () => PhysicsEngine; update: (engine: PhysicsEngine, delta: number) => void; clear: (engine: PhysicsEngine) => void };
  World: { add: (world: object, bodies: PhysicsBody | PhysicsBody[]) => void; remove: (world: object, body: PhysicsBody) => void; clear: (world: object, keepStatic: boolean) => void };
  Bodies: { circle: (x: number, y: number, radius: number, options?: object) => PhysicsBody; rectangle: (x: number, y: number, w: number, h: number, options?: object) => PhysicsBody };
  Body: { setVelocity: (body: PhysicsBody, velocity: Point) => void; setPosition: (body: PhysicsBody, position: Point) => void };
};

type Phase = "loading" | "ready" | "moving" | "landed" | "finished";

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, w, h, radius);
  context.fill();
}

/** Plinko uses the open-source Matter.js rigid-body physics engine. */
export function Plinko({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const matterRef = useRef<MatterApi | null>(null);
  const engineRef = useRef<PhysicsEngine | null>(null);
  const coinRef = useRef<PhysicsBody | null>(null);
  const pegPositionsRef = useRef<Array<{ body: PhysicsBody; x: number; y: number }>>([]);
  const phaseRef = useRef<Phase>("loading");
  const resultsRef = useRef<number[]>([]);
  const dropFrameRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [results, setResults] = useState<number[]>([]);
  const total = results.reduce((sum, prize) => sum + prize, 0);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    let engine: PhysicsEngine | null = null;
    let matter: MatterApi | null = null;
    let createdScript: HTMLScriptElement | null = null;

    const initialise = () => {
      if (cancelled) return;
      matter = (window as unknown as { Matter?: MatterApi }).Matter ?? null;
      if (!matter) {
        phaseRef.current = "ready";
        setPhase("ready");
        return;
      }
      matterRef.current = matter;
      engine = matter.Engine.create();
      engine.gravity.x = 0;
      engine.gravity.y = 1;
      engine.gravity.scale = 0.00115;
      engineRef.current = engine;

      const bodies: PhysicsBody[] = [];
      const pegRows = PLINKO_CONTENT.pegRows;
      const firstCount = PLINKO_CONTENT.firstRowPegs;
      const pinRadius = 3.5;
      const paddingX = 22;
      const pinDistanceX = (width - paddingX * 2) / (firstCount + pegRows - 2);
      const topPadding = 28;
      const bottomPadding = 44;
      const pinDistanceY = (binTop - topPadding - bottomPadding) / (pegRows - 1);

      // Board geometry follows the established triangular Matter.js Plinko layout:
      // each row gains one pin and the outer pins define the sloped guard rails.
      for (let row = 0; row < pegRows; row++) {
        const count = firstCount + row;
        const y = topPadding + pinDistanceY * row;
        const rowPaddingX = paddingX + ((pegRows - 1 - row) * pinDistanceX) / 2;
        for (let col = 0; col < count; col++) {
          const x = rowPaddingX + ((width - rowPaddingX * 2) / (count - 1)) * col;
          bodies.push(matter.Bodies.circle(x, y, pinRadius, {
            isStatic: true,
            label: "plinko-peg",
            restitution: 0.8,
            friction: 0.5,
            render: { fillStyle: "#f8fafc" },
          }));
        }
      }

      // Invisible slanted guard rails keep the coin inside the pin pyramid.
      const firstPinX = width / 2 - pinDistanceX;
      const lastPinX = paddingX;
      const wallAngle = Math.atan2(firstPinX - lastPinX, binTop - topPadding - bottomPadding);
      const wallX = firstPinX - (firstPinX - lastPinX) / 2 - pinDistanceX * 0.25;
      const wallLength = binTop - topPadding - bottomPadding + 30;
      bodies.push(
        matter.Bodies.rectangle(wallX, (topPadding + binTop - bottomPadding) / 2, 8, wallLength, {
          isStatic: true, angle: wallAngle, label: "plinko-wall", render: { visible: false },
        }),
        matter.Bodies.rectangle(width - wallX, (topPadding + binTop - bottomPadding) / 2, 8, wallLength, {
          isStatic: true, angle: -wallAngle, label: "plinko-wall", render: { visible: false },
        }),
      );

      // Five real divider walls separate the fixed £1–£5 prize bins.
      for (let i = 0; i <= prizes.length; i++) {
        const x = boardInset + i * bucketWidth;
        bodies.push(matter.Bodies.rectangle(x, binTop + (height - binTop) / 2, 3, height - binTop, {
          isStatic: true, label: "plinko-divider", restitution: 0.1, render: { fillStyle: "#475569" },
        }));
      }
      bodies.push(matter.Bodies.rectangle(width / 2, height - 3, width, 6, {
        isStatic: true, label: "plinko-floor", restitution: 0.1, render: { fillStyle: "#475569" },
      }));
      matter.World.add(engine.world, bodies);
      pegPositionsRef.current = bodies
        .filter((body) => body.label === "plinko-peg")
        .map((body) => ({ body, x: body.position.x, y: body.position.y }));
      phaseRef.current = "ready";
      setPhase("ready");
    };

    const existing = (window as unknown as { Matter?: MatterApi }).Matter;
    if (existing) {
      initialise();
    } else {
      const prior = document.querySelector<HTMLScriptElement>('script[data-plinko-matter="true"]');
      if (prior) {
        prior.addEventListener("load", initialise, { once: true });
        prior.addEventListener("error", initialise, { once: true });
      } else {
        createdScript = document.createElement("script");
        createdScript.src = "/vendor/matter.js";
        createdScript.async = true;
        createdScript.dataset.plinkoMatter = "true";
        createdScript.onload = initialise;
        createdScript.onerror = initialise;
        document.head.appendChild(createdScript);
      }
    }

    const draw = (context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, width, height);
      // Inspired by the clean, high-contrast board treatment in AnsonH's open-source Plinko project.
      context.fillStyle = "#0f1728";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#172338";
      context.fillRect(7, 7, width - 14, height - 14);

      // Five bright prize bins, similar to the original game's bin strip.
      const palette = ["#ff003f", "#ffc000", "#ffc000", "#ffc000", "#ff003f"];
      context.fillStyle = "#0b1220";
      context.fillRect(boardInset, binTop, width - boardInset * 2, height - binTop - 5);
      prizes.forEach((prize, index) => {
        const x = boardInset + index * bucketWidth;
        context.fillStyle = palette[index]!;
        context.fillRect(x + 1, binTop + 2, bucketWidth - 2, height - binTop - 7);
        context.fillStyle = index === 0 || index === prizes.length - 1 ? "#ffffff" : "#1f2937";
        context.font = "800 16px system-ui, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("£" + prize, x + bucketWidth / 2, binTop + 23);
      });

      // Render pins with a small shadow for depth.
      const activeEngine = engineRef.current;
      if (activeEngine) {
        const worldBodies = (activeEngine.world as { bodies?: PhysicsBody[] }).bodies ?? [];
        for (const body of worldBodies) {
          if (body.label === "plinko-peg") {
            context.beginPath();
            context.arc(body.position.x + 0.5, body.position.y + 1.5, 4, 0, Math.PI * 2);
            context.fillStyle = "rgba(0, 0, 0, .35)";
            context.fill();
            context.beginPath();
            context.arc(body.position.x, body.position.y, 3.5, 0, Math.PI * 2);
            context.fillStyle = "#f8fafc";
            context.fill();
          } else if (body.label === "plinko-divider") {
            context.fillStyle = "#475569";
            context.fillRect(body.position.x - 1.5, binTop, 3, height - binTop - 5);
          }
        }
      }

      if (phaseRef.current === "ready" || phaseRef.current === "landed") {
        context.beginPath();
        context.arc(width / 2, 14, 3, 0, Math.PI * 2);
        context.fillStyle = "#38bdf8";
        context.fill();
      }

      const coin = coinRef.current;
      if (coin && phaseRef.current !== "finished") {
        context.beginPath();
        context.arc(coin.position.x, coin.position.y, coinRadius, 0, Math.PI * 2);
        context.fillStyle = "#ff003f";
        context.fill();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1.5;
        context.stroke();
      }
    };
    const tick = () => {
      if (engine && matter && phaseRef.current === "moving") {
        matter.Engine.update(engine, 1000 / 60);
        dropFrameRef.current += 1;
        const coin = coinRef.current;
        if (coin && coin.position.y >= height - 31 && dropFrameRef.current > 20) {
          const index = Math.max(0, Math.min(prizes.length - 1, Math.floor((coin.position.x - boardInset) / bucketWidth)));
          const nextResults = resultsRef.current.concat(prizes[index]!);
          resultsRef.current = nextResults;
          setResults(nextResults);
          const nextPhase: Phase = nextResults.length >= rounds ? "finished" : "landed";
          phaseRef.current = nextPhase;
          setPhase(nextPhase);
        } else if (dropFrameRef.current > 600) {
          // Safety fallback in case a browser frame is throttled or a collision traps the ball.
          const index = Math.max(0, Math.min(prizes.length - 1, Math.floor(((coin?.position.x ?? width / 2) - boardInset) / bucketWidth)));
          const nextResults = resultsRef.current.concat(prizes[index]!);
          resultsRef.current = nextResults;
          setResults(nextResults);
          const nextPhase: Phase = nextResults.length >= rounds ? "finished" : "landed";
          phaseRef.current = nextPhase;
          setPhase(nextPhase);
        }
      }
      const context = canvas.current?.getContext("2d");
      if (context) draw(context);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (createdScript) createdScript.onload = null;
      if (engine && matter) {
        matter.World.clear(engine.world, false);
        matter.Engine.clear(engine);
      }
      engineRef.current = null;
      matterRef.current = null;
    };
  }, []);

  const dropCoin = () => {
    const matter = matterRef.current;
    const engine = engineRef.current;
    if (!matter || !engine || phaseRef.current !== "ready") return;
    if (coinRef.current) matter.World.remove(engine.world, coinRef.current);
    // Give every round a slightly different peg field so the path is not repeated.
    // Small offsets keep it looking like a real Plinko board rather than changing the rules.
    for (const peg of pegPositionsRef.current) {
      matter.Body.setPosition(peg.body, {
        x: peg.x + (Math.random() - 0.5) * 5,
        y: peg.y,
      });
    }
    const launchX = width / 2 + (Math.random() - 0.5) * 18;
    const coin = matter.Bodies.circle(launchX, 55, coinRadius, {
      label: "plinko-coin",
      restitution: 0.8,
      friction: 0.5,
      frictionAir: 0.0414,
      density: 0.004,
      render: { fillStyle: "#ff003f" },
    });
    coinRef.current = coin;
    matter.World.add(engine.world, coin);
    // A meaningful, randomized sideways launch makes all five buckets reachable.
    matter.Body.setVelocity(coin, { x: (Math.random() - 0.5) * 0.8, y: 0.3 });
    dropFrameRef.current = 0;
    phaseRef.current = "moving";
    setPhase("moving");
  };

  const nextRound = () => {
    const matter = matterRef.current;
    const engine = engineRef.current;
    if (matter && engine && coinRef.current) matter.World.remove(engine.world, coinRef.current);
    coinRef.current = null;
    if (phaseRef.current !== "landed") return;
    phaseRef.current = "ready";
    setPhase("ready");
  };

  const restart = () => {
    const matter = matterRef.current;
    const engine = engineRef.current;
    if (matter && engine && coinRef.current) matter.World.remove(engine.world, coinRef.current);
    coinRef.current = null;
    resultsRef.current = [];
    setResults([]);
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
      <canvas ref={canvas} className="golf-canvas my-4 w-full" style={{ touchAction: "pan-y" }} width={width} height={height} aria-label="Plinko board. Drop a coin from the top; it bounces off the pegs and lands in a prize slot." />
      <p className="mb-3 text-sm text-muted-foreground">{phase === "loading" ? "Getting the board ready…" : phase === "finished" ? "Your total: £" + total + " · Every round counts." : phase === "moving" ? "Here it goes… good luck! ♡" : phase === "landed" ? "Round " + results.length + ": £" + results[results.length - 1] + "!" : "Round " + (results.length + 1) + " of " + rounds + " · Drop your coin from the top and see where it lands."}</p>
      {results.length > 0 && <div className="mb-4 flex flex-wrap justify-center gap-2">{results.map((prize, index) => <span key={index} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">Round {index + 1}: £{prize}</span>)}</div>}
      <div className="mt-auto flex justify-center gap-3">
        {phase === "ready" && <button type="button" className="next-button" onClick={dropCoin}>Drop coin <ArrowRight className="h-4 w-4" /></button>}
        {phase === "landed" && <button type="button" className="next-button" onClick={nextRound}>Next round <ArrowRight className="h-4 w-4" /></button>}
        {phase === "finished" && <><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={restart}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s compliment</button></>}
      </div>
    </section>
  </div></main>;
}
