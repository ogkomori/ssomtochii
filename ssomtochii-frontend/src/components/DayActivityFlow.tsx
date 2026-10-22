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
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    setCompleted(readProgress().completedDays.includes(day));
  }, [day]);

  const complete = () => {
    markDayCompleted(day);
    setCompleted(true);
  };

  if (completed === null) {
    return (
      <main className="page-shell">
        <div className="relative mx-auto flex min-h-[70dvh] w-full max-w-md items-center justify-center text-center">
          <p className="font-script text-4xl">One little moment… ♡</p>
        </div>
      </main>
    );
  }

  if (completed) return <DailyWheel day={day} />;

  return <>{children(complete)}</>;
}
