# Implement: Game Collection + Persistent World

I want to evolve the 16-day birthday website into a collection of small personalized games.

Do **not** redesign the overall project architecture or create a new project structure. Work within the existing codebase and follow the structure/conventions already present.

The four new game concepts I want implemented are:

1. Flappy Bird-style game
2. Connections-style grouping game
3. Emoji Pictionary-style guessing game
4. Tier List game

I also want a persistent **World** page that shows what she has built/unlocked throughout the journey.

---

## 1. Flappy Bird-style Game

Create a small mobile-friendly game inspired by Flappy Bird.

Core mechanic:

- The player controls a character by tapping the screen.
- Each tap makes the character move/flap upward.
- Gravity continuously pulls the character downward.
- Obstacles move from right to left.
- The player must navigate through gaps.
- Collision ends the run.
- Track a score.
- Provide a restart/replay option.
- The game should work well with touch input on an iPhone.
- Keyboard input can also be supported for development/testing.

Do not copy Flappy Bird's visual assets.

Make the visual style fit the existing birthday website.

The character and obstacles should be easy to replace with personalized assets/content later.

On successful completion, the game should produce an unlock/reward that can be added to the World.

For now, mock the reward if the existing project does not yet have a reward system.

---

## 2. Connections-style Grouping Game

Create a personalized grouping puzzle inspired by the general concept of Connections.

Display a grid of **16 words/items**.

The player must identify **four groups of four**.

Example structure:

```text
16 items

A B C D
E F G H
I J K L
M N O P
```

The player should:

- tap/select items
- select four items
- submit the group
- receive feedback
- correctly solved groups become locked/removed
- incorrect groups remain available
- track mistakes
- finish when all four groups are solved

The content should be data-driven so the actual personalized words/categories can easily be changed later.

Use placeholder content for now if necessary.

The game should support a configuration roughly like:

```ts
{
  items: [...],
  groups: [
    {
      category: "...",
      items: [...]
    },
    ...
  ]
}
```

The important part is that the game engine should not be hardcoded around the placeholder words.

When completed, trigger a World reward/unlock.

---

## 3. Emoji Pictionary-style Game

Create a guessing game where a sequence of emojis represents something and the player must guess what it is.

Examples of the concept:

```text
👸 ❄️ 🏰
```

or

```text
🍕 🎬 🛋️
```

The actual content should eventually be personalized around her:

- songs
- movies
- people
- places
- inside jokes
- favorite things
- memories
- etc.

Gameplay:

- Show the emoji clue.
- Provide an input for the answer OR a set of possible answers, depending on what works best with the existing design.
- Allow the player to submit an answer.
- Give feedback.
- Continue through several rounds.
- Show a final score/result.

Make the puzzle data-driven so I can easily add/edit rounds.

Example:

```ts
{
  clue: ["👸", "❄️", "🏰"],
  answer: "...",
  alternatives: [...]
}
```

Do not hardcode the game logic around the example.

Completing the game should trigger a World reward/unlock.

---

## 4. Tier List Game

Create a drag-and-drop tier list game specifically designed so that **I can participate in the experience indirectly**.

The idea:

She is given a collection of things and must place them into tiers such as:

```text
S
A
B
C
D
```

The items could eventually be:

- songs
- foods
- movies
- outfits
- fictional characters
- places
- random things I know she has opinions about

For the initial implementation, use placeholder content.

The important part is the interaction:

- items can be dragged into tiers
- items can be moved between tiers
- items can be reordered
- mobile touch interaction must work
- there should be a clear completion/submit action

### Important concept

This game should allow me to have a hidden/predefined ranking or prediction of how I think she will rank the items.

For example:

```ts
{
  item: "...",
  predictedTier: "A"
}
```

After she finishes, reveal something like:

> "Okay, let's see how well I know you..."

Then compare her choices against my predictions.

The result could show:

- matches
- disagreements
- funny differences
- an overall "how well I know you" score

Keep this system data-driven so I can easily configure my predictions later.

This is specifically intended to make the game involve **me**, rather than being entirely about her interacting with a computer.

Completing the game should trigger a World reward/unlock.

---

# 5. Persistent "World" Page

Create a separate page/view called something like:

**Your World**

This is a persistent visual representation of everything she has built/unlocked throughout the 16-day experience.

There should be an easily accessible button near the bottom of the main/day experience that opens this page.

For example:

> 🌱 Enter Your World

The World should not just be a list of achievements.

It should feel like a small visual world that gradually grows as she completes days.

For example, conceptually:

```text
        🌳        🐦

    🏠        🌸

          🎵

   🖼️              ⭐

        🏛️
```

The exact visual implementation is up to you, but it should feel like a little place rather than a dashboard.

---

## World progression

Games should be able to unlock objects/elements in the world.

For example:

- Flappy Bird → bird/sky-related element
- Connections → puzzle/book element
- Emoji Pictionary → emoji/art element
- Tier List → something representing her choices
- Existing Grow Something → plant/tree
- Existing Dream Space → house/room
- Existing Museum of Her → museum/building
- Existing Memory Match → photo/gallery element

Do not implement all of these integrations if the corresponding games/features do not exist yet.

Instead, create a simple, extensible reward/unlock mechanism that the new games can use.

For example:

```ts
unlockWorldItem("bird")
```

or whatever fits the existing architecture.

The World should render unlocked items based on application state rather than having everything permanently visible.

---

# 6. World State

The World needs persistent state.

Follow the existing project's state/data architecture.

If persistence does not yet exist, create the smallest reasonable abstraction for it rather than building an elaborate system.

Conceptually:

```ts
type WorldItem = {
  id: string;
  name: string;
  unlocked: boolean;
  // optional position/metadata
};
```

The exact implementation should fit the existing codebase.

The important behavior is:

1. Complete a game.
2. Unlock its World item.
3. Navigate away.
4. Return to the World.
5. The item is still unlocked.

If the backend isn't currently wired for this, mock/local state is acceptable for the initial implementation.

Do not introduce authentication or unnecessary infrastructure.

---

# 7. Integration With Existing 16-Day Experience

These games should fit into the existing 16-day system.

Do not replace the existing day structure.

Instead, implement the games as reusable activity components that can be assigned to specific days later.

For example:

```text
Day
 └── Activity
      ├── FlappyBird
      ├── Connections
      ├── EmojiPictionary
      └── TierList
```

The exact component organization should follow the existing codebase.

The important thing is that each game can eventually be plugged into one of the 16 days without rewriting its core logic.

---

# 8. UX Expectations

The games should feel like they belong to the same birthday experience.

They should share the existing:

- typography
- colors
- spacing
- buttons
- cards
- animations
- overall visual language

Do not make the games look like four unrelated websites.

Prioritize:

- mobile/touch interaction
- clear feedback
- satisfying small animations
- quick loading
- simple rules
- polished transitions

The games should be fun before they are technically impressive.

---

# 9. What I Want From This Implementation

Implement the four games and the World page in the existing project.

Use placeholder content where personalized content isn't available yet, but structure everything so I can easily replace the content later.

Do not spend time inventing the final personalized questions, words, emojis, rankings, or artwork.

I want the **game systems and World system working first**.

At the end, I should be able to:

1. Open each game.
2. Play it.
3. Complete it.
4. Receive its reward/unlock.
5. Open the World page.
6. See the corresponding new element appear.
7. Navigate away and return without losing the unlocked state.

Keep the implementation clean and componentized, and don't modify unrelated parts of the project.