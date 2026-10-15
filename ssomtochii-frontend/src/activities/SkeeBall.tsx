import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Botanicals } from "@/components/Botanicals";

const width = 360;
const height = 500;
const start = { x: 180, y: 440 };
const ballRadius = 10;
const maxShots = 5;
type Point = { x: number; y: number };
type Ball = Point & { vx: number; vy: number };
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const freshBall = (): Ball => ({ ...start, vx: 0, vy: 0 });
function scoreAt(x: number) {
  const d = Math.abs(x - 180);
  return d <= 16 ? 50 : d <= 33 ? 30 : d <= 52 ? 20 : d <= 74 ? 10 : 0;
}

export function SkeeBall({ onComplete }: { onComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ball = useRef<Ball>(freshBall());
  const drag = useRef<Point | null>(null);
  const rolling = useRef(false);
  const shotCount = useRef(0);
  const drawRef = useRef<() => void>(() => {});
  const [shots, setShots] = useState(0);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [message, setMessage] = useState("Pull back, then release to send the ball up the ramp.");
  const finished = shots >= maxShots && !rolling.current;

  const draw = useCallback(() => {
    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.clearRect(0, 0, width, height);
    c.fillStyle = "#ead9b9"; c.fillRect(0, 0, width, height);
    c.fillStyle = "#a97955"; c.fillRect(34, 14, 292, 472);
    c.fillStyle = "#f3e6d0"; c.fillRect(45, 22, 270, 458);
    c.fillStyle = "#b9d6b4"; c.fillRect(60, 30, 240, 442);
    c.strokeStyle = "#4f7d5a"; c.lineWidth = 4; c.strokeRect(60, 30, 240, 442);
    c.fillStyle = "#d9c3a1"; c.fillRect(72, 34, 216, 105);
    c.fillStyle = "#7c9c73"; c.beginPath(); c.ellipse(180, 88, 86, 49, 0, 0, Math.PI * 2); c.fill();
    [{rx:70,ry:40,color:"#d7b66e",label:"10"},{rx:52,ry:30,color:"#e89a83",label:"20"},{rx:34,ry:20,color:"#8aaed0",label:"30"},{rx:17,ry:10,color:"#fff0b7",label:"50"}].forEach(r=>{
      c.beginPath(); c.ellipse(180,88,r.rx,r.ry,0,0,Math.PI*2); c.fillStyle=r.color; c.fill();
      c.strokeStyle="#fff8e8"; c.lineWidth=2; c.stroke(); c.fillStyle="#3e5842"; c.font="bold 10px sans-serif"; c.textAlign="center"; c.fillText(r.label,180,91);
    });
    c.strokeStyle="rgba(79,125,90,.35)"; c.lineWidth=2;
    [95,125,155,205,235,265].forEach(x=>{c.beginPath();c.moveTo(x,150);c.lineTo(x,468);c.stroke();});
    c.fillStyle="#f3e6d0"; c.font="12px sans-serif"; c.textAlign="center"; c.fillText("ROLL UP THE RAMP",180,164);
    const b=ball.current;
    if(drag.current&&!rolling.current&&!finished){c.beginPath();c.moveTo(b.x,b.y);c.lineTo(drag.current.x,drag.current.y);c.strokeStyle="rgba(56,84,65,.65)";c.lineWidth=3;c.setLineDash([5,6]);c.stroke();c.setLineDash([]);}
    c.beginPath();c.arc(b.x,b.y,ballRadius,0,Math.PI*2);c.fillStyle="#8d9ec7";c.fill();c.strokeStyle="#53658c";c.lineWidth=2;c.stroke();
    c.beginPath();c.arc(b.x-3,b.y-3,2,0,Math.PI*2);c.arc(b.x+3,b.y-3,2,0,Math.PI*2);c.fillStyle="#fff";c.fill();
  }, [finished]);
  drawRef.current=draw;

  useEffect(()=>{
    let frame=0; let last=performance.now();
    const tick=(now:number)=>{
      const elapsed=Math.min(2,(now-last)/16.67); last=now;
      const b=ball.current;
      if(rolling.current){
        b.x+=b.vx*elapsed; b.y+=b.vy*elapsed; b.vx*=0.987**elapsed; b.vy*=0.987**elapsed;
        if(b.x-ballRadius<62||b.x+ballRadius>298){b.vx*=-0.72;b.x=clamp(b.x,72,288);}
        if(b.y<=118){
          const earned=scoreAt(b.x); setScore(v=>v+earned); setLastScore(earned);
          setMessage(earned ? "Nice shot — "+earned+" points!" : "Missed the scoring pockets. Try a straighter shot!");
          rolling.current=false; ball.current=freshBall();
        } else if(Math.hypot(b.vx,b.vy)<0.18||b.y>height+10){
          rolling.current=false; setLastScore(0); setMessage("Not quite enough power. Pull back a little further next time."); ball.current=freshBall();
        }
      }
      drawRef.current(); frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick); return ()=>cancelAnimationFrame(frame);
  }, []);

  const point=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-r.left)*width/r.width,y:(e.clientY-r.top)*height/r.height};};
  const startAim=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(rolling.current||shots>=maxShots)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current=point(e);};
  const moveAim=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(drag.current&&!rolling.current)drag.current=point(e);};
  const release=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!drag.current||rolling.current||shots>=maxShots)return;
    const p=point(e),dx=start.x-p.x,dy=start.y-p.y,len=Math.hypot(dx,dy);
    if(len>8){const power=Math.min(13,len*0.105);ball.current.vx=dx/len*power;ball.current.vy=-(Math.max(.72,Math.abs(dy)/len))*power;rolling.current=true;shotCount.current++;setShots(shotCount.current);setMessage("Rolling…");}
    drag.current=null;
  };
  const restart=()=>{ball.current=freshBall();drag.current=null;rolling.current=false;shotCount.current=0;setShots(0);setScore(0);setLastScore(null);setMessage("Pull back, then release to send the ball up the ramp.");};

  return <main className="page-shell"><Botanicals/><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
    <header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4"/> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">SCORE {score}</span></header>
    <section className="paper-card my-5 flex flex-1 flex-col p-5 text-center"><p className="day-one-eyebrow">SKEE-BALL</p><h1 className="mt-2 font-script text-4xl leading-none">{finished?"Arcade champion!":"A little Skee-Ball."}</h1>
    <p className="mt-2 text-sm text-foreground/75">{finished?"You scored "+score+" points in five rolls.":"Drag back from the ball and release. Aim for the higher-value pockets!"}</p>
    <canvas ref={canvas} className="golf-canvas my-5" width={width} height={height} onPointerDown={startAim} onPointerMove={moveAim} onPointerUp={release} onPointerCancel={()=>{drag.current=null;}}/>
    <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground"><span>Roll {Math.min(shots+(rolling.current?0:1),maxShots)} of {maxShots}</span><span>{lastScore===null?"Ready?":"Last roll: "+lastScore+" pts"}</span></div>
    <p className="mb-4 min-h-10 text-sm text-foreground/75">{message}</p><div className="mt-auto flex justify-center gap-3">{finished?<><button type="button" className="next-button" onClick={restart}><RotateCcw className="h-4 w-4"/> Play again</button><button type="button" className="next-button" onClick={onComplete}>Get today’s letter</button></>:<span className="text-sm text-muted-foreground">{maxShots-shots} rolls remaining</span>}</div></section>
  </div></main>;
}
