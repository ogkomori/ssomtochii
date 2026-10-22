import type { StoryCharacter } from "./types";

/**
 * Reusable Somto character assets.
 *
 * Import the poses a story needs instead of redefining image paths inside
 * each day file. Public asset paths intentionally omit "/public".
 */
const pose = (id: string, filename: string, alt: string): StoryCharacter => ({
  id,
  name: "Somto",
  image: `/images/character-reference/${filename}.png`,
  position: "center",
  alt,
});

export const baseCharacter1 = pose("base-character-1", "baseCharacter1", "Somto character base");
export const facepalm = pose("facepalm", "facepalm", "Somto facepalming");
export const greenTop = pose("green-top", "greenTop", "Somto wearing a green top");
export const neutral = pose("neutral", "neutral", "Somto with a neutral expression");
export const pose1Neutral = pose("pose-1-neutral", "pose-1-neutral", "Somto in a neutral pose");
export const pose2Happy = pose("pose-2-happy", "pose-2-happy", "Somto looking happy");
export const pose3Shy = pose("pose-3-shy", "pose-3-shy", "Somto looking shy");
export const pose4Sad = pose("pose-4-sad", "pose-4-sad", "Somto looking sad");
export const pose5Surprised = pose("pose-5-surprised", "pose-5-surprised", "Somto looking surprised");
export const pose6Walking = pose("pose-6-walking", "pose-6-walking", "Somto walking");
export const pose7HappyDialogue = pose("pose-7-happy-dialogue", "pose-7-happy-dialogue", "Somto speaking happily");
export const pose8Thinking = pose("pose-8-thinking", "pose-8-thinking", "Somto thinking");
export const pose9Laughing = pose("pose-9-laughing", "pose-9-laughing", "Somto laughing");
export const pose10Explaining = pose("pose-10-explaining", "pose-10-explaining", "Somto explaining something");
export const pose11SeriousConcerned = pose("pose-11-serious-concerned", "pose-11-serious-concerned", "Somto looking serious and concerned");
export const pose12ConfidentStanding = pose("pose-12-confident-standing", "pose-12-confident-standing", "Somto standing confidently");
export const pose13ArmsCrossed = pose("pose-13-arms-crossed", "pose-13-arms-crossed", "Somto with her arms crossed");
export const sitting: StoryCharacter = {
  ...pose("sitting", "sitting", "Somto sitting"),
  scale: 1.2,
};
export const smiling = pose("smiling", "smiling", "Somto smiling");
export const speaking = pose("speaking", "speaking", "Somto speaking");
export const behind = pose("behind", "behind", "Somto behind something");
export const upwards = pose("upwards", "upwards", "Somto looking upwards");
