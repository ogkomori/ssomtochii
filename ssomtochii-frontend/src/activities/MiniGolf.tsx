import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";
import { MINI_GOLF_CONTENT, type GolfWall } from "@/lib/mini-golf";

const width = 360; const height = 500; const ballRadius = 10;
type Point = { x: number; y: number };
type Ball = Point & { vx: number; vy: number };

function resetBall(point: Point): Ball { return { ...point, vx: 0, vy: 0 }; }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }

/** Small canvas mini-golf game. Hole layouts live in lib/mini-golf.ts. */
export function MiniGolf() {
  const canvas = useRef<HTMLCanvasElement>(null); const ball = useRef<Ball>(resetBall(MINI_GOLF_CONTENT.holes[0]!.start));
  const [holeIndex, setHoleIndex] = useState(0); const [strokes, setStrokes] = useState<number[]>([]); const [aim, setAim] = useState<Point | null>(null); const [moving, setMoving] = useState(false); const [holed, setHoled] = useState(false);
  const hole = MINI_GOLF_CONTENT.holes[holeIndex]!; const totalStrokes = strokes.reduce((sum, count) => sum + count, 0); const finished = holeIndex === MINI_GOLF_CONTENT.holes.length - 1 && holed;

  const draw = useCallback((context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, width, height); context.fillStyle = "#b9d6b4"; context.fillRect(0, 0, width, height);
    context.strokeStyle = "#4f7d5a"; context.lineWidth = 16; context.lineJoin = "round"; context.strokeRect(8, 8, width - 16, height - 16);
    context.fillStyle = "#668f68"; hole.walls.forEach((wall) => { context.fillRect(wall.x, wall.y, wall.width, wall.height); });
    context.beginPath(); context.arc(hole.cup.x, hole.cup.y, 15, 0, Math.PI * 2); context.fillStyle = "#385441"; context.fill();
    context.beginPath(); context.moveTo(hole.cup.x + 2, hole.cup.y - 52); context.lineTo(hole.cup.x + 2, hole.cup.y - 13); context.strokeStyle = "#385441"; context.lineWidth = 3; context.stroke(); context.fillStyle = "#e7a5a1"; context.beginPath(); context.moveTo(hole.cup.x + 4, hole.cup.y - 51); context.lineTo(hole.cup.x + 35, hole.cup.y - 39); context.lineTo(hole.cup.x + 4, hole.cup.y - 28); context.closePath(); context.fill();
    if (aim && !moving && !holed) { context.beginPath(); context.moveTo(ball.current.x, ball.current.y); context.lineTo(aim.x, aim.y); context.strokeStyle = "rgba(56,84,65,.55)"; context.lineWidth = 3; context.setLineDash([5, 6]); context.stroke(); context.setLineDash([]); }
    context.beginPath(); context.arc(ball.current.x, ball.current.y, ballRadius, 0, Math.PI * 2); context.fillStyle = "#fffdf7"; context.fill(); context.strokeStyle = "#496e51"; context.lineWidth = 2; context.stroke();
  }, [aim, hole, holed, moving]);

  useEffect(() => {
    let frame = 0; let last = performance.now();
    const collide = (wall: GolfWall) => {
      const closestX = clamp(ball.current.x, wall.x, wall.x + wall.width); const closestY = clamp(ball.current.y, wall.y, wall.y + wall.height); const dx = ball.current.x - closestX; const dy = ball.current.y - closestY;
      if (dx * dx + dy * dy >= ballRadius * ballRadius) return;
      if (Math.abs(dx) > Math.abs(dy)) { ball.current.vx *= -0.75; ball.current.x = closestX + (dx >= 0 ? ballRadius : -ballRadius); } else { ball.current.vy *= -0.75; ball.current.y = closestY + (dy >= 0 ? ballRadius : -ballRadius); }
    };
    const tick = (now: number) => { const elapsed = Math.min(2, (now - last) / 16.67); last = now; const current = ball.current;
      if (Math.hypot(current.vx, current.vy) > .08 && !holed) { current.x += current.vx * elapsed; current.y += current.vy * elapsed; current.vx *= 0.985 ** elapsed; current.vy *= 0.985 ** elapsed;
        if (current.x - ballRadius < 16 || current.x + ballRadius > width - 16) { current.vx *= -0.75; current.x = clamp(current.x, 16 + ballRadius, width - 16 - ballRadius); }
        if (current.y - ballRadius < 16 || current.y + ballRadius > height - 16) { current.vy *= -0.75; current.y = clamp(current.y, 16 + ballRadius, height - 16 - ballRadius); }
        hole.walls.forEach(collide);
        if (Math.hypot(current.x - hole.cup.x, current.y - hole.cup.y) < 13 && Math.hypot(current.vx, current.vy) < 3.4) { current.x = hole.cup.x; current.y = hole.cup.y; current.vx = 0; current.vy = 0; setHoled(true); setMoving(false); }
      } else if (moving) setMoving(false);
      const context = canvas.current?.getContext("2d"); if (context) draw(context); frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [draw, hole, holed, moving]);

  const pointForEvent = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height }; };
  const startAim = (event: React.PointerEvent<HTMLCanvasElement>) => { if (moving || holed) return; event.currentTarget.setPointerCapture(event.pointerId); setAim(pointForEvent(event)); };
  const release = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!aim || moving || holed) return; const point = pointForEvent(event); const dx = ball.current.x - point.x; const dy = ball.current.y - point.y; const length = Math.hypot(dx, dy); if (length > 8) { const strength = Math.min(10, length * .08); ball.current.vx = dx / length * strength; ball.current.vy = dy / length * strength; setStrokes((current) => [...current, (current[holeIndex] ?? 0) + 1]); setMoving(true); } setAim(null); };
  const nextHole = () => { const next = holeIndex + 1; if (next >= MINI_GOLF_CONTENT.holes.length) return; setHoleIndex(next); ball.current = resetBall(MINI_GOLF_CONTENT.holes[next]!.start); setHoled(false); setAim(null); };
  const restart = () => { setHoleIndex(0); setStrokes([]); ball.current = resetBall(MINI_GOLF_CONTENT.holes[0]!.start); setHoled(false); setAim(null); };

  return <main className="page-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col"><header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">HOLE {holeIndex + 1} / {MINI_GOLF_CONTENT.holes.length}</span></header><section className="paper-card my-5 flex flex-1 flex-col p-5 text-center"><p className="day-one-eyebrow">MINI GOLF</p><h1 className="mt-2 font-script text-4xl leading-none">{finished ? "A round well played." : hole.name}</h1><p className="mt-2 text-sm text-foreground/75">{finished ? `${totalStrokes} strokes over ${MINI_GOLF_CONTENT.holes.length} little holes.` : MINI_GOLF_CONTENT.intro}</p><canvas ref={canvas} className="golf-canvas my-5" width={width} height={height} onPointerDown={startAim} onPointerMove={(event) => aim && setAim(pointForEvent(event))} onPointerUp={release} onPointerCancel={() => setAim(null)} /> <div className="mt-auto flex justify-center gap-3">{finished ? <><button type="button" className="next-button" onClick={restart}><RotateCcw className="h-4 w-4" /> Play again</button><Link to="/" className="next-button">All days</Link></> : holed ? <button type="button" className="next-button" onClick={nextHole}>Next hole <ArrowRight className="h-4 w-4" /></button> : <span className="text-sm text-muted-foreground">{strokes[holeIndex] ?? 0} {strokes[holeIndex] === 1 ? "stroke" : "strokes"}</span>}</div></section></div></main>;
}
