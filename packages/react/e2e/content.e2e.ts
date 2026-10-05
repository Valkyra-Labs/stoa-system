// Tooltip, DescriptionList and RecordList in a real browser, against the
// built stories: the keyboard, a touch screen, and right to left.
import { expect, test } from "@playwright/test";

const story = (id: string, globals = "") => `/iframe.html?id=overlays-lists-and-content--${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`;

test("a tooltip opens on keyboard focus, describes its term, and closes on Escape", async ({ page }) => {
  await page.goto(story("tooltip-closed"));
  const term = page.getByRole("button", { name: "YTM" });
  // Start from the paragraph before the term, as a reader would.
  await page.getByText("of this bond").click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("Tab");
  await expect(term).toBeFocused();
  const tip = page.getByRole("tooltip");
  await expect(tip).toHaveText(/Yield to maturity/);
  await expect(term).toHaveAccessibleDescription(/Yield to maturity/);
  await page.keyboard.press("Escape");
  await expect(tip).toHaveCount(0);
});

test.describe("on a touch screen", () => {
  test.use({ hasTouch: true });
  test("a tooltip opens on a tap on its term and closes on a tap elsewhere", async ({ page }) => {
    await page.goto(story("tooltip-closed"));
    await page.getByRole("button", { name: "YTM" }).tap();
    await expect(page.getByRole("tooltip")).toBeVisible();
    await page.getByText("of this bond").tap({ position: { x: 1, y: 1 } });
    await expect(page.getByRole("tooltip")).toHaveCount(0);
  });
});

test("an open tooltip sits below its term, inside the window, in both directions", async ({ page }) => {
  for (const globals of ["", "dir:rtl;lang:ar"]) {
    await page.goto(story("tooltip-open", globals));
    const term = (await page.getByRole("button", { name: "day count" }).boundingBox())!;
    const tip = (await page.getByRole("tooltip").boundingBox())!;
    expect(tip.y, globals).toBeGreaterThanOrEqual(term.y + term.height);
    expect(tip.x, globals).toBeGreaterThanOrEqual(0);
  }
});

test("a description list puts its terms at the start edge: left, and right in a right-to-left page", async ({ page }) => {
  for (const [globals, termFirst] of [["", true], ["dir:rtl;lang:ar", false]] as const) {
    await page.goto(story("description-columns", globals));
    const term = (await page.getByRole("term").first().boundingBox())!;
    const value = (await page.getByRole("definition").first().boundingBox())!;
    expect(term.x < value.x, globals).toBe(termFirst);
    expect(Math.abs(term.y - value.y), globals).toBeLessThan(2);
  }
});

test("a record list picks with the keyboard and shows the pick in the detail", async ({ page }) => {
  await page.goto(story("record-list-with-detail", "dir:rtl;lang:ar"));
  const list = page.getByRole("listbox", { name: "Bonds" });
  await list.getByRole("option", { name: "RU000A1001" }).click();
  await page.keyboard.press("ArrowDown");
  await expect(list.getByRole("option", { name: "RU000A1002" })).toBeFocused();
  // The disabled record is skipped.
  await page.keyboard.press("ArrowDown");
  await expect(list.getByRole("option", { name: "XS0000004" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(list.getByRole("option", { name: "XS0000004" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "XS0000004" })).toBeVisible();
  // The bar marks the picked row at its start edge: the right in right to left.
  const bar = await list.getByRole("option", { name: "XS0000004" }).evaluate((el) => {
    const style = getComputedStyle(el);
    return { right: style.borderRightWidth, left: style.borderLeftWidth };
  });
  expect(parseFloat(bar.right)).toBeGreaterThan(parseFloat(bar.left));
});
