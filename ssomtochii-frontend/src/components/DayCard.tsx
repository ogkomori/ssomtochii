import { Link } from "@tanstack/react-router";
import { Camera, Lock, Check } from "lucide-react";
import type { Day } from "@/lib/days";

export function DayCard({ day, index }: { day: Day; index: number }) {
  const locked = day.state === "locked";
  const tilt = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.5deg]"][index % 4];

  const inner = (
    <>
      <div className="day-visual">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-dashed border-primary/25 bg-secondary/50 text-primary/65">
          <Camera className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.5} />
          <span className="text-[0.45rem] font-semibold tracking-[0.08em] sm:text-[0.6rem]">ADD PHOTO</span>
        </div>
        {day.image && (
          <img
            src={day.image}
            alt={`Photo for day ${day.day}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => event.currentTarget.remove()}
          />
        )}
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
