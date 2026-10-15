# Memory Lane photo placeholders

Add the nine replacement images to this folder, using these exact filenames:

- `round-1-first.jpg`
- `round-1-middle.jpg`
- `round-1-last.jpg`
- `round-2-first.jpg`
- `round-2-middle.jpg`
- `round-2-last.jpg`
- `round-3-first.jpg`
- `round-3-middle.jpg`
- `round-3-last.jpg`

The game references them as `/memory-lane/<filename>`, which maps to this folder under `public/memory-lane/`.

The order of the three entries in each round in `src/lib/memory-lane.ts` is the correct chronological order (earliest first, latest last). The game shuffles them for her. Replace the `image` paths if you choose different filenames, and edit the neutral `caption` values to suit each photo. Keep the three photos in each round ordered chronologically in that file.
