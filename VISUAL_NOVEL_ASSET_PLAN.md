# ssomtochii Visual Novel — Illustration & Asset Plan

## Goal

Create a reusable illustration library for the 16-day *ssomtochii* visual novel. The aim is to make the story feel visually rich without generating a unique illustration for every line of dialogue or scene.

The story uses:
- **Full-body character presentation** for the daily outfit-selection experience.
- **Waist-up character sprites** during dialogue.
- **Player-selected outfits** that persist into story scenes.
- **Story-triggered outfit changes** for events such as rehearsals, performances, or special occasions.
- Separate backgrounds, character layers, dialogue, and story logic wherever practical.

The intended style is polished, anime-inspired, and close to an *Episode Interactive*-style visual novel.

## Asset budget at a glance

Initial planning target: **54 reusable image files**, plus the option to add or replace assets after a visual test.

| Asset group | Planned count |
|---|---:|
| Character foundations | 2 |
| Hair layers | 8 |
| Wardrobe pieces | 25 |
| Facial expressions | 6 |
| Backgrounds | 9 |
| Special story illustrations | 4 |
| **Total** | **54** |

This is a planning estimate, not a hard limit. It assumes clothing, hair, and expressions can be layered. If the layers do not align cleanly, use complete character sprites for the affected looks instead.

## A. Character foundations — 2 assets

1. **Full-body base** — the foundation for outfit selection and wardrobe compositing.
2. **Waist-up dialogue base** — a matching crop or dedicated base suited to dialogue scenes.

### Consistency requirements
- Keep face, skin tone, body proportions, hairline, and overall character identity consistent.
- Use a consistent canvas size, anchor point, and scale for assets that will be layered.
- Export character layers with transparent backgrounds.
- The existing character base has arms angled outward. Clothing must be designed for that exact pose; do not assume arbitrary generated tops will fit.
- Check the character at the actual phone-screen size before producing many assets.

## B. Hair — 8 assets

Plan for **four hairstyles**, with front/back layers where needed.

Possible styles:
- Everyday hairstyle
- Ponytail
- Bun or updo
- Braids, curls, or another style that fits the character

The exact styles should be chosen to suit her appearance and preferences. Some hairstyles may require separate back-hair and front-hair layers so clothing can sit correctly between them.

## C. Wardrobe — 25 assets

These are individual clothing/accessory pieces, not 25 complete outfits.

| Type | Planned count | Notes |
|---|---:|---|
| Tops | 6 | Everyday, smart-casual, school, and going-out options |
| Bottoms | 4 | For mixing with compatible tops |
| Dresses / one-piece looks | 4 | Complete looks that do not require separate tops and bottoms |
| Shoes | 4 | Distinct styles for casual, dressy, and performance looks |
| Accessories | 7 | For example: earrings, necklace, bag, glasses, bracelet, hair accessory, and another personal item |
| **Total** | **25** | |

The wardrobe should support multiple combinations while keeping a coherent style. The daily look selector should let her select compatible items, preview the complete look, and confirm it.

### Story outfit changes
Story events can switch to a preset outfit assembled from the same wardrobe pieces. For example, the story may switch her into a performance look before a showcase. A story-triggered change should update the selected outfit state so the character stays visually consistent in subsequent scenes.

If a particular story outfit cannot be assembled reliably from layers, create a complete sprite for that outfit as an exception.

## D. Facial expressions — 6 assets

Plan for these core expressions:
1. Neutral
2. Happy
3. Laughing
4. Embarrassed / blushing
5. Surprised
6. Sad or determined

Expressions should align with the same face and head position. If expression layers prove difficult to composite cleanly, use a small set of complete waist-up sprites with expressions already rendered.

Expressions should be selected by scene/dialogue state rather than requiring a new illustration for each line.

## E. Backgrounds — 9 assets

Initial background inventory:

1. Bedroom
2. School corridor
3. Classroom
4. Music / rehearsal room
5. Auditorium or performance stage
6. Photoshoot studio
7. Shopping area
8. Travel or outdoor destination
9. Final showcase / birthday venue

These are provisional labels. Once the final story is mapped, combine locations that are visually similar or add a location only when it contributes something meaningful.

