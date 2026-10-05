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

/** The left edges of the first occurrence of each substring in an
 * element's text, in CSS pixels. */
function lefts(element: Locator, parts: string[]) {
  return element.evaluate((el, wanted) => {
    const node = el.firstChild!;
    const text = node.textContent ?? "";
    return wanted.map((part) => {
      const range = document.createRange();
      const at = text.indexOf(part);
      range.setStart(node, at);
      range.setEnd(node, at + part.length);
      return range.getBoundingClientRect().left;
    });
  }, parts);
}

test("ProgressBar keeps an English value text in reading order in a right-to-left frame", async ({ page }) => {
  await page.goto(story("feedback-feedback-and-layout--progress-bytes", "dir:rtl;lang:en"));
  const value = page.locator(".stoa-progress__value");
  await expect(value).toHaveText("⁨1.8 MB⁩ of ⁨4.8 MB⁩");
  const [first, of, total] = await lefts(value, ["1.8 MB", "of", "4.8 MB"]);
  expect(first).toBeLessThan(of!);
  expect(of).toBeLessThan(total!);
});

test("ProgressBar keeps an Arabic value text right to left", async ({ page }) => {
  await page.goto(story("feedback-feedback-and-layout--progress-bytes", "dir:rtl;lang:ar"));
  const value = page.locator(".stoa-progress__value");
  const text = (await value.textContent()) ?? "";
  const [amount, total] = text.split(" من ");
  const [first, , last] = await lefts(value, [amount!.replace(/[\u2068\u2069]/g, ""), "من", total!.replace(/[\u2068\u2069]/g, "")]);
  expect(first).toBeGreaterThan(last!);
});
