// Builds render/check.tsx for Node, for the headless renderer check
// (owner-coding/check-render.mjs).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  root: here,
  plugins: [react()],
  logLevel: "warn",
  ssr: { noExternal: true },
  build: { ssr: `${here}check.tsx`, outDir: `${here}../render-dist/check`, emptyOutDir: true },
});
