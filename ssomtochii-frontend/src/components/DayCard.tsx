import { Link } from "@tanstack/react-router";
import { Flower2, Star, Music, Mail, Leaf, Moon, Sparkles, Lock, Check, Bug } from "lucide-react";
import type { Day, DayIcon } from "@/lib/days";

const ICONS: Record<DayIcon, typeof Star> = {
  flower: Flower2, star: Star, music: Music, butterfly: Bug, mail: Mail, leaf: Leaf, moon: Moon, sparkle: Sparkles,
};

export function DayCard({ day, index }: { day: Day; index: number }) {
  const Icon = ICONS[day.icon];
  const locked = day.state === "locked";
  const tilt = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.5deg]"][index % 4];

  const inner = (
    <>
      <div className="day-visual">
        {day.image ? (
          <img src={day.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.6} />
        )}
        {day.state === "available" && <span className="day-dot" aria-hidden />}
      </div>
      <div className="mt-1 flex items-center justify-center gap-0.5 text-[0.6rem] font-semibold tracking-[0.12em] sm:mt-1.5 sm:text-xs">
        {locked && <Lock className="h-2.5 w-2.5 shrink-0" />}
        {day.state === "completed" && <Check className="h-3 w-3 shrink-0 text-primary" />}
        <span>DAY {day.day}</span>
      </div>
      <div className="text-[0.55rem] tracking-[0.1em] text-muted-foreground sm:text-[0.7rem]">{day.label}</div>
    </>
  );

  const cls = `day-card ${tilt} day-${day.state}`;
  if (locked) return <div className={cls} aria-disabled="true" aria-label={`Day ${day.day}, locked`}>{inner}</div>;
  return (
    <Link to="/day/$day" params={{ day: String(day.day) }} className={cls} aria-label={`Open day ${day.day}`}>
      {inner}
    </Link>
  );
}
