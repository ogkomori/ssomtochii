import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { CSSProperties } from "react";
import type { StoryBeat, StoryCharacter, StoryDefinition } from "@/lib/stories/types";

function getBeat(story: StoryDefinition, id: string) {
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
}: {
  story: StoryDefinition;
  onExit: () => void;
  onComplete?: () => void;
  continueLabel?: string;
  exitLabel?: string;
}) {
  const firstBeat = useMemo(() => {
    const initial = getBeat(story, story.startAt) ?? story.beats[0];
    if (!initial) throw new Error("A story must contain at least one beat.");
    return initial;
  }, [story]);
  const [beatId, setBeatId] = useState(firstBeat.id);
  const [background, setBackground] = useState(firstBeat.background);
  const [characters, setCharacters] = useState<StoryCharacter[]>(firstBeat.characters ?? []);

  const beat = getBeat(story, beatId) ?? firstBeat;
  const beatIndex = story.beats.findIndex((item) => item.id === beat.id);
  const phoneScene = beat.scene === "phone";
  const speaker = beat.type === "dialogue" || beat.type === "choice"
    ? characters.find((character) => character.id === beat.speakerId)
    : undefined;

  const goTo = (nextId?: string) => {
    if (!nextId) return;
    const nextBeat = getBeat(story, nextId);
    if (!nextBeat) return;
    if (nextBeat.background !== undefined) setBackground(nextBeat.background);
    if (nextBeat.characters !== undefined) setCharacters(nextBeat.characters);
    setBeatId(nextBeat.id);
  };

  const advance = () => {
    if (beat.type === "end" || beat.type === "choice") return;
    const nextId = beat.next ?? story.beats[beatIndex + 1]?.id;
    goTo(nextId);
  };

  const restart = () => {
    setBeatId(firstBeat.id);
    setBackground(firstBeat.background);
    setCharacters(firstBeat.characters ?? []);
  };

  return (
    <main className="story-player-shell">
      <div className={`story-stage ${phoneScene ? "story-stage--phone" : ""}`} style={phoneScene ? undefined : getBackgroundStyle(background)}>
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

        {phoneScene && <div className="story-phone-table-scene" aria-label="Phone resting on a wooden desk"><div className="story-phone-object"><div className="story-phone-display"><span className="story-phone-camera-notch" /><div className="story-phone-contact">T</div><strong>Tega</strong><span className="story-phone-status">00:04:27</span><div className="story-phone-action-row"><span>⌁</span><span>▦</span><span>◖</span></div><span className="story-phone-hangup">⌕</span></div></div><span className="story-desk-notebook" /><span className="story-desk-paper" /></div>}

        <div className="story-scene-characters" aria-label="Scene characters">
          {!phoneScene && characters.map((character) => {
            const transform = [
              character.position === "center" ? "translateX(-50%)" : "",
              character.mirrored ? "scaleX(-1)" : "",
            ].filter(Boolean).join(" ") || undefined;

            return (
              <img
                key={character.id}
                className={`story-sprite story-sprite--${character.position}`}
                src={character.image}
                alt={character.alt ?? character.name}
                style={{ transform }}
              />
            );
          })}
        </div>

        {beat.type === "end" ? (
          <div className="story-dialogue-stack">
            <section className="story-dialogue-panel story-ending-panel" aria-live="polite">
              <p className="story-dialogue-text">{beat.text}</p>
              <div className="story-ending-actions">
                <button type="button" className="story-choice-button" onClick={restart}>Play again</button>
                {onComplete ? <button type="button" className="story-choice-button story-choice-button--secondary" onClick={onComplete}>{continueLabel}</button> : <button type="button" className="story-choice-button story-choice-button--secondary" onClick={onExit}>Back to Day 12</button>}
              </div>
            </section>
          </div>
        ) : beat.type === "choice" ? (
          <div className="story-dialogue-stack story-dialogue-stack--choices" aria-live="polite">
            <div className="story-dialogue-wrap">
              {(beat.speakerLabel || speaker) && (
                <div className={`story-speaker-name ${(beat.speakerLabel ?? speaker?.name ?? "").includes("Somto") ? "story-speaker-name--rose" : "story-speaker-name--sage"}`}>
                  <span>{beat.speakerLabel ?? speaker?.name}</span>
                  {beat.speakerLabel?.includes("·") && <span className="story-speaker-status">{beat.speakerLabel.split("·").slice(1).join("·").trim()}</span>}
                </div>
              )}
              <section className="story-dialogue-panel story-choice-panel">
                <p className="story-dialogue-text">{beat.text}</p>
              </section>
            </div>
            <div className="story-choice-list">
              {beat.choices.map((choice) => (
                <button key={choice.id} type="button" className="story-choice-button" onClick={() => goTo(choice.next)}>
                  <span>{choice.label}</span>
                  <ChevronRight className="story-choice-chevron" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="story-dialogue-stack">
            <div className="story-dialogue-wrap">
              {(beat.type === "dialogue" ? beat.speakerLabel || speaker : speaker) && (
                <div className={`story-speaker-name ${(beat.type === "dialogue" ? beat.speakerLabel ?? speaker?.name : speaker?.name ?? "").includes("Somto") ? "story-speaker-name--rose" : "story-speaker-name--sage"}`}>
                  <span>{beat.type === "dialogue" ? beat.speakerLabel ?? speaker?.name : speaker?.name}</span>
                  {beat.type === "dialogue" && beat.speakerLabel?.includes("·") && <span className="story-speaker-status">{beat.speakerLabel.split("·").slice(1).join("·").trim()}</span>}
                </div>
              )}
              <button
                type="button"
                className={`story-dialogue-panel ${beat.type === "narration" ? "story-dialogue-panel--narration" : ""}`}
                onClick={advance}
                aria-label={beat.type === "narration" ? "Continue narration" : `Continue dialogue from ${speaker?.name ?? "speaker"}`}
              >
                <span className="story-dialogue-text">{beat.text}</span>
                <span className="story-continue-hint"><ChevronRight aria-hidden="true" /></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
