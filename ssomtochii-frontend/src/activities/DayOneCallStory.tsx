import { useState } from "react";
import { IncomingCallScreen } from "@/components/IncomingCallScreen";
import { StoryPlayer } from "@/components/StoryPlayer";
import { DAY_ONE_CALL_STORY } from "@/lib/stories/day-one-call";

export function DayOneCallStory({ onComplete }: { onComplete: () => void }) {
  const [accepted, setAccepted] = useState(false);

  if (!accepted) {
    return <IncomingCallScreen callerName="Tega" onAnswer={() => setAccepted(true)} />;
  }

  return (
    <StoryPlayer
      story={DAY_ONE_CALL_STORY}
      exitLabel="Back"
      onExit={() => setAccepted(false)}
      onComplete={onComplete}
      continueLabel="Continue Day 1 ♡"
    />
  );
}
