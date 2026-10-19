# Visual novel stories

The reusable renderer lives in `src/components/StoryPlayer.tsx`. Story content belongs in this folder and should not contain UI code.

## Test it

Run the frontend with `bun dev`, then open:

`http://localhost:3000/day/12?storyTest=1`

Use the port Vite prints if it is not 3000. The query parameter opens the isolated story demo; opening `/day/12` normally keeps the existing Day 12 page.

## Add a story

Create a file such as `day-01.ts` and export a `StoryDefinition` (see `demo.ts` for a working example). A story is an ordered list of beats:

- `narration`: descriptive text, with no speaker tail.
- `dialogue`: a character's line; tapping advances.
- `choice`: a prompt with options that each point to another beat ID.
- `end`: a simple ending screen.

Each beat can set `background` and `characters`. If either is omitted, the previous visual state remains. A background can be a CSS color/gradient while prototyping, or an asset path such as `/images/story/day-01/school-corridor.webp`.

Each character has a stable `id`, a `name`, an `image` path, and a `position` (`left`, `center`, or `right`). Dialogue's `speakerId` should match a visible character's ID so the bubble tail points towards them. Set `mirrored: true` for a sprite that should be flipped horizontally.

## Asset locations

Keep reusable character sprites in `public/images/character/` and day-specific backgrounds/special illustrations in `public/images/story/day-XX/`. These folders can be created as needed. Public asset paths start with `/images/...`, not `/public/images/...`.

Character sprites must be PNG or WebP with a real transparent background to layer cleanly over scene backgrounds. JPEG files are opaque and will cover the background.

## Current scope

This is a client-side visual-novel prototype. It supports backgrounds, positioned sprites, mirrored sprites, dialogue with speaker tails, narration, branching choices, and an ending screen. It does not yet save choices between visits or automatically connect a finished story to a day's activity; those should be added after the presentation and content format are approved.
