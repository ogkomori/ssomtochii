import { useCallback, useEffect, useRef, useState } from "react";
import { Check, RotateCcw, ShieldCheck, ShieldOff } from "lucide-react";
import { Bodies, Body, Composite, Engine, type Body as MatterBody, type Engine as MatterEngine } from "matter-js";
import { GameShell } from "@/activities/Connections";
import { BOWLING_CONTENT } from "@/lib/bowling";

const width = 360;
const height = 500;
const start = { x: 180, y: 425 };
const ballRadius = 10;
const pinPositions = Array.from({ length: 4 }, (_, row) =>
  Array.from({ length: row + 1 }, (_, col) => ({
    x: 180 + (col - row / 2) * 23,
    y: 155 - row * 23,
  })),
).flat();

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function createPins(engine: MatterEngine) {
  const pins = pinPositions.map(({ x, y }) =>
    Bodies.rectangle(x, y, 12, 20, {
      label: "bowling-pin",
      density: 0.0015,
      friction: 0.12,
      frictionAir: 0.025,
      restitution: 0.12,
      chamfer: { radius: 5 },
    }),
  );
  Composite.add(engine.world, pins);
  return pins;
}

export function Bowling({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MatterEngine | null>(null);
  const ballRef = useRef<MatterBody | null>(null);
  const pinsRef = useRef<MatterBody[]>([]);
  const railsRef = useRef<MatterBody[]>([]);
  const movingRef = useRef(false);
  const guardRef = useRef(false);
  const aimRef = useRef<{ x: number; y: number } | null>(null);
  const rollStartedAt = useRef(0);
  const drawRef = useRef<() => void>(() => {});
  const [guard, setGuard] = useState(false);
  const [fallenCount, setFallenCount] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const [message, setMessage] = useState("Pull back from the ball and release to roll.");
  const complete = fallenCount === 10;

  const draw = useCallback(() => {
    const context = canvas.current?.getContext("2d");
    const ball = ballRef.current;
    if (!context || !ball) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ead9b9";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#d5b98d";
    context.fillRect(54, 18, 252, 464);
    context.fillStyle = "#f4e8d0";
    context.fillRect(65, 20, 230, 460);
    context.strokeStyle = "#c6a577";
    context.lineWidth = 2;
    [105, 145, 185, 225, 265].forEach((x) => {
      context.beginPath();
      context.moveTo(x, 22);
      context.lineTo(x, 478);
      context.stroke();
    });
    context.fillStyle = "#8b654d";
    context.fillRect(54, 18, 10, 464);
    context.fillRect(296, 18, 10, 464);
    if (guardRef.current) {
      context.fillStyle = "#86ad86";
      context.fillRect(64, 18, 12, 464);
      context.fillRect(284, 18, 12, 464);
    }

    pinsRef.current.forEach((pin) => {
      context.save();
      context.translate(pin.position.x, pin.position.y);
      context.rotate(pin.angle);
      context.beginPath();
      context.ellipse(0, 0, 6, 10, 0, 0, Math.PI * 2);
      context.fillStyle = "#fffdf7";
      context.fill();
      context.strokeStyle = "#c9c1b5";
      context.lineWidth = 1.5;
      context.stroke();
      context.beginPath();
      context.ellipse(0, -2, 4.5, 2, 0, 0, Math.PI * 2);
      context.fillStyle = "#c75f66";
      context.fill();
      context.restore();
    });

    if (aimRef.current && !movingRef.current && !complete) {
      context.beginPath();
      context.moveTo(ball.position.x, ball.position.y);
      context.lineTo(aimRef.current.x, aimRef.current.y);
      context.strokeStyle = "rgba(75, 90, 65, .6)";
      context.lineWidth = 3;
      context.setLineDash([5, 6]);
      context.stroke();
      context.setLineDash([]);
    }
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#8d9ec7";
    context.fill();
    context.strokeStyle = "#53658c";
    context.lineWidth = 2;
    context.stroke();
    context.beginPath();
    context.arc(ball.position.x - 3, ball.position.y - 3, 2, 0, Math.PI * 2);
    context.arc(ball.position.x + 3, ball.position.y - 3, 2, 0, Math.PI * 2);
    context.fillStyle = "#fff";
    context.fill();
  }, [complete]);
  drawRef.current = draw;

  useEffect(() => {
    const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    engine.positionIterations = 8;
    engine.velocityIterations = 6;
    engineRef.current = engine;

    const ball = Bodies.circle(start.x, start.y, ballRadius, {
      label: "bowling-ball",
      density: 0.007,
      friction: 0.08,
      frictionAir: 0.012,
      restitution: 0.08,
    });
    ballRef.current = ball;
    Composite.add(engine.world, ball);
    pinsRef.current = createPins(engine);

    // Rails are physical bodies; their collision masks are switched by the guard toggle.
    railsRef.current = [
      Bodies.rectangle(70, height / 2, 8, height, { isStatic: true, label: "left-guard" }),
      Bodies.rectangle(290, height / 2, 8, height, { isStatic: true, label: "right-guard" }),
    ];
    Composite.add(engine.world, railsRef.current);

    let frame = 0;
    let last = performance.now();
    let lastFallen = -1;
    const tick = (now: number) => {
      const delta = clamp(now - last, 1, 33.3);
      last = now;
      Engine.update(engine, delta);

      const currentBall = ballRef.current;
      if (currentBall) {
        if (movingRef.current) {
          const speed = Math.hypot(currentBall.velocity.x, currentBall.velocity.y);
          const guttered = !guardRef.current && (currentBall.position.x < 52 || currentBall.position.x > 308);
          const outOfLane = currentBall.position.y < 25 || currentBall.position.y > height - 20 || guttered;
          if (outOfLane || (speed < 0.16 && now - rollStartedAt.current > 550)) {
            movingRef.current = false;
            Body.setVelocity(currentBall, { x: 0, y: 0 });
            Body.setAngularVelocity(currentBall, 0);
            Body.setPosition(currentBall, start);
            setMessage(guttered
              ? "Into the gutter! Try the guards, or aim straighter."
              : pinsRef.current.every((pin) => Math.abs(pin.angle) > 0.55)
                ? "All ten pins are down!"
                : "The roll is over. The pins stay where they fell.");
          }
        }

        const fallen = pinsRef.current.filter((pin) =>
          Math.abs(pin.angle) > 0.55 ||
          Math.hypot(pin.position.x - pinPositions[pinsRef.current.indexOf(pin)]!.x, pin.position.y - pinPositions[pinsRef.current.indexOf(pin)]!.y) > 9,
        ).length;
        if (fallen !== lastFallen) {
          lastFallen = fallen;
          setFallenCount(fallen);
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
      pinsRef.current = [];
      railsRef.current = [];
    };
  }, []);

  useEffect(() => {
    guardRef.current = guard;
    railsRef.current.forEach((rail) => {
      rail.collisionFilter.mask = guard ? 0xffffffff : 0;
    });
  }, [guard]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height };
  };
  const startAim = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (movingRef.current || complete) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const next = point(event);
    aimRef.current = next;
    setAim(next);
  };
  const moveAim = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aimRef.current || movingRef.current) return;
    const next = point(event);
    aimRef.current = next;
    setAim(next);
  };
  const release = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const currentAim = aimRef.current;
    const ball = ballRef.current;
    if (!currentAim || !ball || movingRef.current || complete) return;
    const p = point(event);
    const dx = start.x - p.x;
    const dy = start.y - p.y;
    const length = Math.hypot(dx, dy);
    if (length > 8) {
      const power = Math.min(12, length * 0.075);
      Body.setVelocity(ball, {
        x: (dx / length) * power,
        y: -(Math.max(0.65, Math.abs(dy) / length)) * power,
      });
      movingRef.current = true;
      rollStartedAt.current = performance.now();
      setRolls((value) => value + 1);
      setMessage("The ball is rolling…");
    }
    aimRef.current = null;
    setAim(null);
  };
  const reset = () => {
    const engine = engineRef.current;
    if (!engine) return;
    Composite.remove(engine.world, pinsRef.current);
    pinsRef.current = createPins(engine);
    const ball = ballRef.current;
    if (ball) {
      Body.setPosition(ball, start);
      Body.setVelocity(ball, { x: 0, y: 0 });
      Body.setAngularVelocity(ball, 0);
      Body.setAngle(ball, 0);
    }
    setFallenCount(0);
    setRolls(0);
    movingRef.current = false;
    aimRef.current = null;
    setAim(null);
    setMessage("Pull back from the ball and release to roll.");
  };

  return <GameShell eyebrow="BOWLING" title={complete ? "A perfect strike!" : BOWLING_CONTENT.title} right={10 - fallenCount + "/10 PINS STANDING"}>
    <p className="mb-3 text-sm text-foreground/75">{complete ? "You cleared all the pins in " + rolls + " rolls." : BOWLING_CONTENT.intro}</p>
    <div className="mb-3 flex justify-center">
      <button type="button" onClick={() => setGuard((value) => !value)} className={"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold " + (guard ? "border-primary bg-primary/15 text-foreground" : "border-border bg-background text-muted-foreground")}>
        {guard ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}{guard ? "Gutter guards: ON" : "Gutter guards: OFF"}
      </button>
    </div>
    <canvas ref={canvas} className="golf-canvas mx-auto my-4" width={width} height={height} onPointerDown={startAim} onPointerMove={moveAim} onPointerUp={release} onPointerCancel={() => { aimRef.current = null; setAim(null); }} />
    <p className="mb-4 min-h-6 text-sm text-muted-foreground">{message} · {rolls} {rolls === 1 ? "roll" : "rolls"}</p>
    {complete
      ? <div className="flex justify-center gap-3"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button></div>
      : <div className="flex justify-center"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset game</button></div>}
  </GameShell>;
}
