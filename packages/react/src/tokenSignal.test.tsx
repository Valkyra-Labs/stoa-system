// @vitest-environment jsdom
import { act, render } from "@testing-library/react";
import { createRef, type ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Heatmap, type HeatmapHandle, Ladder, type LadderHandle, signalTokensChanged } from "./index";
import { sampleBook, sampleHeatmap } from "./fixtures";

// A canvas 2d context stub: jsdom does not implement one without the
// optional `canvas` native package. Records the fill colour used for the
// background fill (the first `fillRect` after each `setTransform`, which
// is how `fitCanvas` starts a draw) and how many draws happened, so tests
// can check both the value read and that a signal causes exactly one
// extra draw, not a cascade.
type FakeCtx = { draws: number; surfaceFills: string[] };

function fakeContext(): FakeCtx & Record<string, unknown> {
  const surfaceFills: string[] = [];
  let sinceTransform = false;
  const ctx = {
    fillStyle: "",
    strokeStyle: "",
    font: "",
    textAlign: "left",
    textBaseline: "alphabetic",
    globalAlpha: 1,
    draws: 0,
    surfaceFills,
    setTransform() {
      ctx.draws++;
      sinceTransform = true;
    },
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    fillText() {},
    fillRect() {
      if (sinceTransform) {
        surfaceFills.push(String(ctx.fillStyle));
        sinceTransform = false;
      }
    },
  };
  return ctx;
}

function installFakeCanvas() {
  const original = HTMLCanvasElement.prototype.getContext;
  const contexts = new WeakMap<HTMLCanvasElement, FakeCtx>();
  // @ts-expect-error -- test stub, narrower than the real overload set.
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, id: string) {
    if (id !== "2d") return null;
    let ctx = contexts.get(this);
    if (!ctx) {
      ctx = fakeContext();
      contexts.set(this, ctx);
    }
    return ctx;
  };
  return { contexts, restore: () => (HTMLCanvasElement.prototype.getContext = original) };
}

function Themed({ surface, children }: { surface: string; children: ReactNode }) {
  return <div style={{ "--stoa-color-surface": surface } as never}>{children}</div>;
}

describe("token change signal", () => {
  let canvasStub: ReturnType<typeof installFakeCanvas>;
  afterEach(() => canvasStub?.restore());

  it("re-reads tokens and redraws, from a stoa:tokens event on an ancestor, even while paused", () => {
    canvasStub = installFakeCanvas();
    const ref = createRef<LadderHandle>();
    const { container } = render(
      <Themed surface="rgb(1, 1, 1)">
        <Ladder ref={ref} label="Book" />
      </Themed>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const canvas = container.querySelector("canvas")!;
    act(() => ref.current!.draw(sampleBook()));
    const ctx = canvasStub.contexts.get(canvas)!;
    expect(ctx.surfaceFills.at(-1)).toBe("rgb(1, 1, 1)");
    const drawsAfterFirstFrame = ctx.draws;

    // Signal fires with no new data (playback paused): the ladder still
    // redraws, from the wrapper's now-different value.
    wrapper.style.setProperty("--stoa-color-surface", "rgb(2, 2, 2)");
    act(() => signalTokensChanged(wrapper));

    expect(ctx.surfaceFills.at(-1)).toBe("rgb(2, 2, 2)");
    expect(ctx.draws).toBe(drawsAfterFirstFrame + 1);
  });

  it("reads a different value per instance, scoped to each one's own wrapper", () => {
    canvasStub = installFakeCanvas();
    const refA = createRef<LadderHandle>();
    const refB = createRef<LadderHandle>();
    const { container } = render(
      <div>
        <Themed surface="rgb(10, 10, 10)">
          <Ladder ref={refA} label="Light" />
        </Themed>
        <Themed surface="rgb(20, 20, 20)">
          <Ladder ref={refB} label="Dark" />
        </Themed>
      </div>,
    );
    const [canvasA, canvasB] = container.querySelectorAll("canvas");
    act(() => {
      refA.current!.draw(sampleBook());
      refB.current!.draw(sampleBook());
    });
    expect(canvasStub.contexts.get(canvasA!)!.surfaceFills.at(-1)).toBe("rgb(10, 10, 10)");
    expect(canvasStub.contexts.get(canvasB!)!.surfaceFills.at(-1)).toBe("rgb(20, 20, 20)");
  });

  it("does not cause a redraw loop: a signal draws once, not repeatedly", () => {
    canvasStub = installFakeCanvas();
    const ref = createRef<LadderHandle>();
    const { container } = render(
      <Themed surface="rgb(1, 1, 1)">
        <Ladder ref={ref} label="Book" />
      </Themed>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const canvas = container.querySelector("canvas")!;
    act(() => ref.current!.draw(sampleBook()));
    const ctx = canvasStub.contexts.get(canvas)!;

    for (let i = 0; i < 3; i++) {
      const before = ctx.draws;
      wrapper.style.setProperty("--stoa-color-surface", `rgb(${i}, ${i}, ${i})`);
      act(() => signalTokensChanged(wrapper));
      expect(ctx.draws).toBe(before + 1);
    }
  });

  it("also redraws a Heatmap from the signal, from its own wrapper", () => {
    canvasStub = installFakeCanvas();
    const ref = createRef<HeatmapHandle>();
    const { container } = render(
      <Themed surface="rgb(3, 3, 3)">
        <Heatmap ref={ref} label="Liquidity" height={80} />
      </Themed>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const canvas = container.querySelector("canvas")!;
    act(() => ref.current!.draw(sampleHeatmap(4, 4)));
    const ctx = canvasStub.contexts.get(canvas)!;
    expect(ctx.surfaceFills.at(-1)).toBe("rgb(3, 3, 3)");

    wrapper.style.setProperty("--stoa-color-surface", "rgb(4, 4, 4)");
    act(() => signalTokensChanged(wrapper));
    expect(ctx.surfaceFills.at(-1)).toBe("rgb(4, 4, 4)");
  });

  it("keeps the tokensVersion prop working as an alternative to the event", () => {
    canvasStub = installFakeCanvas();
    const ref = createRef<LadderHandle>();
    const { container, rerender } = render(
      <Themed surface="rgb(5, 5, 5)">
        <Ladder ref={ref} label="Book" tokensVersion={0} />
      </Themed>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const canvas = container.querySelector("canvas")!;
    act(() => ref.current!.draw(sampleBook()));
    const ctx = canvasStub.contexts.get(canvas)!;

    wrapper.style.setProperty("--stoa-color-surface", "rgb(6, 6, 6)");
    act(() => rerender(
      <Themed surface="rgb(6, 6, 6)">
        <Ladder ref={ref} label="Book" tokensVersion={1} />
      </Themed>,
    ));

    expect(ctx.surfaceFills.at(-1)).toBe("rgb(6, 6, 6)");
  });
});
