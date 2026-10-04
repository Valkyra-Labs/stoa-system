// Overlays open inside the frame they were opened from: a dialog, a sheet,
// an alert dialog, the shortcuts dialog and toasts, opened in the dark
// right-to-left frame, are in that frame and take its theme, direction,
// density, motion and locale, not the document's.
import { expect, test, type Locator, type Page } from "@playwright/test";
import { showLanguage, showScreen } from "./frames";

const darkFrame = (page: Page) => page.locator('[data-slot="2"] [data-frame]');

/** A custom property as the box resolves it. */
const tokenOf = (box: Locator, name: string) => box.evaluate((element, n) => getComputedStyle(element).getPropertyValue(n).trim(), name);

async function expectInside(inner: Locator, outer: Locator) {
  const a = (await inner.boundingBox())!;
  const b = (await outer.boundingBox())!;
  expect(a.x).toBeGreaterThanOrEqual(b.x - 0.5);
  expect(a.y).toBeGreaterThanOrEqual(b.y - 0.5);
  expect(a.x + a.width).toBeLessThanOrEqual(b.x + b.width + 0.5);
  expect(a.y + a.height).toBeLessThanOrEqual(b.y + b.height + 0.5);
}

test("a dialog opened in the dark right-to-left frame is inside it, dark, right to left, dense and in its language", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radiogroup", { name: "Density" }).getByRole("radio", { name: "compact" }).click();
  await showScreen(page, "overlays");
  const frame = darkFrame(page);
  await expect(frame).toHaveAttribute("data-frame", "dark-rtl");
  await showLanguage(page, 2, "ar");
  await page.locator('[data-slot="2"]').getByRole("button", { name: "Reduced motion" }).click();

  const trigger = frame.getByRole("button", { name: "تفاصيل الأمر" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "الأمر ORD-000214" });
  await expect(dialog).toBeVisible();

  // In the frame's own overlay container, not at the end of the body.
  await expect(frame.getByRole("dialog")).toHaveCount(1);
  await expect(page.locator("body > .stoa-overlay")).toHaveCount(0);
  await expect(page.locator('[data-slot="1"]').getByRole("dialog")).toHaveCount(0);
  await expectInside(dialog, frame);

  // Right to left, and dark: the modal is drawn in the frame's surface,
  // which is not the light document's.
  await expect(dialog).toHaveCSS("direction", "rtl");
  const modal = frame.locator(".stoa-modal");
  const surface = await tokenOf(frame, "--stoa-color-surface");
  expect(await modal.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(surface);
  expect(surface).not.toBe(await tokenOf(page.locator('[data-slot="1"] [data-frame]'), "--stoa-color-surface"));
  // The frame's density (compact) and motion (reduced), not the document's.
  expect(await tokenOf(modal, "--stoa-density-font-size")).toBe(await tokenOf(frame, "--stoa-density-font-size"));
  expect(await tokenOf(modal, "--stoa-density-font-size")).not.toBe(await tokenOf(page.locator("html"), "--stoa-density-font-size"));
  expect(await tokenOf(modal, "--stoa-motion-duration-base")).toBe("0ms");
  // Stoa's own words in the frame's language.
  await expect(dialog.getByRole("button", { name: "إغلاق" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("a sheet comes from the frame's inline end, and the alert and shortcuts dialogs open in their frame", async ({ page }) => {
  await page.goto("/");
  await showScreen(page, "overlays");
  const frame = darkFrame(page);

  await frame.getByRole("button", { name: "Filters" }).click();
  const sheet = frame.locator(".stoa-sheet");
  await expect(sheet).toBeVisible();
  // Right to left, the inline end is the frame's left edge.
  const box = (await frame.locator(".pg-frame__overlay-box").boundingBox())!;
  await expect.poll(async () => Math.round((await sheet.boundingBox())!.x)).toBe(Math.round(box.x));
  await expectInside(sheet, frame);
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);

  await frame.getByRole("button", { name: "Cancel all orders" }).click();
  const alert = frame.getByRole("alertdialog");
  await expect(alert).toBeVisible();
  await expect(alert).toHaveCSS("direction", "rtl");
  // The safe action has the focus.
  await expect(alert.getByRole("button", { name: "Keep orders" })).toBeFocused();
  await page.keyboard.press("Escape");

  // The shortcut opens the list in the frame that has the focus.
  await frame.getByRole("button", { name: "Order details" }).focus();
  await page.keyboard.press("?");
  const shortcuts = frame.getByRole("dialog", { name: "Keyboard shortcuts" });
  await expect(shortcuts).toBeVisible();
  await expect(shortcuts.locator(".stoa-kbd").first()).toBeVisible();
  await expect(page.locator('[data-slot="1"]').getByRole("dialog")).toHaveCount(0);
  await page.keyboard.press("Escape");
});

test("a toast raised in the dark right-to-left frame appears in that frame's end corner", async ({ page }) => {
  await page.goto("/");
  await showScreen(page, "feedback");
  const frame = darkFrame(page);
  await frame.getByRole("button", { name: "Report a rejection" }).click();
  const region = frame.locator(".stoa-toast-region");
  await expect(region.locator(".stoa-toast--negative")).toBeVisible();
  await expect(page.locator("body > .stoa-toast-region")).toHaveCount(0);
  await expect(region).toHaveCSS("direction", "rtl");
  await expectInside(region, frame);
  // The end corner, right to left: the frame's left side.
  const area = (await frame.locator(".pg-frame__overlay-box").boundingBox())!;
  const toast = (await region.boundingBox())!;
  expect(toast.x - area.x).toBeLessThan(area.x + area.width - (toast.x + toast.width));
  const surface = await tokenOf(frame, "--stoa-color-surface");
  expect(await region.locator(".stoa-toast").first().evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(surface);
  await region.getByRole("button", { name: "Dismiss" }).click();
  await expect(region.locator(".stoa-toast")).toHaveCount(0);
});
