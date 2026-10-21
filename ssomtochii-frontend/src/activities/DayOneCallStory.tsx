import { useState } from "react";
import { IncomingCallScreen } from "@/components/IncomingCallScreen";

type Beat = {
  speaker: "Somto" | "Tega";
  text: string;
  voice?: boolean;
  choices?: { label: string; reply: string }[];
};

const opening: Beat[] = [
  { speaker: "Somto", text: "Hiii 🥹" },
  { speaker: "Tega", voice: true, text: "Heeey, pretty girl. You picked up so fast." },
  {
    speaker: "Somto",
    text: "As if I wasn't going to answer your call 🙄",
    choices: [
      { label: "“I was waiting for you to call.”", reply: "Aww, you were waiting for me? That is so cute. I should call you more often, then." },
      { label: "“You interrupted my very important work.”", reply: "Oh, I'm sorry, ma'am. Should I schedule an appointment to speak to my favourite person?" },
      { label: "“What's up, Tega?”", reply: "Nothing dramatic. I wanted to hear your voice and check on you. Is that allowed?" },
    ],
  },
];

export function DayOneCallStory({ onComplete }: { onComplete: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [index, setIndex] = useState(0);
  const [branchReply, setBranchReply] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);

  if (!accepted) {
    return <IncomingCallScreen callerName="Tega" onAnswer={() => setAccepted(true)} />;
  }

  const beat = opening[index];
  const isBranchBeat = index === 1 && branchReply !== null;
  const speaker = isBranchBeat ? "Tega" : beat.speaker;
  const text = isBranchBeat ? branchReply : beat.text;
  const isTegaVoice = isBranchBeat || beat.voice === true;

  const advance = () => {
    if (index === 0) {
      setIndex(1);
      return;
    }
    if (index === 1) {
      setIndex(2);
      return;
    }
    setEnding(true);
  };

  return (
    <main className="page-shell" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <section style={{ width: "100%", maxWidth: 440, minHeight: "min(780px, calc(100dvh - 2rem))", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 28, background: "linear-gradient(180deg, #f5e9f0 0%, #f8f0e6 58%, #e6eddf 100%)", boxShadow: "0 20px 60px rgb(72 45 59 / 16%)", padding: "1rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#75566b", fontSize: 12, letterSpacing: ".14em", fontWeight: 700 }}>
          <span>DAY 1 · A LITTLE CALL</span>
          <span>♡</span>
        </header>

        <div style={{ minHeight: 120, padding: "1rem .25rem .5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10 }}>
          <div style={{ alignSelf: isTegaVoice ? "flex-start" : "flex-end", maxWidth: "88%", borderRadius: 20, borderBottomLeftRadius: isTegaVoice ? 5 : 20, borderBottomRightRadius: isTegaVoice ? 20 : 5, background: isTegaVoice ? "#fffafc" : "#dcebd5", padding: "12px 15px", color: "#493b46", boxShadow: "0 5px 16px rgb(72 45 59 / 8%)" }}>
            <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 800, color: "#98738c" }}>{isTegaVoice ? "TEGA · ON THE PHONE" : "SOMTO"}</p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>{ending ? "Okay, okay. I'll let you get back to your day. But I'm calling again later, so don't miss me too much. ❤️" : text}</p>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", width: "78%", height: "65%", bottom: "8%", borderRadius: "50%", background: "rgb(255 255 255 / 45%)", filter: "blur(2px)" }} />
          <img
            src="/images/character-reference/neutral.png"
            alt="Somto on the phone"
            style={{ position: "relative", display: "block", maxHeight: "min(42dvh, 390px)", maxWidth: "100%", width: "auto", objectFit: "contain", filter: "drop-shadow(0 12px 18px rgb(72 45 59 / 12%))" }}
          />
          <span style={{ position: "absolute", right: "9%", top: "15%", fontSize: 24, color: "#b78ca8" }}>♡</span>
        </div>

        <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
          {ending ? (
            <button type="button" className="next-button" onClick={onComplete} style={{ justifyContent: "center", width: "100%" }}>Continue Day 1 <span aria-hidden="true">♡</span></button>
          ) : index === 2 && !branchReply ? (
            beat.choices?.map((choice) => (
              <button key={choice.label} type="button" onClick={() => { setBranchReply(choice.reply); setIndex(1); }} style={{ border: "1px solid rgb(151 111 139 / 28%)", borderRadius: 16, padding: "12px 14px", textAlign: "left", background: "#fffafc", color: "#654d60", fontSize: 14, fontWeight: 650 }}>
                {choice.label}
              </button>
            ))
          ) : (
            <button type="button" className="next-button" onClick={() => {
              if (isBranchBeat) { setEnding(true); return; }
              if (index === 1 && branchReply === null) { advance(); return; }
              advance();
            }} style={{ justifyContent: "center", width: "100%" }}>
              {index === 2 ? "Keep talking" : "Next"} <span aria-hidden="true">›</span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
