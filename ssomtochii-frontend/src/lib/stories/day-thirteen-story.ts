import type { StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA } from "./speakers";
import { neutral, speaking, smiling, pose8Thinking, pose11SeriousConcerned, zaraNeutral, zaraHappyDialogueAlone, zaraSurprised, zaraSadAlone, zaraConcernedAlone, placeCharacter } from "./character-poses";

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [somtoLeft(somtoPose), zaraRight(zaraPose)];

export const DAY_THIRTEEN_STORY: StoryDefinition = {
  title: "The Missing Tiara", subtitle: "Day 13", startAt: 1,
  beats: [
    { id: 1, type: "narration", scene: "character", background: "/images/backgrounds/lab.jpg", characters: [pose8Thinking], text: "Somto catches Zara during a quiet moment and asks to speak privately. She has rehearsed what to say, but the moment Zara turns to face her, the words feel harder to get out.", next: 2 },
    { id: 2, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(pose11SeriousConcerned, zaraNeutral), text: "My birthday tiara went missing after you visited my house. Did you see it anywhere while you were there?", next: 3 },
    { id: 3, type: "dialogue", scene: "character", speaker: ZARA, characters: together(pose8Thinking, zaraSurprised), text: "Excuse me? Are you asking me if I stole your tiara?", next: 4 },
    { id: 4, type: "dialogue", scene: "character", speaker: ZARA, characters: together(pose11SeriousConcerned, zaraConcernedAlone), text: "I came over to talk to you, Somto. I didn't take anything. I can't believe you'd look at me and think I'd do something like that.", next: 5 },
    { id: 5, type: "choice", scene: "character", speaker: SOMTO, characters: together(pose11SeriousConcerned, zaraSadAlone), text: "Zara looks genuinely offended. Somto has no proof, only the timing and the empty tiara stand. What does she do?", choices: [
      { id: "day13-believe-zara", label: "Take Zara at her word", next: 6 },
      { id: "day13-accuse-zara", label: "Push the accusation and make a scene", next: 9 },
    ] },
    { id: 6, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(smiling, zaraSadAlone), text: "You're right. I'm sorry. I shouldn't have made it sound like I'd already decided you were guilty. I'm stressed and I panicked.", next: 7 },
    { id: 7, type: "dialogue", scene: "character", speaker: ZARA, characters: together(neutral, zaraNeutral), text: "Thank you for saying that. I can understand being upset, but I need you to trust me if we're going to be friends.", next: 8 },
    { id: 8, type: "end", scene: "character", characters: together(pose8Thinking, zaraNeutral), text: "Zara accepts the apology, though she seems a little more guarded than before. Somto decides to give her the benefit of the doubt, but the missing tiara still bothers her. Trusting Zara hasn't made the mystery disappear." },
    { id: 9, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(pose11SeriousConcerned, zaraSurprised), text: "I don't know what else I'm supposed to think. You were the last person here, and now it's gone.", next: 10 },
    { id: 10, type: "dialogue", scene: "character", speaker: ZARA, characters: together(pose11SeriousConcerned, zaraConcernedAlone), text: "That's not proof, Somto. You invited me into your home and now you're treating me like a thief. Don't speak to me like I'm some kind of criminal.", next: 11 },
    { id: 11, type: "dialogue", scene: "character", speaker: SOMTO, characters: together(speaking, zaraConcernedAlone), text: "I'm asking you a question! You don't have to turn it around on me.", next: 12 },
    { id: 12, type: "dialogue", scene: "character", speaker: ZARA, characters: together(pose11SeriousConcerned, zaraHappyDialogueAlone), text: "And I'm telling you I didn't take it. If you've already decided I'm a bad person, I don't know why you bothered asking.", next: 13 },
    { id: 13, type: "narration", scene: "character", background: "/images/backgrounds/lab.jpg", characters: [pose8Thinking], text: "Their voices have risen enough to draw a few looks. Zara steps away before the argument gets any worse, leaving Somto standing there with no answer and no tiara. Neither of them apologises before they part.", next: 14 },
    { id: 14, type: "end", scene: "character", characters: [pose11SeriousConcerned], text: "Somto knows she might have pushed too hard, but Zara's reaction has only made her more uncertain. For now, the friendship is strained, the tiara is still missing, and the question of whether Zara can be trusted remains open." },
  ],
};
