import type { StoryBeat, StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA } from "./speakers";
import {
  neutral,
  speaking,
  smiling,
  pose8Thinking,
  pose11SeriousConcerned,
  pose12ConfidentStanding,
  pose13ArmsCrossed,
  zaraSadAlone,
  zaraThinking,
  zaraHappyDialogueAlone,
  zaraSurprised,
  zaraConcernedAlone,
  placeCharacter,
} from "./character-poses";

const FRIEND = {
  id: "friend",
  label: "A Friend · On the phone",
  color: "#5D8066",
};

const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [
  somtoLeft(somtoPose),
  zaraRight(zaraPose),
];

type DaySixteenChoices = {
  inviteChoice: string | null;
  tiaraChoice: string | null;
  priorityChoice: string | null;
  themeChoice: string | null;
};

const themeDescription = (choice: string | null) => {
  if (choice === "party-theme-green") return "green";
  if (choice === "party-theme-gold") return "gold";
  if (choice === "party-theme-red") return "red";
  return "her chosen colour";
};

/** Day 16: Zara's tiara stunt backfires, and Somto's friends make the birthday special. */
export function getDaySixteenStory({
  inviteChoice,
  tiaraChoice,
  priorityChoice,
  themeChoice,
}: DaySixteenChoices): StoryDefinition {
  const invitedZara = inviteChoice === "invite-zara";
  const accusedZara = tiaraChoice === "day13-accuse-zara";
  const prioritisedVenue = priorityChoice === "day14-confirm-venue";
  const theme = themeDescription(themeChoice);
  const templates: Array<Record<string, unknown>> = [];

  const add = (beat: Record<string, unknown>) => templates.push(beat);

  add({
    type: "narration",
    scene: "character",
    background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
    characters: [pose8Thinking],
    text: prioritisedVenue
      ? "It's Somto's birthday. The venue is secured, and the plans she fought to protect are ready to go. Still, after sacrificing thesis time to confirm everything, she can't help replaying yesterday's presentation in her head. She wants to enjoy today without worrying about what comes next."
      : "It's Somto's birthday. She made real progress on her thesis yesterday, but the venue was left hanging in the balance. Before she can let herself celebrate, she needs to know the plans she worked so hard on haven't fallen apart.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: [pose8Thinking],
    text: prioritisedVenue
      ? "The venue is sorted, the party is happening, and the presentation is over. So why am I still finding new things to worry about?"
      : "I did what I needed to do for my thesis. Please tell me the venue situation hasn't ruined everything else.",
  });

  add({
    type: "dialogue",
    scene: "phone",
    phone: { contactName: "A Friend", contactInitial: "F", statusText: "00:00:08" },
    characters: [],
    speaker: FRIEND,
    text: prioritisedVenue
      ? "Happy birthday! I know you spent yesterday sorting out the venue and had less time to prepare for your presentation. I wanted to check how you're feeling. You know your project, Somto. One stressful day doesn't erase all the work you've put into it."
      : "Happy birthday! First, breathe. I called the venue this morning and explained that you'd already been arranging everything but had to focus on your thesis yesterday. They let me confirm the final details. The booking is secured, Somto. Your party is still happening.",
  });

  add({
    type: "dialogue",
    scene: "phone",
    phone: { contactName: "A Friend", contactInitial: "F", statusText: "00:00:19" },
    characters: [],
    speaker: FRIEND,
    text: prioritisedVenue
      ? "I spoke to Melanie after your presentation. She said you did well, and she knows the deadline change left you stretched. She'll judge the work you submitted, but she understands the circumstances too. Don't assume the worst before you even get feedback."
      : "You don't have to choose between being proud of your thesis progress and enjoying your birthday. We wanted to help because you've been carrying all of this on your own.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: [smiling],
    text: prioritisedVenue
      ? "Thank you. I think I needed someone to tell me to stop punishing myself for not being able to do everything at once."
      : "You actually called them for me? Thank you. I thought I'd have to spend my birthday trying to fix the plans instead of enjoying them.",
  });

  add({
    type: "narration",
    scene: "character",
    background: "/images/backgrounds/bedroom.png",
    characters: [smiling],
    text: `With the venue worry settled, Somto gets ready for the party. The decorations follow the ${theme} theme she chose, and for the first time in days, she lets herself look forward to the celebration instead of planning for what might go wrong.`,
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: [pose12ConfidentStanding],
    text: "Okay. Birthday girl mode. Today, I'm allowed to enjoy the things people have worked so hard to make happen for me.",
  });

  add({
    type: "narration",
    scene: "character",
    background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
    characters: [smiling],
    text: "By the time Somto arrives, her friends have helped make the venue feel warm and personal. The cake is ready, the music is on, and people are already calling her over for pictures. For a moment, the day feels exactly as it should.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: together(pose8Thinking, zaraHappyDialogueAlone),
    text: invitedZara
      ? "Then Zara arrives wearing Somto's missing birthday tiara. She walks in as though she's part of the organising team, already looking around for ways to make herself the centre of attention."
      : "Then Zara walks in uninvited, wearing Somto's missing birthday tiara as though she belongs there. She looks far too pleased with herself to pretend this is an innocent coincidence.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: ZARA,
    characters: together(neutral, zaraHappyDialogueAlone),
    text: invitedZara
      ? "Happy birthday! See? I told you I'd help make this party unforgettable."
      : "Surprise! You didn't think I'd miss your birthday, did you? And honestly, this tiara suits the occasion.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: together(pose11SeriousConcerned, zaraSurprised),
    text: accusedZara
      ? "You stole my tiara, and now you're wearing it to my birthday?"
      : "You told me you hadn't taken it. I believed you, Zara. Why are you wearing my tiara?",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: ZARA,
    characters: together(pose11SeriousConcerned, zaraConcernedAlone),
    text: invitedZara
      ? "I was going to return it. I thought I'd bring it today and make a little moment of it. You're acting like I came here to ruin your birthday."
      : "I was going to return it. I thought you'd rather get it back in person than have me leave it somewhere. You didn't exactly give me an easy way to talk to you.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: together(pose13ArmsCrossed, zaraThinking),
    text: accusedZara
      ? "You could have returned it without wearing it in front of everyone. You knew exactly what you were doing."
      : "If you had found it, you could have told me. You looked me in the eye and denied knowing anything about it.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: together(pose11SeriousConcerned, zaraHappyDialogueAlone),
    text: "Zara tries to laugh off the tension, then immediately starts commenting on the decorations and suggesting how everyone should arrange themselves for pictures. She acts as though the tiara incident is a small misunderstanding and expects the party to move on around her.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: ZARA,
    characters: together(neutral, zaraHappyDialogueAlone),
    text: "Anyway, let's get everyone together. The lighting is better over here, and I know how to make a picture look good. Come on, I'll organise it.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: together(pose13ArmsCrossed, zaraSurprised),
    text: "You don't need to organise my birthday, Zara. My friends and I are already having a good time.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: together(pose8Thinking, zaraSurprised),
    text: "Before Zara can turn the moment into another argument, one of Somto's friends notices the tiara. The room goes quiet for a second. The missing item Somto had been worrying about is sitting plainly on Zara's head.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: ZARA,
    characters: together(pose11SeriousConcerned, zaraConcernedAlone),
    text: "Oh, please. I said I was going to return it. I didn't think everyone needed to make such a big deal out of it.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: together(pose11SeriousConcerned, zaraThinking),
    text: "It was mine, Zara. You took it from my home, denied it when I asked, and then wore it here like it was yours. You don't get to decide how big a deal that is for me.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: together(pose13ArmsCrossed, zaraSadAlone),
    text: "Zara looks around for someone to take her side, but nobody rushes to defend her. Her own explanations have made the situation clear. The friends who had been welcoming her now turn their attention back to Somto and the birthday they came to celebrate.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: ZARA,
    characters: together(pose13ArmsCrossed, zaraSadAlone),
    text: "Fine. Keep the tiara, then. I was trying to make today memorable, but apparently everything I do is a problem.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: [pose8Thinking],
    text: "Zara takes the tiara off and leaves it on a nearby table before stepping away from the group. Somto could put it back on. For a moment, she considers it, but the thought no longer feels important.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: [speaking],
    text: "No. Leave it there. I don't need to wear it to know this is my day.",
  });

  add({
    type: "narration",
    scene: "character",
    background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
    characters: [smiling],
    text: "The awkwardness fades as her friends gather around her again. Someone brings out the cake; someone else starts the song Somto loves; another friend insists on taking pictures with her before the candles are lit. The celebration picks up, and this time Somto lets herself be at the centre of it.",
  });

  add({
    type: "dialogue",
    scene: "character",
    speaker: SOMTO,
    characters: [pose12ConfidentStanding],
    text: "I thought this day would only feel special if everything went exactly how I planned. I was wrong. Look at all of you. You showed up for me.",
  });

  add({
    type: "end",
    scene: "character",
    background: "linear-gradient(180deg, #d9e8e0 0%, #f4e8e4 58%, #d7dfc7 100%)",
    characters: [smiling],
    text: "The venue is safe, the thesis is submitted, and the birthday is finally going the way Somto deserves. Zara tried to make herself the centre of the day, but her own choices exposed her. Somto leaves the tiara on the table and takes her pictures surrounded by people who chose to show up for her. She doesn't need a crown to know how special she is.",
  });

  const beats = templates.map((beat, index) => ({
    ...beat,
    id: index + 1,
    ...(index < templates.length - 1 ? { next: index + 2 } : {}),
  })) as StoryBeat[];

  return {
    title: "All for You",
    subtitle: "Day 16",
    startAt: 1,
    beats,
  };
}

/** Default story retained for callers that don't supply saved choices. */
export const DAY_SIXTEEN_STORY = getDaySixteenStory({
  inviteChoice: null,
  tiaraChoice: null,
  priorityChoice: null,
  themeChoice: null,
});
