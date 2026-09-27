import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tokenServer } from "./server/tokenServer.ts";

// `vite build` exists only as a check that the app compiles: the playground
// is a development tool and its endpoints live in the dev server.
export default defineConfig({
  plugins: [react(), tokenServer()],
  server: { port: 5173 },
});
