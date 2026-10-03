import type { Meta, StoryObj } from "@storybook/react-vite";
import { Disclosure } from "./Disclosure";
import { StatusBadge } from "./Form";
import { Panel, StatBar } from "./Panel";

const meta: Meta = { title: "Layout/Panel" };
export default meta;

/** A titled region; its heading names it for assistive technology. */
export const Titled: StoryObj = {
  render: () => (
    <Panel title="Session">
      <StatBar
        label="Session counters"
        items={[
          { label: "frames/s", value: "60" },
          { label: "frame p95", value: "16.9 ms" },
          { label: "book p95", value: "0.50 ms" },
        ]}
      />
    </Panel>
  ),
};

/** Sections that open and close, with the Select's chevron. */
export const Sections: StoryObj = {
  render: () => (
    <Panel title="Checks">
      <Disclosure summary="Text contrast (44)" defaultOpen>
        <StatusBadge tone="positive">44 passed</StatusBadge>
      </Disclosure>
      <Disclosure summary="Target size (3)">
        <StatusBadge tone="positive">3 passed</StatusBadge>
      </Disclosure>
    </Panel>
  ),
};
