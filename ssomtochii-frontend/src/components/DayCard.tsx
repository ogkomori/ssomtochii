import { Link } from "@tanstack/react-router";
import { Camera, Lock, Circle, CircleCheck, Sparkles, Star, Crown } from "lucide-react";
import type { Day } from "@/lib/days";

export function DayCard({ day, index, eager = false, priority = false }: { day: Day; index: number; eager?: boolean; priority?: boolean }) {
  const locked = day.state === "locked";
  const completed = day.state === "completed";
  const isFinalDay = day.day === 16;
  const tilt = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.5deg]"][index % 4];

  const status = locked
    ? { label: "Locked", Icon: Lock, className: "day-status--locked" }
    : completed
      ? { label: "Completed", Icon: CircleCheck, className: "day-status--completed" }
      : { label: "Available", Icon: Circle, className: "day-status--available" };

  const inner = (
    <>
      {isFinalDay && (
        <div className="day-sixteen-extras" aria-hidden="true">
          <span className="day-sixteen-crown"><Crown /></span>
          <span className="day-sixteen-confetti day-sixteen-confetti--top" />
          <span className="day-sixteen-confetti day-sixteen-confetti--bottom" />
          <span className="day-sixteen-confetti--sides" />
        </div>
      )}
      <div className={`day-visual ${isFinalDay ? "day-sixteen-visual" : ""}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-dashed border-primary/25 bg-secondary/50 text-primary/65">
          <Camera className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.5} />
          <span className="text-[0.45rem] font-semibold tracking-[0.08em] sm:text-[0.6rem]">ADD PHOTO</span>
        </div>
        {day.image && (
          <img
            src={day.image}
            alt={`Photo for day ${day.day}`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 ${locked ? "grayscale" : "grayscale-0"}`}
            onError={(event) => event.currentTarget.remove()}
          />
        )}
        {isFinalDay && (
          <div className="day-sixteen-celebration" aria-hidden="true">
            <span className="day-sixteen-spark day-sixteen-spark--one"><Sparkles /></span>
            <span className="day-sixteen-spark day-sixteen-spark--two"><Star /></span>
            <span className="day-sixteen-ribbon">THE BIG DAY</span>
            <span className="day-sixteen-spark day-sixteen-spark--three"><Star /></span>
            <span className="day-sixteen-spark day-sixteen-spark--four"><Sparkles /></span>
          </div>
        )}
      </div>
      <div className="day-card-details">
        <div className="day-card-date">
          <span className="day-card-number">DAY {day.day}</span>
          <span className="day-card-full-date">{day.label}</span>
        </div>
        <span className={`day-status ${status.className}`}>
          <status.Icon aria-hidden="true" />
          <span>{status.label}</span>
        </span>
      </div>
    </>
  );

  const cls = `day-card ${tilt} day-${day.state}${isFinalDay ? " day-sixteen" : ""}`;
  if (locked) return <div className={cls} aria-disabled="true" aria-label={`Day ${day.day}, locked`}>{inner}</div>;
  return (
    <Link to="/day/$day" params={{ day: String(day.day) }} className={cls} aria-label={`Open day ${day.day}, ${status.label.toLowerCase()}`}>
      {inner}
    </Link>
  );
}
