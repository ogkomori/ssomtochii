# SPEC.md — 16 Days of You

## Project Overview

Build a private, mobile-first birthday web app for the user's girlfriend.

The experience runs across **16 days**, from **October 23, 2026 through November 7, 2026**. One new experience becomes available each day. Her birthday is November 7, 2026.

Primary theme:

> **16 Days of You ♡**
>
> A little something for you, one day at a time.

The experience should feel personal, playful, romantic, nostalgic, whimsical, and scrapbook/journal-like without becoming overly wedding-themed or visually cluttered.

The app is primarily about **her**: her interests, personality, preferences, memories, creativity, humor, and things she enjoys. The relationship itself should be a thread throughout the experience, not the subject of every day.

---

## 1. Final 16-Day Plan

| Day | Date | Activity |
|---|---|---|
| 1 | Oct 23 | Introduction + Grow Something |
| 2 | Oct 24 | Grow Something / continuation if needed |
| 3 | Oct 25 | Build Your Soundtrack |
| 4 | Oct 26 | Word Scramble |
| 5 | Oct 27 | This or That |
| 6 | Oct 28 | Memory Match |
| 7 | Oct 29 | Design Her Dream Space |
| 8 | Oct 30 | Mini Crossword |
| 9 | Oct 31 | Museum of Her |
| 10 | Nov 1 | Rhythm Game |
| 11 | Nov 2 | Memory Lane |
| 12 | Nov 3 | Hidden Object Hunt |
| 13 | Nov 4 | Ragebait |
| 14 | Nov 5 | Build Your Perfect Day |
| 15 | Nov 6 | Something She Can Keep |
| 16 | Nov 7 | Conclusion / Final Reveal |

This is the finalized 16-day plan. Do not invent additional activities or replace existing activities unless explicitly instructed.

---

## 2. Central Mechanic — 16 Characters

The entire journey leads toward a final physical birthday gift:

**A GIANT TEDDY BEAR!**

The phrase contains 16 non-space characters:

```text
A G I A N T T E D D Y B E A R !
```

Each day awards one character.

### Days 1–15

After completing the day's activity:

1. Show a completion state.
2. Present a character wheel.
3. Animate the wheel spinning.
4. Land on that day's predetermined character.
5. Reveal the character.
6. Show a short personal message associated with the character.
7. Add the character to her collection.

The wheel should **look random**, but the awarded character is predetermined. The backend should eventually be the source of truth. The frontend should not randomly generate the awarded character.

### Day 16

Day 16 awards the final character:

```text
!
```

Then transition into the final collection/reveal. The user should be able to arrange the collected characters into the correct order. When correctly arranged, reveal:

# A GIANT TEDDY BEAR!

The physical giant teddy bear is the real-world payoff.

---

## 3. Character Collection

Characters should initially remain in the order they were earned rather than automatically revealing the final phrase. This prevents the final gift from being immediately obvious.

Each character has:

- Character
- Short personal message
- Day earned
- Completion state

Example:

```ts
{
  character: "A",
  message: "..."
}
```

Actual messages will be supplied when finalized.

---

## 4. Day 1 — Introduction + Grow Something

Day 1 is intentionally introductory.

Exact flow:

```text
Landing Page
    ↓
Open Day 1
    ↓
Introduction Screen
    ↓
Video
    ↓
One Quiz Question
    ↓
Grow Something
    ↓
Completion
    ↓
Character Wheel
    ↓
Character + Personal Message
```

### Introduction

Show a short introduction explaining:

- what the experience is
- why she is receiving it
- what the 16 days are about
- how the experience works

A video is part of the introduction and should be replaceable/configurable later.

### Quiz

There is exactly **one** quiz question:

> Why do you think I chose 16 days?

Use multiple-choice answers. The correct answer references **High School Musical 3** and its opening basketball scene / “16 minutes left” connection.

Provide immediate feedback after selection. Do not add additional quiz questions.

### Grow Something

Day 1 introduces a virtual plant that can persist throughout the 16-day journey.

The plant can grow/change over time, potentially through:

- new leaves
- flowers
- decorations
- visual growth

The exact progression can be refined later. The important requirement is persistence across the journey.

---

## 5. Day 2 — Grow Something / Continuation

The original concept for Grow Something was a standalone Day 2 activity. It has since been moved into **Day 1**.

