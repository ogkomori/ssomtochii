import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { CSSProperties } from "react";
import type { StoryBeat, StoryCharacter, StoryDefinition } from "@/lib/stories/types";
import { IncomingCallScreen } from "@/components/IncomingCallScreen";
import { areBeatAssetsLoaded, getImageAspectRatio, preloadBeatAssets, preloadStoryAssets } from "@/lib/stories/preload-assets";

function getBeat(story: StoryDefinition, id: StoryBeat["id"]) {
  return story.beats.find((beat) => beat.id === id);
}

function getBackgroundStyle(background?: string): CSSProperties {
  if (!background) return {};
  if (background.startsWith("/")) {
    return {
      backgroundImage: `linear-gradient(180deg, rgb(20 34 28 / 8%), rgb(20 34 28 / 12%)), url("${background}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background };
}

function tailOffset(position?: StoryCharacter["position"]) {
  if (position === "left") return "22%";
  if (position === "right") return "78%";
  return "50%";
}

export function StoryPlayer({
  story,
  onExit,
  onComplete,
  continueLabel = "Continue",
  exitLabel = "Exit story",
  onChoiceSelected,
}: {
  story: StoryDefinition;
  onExit: () => void;
  onComplete?: () => void;
  continueLabel?: string;
  exitLabel?: string;
  onChoiceSelected?: (choiceId: string, beatId: number) => void;
}) {
  const firstBeat = useMemo(() => {
    const initial = getBeat(story, story.startAt) ?? story.beats[0];
    if (!initial) throw new Error("A story must contain at least one beat.");
    return initial;
  }, [story]);
  const [beatId, setBeatId] = useState(firstBeat.id);
  const [background, setBackground] = useState(firstBeat.background);
  const [characters, setCharacters] = useState<StoryCharacter[]>(firstBeat.characters ?? []);
  const [assetsReady, setAssetsReady] = useState(() => areBeatAssetsLoaded(firstBeat));
  const [transitioning, setTransitioning] = useState(false);
  const transitionLock = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (areBeatAssetsLoaded(firstBeat)) {
      setAssetsReady(true);
    } else {
      setAssetsReady(false);
      void preloadBeatAssets(firstBeat, true).then(() => {
        if (!cancelled) setAssetsReady(true);
      });
    }

    // This resolves after the opening scene is ready, then warms all later
    // story assets in the background. It does not block the player on them.
    void preloadStoryAssets(story, firstBeat);
    return () => { cancelled = true; };
  }, [story, firstBeat]);

  const beat = getBeat(story, beatId) ?? firstBeat;
  const beatIndex = story.beats.findIndex((item) => item.id === beat.id);
  const phoneScene = beat.scene === "phone";
  const duoScene = !phoneScene && characters.length > 1;
  const phoneContactName = beat.phone?.contactName ?? "Tega";
  const phoneContactInitial = beat.phone?.contactInitial ?? (phoneContactName.trim().charAt(0).toUpperCase() || "T");
  const phoneContactImage = beat.phone?.contactImage ?? (phoneContactName.trim().toLowerCase() === "tega" ? "/images/tega-profile.png" : undefined);
  const phoneStatusText = beat.phone?.statusText ?? "00:04:27";
  const speaker = beat.type === "dialogue" || beat.type === "choice" ? beat.speaker : undefined;
  const speakerCharacter = speaker ? characters.find((character) => character.id === speaker.id) : undefined;

  const goTo = async (nextId?: StoryBeat["id"]) => {
    if (!nextId || transitionLock.current) return;
    const nextBeat = getBeat(story, nextId);
    if (!nextBeat) return;

    transitionLock.current = true;
    setTransitioning(true);
    try {
      // If background preloading hasn't reached this scene yet, wait here
      // instead of briefly showing missing characters or a blank background.
      await preloadBeatAssets(nextBeat, true);
      if (nextBeat.background !== undefined) setBackground(nextBeat.background);
      if (nextBeat.characters !== undefined) setCharacters(nextBeat.characters);
      setBeatId(nextBeat.id);
    } finally {
      transitionLock.current = false;
      setTransitioning(false);
    }
  };

  const advance = () => {
    if (beat.type === "end" || beat.type === "choice") return;
    const nextId = beat.next ?? story.beats[beatIndex + 1]?.id;
    goTo(nextId);
  };

  const restart = async () => {
    if (transitionLock.current) return;
    transitionLock.current = true;
    setTransitioning(true);
    try {
      await preloadBeatAssets(firstBeat, true);
      setBeatId(firstBeat.id);
      setBackground(firstBeat.background);
      setCharacters(firstBeat.characters ?? []);
    } finally {
      transitionLock.current = false;
      setTransitioning(false);
    }
  };

  if (!assetsReady) {
    return (
      <main className="story-player-shell">
        <div className="story-stage flex min-h-[70dvh] items-center justify-center text-center">
          <p className="font-script text-4xl">Getting the opening scene ready… ♡</p>
        </div>
      </main>
    );
  }

  // The same incoming-call UI used before Day 1 can also appear mid-story.
  if (beat.type === "incoming-call") {
    return (
      <IncomingCallScreen
        callerName={beat.callerName ?? "Tega"}
        interaction={beat.interaction ?? "interactive"}
        onAnswer={() => goTo(beat.next)}
        onContinue={() => goTo(beat.next)}
      />
    );
  }

  if (beat.type === "outgoing-call") {
    return (
      <IncomingCallScreen
        callerName={beat.callerName ?? "Tega"}
        callType="outgoing"
        interaction="display-only"
        message={beat.message}
        onContinue={() => goTo(beat.next)}
      />
    );
  }

  if (beat.type === "missed-call") {
    return (
      <IncomingCallScreen
        callerName={beat.callerName ?? "Unknown Caller"}
        callType="missed"
        interaction="display-only"
        onContinue={() => goTo(beat.next)}
      />
    );
  }

  return (
    <main className="story-player-shell">
      <div className={`story-stage ${phoneScene ? "story-stage--phone" : ""} ${duoScene ? "story-stage--duo" : ""}`} style={phoneScene ? undefined : getBackgroundStyle(background)}>
        <header className="story-test-header">
          <button type="button" className="story-exit-button" onClick={onExit}>
            <ArrowLeft className="h-4 w-4" /> {exitLabel}
          </button>
          <div className="story-heading">
            <span>{story.title}</span>
            {story.subtitle && <small>{story.subtitle}</small>}
          </div>
          <button type="button" className="story-restart-button" onClick={restart} aria-label="Restart story">
            <RotateCcw className="h-4 w-4" />
          </button>
        </header>

        {phoneScene && <div className="story-phone-table-scene" aria-label={`Phone showing a call with ${phoneContactName}`}><div className="story-phone-object"><div className="story-phone-display"><span className="story-phone-camera-notch" /><div className={`story-phone-contact${phoneContactImage ? " story-phone-contact--has-image" : ""}`}><span>{phoneContactInitial}</span>{phoneContactImage && <img src={phoneContactImage} alt={`${phoneContactName} profile`} onError={(event) => event.currentTarget.remove()} />}</div><strong>{phoneContactName}</strong><span className="story-phone-status">{phoneStatusText}</span><div className="story-phone-action-row"><span>⌁</span><span>▦</span><span>◖</span></div><span className="story-phone-hangup">⌕</span></div></div><span className="story-desk-notebook" /><span className="story-desk-paper" /></div>}

        <div className="story-scene-characters" aria-label="Scene characters">
          {!phoneScene && characters.map((character) => {
            const transform = [
              character.position === "center" ? "translateX(-50%)" : "",
              character.mirrored ? "scaleX(-1)" : "",
              character.scale && character.scale !== 1 ? `scale(${character.scale})` : "",
              character.offsetY ? `translateY(${character.offsetY}px)` : "",
            ].filter(Boolean).join(" ") || undefined;

            return (
              <div
                key={character.id}
                className={`story-sprite story-sprite--${character.position}`}
                role="img"
                aria-label={character.alt ?? character.name}
                style={{
                  backgroundImage: `url("${character.image}")`,
                  backgroundSize: "contain",
                  backgroundPosition: "center bottom",
                  backgroundRepeat: "no-repeat",
                  aspectRatio: String(getImageAspectRatio(character.image) ?? (2 / 3)),
                  transform,
                }}
              />
            );
          })}
        </div>

        {transitioning && (
          <div className="story-transition-overlay" role="status" aria-live="polite">
            <span className="story-transition-indicator">Just a moment… ♡</span>
          </div>
        )}

        {beat.type === "end" ? (
          <section className="story-dialogue-panel story-ending-panel" aria-live="polite">
            <p className="story-dialogue-text">{beat.text}</p>
            <div className="story-ending-actions">
              <button type="button" className="story-choice-button" onClick={restart}>Play again</button>
              {onComplete ? <button type="button" className="story-choice-button story-choice-button--secondary" onClick={onComplete}>{continueLabel}</button> : <button type="button" className="story-choice-button story-choice-button--secondary" onClick={onExit}>Back to Day 12</button>}
            </div>
          </section>
        ) : beat.type === "choice" ? (
          <section className="story-dialogue-panel story-choice-panel" aria-live="polite">
            {speaker && <p className="story-speaker-name" style={{ color: speaker.color, borderColor: speaker.color, backgroundColor: `color-mix(in srgb, ${speaker.color} 18%, transparent)` }}>{speaker.label}</p>}
            <p className="story-dialogue-text">{beat.text}</p>
            <div className="story-choice-list">
              {beat.choices.map((choice) => (
                <button key={choice.id} type="button" className="story-choice-button" onClick={() => { onChoiceSelected?.(choice.id, beat.id); goTo(choice.next); }}>
                  {choice.label}
                </button>
              ))}
            </div>
            {speakerCharacter && <span className="story-bubble-tail" style={{ left: tailOffset(speakerCharacter.position) }} aria-hidden="true" />}
          </section>
        ) : (
          <button
            type="button"
            className={`story-dialogue-panel ${beat.type === "narration" ? "story-dialogue-panel--narration" : ""}`}
            onClick={advance}
            aria-label={beat.type === "narration" ? "Continue narration" : `Continue dialogue from ${speaker?.label ?? "speaker"}`}
          >
            {speaker && <span className="story-speaker-name" style={{ color: speaker.color, borderColor: speaker.color, backgroundColor: `color-mix(in srgb, ${speaker.color} 18%, transparent)` }}>{speaker.label}</span>}
            <span className="story-dialogue-text">{beat.text}</span>
            <span className="story-continue-hint">Tap to continue ›</span>
            {speakerCharacter && <span className="story-bubble-tail" style={{ left: tailOffset(speakerCharacter.position) }} aria-hidden="true" />}
          </button>
        )}
      </div>
    </main>
  );
}
