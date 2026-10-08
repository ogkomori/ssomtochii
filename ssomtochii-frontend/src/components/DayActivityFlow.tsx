import { useState } from "react";
import { DailyWheel } from "@/components/DailyWheel";

const COMPLETION_KEY = "somto-day-completed";

function getCompletedDays() {
  if (typeof window === "undefined") return new Set<number>();
  try {
    const stored = JSON.parse(window.localStorage.getItem(COMPLETION_KEY) ?? "[]");
    return new Set<number>(Array.isArray(stored) ? stored.filter((day): day is number => Number.isInteger(day)) : []);
  } catch {
    return new Set<number>();
  }
}

function markCompleted(day: number) {
  const completed = getCompletedDays();
  completed.add(day);
  window.localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completed]));
}

export function DayActivityFlow({
  day,
  children,
}: {
  day: number;
  children: (complete: () => void) => React.ReactNode;
}) {
  const [completed, setCompleted] = useState(() => getCompletedDays().has(day));

  const complete = () => {
    markCompleted(day);
    setCompleted(true);
  };

  if (completed) return <DailyWheel day={day} />;

  return <>{children(complete)}</>;
}
