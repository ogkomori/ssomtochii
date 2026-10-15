import { useCallback, useEffect, useRef, useState } from "react";
import { Check, RotateCcw, ShieldCheck, ShieldOff } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { BOWLING_CONTENT } from "@/lib/bowling";

const width = 360;
const height = 500;
const start = { x: 180, y: 425 };
const ballRadius = 10;
const pinRadius = 8;
const ballMass = 5;
const pinMass = 1;
const restitution = 0.58;

type Ball = { x: number; y: number; vx: number; vy: number };
type Pin = { id: number; x: number; y: number; vx: number; vy: number; angle: number; spin: number; fallen: boolean };

const makePins = (): Pin[] => {
  const pins: Pin[] = [];
  let id = 0;
  // The headpin is at the bottom of the rack, closest to the bowler.
  // Four rows widen away from the ball: 1, 2, 3, 4 pins.
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col <= row; col += 1) {
      pins.push({
        id: id++,
        x: 180 + (col - row / 2) * 23,
        y: 155 - row * 23,
        vx: 0,
        vy: 0,
        angle: 0,
        spin: 0,
        fallen: false,
      });
    }
  }
  return pins;
};
const newBall = (): Ball => ({ x: start.x, y: start.y, vx: 0, vy: 0 });
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function collide(
  a: { x: number; y: number; vx: number; vy: number },
  b: { x: number; y: number; vx: number; vy: number },
  massA: number,
  massB: number,
  radius: number,
  bounce: number,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || distance >= radius) return false;
  const nx = dx / distance;
  const ny = dy / distance;
  const relativeSpeed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  // Separate overlapping bodies even if they are no longer approaching.
  const overlap = radius - distance;
  a.x -= nx * overlap * (massB / (massA + massB));
  a.y -= ny * overlap * (massB / (massA + massB));
  b.x += nx * overlap * (massA / (massA + massB));
  b.y += ny * overlap * (massA / (massA + massB));
  if (relativeSpeed < 0) {
    const impulse = -(1 + bounce) * relativeSpeed / (1 / massA + 1 / massB);
    a.vx -= impulse * nx / massA;
    a.vy -= impulse * ny / massA;
    b.vx += impulse * nx / massB;
    b.vy += impulse * ny / massB;
  }
  return true;
}

