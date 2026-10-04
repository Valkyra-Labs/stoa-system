import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterChip, FilterChipGroup, Tag } from "./Chips";
import { Button } from "./Controls";

const meta: Meta = { title: "Controls/Inputs" };
export default meta;

const row = { display: "flex", gap: "var(--stoa-space-3)", alignItems: "center", flexWrap: "wrap" } as const;

/** The five variants at rest. Hover, press and keyboard focus are drawn by
 * each variant's own rules; Tab to a button to see its ring. Danger says
 * what it destroys in its label, so the colour is not the only sign. */
export const ButtonVariants: StoryObj = {
  render: () => (
    <div style={row}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete 3 orders</Button>
    </div>
  ),
};

/** Disabled reads the same in every variant: no fill, subtle text. */
export const ButtonsDisabled: StoryObj = {
  render: () => (
    <div style={row}>
      <Button isDisabled>Default</Button>
      <Button variant="primary" isDisabled>
        Primary
      </Button>
      <Button variant="secondary" isDisabled>
        Secondary
      </Button>
      <Button variant="ghost" isDisabled>
        Ghost
      </Button>
      <Button variant="danger" isDisabled>
        Delete 3 orders
      </Button>
    </div>
  ),
};

/** Every tone, each saying in words what its colour says. Accent fills the
 * tag; the others colour border and text. */
export const TagTones: StoryObj = {
  render: () => (
    <div style={row}>
      <Tag>Paper</Tag>
      <Tag tone="info">Delayed 15 min</Tag>
      <Tag tone="positive">Market open</Tag>
      <Tag tone="warning">Halted</Tag>
      <Tag tone="negative">Rejected</Tag>
      <Tag tone="accent">New</Tag>
    </div>
  ),
};

/** The small size, for a dense row or a table cell. */
export const TagsSmall: StoryObj = {
  render: () => (
    <div style={row}>
      <Tag size="small">Paper</Tag>
      <Tag size="small" tone="info">Delayed 15 min</Tag>
      <Tag size="small" tone="positive">Market open</Tag>
      <Tag size="small" tone="warning">Halted</Tag>
      <Tag size="small" tone="negative">Rejected</Tag>
      <Tag size="small" tone="accent">New</Tag>
    </div>
  ),
};

/** A single chip off, on, and disabled. On shows a check mark as well as
 * the fill; the count follows the label. */
export const FilterChipStates: StoryObj = {
  render: () => {
    const [on, setOn] = useState(true);
    const [off, setOff] = useState(false);
    return (
      <div style={row}>
        <FilterChip isSelected={off} onChange={setOff} count={3}>
          Open
        </FilterChip>
        <FilterChip isSelected={on} onChange={setOn} count={12}>
          Filled
        </FilterChip>
        <FilterChip isSelected={false} onChange={() => {}} count={0} isDisabled>
          Cancelled
        </FilterChip>
      </div>
    );
  },
};

const STATUS = [
  { id: "open", label: "Open", count: 3 },
  { id: "partial", label: "Partly filled", count: 2 },
  { id: "filled", label: "Filled", count: 12 },
  { id: "cancelled", label: "Cancelled", count: 0, isDisabled: true },
  { id: "rejected", label: "Rejected", count: 1 },
  { id: "expired", label: "Expired", count: 4 },
];

/** Filters over one list. The "clear all" pattern: a ghost button after
 * the group, its own Tab stop outside the chips' arrow keys. It stays in
 * place and enabled while nothing is on (pressing it then changes
 * nothing): a button that disappeared or turned disabled under the press
 * would drop the keyboard focus to the page. */
export const FilterChipsClearAll: StoryObj = {
  render: () => {
    const [value, setValue] = useState(["open", "filled"]);
    return (
      <div style={row}>
        <FilterChipGroup label="Order status" chips={STATUS} value={value} onChange={setValue} />
        <Button variant="ghost" onPress={() => setValue([])}>
          Clear all
        </Button>
      </div>
    );
  },
};

/** In a narrow container the row scrolls sideways inside itself; the page
 * does not. The small size, for a toolbar or a header. */
export const FilterChipsScroll: StoryObj = {
  render: () => {
    const [value, setValue] = useState(["filled"]);
    return (
      <div style={{ maxInlineSize: 280, border: "1px solid var(--stoa-color-border)" }}>
        <FilterChipGroup label="Order status" chips={STATUS} value={value} onChange={setValue} overflow="scroll" size="small" />
      </div>
    );
  },
};
