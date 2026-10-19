import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
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
}: {
  story: StoryDefinition;
  onExit: () => void;
}) {
  const firstBeat = useMemo(
    () => getBeat(story, story.startAt) ?? story.beats[0],
    [story],
  );
  const [beatId, setBeatId] = useState(firstBeat.id);
  const [background, setBackground] = useState(firstBeat.background);
  const [characters, setCharacters] = useState<StoryCharacter[]>(firstBeat.characters ?? []);

  const beat = getBeat(story, beatId) ?? firstBeat;
  const beatIndex = story.beats.findIndex((item) => item.id === beat.id);
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
      <div className="story-stage" style={getBackgroundStyle(background)}>
        <header className="story-test-header">
          <button type="button" className="story-exit-button" onClick={onExit}>
            <ArrowLeft className="h-4 w-4" /> Exit test
          </button>
          <div className="story-heading">
            <span>{story.title}</span>
            {story.subtitle && <small>{story.subtitle}</small>}
          </div>
          <button type="button" className="story-restart-button" onClick={restart} aria-label="Restart story">
            <RotateCcw className="h-4 w-4" />
          </button>
        </header>

        <div className="story-scene-characters" aria-label="Scene characters">
          {characters.map((character) => {
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
          <section className="story-dialogue-panel story-ending-panel" aria-live="polite">
            <p className="story-dialogue-text">{beat.text}</p>
            <div className="story-ending-actions">
              <button type="button" className="story-choice-button" onClick={restart}>Play again</button>
              <button type="button" className="story-choice-button story-choice-button--secondary" onClick={onExit}>Back to Day 12</button>
            </div>
          </section>
        ) : beat.type === "choice" ? (
          <section className="story-dialogue-panel story-choice-panel" aria-live="polite">
            {speaker && <p className="story-speaker-name">{speaker.name}</p>}
            <p className="story-dialogue-text">{beat.text}</p>
            <div className="story-choice-list">
              {beat.choices.map((choice) => (
                <button key={choice.id} type="button" className="story-choice-button" onClick={() => goTo(choice.next)}>
                  {choice.label}
                </button>
              ))}
            </div>
            {speaker && <span className="story-bubble-tail" style={{ left: tailOffset(speaker.position) }} aria-hidden="true" />}
          </section>
        ) : (
          <button
            type="button"
            className={`story-dialogue-panel ${beat.type === "narration" ? "story-dialogue-panel--narration" : ""}`}
            onClick={advance}
            aria-label={beat.type === "narration" ? "Continue narration" : `Continue dialogue from ${speaker?.name ?? "speaker"}`}
          >
            {speaker && <span className="story-speaker-name">{speaker.name}</span>}
            <span className="story-dialogue-text">{beat.text}</span>
            <span className="story-continue-hint">Tap to continue ›</span>
            {speaker && <span className="story-bubble-tail" style={{ left: tailOffset(speaker.position) }} aria-hidden="true" />}
          </button>
        )}
      </div>
    </main>
  );
}
