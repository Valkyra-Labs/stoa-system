// The acceptance test of brief 06, the verification panel: an override
// that breaks a text pair shows a new failure in the browser checks, and
// resetting it clears the failure. `smoke.spec.ts` covers the rest of the
// playground; this file is the in-browser checks' own scenario.
import { expect, test } from "@playwright/test";

const TOKEN = "semantic.light:color.text";
// text on surface needs 7:1 (AAA); this is close to the surface colour, so
// the pair fails without needing to know the surface's exact value.
const BROKEN_VALUE = "oklch(0.98 0.002 250)";

test("an override that breaks a text pair shows a new failure, and resetting it clears the failure", async ({ page }) => {
  await page.goto("/");
  const checks = page.getByTestId("browser-checks");
  await expect(checks).toBeVisible();

  const failedRow = checks.locator('tr[data-check="text-contrast/light/text-on-surface"]');
  await expect(failedRow).toHaveAttribute("data-status", "pass");
  await expect(checks.locator('[data-status="new"]')).toHaveCount(0);

  await page.locator(`[data-token="${TOKEN}"] input`).fill(BROKEN_VALUE);

  await expect(failedRow).toHaveAttribute("data-status", "new");
  await expect.poll(() => checks.locator('[data-status="new"]').count()).toBeGreaterThan(0);

  // Selecting the failure highlights the token it reads.
  await failedRow.getByRole("button", { name: "Highlight" }).click();
  await expect(page.locator(`[data-token="${TOKEN}"]`)).toHaveAttribute("data-highlighted", "true");

  await page.locator(`[data-override="${TOKEN}"]`).getByRole("button", { name: "Reset" }).click();

  await expect(failedRow).toHaveAttribute("data-status", "pass");
  await expect(checks.locator('[data-status="new"]')).toHaveCount(0);
});

test("the new-only filter hides everything but new failures", async ({ page }) => {
  await page.goto("/");
  const checks = page.getByTestId("browser-checks");
  await expect(checks).toBeVisible();
  await expect(checks.locator("tbody tr")).not.toHaveCount(0);

  await page.locator(`[data-token="${TOKEN}"] input`).fill(BROKEN_VALUE);
  await expect.poll(() => checks.locator('[data-status="new"]').count()).toBeGreaterThan(0);
  const newCount = await checks.locator('[data-status="new"]').count();

  await checks.getByRole("radio", { name: "New only" }).click();
  await expect(checks.locator("tbody tr")).toHaveCount(newCount);
  for (const row of await checks.locator("tbody tr").all()) await expect(row).toHaveAttribute("data-status", "new");
});

test("each frame offers a colour-vision preview", async ({ page }) => {
  await page.goto("/");
  const frame = page.locator('[data-frame="light-ltr"]');
  await expect(frame).toHaveAttribute("data-cvd", "none");

  await page.getByRole("radio", { name: "Deutan" }).first().click();
  await expect(frame).toHaveAttribute("data-cvd", "deuteranopia");
  await expect(frame).toHaveCSS("filter", /url\("?#pg-cvd-deuteranopia"?\)/);
});

test("logs how long one full check run took, for the acceptance record", async ({ page }) => {
  await page.goto("/");
  const cost = page.getByTestId("browser-checks-cost");
  await expect(cost).toBeVisible();
  const text = (await cost.textContent()) ?? "";
  console.log(`brief 06 acceptance: ${text.trim()}`);
  expect(text).toMatch(/\d+ checks in [\d.]+ ms/);
});
