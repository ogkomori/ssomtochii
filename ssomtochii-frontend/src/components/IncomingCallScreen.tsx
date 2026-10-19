import { useState } from "react";
import { Phone, PhoneOff, RotateCcw, Volume2 } from "lucide-react";

export function IncomingCallScreen({ onAnswer }: { onAnswer: () => void }) {
  const [callerName, setCallerName] = useState("Unknown Caller");
  const [declined, setDeclined] = useState(false);

  const displayName = callerName.trim() || "Unknown Caller";

  return (
    <main className="incoming-call-screen">
      <svg className="incoming-call-art" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="call-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#182a22" />
            <stop offset="52%" stopColor="#526b58" />
            <stop offset="100%" stopColor="#c4b99d" />
          </linearGradient>
          <radialGradient id="call-glow">
            <stop offset="0%" stopColor="#e7d9b9" stopOpacity=".52" />
            <stop offset="100%" stopColor="#e7d9b9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3c7a7" />
            <stop offset="55%" stopColor="#d99d79" />
            <stop offset="100%" stopColor="#b9775b" />
          </linearGradient>
          <linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#183d31" />
            <stop offset="100%" stopColor="#32624b" />
          </linearGradient>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <rect width="390" height="844" fill="url(#call-bg)" />
        <circle cx="308" cy="160" r="190" fill="url(#call-glow)" />
        <circle cx="55" cy="570" r="170" fill="#d8d0b6" opacity=".13" filter="url(#soft-shadow)" />
        <path d="M0 700 Q88 640 142 700 T390 678 V844 H0Z" fill="#12231b" opacity=".35" />
        <ellipse cx="196" cy="675" rx="145" ry="44" fill="#101a14" opacity=".36" filter="url(#soft-shadow)" />
        <path d="M84 900 C94 784 115 704 142 624 C156 581 183 568 204 592 C221 612 206 657 196 698 L177 844Z" fill="url(#sleeve)" />
        <path d="M301 900 C291 800 276 721 250 653 C234 611 211 594 190 615 C172 635 188 676 201 711 L220 844Z" fill="url(#sleeve)" />
        <path d="M111 844 C121 761 136 704 151 661 C162 632 178 617 194 625 C207 632 205 653 196 679 L169 844Z" fill="url(#skin)" />
        <path d="M278 844 C269 761 253 700 238 658 C228 631 211 616 196 625 C183 634 187 656 197 681 L225 844Z" fill="url(#skin)" />
        <path d="M135 640 C117 614 112 586 121 562 C129 541 149 538 160 556 L177 600 C185 621 171 642 153 649Z" fill="url(#skin)" />
        <path d="M255 640 C274 616 280 589 271 565 C263 543 243 540 232 559 L215 602 C207 623 221 643 239 650Z" fill="url(#skin)" />
        <path d="M148 635 C134 610 135 582 147 571 C159 560 174 571 178 590 L185 619Z" fill="#f5cfb2" opacity=".8" />
        <path d="M242 635 C256 610 255 582 243 571 C231 560 216 571 212 590 L205 619Z" fill="#c88768" opacity=".72" />
        <path d="M122 584 Q136 570 148 590 M268 587 Q254 573 242 591" fill="none" stroke="#a8674e" strokeWidth="2" strokeLinecap="round" opacity=".65" />
        <g fill="#e8d8b9" opacity=".8">
          <circle cx="70" cy="210" r="2" /><circle cx="317" cy="280" r="1.7" /><circle cx="294" cy="110" r="1.5" />
          <path d="M68 350 v10 M63 355 h10 M322 440 v8 M318 444 h8" stroke="#e8d8b9" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </svg>

      <div className="incoming-call-topline">
        <span>♡  A LITTLE SURPRISE</span>
        <span className="incoming-call-status"><i /> Ringing</span>
      </div>

      <section className="call-phone" aria-label="Incoming call phone">
        <div className="call-phone-frame">
          <div className="call-phone-screen">
            <div className="call-phone-island" />
            {declined ? (
              <div className="call-declined-state">
                <div className="call-avatar"><PhoneOff size={27} /></div>
                <p className="call-eyebrow">CALL DECLINED</p>
                <h1>{displayName}</h1>
                <button className="call-again-button" type="button" onClick={() => setDeclined(false)}>
                  <RotateCcw size={16} /> Call again
                </button>
              </div>
            ) : (
              <>
                <div className="call-phone-top">
                  <span>Incoming call</span>
                  <Volume2 size={15} />
                </div>
                <div className="call-contact">
                  <div className="call-avatar"><Phone size={27} /></div>
                  <p className="call-eyebrow">INCOMING CALL</p>
                  <h1>{displayName}</h1>
                  <p className="call-subtitle">mobile</p>
                </div>
                <div className="call-actions">
                  <button type="button" className="call-action call-action--decline" onClick={() => setDeclined(true)} aria-label="Decline call">
                    <PhoneOff size={24} />
                  </button>
                  <button type="button" className="call-action call-action--answer" onClick={onAnswer} aria-label="Answer call">
                    <Phone size={24} />
                  </button>
                </div>
                <div className="call-action-captions"><span>Decline</span><span>Answer</span></div>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="caller-name-editor">
        <label htmlFor="caller-name">Who’s calling?</label>
        <input
          id="caller-name"
          type="text"
          maxLength={32}
          value={callerName}
          onChange={(event) => setCallerName(event.target.value)}
          placeholder="Unknown Caller"
          autoComplete="off"
        />
        <p>The name updates on the phone as you type.</p>
      </div>
    </main>
  );
}
