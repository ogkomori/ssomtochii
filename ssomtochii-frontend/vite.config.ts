// @lovable.dev/vite-tanstack-config provides the TanStack Start, React, Tailwind,
// Nitro, path-alias, and development-preview plugins. Do not register them twice.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
  },
  // Lovable's preview uses its managed target; Vercel needs Nitro's Vercel output.
  // Outside Vercel, explicitly enable Nitro for a deployable production build.
  nitro: isVercel ? { preset: "vercel" } : true,
  tanstackStart: {
    // Preserve the SSR error wrapper used by this project.
    server: { entry: "server" },
  },
});
