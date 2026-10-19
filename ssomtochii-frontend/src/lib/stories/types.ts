export type CharacterPosition = "left" | "center" | "right";

export interface StoryCharacter {
  /** Stable identifier used to connect dialogue to the person speaking. */
  id: string;
  name: string;
  /** Public asset path, e.g. /images/character/girlfriend/happy.png */
  image: string;
  position: CharacterPosition;
  /** Flip a sprite horizontally when the pose supports mirroring. */
  mirrored?: boolean;
  /** Optional accessible description. */
  alt?: string;
}

interface StoryBeatBase {
  id: string;
  /**
   * A CSS color/gradient for quick tests, or an absolute public asset path
   * such as /images/story/day-01/school-corridor.webp.
   * Omit to keep the previous background.
   */
  background?: string;
  /** Omit to keep the characters from the previous beat. */
  characters?: StoryCharacter[];
}

export interface DialogueBeat extends StoryBeatBase {
  type: "dialogue";
  speakerId: string;
  text: string;
  /** Optional explicit target; otherwise the next beat in the array is used. */
  next?: string;
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
  /** Optional character speaking the choice prompt. Omit for narrator prompts. */
  speakerId?: string;
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
  startAt: string;
  beats: StoryBeat[];
}
