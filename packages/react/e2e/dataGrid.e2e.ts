// DataGrid virtualisation in a real browser, against the built stories:
// only the rows and columns in view are in the DOM, positions stay right
// after a long scroll, and the pinned columns and the header stick.
import { expect, test, type Locator, type Page } from "@playwright/test";

const story = (id: string) => `/iframe.html?id=data-datagrid--${id}&viewMode=story`;

async function openGrid(page: Page, id: string, name: string) {
  await page.goto(story(id));
  const grid = page.getByRole("grid", { name });
  await expect(grid.getByRole("columnheader").first()).toBeVisible();
  return grid;
}

const rowIndices = (grid: Locator) =>
  grid.locator('[role="row"]').evaluateAll((rows) => rows.map((r) => Number(r.getAttribute("aria-rowindex"))));

test("of 50,000 rows and 31 columns, only those in view are in the DOM", async ({ page }) => {
  const grid = await openGrid(page, "fifty-thousand-rows", "Orders");
  await expect(grid).toHaveAttribute("aria-rowcount", "50001");
  await expect(grid).toHaveAttribute("aria-colcount", "31");
  const { visible, rows } = await grid.evaluate((el) => ({
    visible: Math.ceil(el.clientHeight / (el.querySelector('[role="row"]') as HTMLElement).offsetHeight),
    rows: el.querySelectorAll('[role="row"]').length,
  }));
  // The rows in view, four of overscan on each side at most, the header.
  expect(rows).toBeGreaterThanOrEqual(visible);
  expect(rows).toBeLessThanOrEqual(visible + 9);
  const cellsInFirstRow = await grid.locator('[role="row"][aria-rowindex="2"] > *').count();
  expect(cellsInFirstRow).toBeLessThan(31);
  expect(await rowIndices(grid)).toEqual(Array.from({ length: rows }, (_, i) => i + 1));
});

test("after scrolling to row 40,000 the rendered rows carry the right aria-rowindex", async ({ page }) => {
  const grid = await openGrid(page, "fifty-thousand-rows", "Orders");
  const rowHeight = await grid.evaluate((el) => (el.querySelector('[role="row"]') as HTMLElement).offsetHeight);
  // Row 40,000 (index 39,999) at the top of the body.
  await grid.evaluate((el, top) => (el.scrollTop = top), 39_999 * rowHeight);
  const target = grid.locator('[role="row"][aria-rowindex="40001"]');
  await expect(target).toBeVisible();
  await expect(target.getByRole("rowheader")).toHaveText("ORD-040000");
  const indices = await rowIndices(grid);
  expect(indices[0]).toBe(1);
  // The active cell's row (the first row, index 2) stays in the DOM while
  // it is scrolled away, so focus is never lost; the rest is one run.
  expect(indices[1]).toBe(2);
  const body = indices.slice(2);
  expect(body).toContain(40001);
  expect(body).toEqual(Array.from({ length: body.length }, (_, i) => body[0]! + i));
  expect(indices.length).toBeLessThan(40);
  // Each rendered row's index matches its order id: index n is ORD n - 1.
  const pairs = await grid.locator('[role="row"]:not([aria-rowindex="1"])').evaluateAll((rows) =>
    rows.map((r) => [Number(r.getAttribute("aria-rowindex")), r.querySelector('[role="rowheader"]')?.textContent]),
  );
  for (const [index, id] of pairs) expect(id).toBe(`ORD-${String(Number(index) - 1).padStart(6, "0")}`);
});

test("the keyboard reaches the last row and the far row stays in the DOM", async ({ page }) => {
  const grid = await openGrid(page, "fifty-thousand-rows", "Orders");
  await grid.locator('[data-cell="0:1"]').click();
  await page.keyboard.press("ControlOrMeta+End");
  const focused = page.locator(":focus");
  await expect(focused).toHaveAttribute("data-cell", "49999:30");
  await expect(focused.locator("xpath=..")).toHaveAttribute("aria-rowindex", "50001");
  await expect(focused).toBeInViewport();
  await page.keyboard.press("ControlOrMeta+Home");
  await expect(page.locator(":focus")).toHaveAttribute("data-cell", "0:0");
  expect((await rowIndices(grid)).length).toBeLessThan(40);
});

test("the header and the pinned columns stick while the grid scrolls", async ({ page }) => {
  const grid = await openGrid(page, "fifty-thousand-rows", "Orders");
  await grid.evaluate((el) => {
    el.scrollTop = 3000;
    el.scrollLeft = 1500;
  });
  const box = (await grid.boundingBox())!;
  const header = (await grid.getByRole("columnheader", { name: "Order" }).boundingBox())!;
  expect(Math.round(header.y)).toBe(Math.round(box.y));
  const firstRowHeader = grid.getByRole("rowheader").first();
  const pinned = (await firstRowHeader.boundingBox())!;
  // The selection column (40 px) and then the order column, at the start edge.
  expect(Math.round(pinned.x - box.x)).toBe(40);
});

test("in a right-to-left grid the pinned columns stick to the right edge", async ({ page }) => {
  const grid = await openGrid(page, "right-to-left", "الأوامر");
  await grid.evaluate((el) => (el.scrollLeft = -1200));
  await expect.poll(() => grid.evaluate((el) => el.scrollLeft)).toBeLessThan(-1000);
  const box = (await grid.boundingBox())!;
  const pinned = (await grid.getByRole("rowheader").first().boundingBox())!;
  expect(Math.round(box.x + box.width - (pinned.x + pinned.width))).toBe(40);
});
