import type { StoryBeat, StoryDefinition } from "./types";

const imageLoads = new Map<string, Promise<void>>();
const loadedImages = new Set<string>();

function preloadImage(src: string, priority = false): Promise<void> {
  if (loadedImages.has(src)) return Promise.resolve();

  const cached = imageLoads.get(src);
  if (cached) return cached;

  let finish!: (success: boolean) => void;
  let settled = false;
  const load = new Promise<void>((resolve) => {
    finish = (success) => {
      if (settled) return;
      settled = true;
      if (success) {
        loadedImages.add(src);
      } else {
        // Don't permanently cache a failed request; a later visit can retry.
        imageLoads.delete(src);
      }
      resolve();
    };
  });

  imageLoads.set(src, load);
  const image = new Image();
  image.decoding = "async";
  if ("fetchPriority" in image) {
    image.fetchPriority = priority ? "high" : "low";
  }

  image.onload = () => {
    // Wait for decode where supported so the first visible frame is less likely
    // to flash while the browser decodes a large character sprite.
    if (typeof image.decode === "function") {
      void image.decode().then(
        () => finish(true),
        () => finish(image.naturalWidth > 0),
      );
    } else {
      finish(image.naturalWidth > 0);
    }
  };
  image.onerror = () => finish(false);
  image.src = src;

  if (image.complete) finish(image.naturalWidth > 0);
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
 * Load every image used by a story before playback begins. The module-level
 * cache deduplicates requests across the welcome screen, story playback, and
 * later visits. The opening scene is prioritised; the rest are fetched with a
 * small concurrency limit to avoid overwhelming mobile connections.
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
  const workerCount = Math.min(4, queue.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < queue.length) {
      const source = queue[nextIndex];
      nextIndex += 1;
      if (source) await preloadImage(source);
    }
  });

  await Promise.all(workers);
}

/** True only when every image referenced by this story loaded and decoded. */
export function areStoryAssetsLoaded(story: StoryDefinition, openingBeat: StoryBeat): boolean {
  const sources = new Set<string>();
  for (const beat of story.beats) {
    for (const source of getBeatImageSources(beat)) sources.add(source);
  }
  for (const source of getBeatImageSources(openingBeat)) sources.add(source);
  return [...sources].every((source) => loadedImages.has(source));
}
