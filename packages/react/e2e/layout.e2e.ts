// The page frame and the scrollbars in a real browser, against the built
// stories: a fixed header that never moves, the page scrolling under it
// with the scrollbar below the header, and one scrollbar style everywhere.
import { expect, test, type Page } from "@playwright/test";

const story = (id: string, globals = "") => `/iframe.html?id=${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`;
const LONG_PAGE = "feedback-feedback-and-layout--page-shell-long-page";

async function openLongPage(page: Page, globals = "") {
  await page.goto(story(LONG_PAGE, globals));
  await expect(page.getByRole("banner")).toBeVisible();
  return page.locator(".stoa-page-shell__scroll");
}

test("the header stays at the top while the page scrolls under it", async ({ page }) => {
  const scroll = await openLongPage(page);
  const banner = page.getByRole("banner");
  const before = await banner.boundingBox();
  await scroll.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
  await expect(page.getByRole("contentinfo")).toBeInViewport();
  expect(await banner.boundingBox()).toEqual(before);
  // The document itself never scrolls: only the region under the header.
  const documentScrolls = await page.evaluate(() => document.scrollingElement!.scrollHeight > window.innerHeight);
  expect(documentScrolls).toBe(false);
});

test("the scrollbar starts below the header and has its own lane", async ({ page }) => {
  const scroll = await openLongPage(page);
  const header = (await page.getByRole("banner").boundingBox())!;
  const region = (await scroll.boundingBox())!;
  expect(region.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
  const lane = await scroll.evaluate((el) => (el as HTMLElement).offsetWidth - el.clientWidth);
  expect(lane).toBeGreaterThan(0);
});

test("the keyboard scrolls the page from the skip link", async ({ page }) => {
  const scroll = await openLongPage(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("PageDown");
  await expect.poll(() => scroll.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
});

for (const theme of ["light", "dark"]) {
  test(`every scrollbar uses the scrollbar tokens, thin, in ${theme}`, async ({ page }) => {
    const pages = [
      { id: LONG_PAGE, selector: ".stoa-page-shell__scroll" },
      { id: "layout-panel--scrolling", selector: ".stoa-scroll-area" },
      { id: "data-table--sticky-first-column", selector: ".stoa-table-region" },
      { id: "data-datagrid--fifty-thousand-rows", selector: ".stoa-data-grid__scroller" },
    ];
    for (const { id, selector } of pages) {
      await page.goto(story(id, `theme:${theme}`));
      const box = page.locator(selector).first();
      await expect(box).toBeVisible();
      const style = await box.evaluate((el) => {
        const probe = (name: string) => {
          const span = document.createElement("span");
          span.style.color = `var(${name})`;
          el.appendChild(span);
          const value = getComputedStyle(span).color;
          span.remove();
          return value;
        };
        const own = getComputedStyle(el);
        return {
          width: own.scrollbarWidth,
          color: own.scrollbarColor,
          expected: `${probe("--stoa-color-scrollbar-thumb")} ${probe("--stoa-color-scrollbar-track")}`,
        };
      });
      expect(style.width, id).toBe("thin");
      expect(style.color, id).toBe(style.expected);
    }
  });
}

test("the scroll keys scroll the page on load, with nothing focused", async ({ page }) => {
  const scroll = await openLongPage(page);
  await page.keyboard.press("PageDown");
  await expect.poll(() => scroll.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press("End");
  await expect(page.getByRole("contentinfo")).toBeInViewport();
  // Focus did not move: the keys scrolled the region, nothing took focus.
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
});

test("a key an application claims does not scroll the page", async ({ page }) => {
  const scroll = await openLongPage(page);
  await page.evaluate(() =>
    document.addEventListener("keydown", (e) => {
      if (e.key === " ") e.preventDefault();
    }),
  );
  await page.keyboard.press("Space");
  await page.waitForTimeout(300);
  expect(await scroll.evaluate((el) => el.scrollTop)).toBe(0);
  await page.keyboard.press("PageDown");
  await expect.poll(() => scroll.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
});
