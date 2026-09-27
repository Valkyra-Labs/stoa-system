// Builds the sandboxed renderer as one classic script, so the opaque-origin
// iframe can load it without CORS.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  root: here,
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: `${here}../render-dist`,
    emptyOutDir: true,
    copyPublicDir: false,
    lib: { entry: `${here}main.tsx`, formats: ["iife"], name: "StoaRender", fileName: () => "render.iife.js" },
  },
});
