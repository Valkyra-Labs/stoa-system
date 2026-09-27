// Brief 08: easing and spring editors, live-data motion previews. One
// module under apps/playground/src/motion/, registered once in panels.ts,
// per docs/stage-1/wave-2/README.md.
import { useMemo } from "react";
import { Tabs } from "@valkyra-labs/stoa-react";
import type { Overrides, ResolvedTokens, TokenFiles } from "../tokenModel";
import { BezierEditor } from "./BezierEditor";
import { CanvasFlashBench } from "./CanvasFlashBench";
import { FlashPreview } from "./FlashPreview";
import { SpringEditor } from "./SpringEditor";
import { StaggerPreview } from "./StaggerPreview";
import { easingPointsByName, motionTokens } from "./motionTokens";
import type { SpringParams } from "./springSampler";

export type MotionPanelProps = {
  files: TokenFiles;
  overrides: Overrides;
  values: ResolvedTokens["values"];
  onEdit: (id: string, value: string, held?: boolean) => void;
  onEditEnd: () => void;
  onReset: (id: string) => void;
  spring: SpringParams;
  onSpringChange: (spring: SpringParams) => void;
};

export function MotionPanel({ files, overrides, values, onEdit, onEditEnd, onReset, spring, onSpringChange }: MotionPanelProps) {
  const { easings } = useMemo(() => motionTokens(files), [files]);
  const easingPoints = useMemo(() => easingPointsByName(easings, overrides), [easings, overrides]);

  return (
    <Tabs
      label="Motion"
      items={[
        {
          id: "easing",
          label: "Easing",
          content: <BezierEditor easings={easings} overrides={overrides} values={values} onEdit={onEdit} onEditEnd={onEditEnd} onReset={onReset} />,
        },
        {
          id: "spring",
          label: "Spring",
          content: <SpringEditor spring={spring} onChange={onSpringChange} easingTokens={easingPoints} />,
        },
        {
          id: "flash",
          label: "Flash",
          content: <FlashPreview values={values} easings={easings} />,
        },
        {
          id: "stagger",
          label: "Stagger",
          content: <StaggerPreview values={values} easings={easings} />,
        },
        {
          id: "canvas",
          label: "Canvas cost",
          content: <CanvasFlashBench />,
        },
      ]}
    />
  );
}
