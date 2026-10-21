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
  characters?: StoryCharacter[];
  /** Selects the camera composition for this beat. */
  scene?: "character" | "phone";
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
  next?: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  next: string;
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

export type StoryBeat = DialogueBeat | NarrationBeat | ChoiceBeat | EndBeat;

export interface StoryDefinition {
  title: string;
  subtitle?: string;
  startAt: number;
  beats: StoryBeat[];
}
