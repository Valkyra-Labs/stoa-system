import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NumberField } from "./Controls";
import { StatusBadge, Tabs, TextField } from "./Form";
import { Panel } from "./Panel";

const meta: Meta = { title: "Controls/Form" };
export default meta;

/** A labelled field with a description. Maths and prices stay left to
 * right inside a right-to-left page (`dir="ltr"` on the input). */
export const Fields: StoryObj = {
  render: () => {
    const [limit, setLimit] = useState("222.60");
    const [quantity, setQuantity] = useState(500);
    return (
      <Panel title="Order">
        <div style={{ display: "grid", gap: "var(--stoa-space-3)", maxInlineSize: 320 }}>
          <TextField label="Limit price" value={limit} onChange={setLimit} dir="ltr" description="Tick 0.01" />
          <NumberField label="Quantity" value={quantity} onChange={setQuantity} minValue={1} step={100} />
          <NumberField label="Row height in px" unit="px" size="small" value={28} onChange={() => {}} minValue={0} />
        </div>
      </Panel>
    );
  },
};

/** Every tone carries a symbol and a word, never colour alone. */
export const Badges: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--stoa-space-4)", flexWrap: "wrap" }}>
      <StatusBadge tone="positive">Filled</StatusBadge>
      <StatusBadge tone="negative">Rejected</StatusBadge>
      <StatusBadge tone="warning">Marketable</StatusBadge>
      <StatusBadge tone="neutral">Pending</StatusBadge>
    </div>
  ),
};

/** Arrow keys move between tabs; the panel follows the selection. */
export const TabList: StoryObj = {
  render: () => (
    <Panel title="Trades">
      <Tabs
        label="Trades view"
        items={[
          { id: "tape", label: "Tape", content: <p>The tape: every trade, newest first.</p> },
          { id: "summary", label: "Summary", content: <p>Mid, count and volume.</p> },
          { id: "notes", label: "Notes", content: <p>Nothing noted yet.</p> },
        ]}
      />
    </Panel>
  ),
};
