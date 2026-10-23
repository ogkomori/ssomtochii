import type { StoryBeat, StoryDefinition } from "./types";

const imageLoads = new Map<string, Promise<void>>();

function preloadImage(src: string, priority = false): Promise<void> {
  const cached = imageLoads.get(src);
  if (cached) return cached;

  const load = new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    if ("fetchPriority" in image) {
      image.fetchPriority = priority ? "high" : "low";
    }

    const finish = () => resolve();
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
 * Load opening-frame assets first, then warm the rest without flooding the
 * connection with every image in the story at once. The module-level cache
 * avoids re-requesting images across beats and visits to the same story.
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
  const workerCount = Math.min(3, queue.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < queue.length) {
      const source = queue[nextIndex];
      nextIndex += 1;
      if (source) await preloadImage(source);
    }
  });

  void Promise.all(workers).catch(() => {
    // Image failures should not prevent the story from being played.
  });
}
