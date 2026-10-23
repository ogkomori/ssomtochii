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
  if ("fetchPriority" in image) image.fetchPriority = priority ? "high" : "low";

  image.onload = () => {
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

/** True when the opening scene's images have loaded successfully. */
export function areStoryAssetsLoaded(_story: StoryDefinition, openingBeat: StoryBeat): boolean {
  return getBeatImageSources(openingBeat).every((source) => loadedImages.has(source));
}

/**
 * Prioritise the opening scene so playback can begin quickly, then warm the
 * remaining scene assets in the background. A later scene should never keep
 * the entire story blocked behind a slow or missing image.
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

  // Only the first scene is a hard gate. Failed requests resolve too, so a
  // missing asset can't leave the player stuck on its loading screen.
  await Promise.all(openingSources.map((source) => preloadImage(source, true)));

  // Continue warming later scenes without making StoryPlayer wait for every
  // image in the full story before it can render.
  const queue = [...remainingSources];
  let nextIndex = 0;
  const workerCount = Math.min(3, queue.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < queue.length) {
      const source = queue[nextIndex++];
      if (source) await preloadImage(source);
    }
  });
  void Promise.all(workers);
}