Day 2 should therefore not introduce a second unrelated Grow Something activity. If the plant progresses on Day 2, that progression is part of the persistent plant mechanic rather than a separate activity.

---

## 6. Day 3 — Build Your Soundtrack

A personalized music game based on songs the girlfriend likes.

Do not simply ask her to select songs from a list. Instead, present difficult song matchups:

```text
Song A  VS  Song B
```

She repeatedly chooses between competing songs. Her decisions build a personalized result.

At the end, transform the choices into:

> **Your Soundtrack**

The final result should feel specifically generated from her choices.

---

## 7. Day 4 — Word Scramble

Unscramble words connected to her.

Words should be personalized to:

- interests
- favorite things
- personality
- memories
- inside jokes
- relevant references

It should feel made for her rather than like a generic word game.

---

## 8. Day 5 — This or That

A rapid-fire personalized choice game.

Present pairs such as:

```text
A or B?
```

Choices should relate to her preferences. At the end, provide a fun personalized result based on her choices.

---

## 9. Day 6 — Memory Match

A classic memory matching game.

Cards can contain:

- photos
- icons
- illustrations
- personal references
- other imagery relevant to her

The implementation should support replacing placeholder card content with real content later.

---

## 10. Day 7 — Design Her Dream Space

Allow her to construct/customize her ideal room or personal space.

Possible choices:

- wall color
- bed
- plants
- posters
- lighting
- rug
- decorations
- other room elements

The final room should visually reflect her choices.

---

## 11. Day 8 — Mini Crossword

A small personalized crossword.

Clues should reference things she knows, such as:

- favorite things
- personality
- memories
- interests
- inside jokes
- relevant people, places, or things

Keep it small and approachable.

---

## 12. Day 9 — Museum of Her

Create a virtual museum dedicated to her. This is one of the centerpiece experiences.

Possible exhibits can represent:

- interests
- favorite things
- quirks
- habits
- personality
- memories
- funny facts
- things she loves
- things that make her unique

It should feel like exploring a tiny museum made specifically for her.

---

## 13. Day 10 — Rhythm Game

A small rhythm game where she taps along to a beat/music track.

Prioritize:

- responsive touch input
- satisfying timing feedback
- simple rules
- mobile usability

It should feel fun and polished rather than like a full rhythm-game platform.

---

## 14. Day 11 — Memory Lane

A memory reconstruction/ordering activity.

Give her memories/events and ask her to arrange or reconstruct them in the correct order.

Possible presentation:

- chronological cards
- timeline
- drag-and-drop

The memories should be personalized.

---

## 15. Day 12 — Hidden Object Hunt

Create a personalized illustrated scene containing hidden objects/references.

The concept is similar to a small custom “Where’s Waldo” experience.

The scene can contain:

- hidden objects
- personal references
- inside jokes
- favorite things
- indirect clues
- Easter eggs

Some Easter eggs can simply exist for her to notice. Clues should not all be completely obvious. The activity should reward careful observation.

---

## 16. Day 13 — Ragebait

This day is deliberately chaotic.

The purpose is to make her:

- laugh
- complain
- rage
- question the developer's sanity

It should be playful rather than genuinely frustrating.

Possible mechanisms include:

- ridiculous choices
- fake rules
- misleading UI
- intentionally annoying interactions
- other affectionate chaos

Tone:

> “I made this specifically to annoy you.”

But affectionately.

---

## 17. Day 14 — Build Your Perfect Day

Let her construct her ideal day.

Possible components:

- breakfast
- outfit
- activity
- music
- food
- location
- evening activity
- other personal preferences

The result should visually assemble into a personalized “perfect day.”

---

## 18. Day 15 — Something She Can Keep

This day is intentionally not fully specified yet.

It should produce something she can actually keep after the 16-day experience.

Keep the implementation/content flexible until the user decides what the keepsake should be. Do not invent the final concept without explicit instruction.

---

## 19. Day 16 — Conclusion / Final Reveal

Day 16 is the final experience.

Award:

```text
!
```

Then transition into the final collection/reveal.

The collected characters should be arranged into:

```text
A GIANT TEDDY BEAR!
```

The interface should make the final reveal feel significant. The physical giant teddy bear is the real-world payoff.

Day 16 should feel like a conclusion rather than another ordinary activity.

---

## 20. Landing Page

Primary heading:

> **16 Days of You ♡**

Subtitle:

> **A little something for you, one day at a time.**

Date range:

> **October 23 — November 7, 2026**