export function Bowling({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ball = useRef<Ball>(newBall());
  const pinsRef = useRef<Pin[]>(makePins());
  const [pins, setPins] = useState<Pin[]>(makePins());
  const [guard, setGuard] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const [moving, setMoving] = useState(false);
  const [message, setMessage] = useState("Pull back from the ball and release to roll.");
  const standingCount = pins.filter((pin) => !pin.fallen).length;
  const complete = standingCount === 0;

  const draw = useCallback((context: CanvasRenderingContext2D) => {
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
      context.beginPath(); context.moveTo(x, 22); context.lineTo(x, 478); context.stroke();
    });
    context.fillStyle = "#8b654d";
    context.fillRect(54, 18, 10, 464);
    context.fillRect(296, 18, 10, 464);
    if (guard) {
      context.fillStyle = "#86ad86";
      context.fillRect(64, 18, 12, 464);
      context.fillRect(284, 18, 12, 464);
    }

    pinsRef.current.forEach((pin) => {
      context.save();
      context.translate(pin.x, pin.y);
      context.rotate(pin.angle);
      // Draw pins as small bottle shapes, with the red neck stripe.
      context.beginPath();
      context.ellipse(0, 0, pin.fallen ? 12 : 7, pin.fallen ? 6 : 10, 0, 0, Math.PI * 2);
      context.fillStyle = "#fffdf7";
      context.fill();
      context.strokeStyle = "#c9c1b5";
      context.lineWidth = 1.5;
      context.stroke();
      context.beginPath();
      context.ellipse(0, pin.fallen ? 0 : -2, pin.fallen ? 3 : 5, pin.fallen ? 4 : 2, 0, 0, Math.PI * 2);
      context.fillStyle = "#c75f66";
      context.fill();
      context.restore();
    });

    if (aim && !moving && !complete) {
      context.beginPath();
      context.moveTo(ball.current.x, ball.current.y);
      context.lineTo(aim.x, aim.y);
      context.strokeStyle = "rgba(75, 90, 65, .6)";
      context.lineWidth = 3;
      context.setLineDash([5, 6]);
      context.stroke();
      context.setLineDash([]);
    }
    context.beginPath();
    context.arc(ball.current.x, ball.current.y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#8d9ec7";
    context.fill();
    context.strokeStyle = "#53658c";
    context.lineWidth = 2;
    context.stroke();
    context.beginPath();
    context.arc(ball.current.x - 3, ball.current.y - 3, 2, 0, Math.PI * 2);
    context.arc(ball.current.x + 3, ball.current.y - 3, 2, 0, Math.PI * 2);
    context.fillStyle = "#fff";
    context.fill();
  }, [aim, complete, guard, moving]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let pinsDirty = false;
    let rollFinished = false;

    const tick = (now: number) => {
      const dt = clamp((now - last) / 16.67, 0, 2);
      last = now;
      if (moving && !rollFinished) {
        const b = ball.current;
        // Rolling resistance gradually slows the ball without reversing it.
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vx *= Math.pow(0.997, dt);
        b.vy *= Math.pow(0.999, dt);

        if (guard && (b.x - ballRadius < 76 || b.x + ballRadius > 284)) {
          b.vx *= -0.42;
          b.x = clamp(b.x, 76 + ballRadius, 284 - ballRadius);
        }

        // Ball-to-pin impacts transfer momentum; the ball keeps moving forward.
        for (const pin of pinsRef.current) {
          if (pin.fallen) continue;
          if (collide(b, pin, ballMass, pinMass, ballRadius + pinRadius, restitution)) {
            const impact = Math.hypot(pin.vx, pin.vy);
            if (impact > 0.55) {
              pin.fallen = true;
              pin.spin = (b.vx * (pin.y - b.y) - b.vy * (pin.x - b.x)) * 0.018;
            }
            pinsDirty = true;
          }
        }

        // Pins can knock into neighbouring pins and pass the impact along the rack.
        for (let i = 0; i < pinsRef.current.length; i += 1) {
          const a = pinsRef.current[i]!;
          for (let j = i + 1; j < pinsRef.current.length; j += 1) {
            const other = pinsRef.current[j]!;
            if (a.fallen && other.fallen) continue;
            if (collide(a, other, pinMass, pinMass, pinRadius * 2, 0.42)) {
              const speed = Math.hypot(a.vx - other.vx, a.vy - other.vy);
              if (speed > 0.42) {
                if (Math.hypot(a.vx, a.vy) > 0.55) a.fallen = true;
                if (Math.hypot(other.vx, other.vy) > 0.55) other.fallen = true;
              }
              pinsDirty = true;
            }
          }
        }

        for (const pin of pinsRef.current) {
          const speed = Math.hypot(pin.vx, pin.vy);
          if (pin.fallen || speed > 0.08) {
            pin.x += pin.vx * dt;
            pin.y += pin.vy * dt;
            pin.vx *= Math.pow(0.94, dt);
            pin.vy *= Math.pow(0.94, dt);
            if (pin.fallen) {
              pin.angle += (pin.spin || Math.sign(pin.vx || 1) * 0.12) * dt;
              pin.spin *= Math.pow(0.9, dt);
            }
            if (pin.x < 76 || pin.x > 284) pin.vx *= -0.3;
            if (pin.y < 30 || pin.y > 460) pin.vy *= -0.3;
          }
        }

        const guttered = !guard && (b.x < 62 || b.x > 298);
        const outOfLane = b.y < 26 || b.y > height - 25 || guttered;
        const stopped = Math.abs(b.vx) + Math.abs(b.vy) < 0.16;
        if (outOfLane || stopped) {
          rollFinished = true;
          setMoving(false);
          b.x = start.x; b.y = start.y; b.vx = 0; b.vy = 0;
          setMessage(pinsRef.current.every((pin) => pin.fallen)
            ? "All ten pins are down!"
            : guttered ? "Into the gutter! Try the guards, or aim straighter."
            : "The roll is over. The pins stay where they fell.");
          setPins(pinsRef.current.map((pin) => ({ ...pin })));
        }
        if (pinsDirty && !rollFinished) {
          setPins(pinsRef.current.map((pin) => ({ ...pin })));
          pinsDirty = false;
        }
      }

      const context = canvas.current?.getContext("2d");
      if (context) draw(context);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [draw, moving, guard]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height };
  };
  const startAim = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (moving || complete) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setAim(point(event));
  };
  const release = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aim || moving || complete) return;
    const p = point(event);
    // Dragging backwards sets direction and strength; cap speed for controllable rolls.
    const dx = start.x - p.x;
    const dy = start.y - p.y;
    const length = Math.hypot(dx, dy);
    if (length > 8) {
      const power = Math.min(12, length * 0.075);
      const directionLength = Math.max(1, Math.hypot(dx, dy));
      ball.current.vx = (dx / directionLength) * power;
      ball.current.vy = -(Math.max(0.65, Math.abs(dy) / directionLength)) * power;
      setRolls((value) => value + 1);
      setMoving(true);
      setMessage("The ball is rolling…");
    }
    setAim(null);
  };
  const reset = () => {
    pinsRef.current = makePins();
    setPins(pinsRef.current.map((pin) => ({ ...pin })));
    ball.current = newBall();
    setRolls(0);
    setMoving(false);
    setAim(null);
    setMessage("Pull back from the ball and release to roll.");
  };

  return <GameShell eyebrow="BOWLING" title={complete ? "A perfect strike!" : BOWLING_CONTENT.title} right={standingCount + "/10 PINS STANDING"}>
    <p className="mb-3 text-sm text-foreground/75">{complete ? "You cleared all the pins in " + rolls + " rolls." : BOWLING_CONTENT.intro}</p>
    <div className="mb-3 flex justify-center">
      <button type="button" onClick={() => setGuard((value) => !value)} className={"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold " + (guard ? "border-primary bg-primary/15 text-foreground" : "border-border bg-background text-muted-foreground")}>
        {guard ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}{guard ? "Gutter guards: ON" : "Gutter guards: OFF"}
      </button>
    </div>
    <canvas ref={canvas} className="golf-canvas mx-auto my-4" width={width} height={height} onPointerDown={startAim} onPointerMove={(event) => aim && setAim(point(event))} onPointerUp={release} onPointerCancel={() => setAim(null)} />
    <p className="mb-4 min-h-6 text-sm text-muted-foreground">{message} · {rolls} {rolls === 1 ? "roll" : "rolls"}</p>
    {complete
      ? <div className="flex justify-center gap-3"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button></div>
      : <div className="flex justify-center"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset game</button></div>}
  </GameShell>;
}
