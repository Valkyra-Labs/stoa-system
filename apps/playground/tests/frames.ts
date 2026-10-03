// The preview has two frames, each showing one of four views. A test that
// has to see every view shows them two at a time.
import { expect, type Page } from "@playwright/test";

export const VIEW_LABELS: Record<string, string> = {
  "light-ltr": "Light, left to right",
  "light-rtl": "Light, right to left",
  "dark-ltr": "Dark, left to right",
  "dark-rtl": "Dark, right to left",
};

/** The views on load, then the other two: between them, all four. */
export const INITIAL_VIEWS: [string, string] = ["light-ltr", "dark-rtl"];
export const OTHER_VIEWS: [string, string] = ["light-rtl", "dark-ltr"];
export const VIEW_PAIRS = [INITIAL_VIEWS, OTHER_VIEWS];

/** Picks a view for one frame from its header's drop-down list. */
export async function showView(page: Page, slot: number, view: string) {
  const frame = page.locator(`[data-slot="${slot}"]`);
  await frame.locator(".stoa-select__button").click();
  await page.getByRole("option", { name: VIEW_LABELS[view] }).click();
  await expect(frame.locator(`[data-frame="${view}"]`)).toBeVisible();
}

export async function showViews(page: Page, [first, second]: [string, string]) {
  await showView(page, 1, first);
  await showView(page, 2, second);
}
