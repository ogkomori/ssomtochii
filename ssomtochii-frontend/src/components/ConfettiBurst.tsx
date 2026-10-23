import { useEffect, useState, type CSSProperties } from "react";

export function ConfettiBurst({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [trigger]);
  if (!visible) return null;
  return (
    <div key={trigger} className="confetti-burst" aria-hidden="true">
      {Array.from({ length: 48 }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            "--piece-left": `${(i * 37 + 11) % 100}%`,
            "--piece-hue": (i * 47) % 360,
            "--piece-delay": `${(i % 12) * 18}ms`,
            "--piece-drift": `${((i * 29) % 240) - 120}px`,
            "--piece-spin": `${360 + ((i * 97) % 720)}deg`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
