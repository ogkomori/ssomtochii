import type { StoryBeat, StoryDefinition } from "./types";

const imageLoads = new Map<string, Promise<void>>();
const loadedImages = new Set<string>();

function preloadImage(src: string, priority = false): Promise<void> {
  const cached = imageLoads.get(src);
  if (cached) return cached;

  const load = new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    if ("fetchPriority" in image) {
      image.fetchPriority = priority ? "high" : "low";
    }

    const finish = () => {
      loadedImages.add(src);
      resolve();
    };
    image.onload = finish;
    image.onerror = finish;
    image.src = src;

    if (image.complete) finish();
  });

  imageLoads.set(src, load);
  return load;
}

function getBeatImageSources(beat: StoryBeat): string[] {
  const sources = new Set<string>();

  for (const character of beat.characters ?? []) {
    if (character.image) sources.add(character.image);
  }

  const background = beat.background?.trim();
  if (background?.startsWith("/")) {
    sources.add(background);
  } else if (background) {
    for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      if (match[1]) sources.add(match[1]);
    }
  }

  return [...sources];
}

/**
 * Load every image used by the story before playback begins. The module-level
 * cache avoids re-requesting images across beats and visits to the same story.
 */
export async function preloadStoryAssets(story: StoryDefinition, openingBeat: StoryBeat): Promise<void> {
  const openingSources = getBeatImageSources(openingBeat);
  const openingSet = new Set(openingSources);
  const remainingSources = new Set<string>();

  for (const beat of story.beats) {
    for (const source of getBeatImageSources(beat)) {
      if (!openingSet.has(source)) remainingSources.add(source);
    }
  }

  await Promise.all(openingSources.map((source) => preloadImage(source, true)));

  const queue = [...remainingSources];
  let nextIndex = 0;
  const workerCount = Math.min(6, queue.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < queue.length) {
      const source = queue[nextIndex];
      nextIndex += 1;
      if (source) await preloadImage(source);
    }
  });

  await Promise.all(workers);
}


/** True when every image referenced by this story has already finished loading. */
export function areStoryAssetsLoaded(story: StoryDefinition, openingBeat: StoryBeat): boolean {
  const sources = new Set<string>();
  for (const beat of story.beats) {
    for (const source of getBeatImageSources(beat)) sources.add(source);
  }
  for (const source of getBeatImageSources(openingBeat)) sources.add(source);
  return [...sources].every((source) => loadedImages.has(source));
}
