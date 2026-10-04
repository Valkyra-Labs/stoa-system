// Fields in a real browser, against the built stories: what is typed on
// the keyboard, through the browser's own beforeinput and input events.
import { expect, test } from "@playwright/test";

const story = (id: string, globals = "") => `/iframe.html?id=${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`;

test("NumberField under Arabic-Indic digits takes digits typed in Latin", async ({ page }) => {
  await page.goto(story("controls-form--number-field-steps", "dir:rtl;lang:ar"));
  const field = page.getByRole("textbox", { name: "Kept as typed" });
  await expect(field).toHaveValue("٢٠٬٠٠٠");
  await field.fill("");
  await field.pressSequentially("500.5");
  await expect(field).toHaveValue("٥٠٠٫٥");
  await field.press("Enter");
  await expect(field).toHaveValue("٥٠٠٫٥");
  // The arrow keys still step from the kept value.
  await field.press("ArrowUp");
  await expect(field).toHaveValue("١٠٬٠٠٠");
});

test("NumberField rounds a typed value to the step, unless it keeps typed values", async ({ page }) => {
  await page.goto(story("controls-form--number-field-steps"));
  const rounded = page.getByRole("textbox", { name: "Rounded to 10,000" });
  await rounded.fill("500");
  await rounded.press("Enter");
  await expect(rounded).toHaveValue("0");
  const kept = page.getByRole("textbox", { name: "Kept as typed" });
  await kept.fill("500");
  await kept.press("Enter");
  await expect(kept).toHaveValue("500");
  await expect(kept).not.toHaveAttribute("aria-invalid", "true");
  await kept.press("ArrowUp");
  await expect(kept).toHaveValue("10,000");
});
