import type { StoryBeat, StoryCharacter, StoryDefinition } from "./types";
import { SOMTO, ZARA, MELANIE, PARTY_PLANNERS } from "./speakers";
import {
  speaking,
  sitting,
  facepalm,
  pose1NeutralDay16,
  pose2HappyAloneDay16,
  pose4SadDay16,
  pose7HappyDialogueDay16,
  pose8ThinkingDay16,
  smiling,
  pose1NeutralAloneDay16,
  pose11SeriousConcernedAloneDay16,
  zaraHappyAloneDay16,
  placeCharacter,
  pose5SurprisedDay16,
  pose10ExplainingAloneDay16,
  pose11SeriousConcernedDay16,
  zaraNeutralDay16,
  zaraHappyDialogueDay16,
  zaraExplainingDay16,
  friendsGreeting,
} from "./character-poses";

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

/** Day 16 opens with the birthday morning, then follows the branch from Day 14. */
export function getDaySixteenStory({
  inviteChoice,
  tiaraChoice,
  priorityChoice,
  themeChoice,
}: DaySixteenChoices): StoryDefinition {
  // These choices are retained for the later party storyline.
  void inviteChoice;
  void tiaraChoice;

  const prioritisedVenue = priorityChoice === "day14-confirm-venue";
  const theme = themeDescription(themeChoice);
  const venueTint = themeChoice === "party-theme-green"
    ? "rgba(35, 125, 70, 0.42)"
    : themeChoice === "party-theme-red"
      ? "rgba(205, 35, 48, 0.42)"
      : "rgba(173, 132, 42, 0.34)";
  const venueBackground = `linear-gradient(0deg, ${venueTint}, ${venueTint}), url("/images/backgrounds/party.jpg")`;
  const outfitColour = themeChoice === "party-theme-green" ? "green" : themeChoice === "party-theme-red" ? "red" : undefined;

  const outfitPose = (character: StoryCharacter): StoryCharacter => {
    if (character.name === "Zara") {
      const zaraFilenames: Record<string, string> = {
        "zara-pose-1-neutral": "pose-1-neutral",
        "zara-pose-2-happy": "pose-2-happy",
        "zara-pose-4-sad": "pose-4-sad",
        "zara-pose-5-surprised": "pose-5-surprised",
        "zara-pose-7-happy-dialogue": "pose-7-happy-dialogue",
        "zara-pose-8-thinking": "pose-8-thinking",
        "zara-pose-9-laughing": "pose-9-laughing",
        "zara-pose-10-explaining": "pose-10-explaining",
        "zara-pose-11-serious-concerned": "pose-11-serious-concerned",
      };
      const sourceFilename = character.image.split("/").pop()?.replace(".png", "");
      const filename = sourceFilename ? zaraFilenames[sourceFilename] : undefined;
      if (!filename) return character;
      return {
        ...character,
        image: "/images/day-16-zara/" + filename + ".png",
        outfitMask: undefined,
        outfitColour: undefined,
      };
    }

    if (character.name === "Friend") {
      const sourceFilename = character.image.split("/").pop()?.replace(/\.png$/, "");
      if (!sourceFilename) return character;
      return {
        ...character,
        ...(outfitColour
          ? {
              outfitMask: "/images/character-reference/Friends/" + sourceFilename + "-mask.png",
              outfitColour,
            }
          : { outfitMask: undefined, outfitColour: undefined }),
      };
    }

    if (character.name !== "Somto") return character;

    const filenames: Record<string, string> = {
      "pose-1-neutral": "pose-1-neutral",
      "pose-2-happy": "pose-2-happy",
      "pose-4-sad": "pose-4-sad",
      "pose-5-surprised": "pose-5-surprised",
      "pose-7-happy-dialogue": "pose-7-happy-dialogue",
      "pose-8-thinking": "pose-8-thinking",
      "pose-10-explaining": "pose-10-explaining",
      "pose-11-serious-concerned": "pose-11-serious-concerned",
    };

    const sourceFilename = character.image.split("/").pop()?.replace(/\.png$/, "").replace(/-gold$/, "");
    if (!sourceFilename || !filenames[sourceFilename]) return character;

    const filename = filenames[sourceFilename];
    const image = filename === "pose-1-neutral"
      ? "/images/day-16/pose-1-neutral-gold.png"
      : "/images/day-16/" + filename + ".png";

    return {
      ...character,
      image,
      ...(outfitColour
        ? { outfitMask: "/images/day-16/" + filename + "-mask.png", outfitColour }
        : { outfitMask: undefined, outfitColour: undefined }),
    };
  };

  const templates: Array<Record<string, unknown>> = [];

  const add = (beat: Record<string, unknown>) => {
    const characters = beat.characters as StoryCharacter[] | undefined;
    templates.push({
      ...beat,
      ...(characters ? { characters: characters.map(outfitPose) } : {}),
    });
  };

  if (prioritisedVenue) {
    // Somto chose the party over the thesis. Melanie calls with the revised result.
    add({
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "A very Happy Birthday to our main char...oh my bad. It's not looking too happy just yet. Somto should be thinking about getting ready and enjoying herself, but yesterday's uncertainty about her thesis result is still sitting at the back of her mind. All of a sudden...",
    });

    add({
      type: "incoming-call",
      scene: "phone",
      callerName: "Melanie",
      interaction: "display-only",
      narration: "Yup, you guessed it. A phone call, but from Melanie. She's definitely calling to give Somto her thesis result.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "You've got to be kidding me. I don't want to receive bad news on my birthday. I don't think I have the strength for that this morning.",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:04" },
      characters: [],
      speaker: MELANIE,
      text: "Good morning, Somto. Happy birthday! I wanted to call you personally because the panel has had some more time to review yesterday's discussion, and we've now reached an agreement.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "Thanks for the birthday message, Melanie. I appreciate you calling me personally. I hope the news is good, but I have to admit I'm a little nervous.",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:15" },
      characters: [],
      speaker: MELANIE,
      text: "I understand, Somto. I know this has been a stressful time for you. The panel has reviewed the circumstances and the work you've submitted, and I'm pleased to inform you that the panel has agreed to award you the highest grade, a 1.",
    });

    add({
      type: "dialogue",
      scene: "character",
      characters: [smiling],
      speaker: SOMTO,
      text: "A Grade 1? Oh my goodness. Thank you so much, Melanie. I honestly thought I was going to spend my birthday worrying about this!",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:18" },
      characters: [],
      speaker: MELANIE,
      text: "Well there is something else you should know. A friend of yours got in touch with me and spoke about how much you've been dealing with recently, especially with the deadline being moved and everything happening around your birthday. They really advocated for you and asked us to consider the circumstances you've been working through. We took that context into consideration when we revisited the decision.",
    });

    add({
      type: "dialogue",
      scene: "character",
      characters: [speaking],
      speaker: SOMTO,
      text: "A friend did that for me? I don't even know what to say. Please thank them for me. I'm so grateful.",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Melanie", contactInitial: "M", statusText: "00:00:55" },
      characters: [],
      speaker: MELANIE,
      text: "Haha, I'm sure you'll see them today. Congratulations again, Somto. Enjoy your birthday, and I hope you have a wonderful celebration.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [smiling],
      text: "I will. Thank you, Melanie. This has made my whole day. I can't believe I get to celebrate my birthday with a Grade 1 as well!",
    });
  } else {
    // Somto chose the thesis over confirming the venue. A friend saves the booking.
    add({
      type: "narration",
      scene: "character",
      background: "/images/backgrounds/bedroom.png",
      characters: [sitting],
      text: "A very Happy Birthday to our main char...oh my bad. It's not looking too happy just yet. Somto should be thinking about getting ready and enjoying herself, but she remembers the venue. Because she stayed focused on her thesis yesterday, the booking was never properly confirmed. She wonders whether there's any point getting dressed for a party that might not happen. All of a sudden...",
    });

    add({
      type: "incoming-call",
      scene: "phone",
      callerName: "Party Planners",
      interaction: "display-only",
      narration: "Yup, you guessed it. A phone call, but from the Party Planners. Surely there's hope now, right?",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [facepalm],
      text: "This better be good news. Hello?",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Party Planners", contactInitial: "PP", statusText: "00:00:04" },
      characters: [],
      speaker: PARTY_PLANNERS,
      text: "Good morning, Somto, and Happy Birthday! We're calling with an update about your venue booking.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [speaking],
      text: "Thanks for the birthday message. What's the update? I was worried that my booking might not have been confirmed because I was so focused on my thesis yesterday and...",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Party Planners", contactInitial: "PP", statusText: "00:00:17" },
      characters: [],
      speaker: PARTY_PLANNERS,
      text: "Slow down, Somto. A friend of yours came in to speak with us and paid an additional late confirmation fee on your behalf. We've confirmed the venue in your name. Your birthday party is going ahead. You don't need to worry about finding another location.",
    });

    add({
      type: "dialogue",
      scene: "character",
      characters: [smiling],
      speaker: SOMTO,
      text: "Wait, someone came all the way there and paid the extra fee for me? I don't even know what to say. Please thank them for me. I'm so grateful.",
    });

    add({
      type: "dialogue",
      scene: "phone",
      phone: { contactName: "Party Planners", contactInitial: "PP", statusText: "00:00:43" },
      characters: [],
      speaker: PARTY_PLANNERS,
      text: "Haha, I'm sure you'll see them today. Enjoy your birthday, and I hope you have a wonderful celebration.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: [smiling],
      text: "Thank you!",
    });
  }

  // Both branches meet here. The chosen Day 2 theme controls the dress recolour.
  add({
    type: "narration",
    scene: "character",
    background: "/images/backgrounds/bedroom.png",
    characters: [sitting],
    text: `With the morning's worry finally behind her, Somto finally gets dressed for her birthday celebration.`,
  });

  add({
    type: "narration",
    scene: "character",
    characters: [pose2HappyAloneDay16],
    text: `Her ${theme} birthday outfit is ready, and she takes a moment to admire herself in the mirror. The day is finally here, and she's ready to enjoy it.`,
  });

  add({
    type: "narration",
    scene: "character",
    background: venueBackground,
    characters: [pose1NeutralAloneDay16],
    text: "A little later, Somto arrives at the party venue. The day she had spent so much time planning for is finally here.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: [friendsGreeting],
    text: "She sees her friends that she had already invited, and they all greet her with a big cheer.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: [pose11SeriousConcernedAloneDay16],
    text: "Immediately, something catches her eye.",
  });

  add({
    type: "narration",
    scene: "character",
    characters: [zaraHappyAloneDay16],
    text: "Zara.",
  });


  // Day 16 continues from Zara's reveal. Her invitation status decides how
  // she enters the conversation, then both routes converge on the tiara.
  const somtoLeft = (pose: StoryCharacter) => placeCharacter(pose, "somto", "Somto", "left");
  const zaraRight = (pose: StoryCharacter) => placeCharacter(pose, "zara", "Zara", "right");
  const together = (somtoPose: StoryCharacter, zaraPose: StoryCharacter) => [
    somtoLeft(somtoPose),
    zaraRight(zaraPose),
  ];

  if (inviteChoice === "invite-zara") {
    add({
      type: "narration",
      scene: "character",
      characters: together(pose8ThinkingDay16, zaraHappyAloneDay16),
      text: "Zara makes her way over to Somto with a bright smile, ready to greet the birthday girl. Somto's expression barely changes. After everything that has happened, she isn't in the mood to pretend she hasn't noticed Zara's little performance.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraHappyDialogueDay16],
      text: "Somtooo! Happy birthday, beautiful! You look lovely. I hope you're having the most amazing time!",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose11SeriousConcernedDay16, zaraNeutralDay16),
      text: "Zara, please. You really came here dressed like this? On my birthday? You knew exactly what you were doing. This whole thing is giving trying to outdress the birthday girl and steal the show.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraExplainingDay16],
      text: "What? I'm not even wearing the theme, Somto. I'm in purple. How am I supposed to be competing with you when I'm not even matching everyone else?",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose10ExplainingAloneDay16, zaraNeutralDay16),
      text: "Girl, exactly. Everyone else is dressed for the theme, and you're standing here in purple. Obviously you're going to stand out. Don't act like you didn't know that.",
    });
  } else {
    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose5SurprisedDay16, zaraHappyAloneDay16),
      text: "Zara? What are you doing here? I didn't invite you.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraExplainingDay16],
      text: "Oh, one of your friends couldn't make it, so she said I could take her place. I thought you'd be happy to see me!",
    });

    add({
      type: "narration",
      scene: "character",
      characters: together(pose8ThinkingDay16, zaraNeutralDay16),
      text: "Somto looks towards the friend who had to give up her spot. The friend gives a small nod, confirming that she'd offered Zara her place. Somto takes a breath. Well, if her friend had arranged it, she wasn't going to make a scene about the guest list.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose7HappyDialogueDay16, zaraNeutralDay16),
      text: "Oh, okay. If she offered you her place, then that's fine. Happy birthday party guest, I guess. But what's with the outfit?",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraExplainingDay16],
      text: "What about my outfit? I'm not even wearing the theme. I'm in purple.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose10ExplainingAloneDay16, zaraNeutralDay16),
      text: "I mean, you do realise you're still going to stand out, right? Everyone else is dressed for the theme. You're the only one in purple.",
    });
  }

  // Both invitation routes meet when Somto notices the missing tiara.
  add({
    type: "narration",
    scene: "character",
    characters: together(pose8ThinkingDay16, zaraHappyAloneDay16),
    text: "Somto is about to turn away when something catches her eye. The tiara. Her tiara. Sitting right there on Zara's head.",
  });

  if (tiaraChoice === "day13-believe-zara") {
    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose11SeriousConcernedDay16, zaraNeutralDay16),
      text: "Wait. Is that my tiara? Zara, you told me you didn't take it. I trusted you. I actually believed you, and you've been walking around wearing it this whole time?",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraExplainingDay16],
      text: "Somto, I'm sorry. I should have told you. I was only borrowing it, honestly. I didn't mean for you to find out like this.",
    });
  } else {
    add({
      type: "dialogue",
      scene: "character",
      speaker: SOMTO,
      characters: together(pose11SeriousConcernedDay16, zaraNeutralDay16),
      text: "I knew it. I knew you took it, you liar! You stood there looking me in the eye and denied everything.",
    });

    add({
      type: "dialogue",
      scene: "character",
      speaker: ZARA,
      characters: [zaraExplainingDay16],
      text: "Oh, I knew you knew. I was wondering how long you'd take to say something. I was only borrowing it, Somto. You don't have to make such a big deal out of it.",
    });
  }

  add({
    type: "narration",
    scene: "character",
    characters: together(pose11SeriousConcernedDay16, zaraNeutralDay16),
    text: "A few of Somto's friends have noticed the exchange. They glance between the two of them, clearly aware something is going on, but nobody steps in. It's her birthday, and they came to celebrate. They would rather leave the confrontation there and get back to the party.",
  });

  add({
    type: "end",
    scene: "character",
    characters: [zaraHappyAloneDay16],
    text: "Zara is still wearing Somto's tiara, and the truth is finally out. Somto's friends have chosen not to get involved, but the moment has left a tension hanging over the celebration. For now, the party carries on.",
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
