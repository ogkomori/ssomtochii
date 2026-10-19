import { useEffect, useState } from "react";
import { Phone, PhoneOff, RotateCcw, Volume2 } from "lucide-react";

const callerName = "Unknown Caller";

type CallState = "ringing" | "declined";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

export function IncomingCallScreen({ onAnswer }: { onAnswer: () => void }) {
  const [state, setState] = useState<CallState>("ringing");
  const now = useClock();

  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const date = now
    ? now.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";
  const initials =
    callerName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "♡";

  return (
    <main className="incoming-call-screen scene-bg">
      <div className="scene">
        <img
          src="/images/hand-phone.jpg"
          alt="A hand holding a smartphone"
          width={848}
          height={1264}
          className="scene-img"
        />

        <div className="screen" aria-label="Phone screen">
          <div className="status">
            <span>{time}</span>
            <span className="status-icons" aria-hidden="true">
              <svg viewBox="0 0 18 12">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5" width="3" height="7" rx="1" />
                <rect x="10" y="2" width="3" height="10" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" opacity=".4" />
              </svg>
              <span className="battery"><i /></span>
            </span>
          </div>

          <div key={state} className="screen-body fade-in">
            {state === "ringing" ? (
              <>
                <div className="top-block">
                  <p className="clock">{time}</p>
                  <p className="date">{date}</p>
                </div>

                <div className="caller">
                  <div className="avatar ringing" aria-hidden="true">
                    <span>{initials}</span>
                  </div>
                  <p className="label">incoming call</p>
                  <h1 className="name">{callerName}</h1>
                  <p className="sub">mobile</p>
                </div>

                <div className="controls">
                  <button
                    className="call-btn decline"
                    type="button"
                    onClick={() => setState("declined")}
                    aria-label="Decline call"
                  >
                    <PhoneOff className="icon" aria-hidden="true" />
                    <span>Decline</span>
                  </button>
                  <button
                    className="call-btn answer"
                    type="button"
                    onClick={onAnswer}
                    aria-label="Answer call"
                  >
                    <Phone className="icon wiggle" aria-hidden="true" />
                    <span>Accept</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="caller mt">
                  <div className="avatar muted" aria-hidden="true">
                    <PhoneOff size={26} />
                  </div>
                  <p className="label">call declined</p>
                  <h1 className="name">{callerName}</h1>
                  <p className="sub">Missed call · {time}</p>
                  <p className="sub italic">Maybe they’ll call back…</p>
                </div>

                <div className="controls single">
                  <button
                    className="again"
                    type="button"
                    onClick={() => setState("ringing")}
                  >
                    <RotateCcw className="icon-sm" aria-hidden="true" />
                    Call again
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="home-bar" aria-hidden="true" />
        </div>
      </div>

      <div className="incoming-call-caption" aria-hidden="true">
        <span>♡ A LITTLE SURPRISE</span>
        <span><i /> Someone’s calling</span>
      </div>
    </main>
  );
}
