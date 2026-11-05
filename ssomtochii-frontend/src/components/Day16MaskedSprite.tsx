import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

export function Day16MaskedSprite({
  image,
  mask,
  colour,
  className,
  style,
}: {
  image: string;
  mask: string;
  colour: "green" | "red";
  className: string;
  style: CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return;
    const sprite = new Image();
    const maskImage = new Image();
    const fail = () => {
      if (!cancelled) console.error("Unable to load Day 16 outfit sprite or mask:", image, mask);
    };
    const render = () => {
      if (cancelled || !sprite.complete || !maskImage.complete || !sprite.naturalWidth || !maskImage.naturalWidth) return;
      if (sprite.naturalWidth !== maskImage.naturalWidth || sprite.naturalHeight !== maskImage.naturalHeight) {
        console.error("Day 16 sprite and mask dimensions do not match:", image, mask);
        return;
      }
      canvas.width = sprite.naturalWidth;
      canvas.height = sprite.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(sprite, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;
      maskContext.drawImage(maskImage, 0, 0);
      const maskPixels = maskContext.getImageData(0, 0, canvas.width, canvas.height).data;
      const targetHue = colour === "green" ? 135 : 2;
      for (let i = 0; i < pixels.data.length; i += 4) {
        const coverage = (maskPixels[i] / 255) * (maskPixels[i + 3] / 255);
        if (coverage <= 0) continue;
        const r = pixels.data[i] / 255;
        const g = pixels.data[i + 1] / 255;
        const b = pixels.data[i + 2] / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const lightness = (max + min) / 2;
        const delta = max - min;
        const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
        if (saturation < 0.08) continue;
        const sat = colour === "green" ? Math.max(saturation, 0.68) : Math.max(saturation, 0.82);
        const adjustedLightness = colour === "green" ? lightness * 0.82 : lightness;
        const chroma = (1 - Math.abs(2 * adjustedLightness - 1)) * sat;
        const x = chroma * (1 - Math.abs(((targetHue / 60) % 2) - 1));
        const m = adjustedLightness - chroma / 2;
        const rgb = targetHue < 60 ? [chroma, x, 0] : targetHue < 120 ? [x, chroma, 0] : [0, chroma, x];
        for (let channel = 0; channel < 3; channel++) {
          const recoloured = (rgb[channel] + m) * 255;
          pixels.data[i + channel] = Math.round(pixels.data[i + channel] * (1 - coverage) + recoloured * coverage);
        }
      }
      context.putImageData(pixels, 0, 0);
    };
    sprite.onload = render;
    maskImage.onload = render;
    sprite.onerror = fail;
    maskImage.onerror = fail;
    sprite.src = image;
    maskImage.src = mask;
    if (sprite.complete && maskImage.complete) render();
    return () => { cancelled = true; };
  }, [image, mask, colour]);

  return <div className={className} role="img" aria-label={colour === "green" ? "Somto wearing her green birthday outfit" : "Somto wearing her red birthday outfit"} style={style}>
    <canvas ref={canvasRef} className="h-full w-full object-contain object-bottom" />
  </div>;
}
