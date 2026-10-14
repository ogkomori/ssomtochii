# Birthday App Architecture Plan

Version 1. A static PWA for iPhone. No backend.

## 1. Goals and constraints

- Deliver 16 daily gifts, ending on her birthday. Six are story chapters and ten are gift days.
- She only receives. She reads, taps, and chooses. Nothing asks her to sing, dance, or record.
- Gift days take about 1 minute. Story days take 3 to 4 minutes.
- Spend no money. Every tool and asset is free.
- Run as an installed home screen app on iPhone.
- Keep the app static. All content ships as files. There are no accounts, no server, and no database.

## 2. Stack

- Vite, React 18, and TypeScript in strict mode.
- Tailwind CSS for styling.
- Framer Motion for screen transitions and message animation.
- inkjs to run stories written in Ink.
- Zustand with the persist middleware for state and local storage.
- lottie-react for coin and confetti effects.
- vite-plugin-pwa for the manifest and service worker.
- React Router for screens.
- Vitest for unit tests.
- Hosting on Cloudflare Pages, Vercel, or Netlify. All three are free and serve HTTPS.

If your current project uses another framework, keep your framework. Every module in engine/ and store/ is framework-free.

## 3. Screens

- Install Gate. Shows on iPhone Safari before installation. Explains Add to Home Screen with screenshots.
- Home. Shows the coin counter, today's card, a bonus tile when the day has a mini game, and a strip of past days.
- Chapter. The chat story. Full screen with a tinted background.
- Gift. A gift day with one compliment, one song, and a few outfit images to scroll.
- Wardrobe. Outfit cards with prices. She buys with coins and equips one.
- Mini Game. Hosts one of your existing games.
- Archive. Past chapters, gifts, friend messages, and songs. She rereads and replays here.
- Reveal. Day 16 only. Shows the party chapter, coin total, final message, and gift.

## 4. Folder structure

```
src/
  app/            App.tsx, routes.tsx
  config/         app.ts (startDate, name, theme), days.ts
  engine/         storyEngine.ts, tags.ts, dayLock.ts, rewards.ts
  store/          saveStore.ts, types.ts
  features/
    home/         HomeScreen.tsx, DayCard.tsx, CoinCounter.tsx
    chapter/      ChapterScreen.tsx, ChatThread.tsx, MessageBubble.tsx,
                  TypingIndicator.tsx, ChoiceSheet.tsx, BackgroundLayer.tsx,
                  OutfitPicker.tsx, RecapCard.tsx
    gift/         GiftScreen.tsx
    wardrobe/     WardrobeScreen.tsx, ItemCard.tsx
    minigames/    MiniGameHost.tsx, registry.ts, adapters/
    archive/      ArchiveScreen.tsx
    reveal/       RevealScreen.tsx
    install/      InstallGate.tsx
  ui/             Button, Sheet, LottieEffect, tokens
content/
  ink/            ch01.ink to ch06.ink
  gifts.json      ten gift days: compliment, song, images
  wardrobe.json
scripts/
  compile-ink.ts
  walk-branches.ts
public/
  chapters/       ch01.json to ch06.json (compiled)
  images/         bg/, outfits/, characters/, friends/, gifts/
  audio/
  icons/
licenses.md
```

## 5. Day schedule

config/days.ts holds sixteen entries. Each entry has a kind, either story or gift. A story day names a chapter. A gift day names a gift. Either kind may name a mini game.

- Six story chapters play on days 1, 4, 7, 10, 13, and 16.
- Ten gift days fill the days between: 2, 3, 5, 6, 8, 9, 11, 12, 14, and 15.
- A gift day holds one specific compliment, one song with a line on why the song fits her, and a few outfit images to scroll. She only reads and taps.
- Mini games open on days 3, 6, 9, 12, and 15.
- Friend and family messages arrive inside chapters 2 to 6, which play on days 4, 7, 10, 13, and 16, as texts from story characters.
- Day 16 is the party chapter and the reveal.

## 6. Data model

```ts
export type Song = { title: string; artist: string; note: string; url: string }

export type Gift = {
  id: string
  compliment: string          // three sentences about a real moment
  song: Song
  images: string[]            // outfit images to scroll
}

export type DayConfig =
  | { day: number; kind: 'story'; chapterId: string; miniGameId?: string }  // chapterId matches public/chapters/<id>.json
  | { day: number; kind: 'gift'; giftId: string; miniGameId?: string }

export type WardrobeItem = {
  id: string
  name: string
  price: number
  image: string
  slot: 'outfit'              // reserved for layered dress up in v2
}

export type SaveState = {
  version: 1
  coins: number
  owned: string[]
  equipped: string | null
  progress: Record<string, { inkState?: string; done: boolean }>  // keys such as 'ch01' and 'gift02'
  rewardsClaimed: string[]    // keys such as 'done:ch05', 'done:gift02', and 'game:day06'
  lastOpenDay: string         // local date, yyyy-mm-dd
  soundOn: boolean
}
```

