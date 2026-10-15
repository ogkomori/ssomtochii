import { useCallback, useEffect, useRef, useState } from "react";
import { Check, RotateCcw, ShieldCheck, ShieldOff } from "lucide-react";
import { GameShell } from "@/activities/Connections";
import { BOWLING_CONTENT } from "@/lib/bowling";

const width = 360; const height = 500; const start = { x: 180, y: 425 }; const ballRadius = 10;
type Ball = { x: number; y: number; vx: number; vy: number };
type Pin = { x: number; y: number; id: number };
const makePins = (): Pin[] => {
  const pins: Pin[] = []; let id = 0;
  for (let row = 0; row < 4; row += 1) for (let col = 0; col <= row; col += 1) pins.push({ id: id++, x: 180 + (col - row / 2) * 25, y: 95 + row * 24 });
  return pins;
};
const newBall = (): Ball => ({ ...start, vx: 0, vy: 0 });
export function Bowling({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ball = useRef<Ball>(newBall());
  const pinsRef = useRef<Pin[]>(makePins());
  const [pins, setPins] = useState<Pin[]>(makePins());
  const [guard, setGuard] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const [moving, setMoving] = useState(false);
  const [message, setMessage] = useState("Aim, pull back, and roll.");
  const complete = pins.length === 0;
  const draw = useCallback((context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ead9b9"; context.fillRect(0, 0, width, height);
    context.fillStyle = "#d5b98d"; context.fillRect(54, 18, 252, 464);
    context.fillStyle = "#f4e8d0"; context.fillRect(65, 20, 230, 460);
    context.strokeStyle = "#c6a577"; context.lineWidth = 2;
    [105, 145, 185, 225, 265].forEach((x) => { context.beginPath(); context.moveTo(x, 22); context.lineTo(x, 478); context.stroke(); });
    context.fillStyle = "#8b654d"; context.fillRect(54, 18, 10, 464); context.fillRect(296, 18, 10, 464);
    if (guard) { context.fillStyle = "#86ad86"; context.fillRect(64, 18, 12, 464); context.fillRect(284, 18, 12, 464); }
    pinsRef.current.forEach((pin) => { context.beginPath(); context.arc(pin.x, pin.y, 8, 0, Math.PI * 2); context.fillStyle = "#fffdf7"; context.fill(); context.strokeStyle = "#c75f66"; context.lineWidth = 3; context.stroke(); context.beginPath(); context.arc(pin.x, pin.y - 2, 3, 0, Math.PI * 2); context.fillStyle = "#c75f66"; context.fill(); });
    if (aim && !moving && !complete) { context.beginPath(); context.moveTo(ball.current.x, ball.current.y); context.lineTo(aim.x, aim.y); context.strokeStyle = "rgba(75, 90, 65, .6)"; context.lineWidth = 3; context.setLineDash([5, 6]); context.stroke(); context.setLineDash([]); }
    context.beginPath(); context.arc(ball.current.x, ball.current.y, ballRadius, 0, Math.PI * 2); context.fillStyle = "#8d9ec7"; context.fill(); context.strokeStyle = "#53658c"; context.lineWidth = 2; context.stroke();
    context.beginPath(); context.arc(ball.current.x - 3, ball.current.y - 3, 2, 0, Math.PI * 2); context.arc(ball.current.x + 3, ball.current.y - 3, 2, 0, Math.PI * 2); context.fillStyle = "#fff"; context.fill();
  }, [aim, complete, guard, moving]);
  useEffect(() => {
    let frame = 0; let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(2, (now - last) / 16.67); last = now;
      if (moving) {
        const b = ball.current; b.x += b.vx * delta; b.y += b.vy * delta;
        b.vx *= .994 ** delta; b.vy *= .997 ** delta;
        if (guard && (b.x - ballRadius < 78 || b.x + ballRadius > 282)) { b.vx *= -.72; b.x = Math.max(78 + ballRadius, Math.min(282 - ballRadius, b.x)); }
        const hit = pinsRef.current.filter((pin) => Math.hypot(pin.x - b.x, pin.y - b.y) < 18);
        if (hit.length) {
          const hitIds = new Set(hit.map((pin) => pin.id));
          pinsRef.current = pinsRef.current.filter((pin) => !hitIds.has(pin.id));
          setPins([...pinsRef.current]);
          b.vx *= .65; b.vy *= -.2;
        }
        const guttered = !guard && (b.x < 62 || b.x > 298);
        if (b.y < 38 || b.y > height - 25 || guttered || Math.abs(b.vx) + Math.abs(b.vy) < .15) {
          setMoving(false); b.x = start.x; b.y = start.y; b.vx = 0; b.vy = 0;
          setMessage(pinsRef.current.length === 0 ? "Strike! All the pins are down." : guttered ? "Into the gutter! Try turning on the guards." : "Nice roll. Take another shot.");
        }
      }
      const context = canvas.current?.getContext("2d"); if (context) draw(context);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [draw, moving, guard]);
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height }; };
  const startAim = (event: React.PointerEvent<HTMLCanvasElement>) => { if (moving || complete) return; event.currentTarget.setPointerCapture(event.pointerId); setAim(point(event)); };
  const release = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aim || moving || complete) return;
    const p = point(event); const dx = start.x - p.x; const dy = start.y - p.y; const length = Math.hypot(dx, dy);
    if (length > 8) { const power = Math.min(13, length * .09); ball.current.vx = dx / length * power; ball.current.vy = -Math.max(4, Math.abs(dy) / length * power); setRolls((value) => value + 1); setMoving(true); setMessage("Here it comes…"); }
    setAim(null);
  };
  const reset = () => { pinsRef.current = makePins(); setPins([...pinsRef.current]); ball.current = newBall(); setRolls(0); setMoving(false); setAim(null); setMessage("Aim, pull back, and roll."); };
  return <GameShell eyebrow="BOWLING" title={complete ? "A perfect strike!" : BOWLING_CONTENT.title} right={`${pins.length}/10 PINS LEFT`}>
    <p className="mb-3 text-sm text-foreground/75">{complete ? `You cleared all the pins in ${rolls} rolls.` : BOWLING_CONTENT.intro}</p>
    <div className="mb-3 flex justify-center"><button type="button" onClick={() => setGuard((value) => !value)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${guard ? "border-primary bg-primary/15 text-foreground" : "border-border bg-background text-muted-foreground"}`}>{guard ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}{guard ? "Gutter guards: ON" : "Gutter guards: OFF"}</button></div>
    <canvas ref={canvas} className="golf-canvas mx-auto my-4" width={width} height={height} onPointerDown={startAim} onPointerMove={(event) => aim && setAim(point(event))} onPointerUp={release} onPointerCancel={() => setAim(null)} />
    <p className="mb-4 min-h-6 text-sm text-muted-foreground">{message} · {rolls} {rolls === 1 ? "roll" : "rolls"}</p>
    {complete ? <div className="flex justify-center gap-3"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter <Check className="h-4 w-4" /></button></div> : <div className="flex justify-center"><button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset game</button></div>}
  </GameShell>;
}
