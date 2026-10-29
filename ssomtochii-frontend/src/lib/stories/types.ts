export type CharacterPosition = "left" | "center" | "right";

export interface Speaker {
  /** Matches the speaker's visible StoryCharacter.id when the character is on screen. */
  id: string;
  /** Text shown in the dialogue name tag. */
  label: string;
  /** CSS colour used for the dialogue name tag. */
  color: string;
}

export interface StoryCharacter {
  id: string;
  name: string;
  image: string;
  position: CharacterPosition;
  mirrored?: boolean;
  /** Optional scale multiplier for poses that need a closer camera crop. */
  scale?: number;
  /** Optional vertical offset in pixels; positive values move the sprite down. */
  offsetY?: number;
  alt?: string;
}

interface StoryBeatBase {
  id: number;
  background?: string;
  characters?: StoryCharacter[];
  /** Selects the camera composition for this beat. */
  scene?: "character" | "phone";
  /** Optional contact details for phone scenes; defaults preserve the original Day 1 look. */
  phone?: {
    contactName?: string;
    contactInitial?: string;
    /** Optional profile image path for the phone contact. */
    contactImage?: string;
    statusText?: string;
  };
}

export interface DialogueBeat extends StoryBeatBase {
  type: "dialogue";
  speaker: Speaker;
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
  speaker?: Speaker;
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
  /** Display-only calls show the incoming-call UI without letting the viewer accept or decline. */
  narration?: string;
  interaction?: "interactive" | "display-only";
  next: number;
}

/** A display-only outgoing call screen with a single red decline icon. */
export interface OutgoingCallBeat extends StoryBeatBase {
  type: "outgoing-call";
  callerName?: string;
  next: number;
}

/** A display-only missed-call screen with optional narration in the story dialogue panel. */
export interface MissedCallBeat extends StoryBeatBase {
  type: "missed-call";
  callerName?: string;
  /** Optional narration shown beneath the missed-call screen. */
  narration?: string;
  next: number;
}

export type StoryBeat = DialogueBeat | NarrationBeat | ChoiceBeat | EndBeat | IncomingCallBeat | OutgoingCallBeat | MissedCallBeat;

export interface StoryDefinition {
  title: string;
  subtitle?: string;
  startAt: number;
  beats: StoryBeat[];
}