Backgrounds should be separate from character sprites so dialogue, outfits, and expressions can be reused across scenes.

## F. Special story illustrations — 4 assets

Reserve complete illustrations for the moments that deserve more visual impact than a reusable sprite can provide:

1. A major audition moment
2. An emotional turning point
3. A performance or dance moment
4. The birthday finale

These are full scene illustrations, not mandatory assets for ordinary dialogue. Final moments should be chosen after the storyline is settled so the illustrations support the actual plot.

## How the assets are reused

A typical dialogue scene is assembled from:

- One background
- One character sprite or full-body layered character
- The selected outfit
- One facial expression
- Dialogue text and choices rendered by the app

For example, a music-room scene can reuse the same background for multiple lines and choices. Only the dialogue, expression, or character pose needs to change when the story calls for it.

Generate a new illustration only when there is a meaningful visual change: a new location, a distinct pose/action, or a special emotional or story moment.

## Story coverage across the 16 days

This is an initial allocation to help ensure the library covers the whole story. It can change as the final dialogue and choices are written.

| Story section | Days | Main reusable visuals |
|---|---|---|
| Introduction and school life | 1–4 | Bedroom, corridor, classroom; casual and school looks |
| Auditions and rehearsals | 5–7 | Rehearsal room and auditorium; performance outfits |
| Friendship and conflict | 8–10 | Existing school backgrounds; expressions convey emotional shifts |
| Photoshoot and new experiences | 11–13 | Studio, shopping, and travel backgrounds; new outfit combinations |
| Final preparations | 14–15 | Bedroom, rehearsal room, and showcase venue |
| Birthday finale | 16 | Special finale illustration |

The story mapping is provisional; do not create a background or special illustration solely because it appears in this table if the final story does not need it.

## Outfit and dialogue flow

1. **Look of the Day:** she chooses hair, top, bottom or dress, shoes, and accessories.
2. **Preview and confirm:** show the complete look before saving it.
3. **Persist the look:** keep her selection for scenes that day and wherever the story calls for that outfit.
4. **Render dialogue scenes:** use a waist-up presentation with the selected outfit and appropriate expression.
5. **Handle story changes:** switch to a preset outfit at story events when needed, and keep that change consistent until another event or selection updates it.

## Recommended production order

Do not generate all 54 assets immediately. Validate the asset pipeline first.

### Phase 1 — Lock the character identity
- Use the existing character base as the reference.
- Establish consistent face, hair, skin tone, proportions, and art style.
- Decide the target canvas dimensions, anchor points, and transparent export format.

### Phase 2 — Build one test outfit
- Create one top, one bottom, shoes, and one hairstyle aligned to the full-body base.
- Composite them in the app and check fit around the shoulders, arms, waist, and legs.
- Test on the target phone-sized screen.

### Phase 3 — Test dialogue rendering
- Produce or crop the matching waist-up character.
- Test one alternate expression.
- Confirm that the face and outfit remain consistent at dialogue size.

### Phase 4 — Expand the library
- Add the remaining hair and wardrobe options.
- Add the core expressions.
- Produce the backgrounds needed by the finalized story.
- Commission/generate the four special illustrations only after their story moments are confirmed.

## Technical and visual risks

Image generation may not produce perfectly aligned transparent clothing or expression layers, especially around hair, hands, shoulders, and the waist. Some assets may require manual cleanup.

If layering is unreliable, use a hybrid fallback:
- Keep modular layers for outfit selection where they work well.
- Generate complete full-body sprites for difficult outfit combinations.
- Use complete waist-up sprites for dialogue expressions that cannot be composited consistently.
- Reserve full scene illustrations for major moments only.

This may increase the number of image files but can save time and preserve visual quality.

## Definition of done for the initial test

Before expanding the library, confirm that:
- The full-body base looks correct on a phone screen.
- At least one complete outfit can be assembled without visible gaps or misalignment.
- The selected outfit persists into a dialogue scene.
- A second expression can be shown without changing the character's identity.
- A story-triggered outfit change works and remains consistent in later scenes.

**Recommended next step:** build and test one complete outfit and one dialogue expression using the existing character base. Expand the asset library only after that test succeeds.
