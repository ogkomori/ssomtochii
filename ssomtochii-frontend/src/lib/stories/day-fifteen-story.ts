import type { StoryDefinition } from "./types";
import { SOMTO, MELANIE } from "./speakers";
import { sitting, smiling, pose8Thinking, pose11SeriousConcerned, pose12ConfidentStanding } from "./character-poses";

const thesisFirstStory: StoryDefinition = {
  title: "The Big Day", subtitle: "Day 15", startAt: 1,
  beats: [
    { id: 1, type: "narration", scene: "character", background: "/images/backgrounds/bedroom.png", characters: [pose12ConfidentStanding], text: "Today is the big day. Somto has her thesis presentation, and she has worked incredibly hard to get here. She wakes up feeling prepared, focused, and confident. Her birthday is tomorrow, but for now, the party plans are far from her mind. There is something bigger at stake today, and she is ready to give it everything.", next: 2 },
    { id: 2, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose8Thinking], text: "I've put too much work into this to let nerves get the better of me. One thing at a time. Today is about my thesis.", next: 3 },
    { id: 3, type: "narration", scene: "character", background: "linear-gradient(180deg, #dce7e8 0%, #f7eee5 100%)", characters: [pose12ConfidentStanding], text: "At the lab, Somto sets up her presentation. The panel is seated and ready to assess her work. She takes a breath, looks around the room, and begins. Her voice is steady, her explanations are clear, and she handles the questions with confidence.", next: 4 },
    { id: 4, type: "narration", scene: "character", background: "/images/day-15/thesis-judges.png", characters: [], text: "The judges listen closely, taking notes as Somto works through her findings, methods, and conclusions. She has clearly put the hours in, and she gives them a presentation she can be proud of.", next: 5 },
    { id: 5, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose12ConfidentStanding], text: "To conclude, the results support my main argument. I've also outlined the limitations of the study and the areas where further research would be useful. Thank you.", next: 6 },
    { id: 6, type: "narration", scene: "character", background: "linear-gradient(180deg, #dce7e8 0%, #f7eee5 100%)", characters: [pose8Thinking], text: "The presentation ends. Somto steps outside while the panel deliberates. The wait feels long, but she is not replaying every sentence or wishing she had prepared more. She knows she gave the work her best.", next: 7 },
    { id: 7, type: "dialogue", scene: "character", speaker: MELANIE, characters: [smiling], text: "Somto, congratulations. You did exceptionally well. The panel has agreed on a First. I'm so proud of you. I know how much work you put into this, and you have earned every bit of this result.", next: 8 },
    { id: 8, type: "dialogue", scene: "character", speaker: SOMTO, characters: [smiling], text: "A First? Oh my goodness. Thank you, Melanie. I honestly don't even know what to say.", next: 9 },
    { id: 9, type: "narration", scene: "character", background: "/images/backgrounds/bedroom.png", characters: [smiling], text: "Somto heads home on a high. All those late nights, revisions, and moments of doubt have led to this. She is proud of herself, and she should be. But as the excitement settles, tomorrow comes back to mind. Her birthday venue is still not confirmed. She hopes the space is still available.", next: 10 },
    { id: 10, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose11SeriousConcerned], text: "I got my First. I actually got my First. Please, let that venue still be available tomorrow. I don't want to deal with another problem now.", next: 11 },
    { id: 11, type: "end", scene: "character", characters: [pose8Thinking], text: "For tonight, Somto lets herself enjoy the achievement. Tomorrow is her birthday, and she still has one big thing to sort out. She can only hope the venue hasn't been given away." },
  ],
};

const partyFirstStory: StoryDefinition = {
  title: "The Big Day", subtitle: "Day 15", startAt: 1,
  beats: [
    { id: 1, type: "narration", scene: "character", background: "/images/backgrounds/bedroom.png", characters: [pose11SeriousConcerned], text: "Today is the big day. Somto has her thesis presentation, but she wakes up with a knot in her stomach. Yesterday, she spent the time securing her birthday venue, leaving less time than she wanted for her final thesis preparations. She knows her work, but she is worried she has not done enough to earn the result she hoped for.", next: 2 },
    { id: 2, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose8Thinking], text: "I should have had more time. I know my project, but there are parts I wish I'd been able to explain better. I need to pull myself together.", next: 3 },
    { id: 3, type: "narration", scene: "character", background: "linear-gradient(180deg, #dce7e8 0%, #f7eee5 100%)", characters: [pose11SeriousConcerned], text: "At the lab, Somto sets up her presentation. The judges are ready, and she begins. She gets through the opening, but her confidence keeps slipping. She loses her train of thought once, rushes through an explanation, and struggles to give as much detail as she wanted.", next: 4 },
    { id: 4, type: "narration", scene: "character", background: "/images/day-15/thesis-judges.png", characters: [], text: "The panel listens and takes notes. Somto answers the questions, but a few answers come out less clearly than she intended. She knows there were points she should have explained more fully.", next: 5 },
    { id: 5, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose11SeriousConcerned], text: "I think that covers the main points. I would have liked to go into more detail on the limitations and the analysis, but thank you for your time.", next: 6 },
    { id: 6, type: "narration", scene: "character", background: "linear-gradient(180deg, #dce7e8 0%, #f7eee5 100%)", characters: [pose8Thinking], text: "The presentation ends. Somto waits outside while the judges deliberate. The discussion takes longer than she expected. When Melanie finally comes out, her expression is thoughtful.", next: 7 },
    { id: 7, type: "dialogue", scene: "character", speaker: MELANIE, characters: [pose11SeriousConcerned], text: "Somto, the panel has not been able to reach a unified decision today. We need a little more time to agree on the assessment. You'll receive your result tomorrow.", next: 8 },
    { id: 8, type: "dialogue", scene: "character", speaker: SOMTO, characters: [pose11SeriousConcerned], text: "Tomorrow? Okay. I understand. I just wish I knew where I stood.", next: 9 },
    { id: 9, type: "narration", scene: "character", background: "/images/backgrounds/bedroom.png", characters: [pose11SeriousConcerned], text: "Somto heads home worried. She keeps thinking about the answers she rushed and the details she left out. Still, the birthday plans are looking good. The venue is secured, and everything is coming together for tomorrow. She decides to put the result out of her mind for tonight and focus on her birthday.", next: 10 },
    { id: 10, type: "dialogue", scene: "character", speaker: SOMTO, characters: [sitting], text: "There's nothing I can do about the result tonight. The party is sorted, and tomorrow is my birthday. I'm going to enjoy that. I'll deal with the grade when I know.", next: 11 },
    { id: 11, type: "end", scene: "character", characters: [smiling], text: "The worry has not disappeared, but Somto chooses not to let it take over the evening. Her birthday plans are ready, and for now, she wants to look forward to tomorrow." },
  ],
};

export function getDayFifteenStory(priorityChoice: string | null): StoryDefinition {
  return priorityChoice === "day14-work-thesis" ? thesisFirstStory : partyFirstStory;
}

export const DAY_FIFTEEN_STORY = partyFirstStory;
