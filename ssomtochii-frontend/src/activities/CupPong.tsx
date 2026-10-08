import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { CUP_PONG_CONTENT, type PongCup } from "@/lib/cup-pong";

const width = 360; const height = 500; const start = { x: 180, y: 425 }; const ballRadius = 9;
type Ball = { x: number; y: number; vx: number; vy: number };
const newBall = (): Ball => ({ ...start, vx: 0, vy: 0 });

/** Reusable canvas cup-pong activity; edit cup positions in lib/cup-pong.ts. */
export function CupPong({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null); const ball = useRef<Ball>(newBall()); const cupsRef = useRef<PongCup[]>([...CUP_PONG_CONTENT.cups]);
  const [cups, setCups] = useState<PongCup[]>([...CUP_PONG_CONTENT.cups]); const [throws, setThrows] = useState(0); const [aim, setAim] = useState<{ x: number; y: number } | null>(null); const [moving, setMoving] = useState(false); const [message, setMessage] = useState("Aim for the cups.");
  const complete = cups.length === 0;

  const draw = useCallback((context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, width, height); context.fillStyle = "#f1e6c9"; context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(128, 87, 64, .14)"; context.fillRect(22, 45, width - 44, 190); context.fillStyle = "#d8927e"; context.fillRect(22, 40, width - 44, 8);
    cupsRef.current.forEach((cup) => { context.beginPath(); context.moveTo(cup.x - 16, cup.y - 18); context.lineTo(cup.x + 16, cup.y - 18); context.lineTo(cup.x + 12, cup.y + 19); context.lineTo(cup.x - 12, cup.y + 19); context.closePath(); context.fillStyle = "#d76f67"; context.fill(); context.beginPath(); context.ellipse(cup.x, cup.y - 18, 16, 5, 0, 0, Math.PI * 2); context.fillStyle = "#7a4e46"; context.fill(); });
    if (aim && !moving && !complete) { context.beginPath(); context.moveTo(ball.current.x, ball.current.y); context.lineTo(aim.x, aim.y); context.strokeStyle = "rgba(78, 91, 67, .55)"; context.lineWidth = 3; context.setLineDash([5, 6]); context.stroke(); context.setLineDash([]); }
    context.beginPath(); context.arc(ball.current.x, ball.current.y, ballRadius, 0, Math.PI * 2); context.fillStyle = "#fffdf7"; context.fill(); context.strokeStyle = "#6a7660"; context.lineWidth = 2; context.stroke();
  }, [aim, complete, moving]);

  useEffect(() => {
    let frame = 0; let last = performance.now(); let settledAt: number | null = null;
    const resetAfterThrow = (text: string) => { setMoving(false); setAim(null); setMessage(text); window.setTimeout(() => { ball.current = newBall(); }, 550); };
    const tick = (now: number) => { const delta = Math.min(2, (now - last) / 16.67); last = now;
      if (moving) { const current = ball.current; current.x += current.vx * delta; current.y += current.vy * delta; current.vy += .16 * delta; current.vx *= .997 ** delta;
        const hit = cupsRef.current.find((cup) => Math.hypot(current.x - cup.x, current.y - (cup.y - 12)) < 15 && current.vy > 0);
        if (hit) { cupsRef.current = cupsRef.current.filter((cup) => cup.id !== hit.id); setCups(cupsRef.current); current.vx = 0; current.vy = 0; resetAfterThrow(cupsRef.current.length === 0 ? "Every cup is down!" : "Sunk it! Nice shot."); }
        else if (current.x < -20 || current.x > width + 20 || current.y > height + 30) resetAfterThrow("Close one — try another toss.");
        else if (Math.hypot(current.vx, current.vy) < .2) { if (settledAt === null) settledAt = now; if (now - settledAt > 450) resetAfterThrow("Not quite. You’ve got another ball."); } else settledAt = null;
      }
      const context = canvas.current?.getContext("2d"); if (context) draw(context); frame = requestAnimationFrame(tick);
    }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [draw, moving]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height }; };
  const toss = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!aim || moving || complete) return; const release = point(event); const dx = start.x - release.x; const dy = start.y - release.y; const length = Math.hypot(dx, dy); if (length > 10) { const strength = Math.min(12, length * .09); ball.current.vx = dx / length * strength; ball.current.vy = dy / length * strength; setThrows((current) => current + 1); setMoving(true); setMessage("In the air…"); } setAim(null); };
  const restart = () => { cupsRef.current = [...CUP_PONG_CONTENT.cups]; setCups(cupsRef.current); setThrows(0); ball.current = newBall(); setMoving(false); setAim(null); setMessage("Aim for the cups."); };

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{cups.length} CUPS LEFT</span></header><section className="paper-card my-5 flex flex-1 flex-col p-5 text-center"><p className="day-one-eyebrow">CUP PONG</p><h1 className="mt-2 font-script text-4xl leading-none">{complete ? "You cleared the table." : CUP_PONG_CONTENT.title}</h1><p className="mt-2 text-sm text-foreground/75">{complete ? `${throws} throws. Genuinely impressive.` : CUP_PONG_CONTENT.intro}</p><canvas ref={canvas} className="golf-canvas my-5" width={width} height={height} onPointerDown={(event) => { if (!moving && !complete) { event.currentTarget.setPointerCapture(event.pointerId); setAim(point(event)); } }} onPointerMove={(event) => aim && setAim(point(event))} onPointerUp={toss} onPointerCancel={() => setAim(null)} /><div className="mt-auto"><p className="mb-4 text-sm text-muted-foreground">{message} · {throws} {throws === 1 ? "throw" : "throws"}</p>{complete ? <div className="flex justify-center gap-3"><button type="button" className="next-button" onClick={restart}><RotateCcw className="h-4 w-4" /> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></div> : <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground" onClick={restart}><RotateCcw className="h-4 w-4" /> Reset table</button>}</div></section></div></main>;
}
