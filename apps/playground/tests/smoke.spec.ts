// The acceptance test of brief 04: the app loads, one colour override
// reaches every view and can be reset, and the dev server's build
// endpoint really builds and tests the token package.
import { expect, test, type Page } from "@playwright/test";
import { INITIAL_VIEWS, OTHER_VIEWS, VIEW_PAIRS, showViews } from "./frames";

/** The side panel is tabbed; a control is reachable once its tab is open. */
const openTab = (page: Page, name: string | RegExp) => page.getByRole("tab", { name }).click();

/** A primitive both themes reference (`--stoa-color-warning` in each), so
 * one edit has to show up in every view. */
const TOKEN = "primitive:color.amber.500";
const BASE_VALUE = "oklch(0.78 0.15 80)";
const EDITED_VALUE = "oklch(0.55 0.2 300)";

const warningVariable = (page: Page, frame: string) =>
  page
    .locator(`[data-frame="${frame}"]`)
    .evaluate((element) => getComputedStyle(element).getPropertyValue("--stoa-color-warning").trim());

const badgeColor = (page: Page, frame: string) =>
  page
    .locator(`[data-frame="${frame}"] .stoa-badge--warning > span`)
    .first()
    .evaluate((element) => getComputedStyle(element).color);

test("loads two frames of the same dense screen, which show all four views between them", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Stoa playground", level: 1 })).toBeVisible();
  await expect(page.locator("[data-frame]")).toHaveCount(2);

  for (const pair of VIEW_PAIRS) {
    await showViews(page, pair);
    for (const frame of pair) {
      const body = page.locator(`[data-frame="${frame}"]`);
      await expect(body).toHaveAttribute("data-theme", frame.startsWith("dark") ? "dark" : "light");
      await expect(body).toHaveAttribute("dir", frame.endsWith("rtl") ? "rtl" : "ltr");
      // The canvases are sized by layout, so a drawn ladder means the frame
      // is at a real width, not collapsed.
      const box = await body.locator(".stoa-ladder__canvas").boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(150);
      // The stream is running: the tape fills after the first frame.
      await expect(body.locator(".stoa-table tbody tr").first()).toBeVisible();
    }
  }

  await openTab(page, /^Overrides/);
  await expect(page.locator('[data-override-count="0"]')).toBeVisible();
});

test("one colour override reaches every view, and reset undoes it", async ({ page }) => {
  await page.goto("/");
  const shown = INITIAL_VIEWS;
  const other = OTHER_VIEWS;
  const before = await Promise.all(shown.map((frame) => badgeColor(page, frame)));
  for (const frame of shown) expect(await warningVariable(page, frame)).toBe(BASE_VALUE);

  await openTab(page, "Tokens");
  await page.locator(`[data-token="${TOKEN}"] input`).fill(EDITED_VALUE);

  for (const [index, frame] of shown.entries()) {
    await expect
      .poll(() => warningVariable(page, frame), { message: `${frame} takes the override` })
      .toBe(EDITED_VALUE);
    expect(await badgeColor(page, frame)).not.toBe(before[index]);
  }
  // A view picked after the edit shows it too.
  await showViews(page, other);
  for (const frame of other) expect(await warningVariable(page, frame)).toBe(EDITED_VALUE);
  await showViews(page, shown);

  // The override is marked on the control and listed with its derived value.
  await expect(page.locator(`[data-token="${TOKEN}"]`)).toHaveAttribute("data-overridden", "true");
  await expect(page.locator(`[data-token="${TOKEN}"]`)).toContainText("Override detected");
  const row = page.locator(`[data-override="${TOKEN}"]`);
  await openTab(page, /^Overrides/);
  await expect(row).toContainText(BASE_VALUE);
  await expect(row).toContainText(EDITED_VALUE);
  await expect(page.locator('[data-override-count="1"]')).toBeVisible();

  await row.getByRole("button", { name: "Reset" }).click();

  await expect(page.locator('[data-override-count="0"]')).toBeVisible();
  for (const [index, frame] of shown.entries()) {
    await expect.poll(() => warningVariable(page, frame)).toBe(BASE_VALUE);
    expect(await badgeColor(page, frame)).toBe(before[index]);
  }
  await expect(page.locator(`[data-token="${TOKEN}"]`)).not.toHaveAttribute("data-overridden", "true");
});

test("the build endpoint builds and tests the unmodified base", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "Checks");
  await page.getByRole("button", { name: "Build and test" }).click();

  const results = page.getByTestId("build-results");
  await expect(results).toBeVisible({ timeout: 90_000 });
  await expect(page.getByTestId("build-status")).toContainText("passed");
  await expect(page.getByTestId("test-status")).toContainText("passed");
  await expect(page.getByTestId("test-output")).toContainText("pass");
  // The values the previews are using are the values the build emitted.
  await expect(page.getByTestId("agreement-status")).toContainText("agrees on");

  // The verdict is about the files it was taken on: an edit retires it
  // rather than leaving a "passed" beside tokens that have since changed.
  await openTab(page, "Tokens");
  await page.locator(`[data-token="${TOKEN}"] input`).fill(EDITED_VALUE);
  await openTab(page, "Checks");
  await expect(results).toBeHidden();
});

test("saving refuses to write over the committed baseline", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "Snapshot");
  await page.getByRole("textbox", { name: "Snapshot name" }).fill("stoa-today");
  await page.getByRole("button", { name: "Save snapshot" }).click();

  // Refused with no way to force it: the file is the base of every override.
  await expect(page.getByText("is never written over")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Replace/ })).toHaveCount(0);
});
