import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bodies, Body, Composite, Engine, type Body as MatterBody, type Engine as MatterEngine } from "matter-js";
import { Botanicals } from "@/components/Botanicals";
import { MINI_GOLF_CONTENT } from "@/lib/mini-golf";

const width = 360;
const height = 500;
const ballRadius = 10;
type Point = { x: number; y: number };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Mini-golf uses Matter.js for ball momentum and physical wall collisions. */
export function MiniGolf({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MatterEngine | null>(null);
  const ballRef = useRef<MatterBody | null>(null);
  const movingRef = useRef(false);
  const holedRef = useRef(false);
  const aimRef = useRef<Point | null>(null);
  const shotStartedAt = useRef(0);
  const drawRef = useRef<() => void>(() => {});
  const [holeIndex, setHoleIndex] = useState(0);
  const [strokes, setStrokes] = useState<number[]>([]);
  const [aim, setAim] = useState<Point | null>(null);
  const [holed, setHoled] = useState(false);
  const hole = MINI_GOLF_CONTENT.holes[holeIndex]!;
  const totalStrokes = strokes.reduce((sum, count) => sum + count, 0);
  const finished = holeIndex === MINI_GOLF_CONTENT.holes.length - 1 && holed;

  const draw = useCallback(() => {
    const context = canvas.current?.getContext("2d");
    const ball = ballRef.current;
    if (!context || !ball) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#b9d6b4";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#4f7d5a";
    context.lineWidth = 16;
    context.lineJoin = "round";
    context.strokeRect(8, 8, width - 16, height - 16);
    context.fillStyle = "#668f68";
    hole.walls.forEach((wall) => context.fillRect(wall.x, wall.y, wall.width, wall.height));
    context.beginPath();
    context.arc(hole.cup.x, hole.cup.y, 15, 0, Math.PI * 2);
    context.fillStyle = "#385441";
    context.fill();
    context.beginPath();
    context.moveTo(hole.cup.x + 2, hole.cup.y - 52);
    context.lineTo(hole.cup.x + 2, hole.cup.y - 13);
    context.strokeStyle = "#385441";
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = "#e7a5a1";
    context.beginPath();
    context.moveTo(hole.cup.x + 4, hole.cup.y - 51);
    context.lineTo(hole.cup.x + 35, hole.cup.y - 39);
    context.lineTo(hole.cup.x + 4, hole.cup.y - 28);
    context.closePath();
    context.fill();

    if (aimRef.current && !movingRef.current && !holedRef.current) {
      context.beginPath();
      context.moveTo(ball.position.x, ball.position.y);
      context.lineTo(aimRef.current.x, aimRef.current.y);
      context.strokeStyle = "rgba(56,84,65,.55)";
      context.lineWidth = 3;
      context.setLineDash([5, 6]);
      context.stroke();
      context.setLineDash([]);
    }
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#fffdf7";
    context.fill();
    context.strokeStyle = "#496e51";
    context.lineWidth = 2;
    context.stroke();
  }, [hole]);
  drawRef.current = draw;

  useEffect(() => {
    const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    engine.positionIterations = 8;
    engine.velocityIterations = 6;
    engineRef.current = engine;
    const ball = Bodies.circle(hole.start.x, hole.start.y, ballRadius, {
      label: "golf-ball",
      density: 0.002,
      friction: 0.08,
      frictionAir: 0.018,
      restitution: 0.42,
    });
    ballRef.current = ball;
    Composite.add(engine.world, ball);

    const boundaries = [
      Bodies.rectangle(width / 2, 8, width, 16, { isStatic: true }),
      Bodies.rectangle(width / 2, height - 8, width, 16, { isStatic: true }),
      Bodies.rectangle(8, height / 2, 16, height, { isStatic: true }),
      Bodies.rectangle(width - 8, height / 2, 16, height, { isStatic: true }),
    ];
    const obstacles = hole.walls.map((wall) =>
      Bodies.rectangle(
        wall.x + wall.width / 2,
        wall.y + wall.height / 2,
        wall.width,
        wall.height,
        { isStatic: true, label: "golf-wall", restitution: 0.5, friction: 0.1 },
      ),
    );
    Composite.add(engine.world, [...boundaries, ...obstacles]);

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = clamp(now - last, 1, 33.3);
      last = now;
      Engine.update(engine, delta);
      const current = ballRef.current;
      if (current && movingRef.current && !holedRef.current) {
        const speed = Math.hypot(current.velocity.x, current.velocity.y);
        const distanceToCup = Math.hypot(current.position.x - hole.cup.x, current.position.y - hole.cup.y);
        if (distanceToCup < 13 && speed < 3.4) {
          Body.setPosition(current, hole.cup);
          Body.setVelocity(current, { x: 0, y: 0 });
          holedRef.current = true;
          movingRef.current = false;
          setHoled(true);
        } else if (speed < 0.08 && now - shotStartedAt.current > 200) {
          movingRef.current = false;
              }
      }
      drawRef.current();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      Engine.clear(engine);
      Composite.clear(engine.world, false);
      engineRef.current = null;
      ballRef.current = null;
    };
  }, [hole]);

  const pointForEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height };
  };
  const startAim = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (movingRef.current || holedRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = pointForEvent(event);
    aimRef.current = next;
    setAim(next);
  };
  const moveAim = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aimRef.current || movingRef.current) return;
    const next = pointForEvent(event);
    aimRef.current = next;
    setAim(next);
  };
  const release = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const currentAim = aimRef.current;
    const ball = ballRef.current;
    if (!currentAim || !ball || movingRef.current || holedRef.current) return;
    const point = pointForEvent(event);
    const dx = ball.position.x - point.x;
    const dy = ball.position.y - point.y;
    const length = Math.hypot(dx, dy);
    if (length > 8) {
      const strength = Math.min(10, length * 0.08);
      Body.setVelocity(ball, { x: (dx / length) * strength, y: (dy / length) * strength });
      movingRef.current = true;
      shotStartedAt.current = performance.now();
      setStrokes((current) => {
        const next = [...current];
        next[holeIndex] = (next[holeIndex] ?? 0) + 1;
        return next;
      });
    }
    aimRef.current = null;
    setAim(null);
  };
  const nextHole = () => {
    const next = holeIndex + 1;
    if (next >= MINI_GOLF_CONTENT.holes.length) return;
    movingRef.current = false;
    holedRef.current = false;
    aimRef.current = null;
    setHoleIndex(next);
    setHoled(false);
    setAim(null);
  };
  const restart = () => {
    movingRef.current = false;
    holedRef.current = false;
    aimRef.current = null;
    setHoleIndex(0);
    setStrokes([]);
    setHoled(false);
    setAim(null);
    if (holeIndex === 0) {
      const ball = ballRef.current;
      if (ball) {
        Body.setPosition(ball, MINI_GOLF_CONTENT.holes[0]!.start);
        Body.setVelocity(ball, { x: 0, y: 0 });
        Body.setAngle(ball, 0);
      }
    }
  };

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">HOLE {holeIndex + 1} / {MINI_GOLF_CONTENT.holes.length}</span></header><section className="paper-card my-5 flex flex-1 flex-col p-5 text-center"><p className="day-one-eyebrow">MINI GOLF</p><h1 className="mt-2 font-script text-4xl leading-none">{finished ? "A round well played." : hole.name}</h1><p className="mt-2 text-sm text-foreground/75">{finished ? `${totalStrokes} strokes over ${MINI_GOLF_CONTENT.holes.length} little holes.` : MINI_GOLF_CONTENT.intro}</p><canvas ref={canvas} className="golf-canvas my-5" width={width} height={height} onPointerDown={startAim} onPointerMove={moveAim} onPointerUp={release} onPointerCancel={() => { aimRef.current = null; setAim(null); }} /> <div className="mt-auto flex justify-center gap-3">{finished ? <><button type="button" className="next-button" onClick={restart}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></> : holed ? <button type="button" className="next-button" onClick={nextHole}>Next hole <ArrowRight className="h-4 w-4" /></button> : <span className="text-sm text-muted-foreground">{strokes[holeIndex] ?? 0} {strokes[holeIndex] === 1 ? "stroke" : "strokes"}</span>}</div></section></div></main>;
}
