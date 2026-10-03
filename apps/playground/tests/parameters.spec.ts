// The acceptance test of brief 05: a preset puts the parameter model under
// the previews, the clamps it applied are shown, the override layer still
// sits on top, and turning the model off brings the built tokens back.
import { rm } from "node:fs/promises";
import { PRESETS, deriveTokens, type DerivedTokens, type Theme } from "@valkyra-labs/stoa-tokens/model";
import { expect, test, type Page } from "@playwright/test";
import { VIEW_PAIRS, showViews } from "./frames";

/** The side panel is tabbed; a control is reachable once its tab is open. */
const openTab = (page: Page, name: string | RegExp) => page.getByRole("tab", { name }).click();

/** The one snapshot this file writes. It is a test artefact, not a saved
 * design, so it is removed again whatever the run does. */
const WRITTEN_SNAPSHOT = new URL("../snapshots/brief-05-studio.json", import.meta.url);
test.afterAll(async () => {
  await rm(WRITTEN_SNAPSHOT, { force: true });
});

/** What Stoa ships today for the light page background, and what
 * Broadsheet's paper derives to. The second is read from the model rather
 * than typed in, so the test cannot drift from the derivation. */
const TODAY_BG = "oklch(0.985 0.002 250)";
const BROADSHEET = deriveTokens(PRESETS.broadsheet.parameters);

/** One token of a derived tree. A name the model does not emit is an
 * error here rather than a comparison against nothing. */
function derived(tree: DerivedTokens, theme: Theme, name: string): string {
  const value = tree.themes[theme][name];
  if (value === undefined) throw new Error(`the model emitted no ${name} for the ${theme} theme`);
  return value;
}

const variable = (page: Page, frame: string, name: string) =>
  page
    .locator(`[data-frame="${frame}"]`)
    .evaluate((element, property) => getComputedStyle(element).getPropertyValue(property).trim(), name);

/** The preset picker. A ChoiceGroup with single selection is a radio
 * group, so its entries are radios rather than buttons. */
const preset = (page: Page, label: string) =>
  page.getByRole("radiogroup", { name: "Preset" }).getByRole("radio", { name: label });

test("a preset derives every token, and the clamps it applied are listed", async ({ page }) => {
  await page.goto("/");
  expect(await variable(page, "light-ltr", "--stoa-color-bg")).toBe(TODAY_BG);

  await preset(page, "Broadsheet").click();

  await expect
    .poll(() => variable(page, "light-ltr", "--stoa-color-bg"), { message: "the light frames take the derived paper" })
    .toBe(derived(BROADSHEET, "light", "color-bg"));
  expect(await variable(page, "dark-rtl", "--stoa-color-bg")).toBe(derived(BROADSHEET, "dark", "color-bg"));
  // Rule surfaces: the panel is the page tone, separated by a hairline.
  expect(await variable(page, "light-ltr", "--stoa-color-surface")).toBe(derived(BROADSHEET, "light", "color-bg"));
  expect(await variable(page, "light-ltr", "--stoa-radius-sm")).toBe("0px");

  const clamps = page.getByTestId("clamps");
  await expect(clamps).toBeVisible();
  await expect(clamps.locator("li")).toHaveCount(BROADSHEET.clamps.length);
  await expect(clamps).toContainText("border-strong");

  // The build endpoint reads token files, so it has nothing to say about a
  // derived tree, and the panel says that rather than reporting a
  // disagreement it cannot speak to.
  await openTab(page, "Checks");
  await page.getByRole("button", { name: "Build and test" }).click();
  await expect(page.getByTestId("agreement-status")).toContainText("not compared", { timeout: 90_000 });
});

test("an override still sits on top of the derived tree, and Stoa today comes back", async ({ page }) => {
  await page.goto("/");
  await preset(page, "Tape").click();

  const token = "semantic.dark:color.accent";
  const derivedAccent = derived(deriveTokens(PRESETS.tape.parameters), "dark", "color-accent");
  await expect
    .poll(() => variable(page, "dark-rtl", "--stoa-color-accent"))
    .toBe(derivedAccent);

  await openTab(page, "Tokens");
  await page.locator(`[data-token="${token}"] input`).fill("oklch(0.7 0.2 300)");
  await expect.poll(() => variable(page, "dark-rtl", "--stoa-color-accent")).toBe("oklch(0.7 0.2 300)");
  // The light frames keep the derived value: this override names one theme.
  expect(await variable(page, "light-ltr", "--stoa-color-accent")).not.toBe("oklch(0.7 0.2 300)");

  const control = page.locator(`[data-token="${token}"]`);
  await expect(control).toHaveAttribute("data-overridden", "true");
  await expect(control).toContainText("Override detected");
  await expect(control).toContainText(derivedAccent);

  await openTab(page, "Parameters");
  await preset(page, "Stoa today").click();
  for (const pair of VIEW_PAIRS) {
    await showViews(page, pair);
    for (const frame of pair) {
      await expect.poll(() => variable(page, frame, "--stoa-color-bg")).toBe(
        frame.startsWith("light") ? TODAY_BG : "oklch(0.13 0.006 250)",
      );
    }
  }
  // The override outlives the switch: it is a layer of its own.
  await expect(control).toHaveAttribute("data-overridden", "true");
});

test("a snapshot restores the parameters it was saved with", async ({ page }) => {
  await page.goto("/");
  await preset(page, "Studio").click();
  const studio = deriveTokens(PRESETS.studio.parameters);
  await expect.poll(() => variable(page, "light-ltr", "--stoa-color-accent")).toBe(derived(studio, "light", "color-accent"));

  await openTab(page, "Snapshot");
  await page.getByRole("textbox", { name: "Snapshot name" }).fill("brief 05 studio");
  await page.getByRole("button", { name: "Save snapshot" }).click();
  await expect(page.getByText("snapshots/brief-05-studio.json")).toBeVisible();

  // Back to the built tokens, then load the snapshot: the parameters come
  // back with it, not just the overrides.
  await openTab(page, "Parameters");
  await preset(page, "Stoa today").click();
  await expect.poll(() => variable(page, "light-ltr", "--stoa-color-bg")).toBe(TODAY_BG);

  await openTab(page, "Snapshot");
  await page.getByTestId("snapshot-load").getByRole("button", { name: "brief-05-studio" }).click();
  await expect.poll(() => variable(page, "light-ltr", "--stoa-color-accent")).toBe(derived(studio, "light", "color-accent"));
});
