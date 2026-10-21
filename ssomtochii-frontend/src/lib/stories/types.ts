export type CharacterPosition = "left" | "center" | "right";

export interface StoryCharacter {
  id: string;
  name: string;
  image: string;
  position: CharacterPosition;
  mirrored?: boolean;
  alt?: string;
}

interface StoryBeatBase {
  id: number;
  background?: string;
  /** Optional colour for the visible speaker-name label on this beat (CSS colour). */
  speakerColor?: string;
  characters?: StoryCharacter[];
  /** Selects the camera composition for this beat. */
  scene?: "character" | "phone";
  /** Optional contact details for phone scenes; defaults preserve the original Day 1 look. */
  phone?: {
    contactName?: string;
    contactInitial?: string;
    statusText?: string;
  };
}

export interface DialogueBeat extends StoryBeatBase {
  type: "dialogue";
  speakerId: string;
  /** Override the visible speaker tag for off-screen voices, e.g. "Tega · On the phone". */
  speakerLabel?: string;
  text: string;
  next?: number;
}

export interface NarrationBeat extends StoryBeatBase {
  type: "narration";
  text: string;
  next?: number;
}

export interface ChoiceOption {
  id: string;
  label: string;
  next: number;
}

export interface ChoiceBeat extends StoryBeatBase {
  type: "choice";
  speakerId?: string;
  speakerLabel?: string;
  text: string;
  choices: ChoiceOption[];
}

export interface EndBeat extends StoryBeatBase {
  type: "end";
  text: string;
}

/** A reusable incoming-call screen that pauses the story until the call is answered. */
export interface IncomingCallBeat extends StoryBeatBase {
  type: "incoming-call";
  callerName?: string;
  next: number;
}

export type StoryBeat = DialogueBeat | NarrationBeat | ChoiceBeat | EndBeat | IncomingCallBeat;

export interface StoryDefinition {
  title: string;
  subtitle?: string;
  startAt: number;
  beats: StoryBeat[];
}
