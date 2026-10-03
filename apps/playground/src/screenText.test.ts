import { describe, expect, it } from "vitest";
import { SCREEN_TEXT, localeFor, retypeDigits } from "./screenText";

describe("the frame's locale", () => {
  it("states the frame's direction through the script, and Arabic digits", () => {
    expect(localeFor("en", "ltr")).toBe("en-US");
    expect(localeFor("ar", "rtl")).toBe("ar-u-nu-arab");
    const directionOf = (tag: string) => {
      const locale = new Intl.Locale(tag).maximize() as Intl.Locale & { getTextInfo?: () => { direction: string } };
      return locale.getTextInfo?.().direction;
    };
    for (const language of ["en", "ar"] as const) {
      for (const dir of ["ltr", "rtl"] as const) {
        const direction = directionOf(localeFor(language, dir));
        // Engines without Intl.Locale text info cannot say; where they can,
        // the direction is the frame's.
        if (direction !== undefined) expect(direction, `${language} ${dir}`).toBe(dir);
      }
    }
    expect(new Intl.NumberFormat(localeFor("ar", "ltr")).format(12.5)).toBe("١٢٫٥");
    expect(new Intl.NumberFormat(localeFor("en", "rtl")).format(12.5)).toBe("12.5");
  });
});

describe("retyping a field between languages", () => {
  it("moves the digits and the decimal separator and keeps the rest", () => {
    expect(retypeDigits("222.60", "ar")).toBe("٢٢٢٫٦٠");
    expect(retypeDigits("٢٢٢٫٦٠", "en")).toBe("222.60");
    expect(retypeDigits("12 lots", "ar")).toBe("١٢ lots");
  });
});

describe("the screen's words", () => {
  it("has every word in both languages", () => {
    expect(Object.keys(SCREEN_TEXT.ar).sort()).toEqual(Object.keys(SCREEN_TEXT.en).sort());
  });
});
