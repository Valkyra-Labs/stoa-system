// Mixed directions in a real browser, against the built stories: where
// the bidi algorithm actually draws each part of a line.
import { expect, test, type Locator } from "@playwright/test";

const story = (id: string, globals = "") => `/iframe.html?id=${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`;

/** The left edge of the drawn text of an element, in CSS pixels. */
const left = (element: Locator) => element.evaluate((el) => el.getBoundingClientRect().left);

test("LogView keeps an Arabic time and level at the left of their line, in that order, in a right-to-left page", async ({ page }) => {
  await page.goto(story("overlays-lists-and-content--log-arabic", "dir:rtl;lang:ar"));
  const lines = page.locator(".stoa-code__line");
  await expect(lines).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const line = lines.nth(i);
    const time = await left(line.locator(".stoa-code__time"));
    const level = await left(line.locator(".stoa-code__level"));
    const message = await left(line.locator("bdi").last());
    expect(time, `line ${i + 1}`).toBeLessThan(level);
    expect(level, `line ${i + 1}`).toBeLessThan(message);
  }
});
