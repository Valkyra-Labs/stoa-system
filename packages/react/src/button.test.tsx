// @vitest-environment jsdom
// Button variants: every variant is a button in every state, and the state
// is on the element for the stylesheet to draw.
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button, I18nProvider, type ButtonProps } from "./index";

afterEach(cleanup);

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = ["default", "primary", "secondary", "ghost", "danger"];

describe.each(VARIANTS)("Button, %s", (variant) => {
  it("is a button named by its label, with the variant's class", () => {
    render(<Button variant={variant}>Delete 3 orders</Button>);
    const button = screen.getByRole("button", { name: "Delete 3 orders" });
    expect(button.className.split(" ")).toEqual(["stoa-button", `stoa-button--${variant}`]);
  });

  it("marks hover and press for the stylesheet, and calls onPress", () => {
    const onPress = vi.fn();
    render(
      <Button variant={variant} onPress={onPress}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    fireEvent.pointerEnter(button, { pointerType: "mouse" });
    expect(button.hasAttribute("data-hovered")).toBe(true);
    fireEvent.pointerDown(button, { pointerType: "mouse", button: 0, pointerId: 1 });
    expect(button.hasAttribute("data-pressed")).toBe(true);
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalled();
  });

  it("shows the focus ring after keyboard focus, and presses with Enter and Space", () => {
    const onPress = vi.fn();
    render(
      <Button variant={variant} onPress={onPress}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    fireEvent.keyDown(document.body, { key: "Tab" });
    act(() => button.focus());
    expect(button.hasAttribute("data-focus-visible")).toBe(true);
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyUp(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: " " });
    fireEvent.keyUp(button, { key: " " });
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("is disabled: not pressable, and marked for the stylesheet", () => {
    const onPress = vi.fn();
    render(
      <Button variant={variant} onPress={onPress} isDisabled>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.hasAttribute("data-disabled")).toBe(true);
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("Button in a right-to-left page", () => {
  it("keeps its name and variant under an Arabic locale", () => {
    render(
      <I18nProvider locale="ar-u-nu-arab">
        <div dir="rtl">
          <Button variant="danger">حذف</Button>
        </div>
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "حذف" }).className).toContain("stoa-button--danger");
  });
});
