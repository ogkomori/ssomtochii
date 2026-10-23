import { useEffect, useState } from "react";

export function ConfettiBurst({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [trigger]);
  if (!visible) return null;
  return <div key={trigger} className="confetti-burst" aria-hidden="true">{Array.from({ length: 48 }, (_, i) => <span key={i} className="confetti-piece" style={{ "--piece": i, "--hue": (i * 47) % 360 } as React.CSSProperties} />)}</div>;
}
