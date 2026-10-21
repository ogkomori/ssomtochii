import { useState } from "react";
import { IncomingCallScreen } from "@/components/IncomingCallScreen";
import { StoryPlayer } from "@/components/StoryPlayer";
import { DAY_ONE_STORY } from "@/lib/stories/day-one-story";

export function DayOneStory({ onComplete }: { onComplete: () => void }) {
  const [accepted, setAccepted] = useState(false);

  if (!accepted) {
    return <IncomingCallScreen callerName="Tega" onAnswer={() => setAccepted(true)} />;
  }

  return (
    <StoryPlayer
      story={DAY_ONE_STORY}
      exitLabel="Back"
      onExit={() => setAccepted(false)}
      onComplete={onComplete}
      continueLabel="Continue Day 1 ♡"
    />
  );
}