## 7. Story format

Write chapters as Ink files in content/ink. Compile them to JSON with inklecate in scripts/compile-ink.ts. Output goes to public/chapters.

Rules for writing:

- Six chapters of 40 to 60 lines each. Each takes 3 to 4 minutes.
- Each chapter opens with a three-line recap, because chapters sit three days apart.
- Every decision has three choices. Every choice is a good one and shows a trait of hers.
- Every chapter except 6 ends on a cliffhanger.
- She plays herself, with her real name.

Tags used in Ink lines:

- speaker: character id. No speaker means narration.
- bg: background image id.
- music: audio loop id.
- sfx: sound effect id.
- coins: bonus coins for this moment.
- pick\_outfit: pauses the chapter and opens the outfit picker.
- photo: shows an image from public/images/friends.

Example:

```
VAR outfit = ""

=== ch05 ===
# bg: club_night
# music: loop_midnight
Mia: You made it. Everyone keeps asking about you. # speaker: mia
{outfit == "red_dress": Mia: That red dress is a problem. A good one. # speaker: mia}
* [Walk in like you own the room]
    You: I always do. # speaker: you
    -> dance_floor
* [Find the music first]
    You: Give me one second with the DJ. # speaker: you
    -> dance_floor
* [Scan the room for a familiar face]
    You: Let me see who is here first. # speaker: you
    -> dance_floor
```

The app sets the Ink variable outfit before each chapter and after each outfit pick.

## 8. Story engine

engine/storyEngine.ts wraps inkjs. Keep the module free of UI code.

```ts
export type Beat =
  | { kind: 'line'; speaker: string | null; text: string; tags: Record<string, string> }
  | { kind: 'choices'; options: string[] }
  | { kind: 'end' }

export interface StoryEngine {
  next(): Beat
  choose(index: number): void
  setVariable(name: string, value: string): void
  save(): string
}
```

Behavior:

- next() returns one beat per call.
- The UI controls pacing. Typing dots show for 600 to 1200 ms, scaled to the length of the line.
- The app saves after every choice. Reopening the app resumes at the same beat.
- scripts/walk-branches.ts walks every branch of every chapter and fails on dead ends and unknown tags.

## 9. Day lock

engine/dayLock.ts exports unlockedDay(now, startDate). The result is the smaller of 16 and the number of whole local days since startDate, plus one.

Rules:

- Day N opens at local midnight on startDate plus N minus 1 days.
- Past days stay open.
- A locked day shows a card with the hours left and no preview of content.
- Before startDate, show a Starts soon screen.
- Compare local date strings, not timestamps, to avoid daylight saving errors.
- A dev override through ?day=N works only when import.meta.env.DEV is true. Check the production build to confirm the override is gone.

## 10. State and persistence

- One Zustand store, persisted under the key birthday-save-v1 in localStorage.
- Include the version field and a migrate function from the start.
- Save the inkjs state string after every choice.
- Reward claims are idempotent. Each reward has a key in rewardsClaimed. Replaying a chapter gives no coins.
- Reinstalling the app clears storage. Day access stays correct because the lock uses the date. Coins and outfits reset. Accept this risk.
- An installed app and a Safari tab hold separate storage. The Install Gate stops progress from being stranded in Safari.

## 11. Coins and wardrobe

Earning:

- 10 coins on the first open each day.
- 50 coins on finishing the day's chapter or gift.
- 25 coins for finishing a mini game, once per game.
- Bonus coins from coins tags in the story.

The base total is 16 days at 60 coins plus 5 games at 25 coins, which gives 1,085 coins before bonus tags.

Wardrobe in v1:

- 30 to 40 full outfit cards. Photos in her taste, all cropped to a 4:5 ratio.
- Prices from 40 to 200 coins. Set the catalog total near 1.5 times her earnings so her choices matter.
- She buys an outfit, then equips one. The equipped id goes into the Ink variable outfit.
- pick\_outfit shows owned outfits only. If she owns none, the chapter uses a free default outfit.
- Chapter 6 reads the equipped outfit.

## 12. Mini games

