// The cost of drawing the flash wash on canvas (Ladder, Heatmap): not those
// components themselves (out of scope, Stage 2 reads the tokens there), but
// the same draw a render loop would do each frame, so the acceptance's
// per-frame cost can be measured against a real canvas rather than guessed.
import { useRef, useState } from "react";
import { Button, StatBar, fitCanvas, readCanvasTokens } from "@valkyra-labs/stoa-react";

const COLUMNS = 40;
const ROWS = 20;
const FRAMES = 180;
const HEIGHT = 160;

function drawFrame(ctx: CanvasRenderingContext2D, width: number, tokens: ReturnType<typeof readCanvasTokens>, phase: number) {
  ctx.fillStyle = tokens.surface;
  ctx.fillRect(0, 0, width, HEIGHT);
  const cw = width / COLUMNS;
  const rh = HEIGHT / ROWS;
  for (let c = 0; c < COLUMNS; c++) {
    for (let r = 0; r < ROWS; r++) {
      // A moving band of flashed cells: the worst case a real render loop
      // sees is many cells flashing on the same frame, not one at a time.
      const alpha = Math.max(0, Math.sin((c + r + phase) * 0.3));
      if (alpha <= 0.02) continue;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = (c + r) % 2 === 0 ? tokens.bid : tokens.ask;
      ctx.fillRect(c * cw, r * rh, Math.ceil(cw), Math.ceil(rh));
    }
  }
  ctx.globalAlpha = 1;
}

export function CanvasFlashBench() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<{ avgMs: number; frames: number } | null>(null);
  const [running, setRunning] = useState(false);

  const measure = () => {
    const el = canvas.current;
    if (!el || running) return;
    setRunning(true);
    const tokens = readCanvasTokens(el);
    const width = el.clientWidth;
    let frame = 0;
    let total = 0;
    const step = () => {
      const start = performance.now();
      drawFrame(fitCanvas(el, HEIGHT), width, tokens, frame);
      total += performance.now() - start;
      frame += 1;
      if (frame < FRAMES) {
        requestAnimationFrame(step);
      } else {
        setResult({ avgMs: total / FRAMES, frames: FRAMES });
        setRunning(false);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="pg-motion-canvas-bench">
      <canvas ref={canvas} className="pg-motion-canvas-bench__canvas" aria-hidden="true" />
      <div className="pg-row">
        <Button onPress={measure} isDisabled={running}>
          {running ? "Measuring..." : `Measure ${FRAMES} frames`}
        </Button>
        {result && (
          <StatBar
            label="Canvas flash cost"
            items={[
              { label: "avg draw", value: `${result.avgMs.toFixed(3)} ms/frame` },
              { label: "frames", value: String(result.frames) },
              { label: "cells", value: String(COLUMNS * ROWS) },
            ]}
          />
        )}
      </div>
    </div>
  );
}
