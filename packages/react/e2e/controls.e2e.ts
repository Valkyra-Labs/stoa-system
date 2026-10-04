// Controls in a real browser, against the built stories: sizes as drawn.
import { expect, test } from "@playwright/test";

const story = (id: string, globals = "") => `/iframe.html?id=${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`;

for (const [mode, globals] of [["left to right", ""], ["right to left", "dir:rtl;lang:ar"]] as const) {
  test(`a small Button is as tall as the small ChoiceGroup, Select and FilterChip, and at least 24 px, ${mode}`, async ({ page }) => {
    await page.goto(story("controls-inputs--button-small", globals));
    await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
    const heights = await page.evaluate(() =>
      [".stoa-button--small", ".stoa-choice-group--small > .stoa-choice", ".stoa-select--small .stoa-select__button", ".stoa-filter-chip--small"].map(
        (selector) => Math.round(document.querySelector(selector)!.getBoundingClientRect().height * 10) / 10,
      ),
    );
    expect(new Set(heights).size, heights.join(", ")).toBe(1);
    expect(heights[0]).toBeGreaterThanOrEqual(24);
    const sizes = await page.evaluate(() =>
      [".stoa-button--small", ".stoa-choice-group--small > .stoa-choice"].map((selector) => getComputedStyle(document.querySelector(selector)!).fontSize),
    );
    expect(sizes[0]).toBe(sizes[1]);
  });
}
