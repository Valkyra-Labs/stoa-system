// Four handles on one curve, the other two named easings drawn alongside it
// for comparison. Editing a handle writes the same override every other
// token control writes (`onEdit`/`onEditEnd`), as a comma list of numbers
// (`tokenModel.ts` reconstitutes a numeric-array override back into the
// token's array shape).
import { useState } from "react";
import { Button, ChoiceGroup, StatusBadge, TimeSlider } from "@valkyra-labs/stoa-react";
import type { Overrides, ResolvedTokens, TokenEntry } from "../tokenModel";
import { sampleBezier, type BezierPoints } from "./bezier";
import { effectiveBezierPoints, lastSegment } from "./motionTokens";

export type BezierEditorProps = {
  easings: TokenEntry[];
  overrides: Overrides;
  values: ResolvedTokens["values"];
  onEdit: (id: string, value: string, held?: boolean) => void;
  onEditEnd: () => void;
  onReset: (id: string) => void;
};

const HANDLES = [
  { index: 0 as const, label: "P1 x", min: 0, max: 1 },
  { index: 1 as const, label: "P1 y", min: -0.5, max: 1.5 },
  { index: 2 as const, label: "P2 x", min: 0, max: 1 },
  { index: 3 as const, label: "P2 y", min: -0.5, max: 1.5 },
];

const CURVE_COLOUR: Record<string, string> = {
  standard: "var(--stoa-color-accent)",
  enter: "var(--stoa-color-up)",
  exit: "var(--stoa-color-down)",
};

/** The curve as an SVG path in a `size`-square box, y flipped (SVG grows
 * downward, a curve's progress grows upward). */
function curvePath(points: BezierPoints, size: number): string {
  return sampleBezier(points, 48)
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x * size).toFixed(1)} ${((1 - p.y) * size).toFixed(1)}`)
    .join(" ");
}

export function BezierEditor({ easings, overrides, values, onEdit, onEditEnd, onReset }: BezierEditorProps) {
  const [selectedId, setSelectedId] = useState(easings[0]?.id ?? "");
  const selected = easings.find((e) => e.id === selectedId) ?? easings[0];
  if (!selected) return null;
  const points = effectiveBezierPoints(selected, overrides);
  const override = overrides[selected.id];
  const size = 140;

  const setPoint = (index: 0 | 1 | 2 | 3, value: number, held: boolean) => {
    const next = [...points] as [number, number, number, number];
    next[index] = Math.round(value * 1000) / 1000;
    onEdit(selected.id, next.join(", "), held);
  };

  return (
    <div className="pg-motion-bezier">
      <ChoiceGroup
        label="Easing token"
        choices={easings.map((e) => ({ id: e.id, label: lastSegment(e) }))}
        value={selected.id}
        onChange={setSelectedId}
      />
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="pg-motion-bezier__plot"
        role="img"
        aria-label={`Cubic bezier curves for ${easings.map(lastSegment).join(", ")}, ${lastSegment(selected)} highlighted`}
      >
        <rect x={0} y={0} width={size} height={size} className="pg-motion-bezier__bg" />
        <line x1={0} y1={size} x2={size} y2={0} className="pg-motion-bezier__diagonal" />
        {easings.map((e) => (
          <path
            key={e.id}
            d={curvePath(effectiveBezierPoints(e, overrides), size)}
            fill="none"
            stroke={CURVE_COLOUR[lastSegment(e)] ?? "currentColor"}
            strokeWidth={e.id === selected.id ? 2.5 : 1.25}
            opacity={e.id === selected.id ? 1 : 0.5}
          />
        ))}
      </svg>

      <div className="pg-motion-bezier__handles">
        {HANDLES.map(({ index, label, min, max }) => (
          <div key={index} className="pg-token__slider">
            <span className="pg-token__label">{label}</span>
            <TimeSlider
              label={`${lastSegment(selected)} ${label}`}
              min={min}
              max={max}
              step={0.01}
              value={points[index]}
              onChange={(value) => setPoint(index, value, true)}
              onChangeEnd={onEditEnd}
              format={(value) => value.toFixed(2)}
            />
          </div>
        ))}
      </div>

      <p className="pg-note">
        <code>{values[selected.id]?.effective ?? ""}</code>
      </p>

      {override !== undefined && (
        <div className="pg-token__override">
          <StatusBadge tone="warning">Override detected</StatusBadge>
          <Button onPress={() => onReset(selected.id)}>Reset {lastSegment(selected)}</Button>
        </div>
      )}
    </div>
  );
}
