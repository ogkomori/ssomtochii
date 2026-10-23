import { useState } from "react";
import { DailyWheel } from "@/components/DailyWheel";
import { markDayCompleted } from "@/lib/progress";

export function DayActivityFlow({
  day,
  children,
}: {
  day: number;
  children: (complete: () => void) => React.ReactNode;
}) {
  const [completed, setCompleted] = useState(false);

  const complete = () => {
    markDayCompleted(day);
    setCompleted(true);
  };

  if (completed) return <DailyWheel day={day} />;

  return <>{children(complete)}</>;
}