- Define one interface. Props are { onComplete: (score?: number) => void }.
- registry.ts maps each game id to a lazy imported component.
- MiniGameHost renders the game in a full screen frame with a back button, calls the reward function, and returns home.
- Wrap each existing game with a thin adapter. Do not rewrite the games.

## 13. Animation and design

Animation budget:

- Screen transitions with Framer Motion.
- Message entrance, typing dots, and scroll to the newest message.
- Coin burst with Lottie on rewards. Confetti on day 16.
- Respect prefers-reduced-motion.

Design tokens in tailwind.config.ts:

- One palette built from her favorite color. Define primary, soft tint, dark, and text.
- One font pair from Google Fonts. Self-host the files so the app works offline.
- Radius of 20 px on cards, soft shadows, and a 4 px spacing scale.
- Her bubbles sit on the right. Characters sit on the left with avatar circles.
- Generate avatars with DiceBear once and save them as SVG files in public/images/characters. The app makes no runtime network calls for avatars.
- Backgrounds are WebP photos with a CSS blur and a color tint overlay.

## 14. PWA and iOS

- Manifest, icons, meta tags, and safe area padding follow the earlier PWA setup.
- Precache all chapters, images, and audio so the app works offline. Keep the total under 25 MB.
- InstallGate shows only on iOS Safari outside standalone mode. Detect with navigator.standalone and matchMedia('(display-mode: standalone)'). Other platforms skip the gate.
- AudioProvider starts sound after the first tap in each session. No autoplay.
- Her songs open through an Open in Spotify button. Embeds behave unevenly inside installed iPhone apps.
- No vibration and no push reminders in v1.
- The offline cache holds future chapters. Someone who reads network files in browser tools sees them. Accept this for a private gift.

## 15. Asset rules

- Backgrounds: WebP, 1170 px wide, quality 80, under 200 KB each.
- Outfits: WebP, 800 px wide, under 120 KB each.
- Friend photos: WebP, 1000 px wide.
- Audio: m4a at 128 kbps. Loops stay under 60 seconds.
- Names use lowercase and underscores. The file name matches the id in the data file.
- Log the source and license of every asset in licenses.md.
- Convert images with Squoosh or a sharp script.

## 16. Testing checklist

- Install on a real iPhone in the first week.
- Unit test dayLock around midnight, the start date, and day 16.
- Run the branch walker on every chapter.
- Force close mid-chapter, reopen, and confirm the same beat.
- Load the app once, switch on airplane mode, and confirm everything works.
- Replay a chapter and confirm the coin total stays the same.
- Confirm sound starts after a tap and stops when she leaves the chapter.
- Check 375 px and 430 px widths and the safe areas in installed mode.
- Check reduced motion.
- Deploy a new chapter and confirm the installed app receives the update.

## 17. Build order

- M0. Setup, half a day. Repo, Vite, Tailwind, PWA plugin, deploy an empty shell, install on iPhone.
- M1. Story engine, one weekend. inkjs wrapper, tag parser, chapter 1 in Inky, branch walker.
- M2. Chat UI, one weekend. Thread, bubbles, typing dots, choice sheet, backgrounds, transitions.
- M3. State and days, one weekend. Store, day lock, Home, Gift screen, Archive.
- M4. Coins and wardrobe, one weekend. Reward logic, Lottie burst, Wardrobe, outfit picker.
- M5. Mini games, half a day. Host, registry, adapters.
- M6. Content, ongoing. Start now. Six chapters, ten gifts, outfit photos, audio, friend messages.
- M7. Reveal screen and Install Gate, one evening each.
- M8. Freeze and test, three days before day 1.

## 18. Delivery rule

The engine, the home screen, chapter 1, and the gifts for days 2 and 3 go live before day 1. Everything else ships during the 16 days. Each day's content deploys by 6 pm on the day before. The service worker applies new files when she reopens the app. Test one update on the iPhone before launch.

## 19. Risks

- Writing 6 chapters and 10 gift days costs the most time. Keep each chapter to 40 to 60 lines, reuse three settings, and keep each compliment to three sentences.
- Mismatched outfit photos look messy. Use one photo style and one crop ratio.
- iOS storage splits between Safari and the installed app. The Install Gate handles this.
- Scope growth. Layered dress up, push reminders, and cloud sync stay out of v1.

## 20. Inputs needed

- Her birthday date, so the start date is exact.
- Her favorite color.
- The name or nickname used in the story.
- The main setting for the romance.
- The love interest, either a fictional character or someone you design.
- Ten songs she loves and her favorite outfit styles, for the gift days.
- Your current framework, if it is not React.
