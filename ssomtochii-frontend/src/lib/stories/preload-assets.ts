import type { StoryBeat, StoryDefinition } from "./types";

const imageLoads = new Map<string, Promise<void>>();
const loadedImages = new Set<string>();
const imageAspectRatios = new Map<string, number>();

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

  const recordDimensions = () => {
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      imageAspectRatios.set(src, image.naturalWidth / image.naturalHeight);
    }
  };

  image.onload = () => {
    recordDimensions();
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

  if (image.complete) {
    recordDimensions();
    finish(image.naturalWidth > 0);
  }
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

  // The phone scene includes this profile image outside the character list.
  if (beat.scene === "phone") {
    const contactName = beat.phone?.contactName ?? "Tega";
    const contactImage = beat.phone?.contactImage
      ?? (contactName.trim().toLowerCase() === "tega" ? "/images/tega-profile.png" : undefined);
    if (contactImage) sources.add(contactImage);
  }

  return [...sources];
}

/** Return a decoded image's intrinsic width-to-height ratio, when available. */
export function getImageAspectRatio(src: string): number | undefined {
  return imageAspectRatios.get(src);
}

/** Check whether all images for one scene have loaded successfully. */
export function areBeatAssetsLoaded(beat: StoryBeat): boolean {
  return getBeatImageSources(beat).every((source) => loadedImages.has(source));
}

/** Ensure one scene's images are loaded and decoded before it is displayed. */
export async function preloadBeatAssets(beat: StoryBeat, priority = true): Promise<void> {
  await Promise.all(getBeatImageSources(beat).map((source) => preloadImage(source, priority)));
}

/**
 * Prioritise the opening scene so playback can begin quickly, then warm later
 * scene assets in story order in the background. Per-scene loading remains
 * available as a fallback when the user reaches a scene before it is ready.
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

  // Start the opening images at high priority, but don't wait for them before
  // starting the background queue. That way, later scenes begin downloading as
  // soon as the day is opened, while the opening scene still gets priority.
  const openingLoads = Promise.all(
    openingSources.map((source) => preloadImage(source, true)),
  );

  const queue = [...remainingSources];
  let nextIndex = 0;
  const workerCount = Math.min(3, queue.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < queue.length) {
      const source = queue[nextIndex++];
      if (source) await preloadImage(source);
    }
  });

  // Background downloads continue independently; only the opening scene is
  // awaited by callers, and per-scene loading remains the safety net.
  void Promise.all(workers);
  await openingLoads;
}
