import { defineConfig } from "vitest/config";

// Unit tests only; tests/ holds the Playwright smoke test, which needs a
// dev server and runs from `playwright test`.
export default defineConfig({
  test: { include: ["src/**/*.test.ts"] },
});
