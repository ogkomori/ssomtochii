import { useEffect, useRef, useState } from "react";

type OutfitColour = "gold" | "green" | "red";

const COLOURS: Array<{ id: OutfitColour; label: string; hue: number; swatch: string }> = [
  { id: "gold", label: "Gold", hue: 46, swatch: "#d6a83f" },
  { id: "green", label: "Green", hue: 135, swatch: "#176b38" },
  { id: "red", label: "Red", hue: 2, swatch: "#c41625" },
];

// Replace these two placeholder files when the Pose 1 assets are uploaded.
const SOURCE_SPRITE = "/images/day-16/pose-1-neutral-gold.png";
const OUTFIT_MASK = "/images/day-16/pose-1-neutral-mask.png";

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l] as const;
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((value) => Math.round((value + m) * 255)) as [number, number, number];
}

export function Day16OutfitPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colour, setColour] = useState<OutfitColour>("gold");
  const [assetError, setAssetError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return;

    const sprite = new Image();
    const mask = new Image();
    sprite.src = SOURCE_SPRITE;
    mask.src = OUTFIT_MASK;

    const render = () => {
      if (cancelled || !sprite.complete || !mask.complete || !sprite.naturalWidth || !mask.naturalWidth) return;
      if (sprite.naturalWidth !== mask.naturalWidth || sprite.naturalHeight !== mask.naturalHeight) {
        setAssetError(true);
        return;
      }

      canvas.width = sprite.naturalWidth;
      canvas.height = sprite.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(sprite, 0, 0);
      const original = context.getImageData(0, 0, canvas.width, canvas.height);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;
      maskContext.drawImage(mask, 0, 0);
      const maskPixels = maskContext.getImageData(0, 0, canvas.width, canvas.height).data;
      const targetHue = COLOURS.find((item) => item.id === colour)?.hue ?? 46;

      for (let i = 0; i < original.data.length; i += 4) {
        const coverage = (maskPixels[i] / 255) * (maskPixels[i + 3] / 255);
        if (coverage <= 0) continue;
        const [h, s, l] = rgbToHsl(original.data[i], original.data[i + 1], original.data[i + 2]);
        if (s < 0.08) continue;
        const hue = colour === "gold" ? h : targetHue;
        const saturation = colour === "green" ? Math.max(s, 0.68) : colour === "red" ? Math.max(s, 0.82) : s;
        const lightness = colour === "green" ? l * 0.82 : l;
        const [r, g, b] = hslToRgb(hue, saturation, lightness);
        original.data[i] = Math.round(original.data[i] * (1 - coverage) + r * coverage);
        original.data[i + 1] = Math.round(original.data[i + 1] * (1 - coverage) + g * coverage);
        original.data[i + 2] = Math.round(original.data[i + 2] * (1 - coverage) + b * coverage);
      }
      context.putImageData(original, 0, 0);
      setAssetError(false);
    };

    const failed = () => { if (!cancelled) setAssetError(true); };
    sprite.onload = render;
    mask.onload = render;
    sprite.onerror = failed;
    mask.onerror = failed;
    if (sprite.complete && mask.complete) render();

    return () => { cancelled = true; };
  }, [colour]);

  return (
    <div className="mt-5 flex w-full flex-col items-center">
      <div className="flex min-h-40 w-full items-center justify-center rounded-2xl bg-[#f7edda]/70 p-3">
        {assetError ? (
          <p className="max-w-xs text-xs text-[#875f50]">Pose 1 sprite and mask placeholders are ready. Upload both files to preview the recolouring.</p>
        ) : (
          <canvas ref={canvasRef} aria-label={`Somto's birthday dress in ${colour}`} className="max-h-52 max-w-full object-contain" />
        )}
      </div>
      <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#a46b35]">BIRTHDAY OUTFIT PREVIEW</p>
      <div className="mt-2 flex items-center justify-center gap-3" aria-label="Choose dress colour">
        {COLOURS.map((option) => (
          <button key={option.id} type="button" onClick={() => setColour(option.id)} aria-pressed={colour === option.id}
            className={`rounded-full border-2 px-4 py-2 text-xs font-semibold transition ${colour === option.id ? "border-[#7d2630] bg-white text-[#7d2630] shadow-sm" : "border-transparent bg-white/60 text-[#875f50]"}`}>
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: option.swatch }} />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
