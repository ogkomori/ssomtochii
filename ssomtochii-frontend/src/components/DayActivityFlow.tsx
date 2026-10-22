import { useEffect, useState } from "react";
import { DailyWheel } from "@/components/DailyWheel";
import { markDayCompleted, readProgress } from "@/lib/progress";

export function DayActivityFlow({
  day,
  children,
}: {
  day: number;
  children: (complete: () => void) => React.ReactNode;
}) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(readProgress().completedDays.includes(day));
  }, [day]);

  const complete = () => {
    markDayCompleted(day);
    setCompleted(true);
  };

  if (completed) return <DailyWheel day={day} />;

  return <>{children(complete)}</>;
}