Display the 16 days as a visual grid, approximately 4 × 4 on larger mobile/tablet layouts where appropriate.

Each day tile should contain:

- Day number
- small icon/image
- status

A day image/icon should be replaceable with a personal photo later.

### Day states

**Locked** — not available yet.

**Available** — can currently be opened.

**Completed** — already completed.

The current day should have a subtle visual highlight.

Bottom text:

> **Come back tomorrow for the next one. ♡**

Date-locking logic does not need to be fully implemented in the initial visual prototype.

---

## 21. Design Direction

Combine:

- scrapbook
- journal
- soft garden
- nostalgic
- whimsical
- intimate
- romantic
- playful

Use a faint/light sage-green background. Flowers can be scattered throughout the interface. The design should feel handcrafted rather than corporate.

Avoid:

- wedding invitation aesthetics
- excessive hearts
- excessive glitter
- excessive roses
- generic Valentine's Day styling
- overly pink UI
- visual clutter

The High School Musical connection should influence the nostalgic feeling, but the site should not look like an HSM fan site.

---

## 22. Device Priority

Primary: **iPhone**

Secondary: **iPad**

Fallback: **Laptop/desktop**

The UI must be mobile-first, targeting approximately **375–430px** wide phones.

Requirements:

- comfortable touch targets
- no hover-dependent interactions
- respect mobile safe areas

---

## 23. Technical Stack

Frontend:

- React
- TypeScript
- Vite

Backend:

- Spring Boot
- Java

Database:

- PostgreSQL

API:

- REST
- JSON

Application type:

- PWA

Support:

- web browser usage
- optional Add to Home Screen installation
- standalone PWA display
- basic service worker/caching
- mobile viewport configuration

Do not use Capacitor unless there is a later explicit requirement for native functionality.

---

## 24. Authentication

There is only one intended user.

Do not implement:

- accounts
- login
- registration
- JWT authentication
- refresh tokens
- user roles
- password management

The application is private but does not require a conventional authentication system.

---

## 25. Backend Direction

Separate **journey content** from **journey state**.

### Journey content

```text
days
------------------
day_number
date
character
message
```

### Journey state

```text
daily_progress
------------------
day_number
completed
completed_at
```

Do not lock the final database schema until the activities are implemented enough to understand their actual state requirements.

Some activities may eventually require:

- choices
- scores
- answers
- completion metadata
- uploaded media metadata
- generated results

Do not over-engineer the database before the activities are understood.

---

## 26. Planned API Direction

Potential endpoints:

```http
GET  /api/journey
GET  /api/days/{day}
POST /api/days/{day}/complete
GET  /api/final
```

### GET /api/journey

Returns:

- date range
- current day
- day statuses
- completed characters

### GET /api/days/{day}

Returns the content/state required to render a day.

### POST /api/days/{day}/complete

Should:

- validate that the day is available
- handle already-completed days safely
- persist completion
- return the predetermined character
- return the corresponding message

The character must come from the backend rather than being randomly generated by the frontend.

### GET /api/final

Used to determine whether the final reveal can occur. The frontend handles the visual character arrangement/reveal.

---

## 27. Important Implementation Principle

Build and test the frontend before locking the backend schema.

For the initial implementation, it is acceptable to mock:

- day data
- completion
- character awards
- character messages

First major technical milestone:

```text
React PWA
    ↓
Current day
    ↓
Complete activity
    ↓
Spring Boot API
    ↓
PostgreSQL
    ↓
Refresh page
    ↓
Progress still exists
```

Once that foundation works, individual activities can be connected to persistent backend state.

---

## 28. Development Philosophy

Build incrementally. Do not attempt to build all 16 days at once.

Recommended order:

1. Landing page
2. Day 1
3. Character/wheel mechanic
4. Persistent progress
5. Remaining activities one at a time
6. Final character collection
7. Day 16 reveal
8. PWA polish
9. Visual polish
10. Final testing on iPhone

The content and visual experience are more important than unnecessary technical complexity.

The app should feel like something made specifically for one person, not like a generic game website.

---

## 29. Non-Goals

Do not add:

- social features
- multiple users
- authentication
- accounts
- leaderboards
- admin dashboards
- unnecessary microservices
- unnecessary AI features
- unnecessary native-app wrappers
- generic gamification unrelated to the 16-day experience

Keep the architecture simple enough for a single-person private birthday experience while still being a legitimate full-stack project.
