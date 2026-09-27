import { defineConfig } from "@playwright/test";

// The smoke test drives the real dev server, because the endpoints under
// test are the dev server's. The port is not the default one, so a session
// already running `pnpm --filter playground dev` is not disturbed.
const PORT = 5174;

export default defineConfig({
  testDir: "tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  timeout: 120_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    browserName: "chromium",
    // Wide enough for the four frames to sit two by two beside the panel.
    viewport: { width: 1800, height: 1200 },
  },
  webServer: {
    // The host is stated, not left to `localhost`: on a runner where
    // localhost resolves to ::1 first, the server binds there and the
    // check below, which is IPv4, never reaches it. The output is piped
    // so that a server that fails to start says why in the test log.
    command: `pnpm exec vite --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
