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
 * Prioritise the opening frame, then warm the remaining story assets in the
 * background. The module-level cache avoids re-requesting images across beats
 * and across visits to the same story.
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
  void Promise.all([...remainingSources].map((source) => preloadImage(source))).catch(() => {
    // Image failures should not prevent the story from being played.
  });
}
