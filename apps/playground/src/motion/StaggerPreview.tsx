// One entrance, staggered across a list of items: delay per item, capped so
// a long list does not take forever to finish appearing.
import { useEffect, useRef, useState } from "react";
import { Button, TimeSlider } from "@valkyra-labs/stoa-react";
import type { ResolvedTokens, TokenEntry } from "../tokenModel";

export type StaggerPreviewProps = {
  values: ResolvedTokens["values"];
  easings: TokenEntry[];
};

const ITEMS = 10;
const ms = (text: string | undefined) => Number.parseFloat(text ?? "") || 0;

export function StaggerPreview({ values, easings }: StaggerPreviewProps) {
  const [perItemMs, setPerItemMs] = useState(24);
  const [capMs, setCapMs] = useState(160);
  const [replayKey, setReplayKey] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  const durationMs = ms(values["primitive:motion.duration.base"]?.effective);
  const easing = values[easings.find((e) => e.path[e.path.length - 1] === "standard")?.id ?? ""]?.effective ?? "ease";

  const replay = () => {
    setReplayKey((k) => k + 1);
    refs.current.forEach((el, i) => {
      if (!el || typeof el.animate !== "function") return;
      const delay = Math.min(i * perItemMs, capMs);
      el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], {
        duration: durationMs,
        delay,
        easing,
        fill: "backwards",
      });
    });
  };

  // Plays once on mount, at whatever the sliders' initial values are.
  useEffect(() => {
    replay();
  }, []);

  return (
    <div className="pg-motion-stagger">
      <div className="pg-token__slider">
        <span className="pg-token__label">Stagger per item</span>
        <TimeSlider
          label="Stagger per item"
          min={0}
          max={80}
          step={4}
          value={perItemMs}
          onChange={setPerItemMs}
          format={(v) => `${v}ms`}
        />
      </div>
      <div className="pg-token__slider">
        <span className="pg-token__label">Stagger cap</span>
        <TimeSlider label="Stagger cap" min={0} max={400} step={10} value={capMs} onChange={setCapMs} format={(v) => `${v}ms`} />
      </div>
      <Button variant="primary" onPress={replay}>
        Replay
      </Button>
      <ul className="pg-motion-stagger__list" key={replayKey}>
        {Array.from({ length: ITEMS }, (_, i) => (
          <li
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="pg-motion-stagger__item"
          >
            Row {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}
