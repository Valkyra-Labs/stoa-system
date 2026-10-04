import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterChip, FilterChipGroup, Tag } from "./Chips";
import { Button } from "./Controls";
import { Slider } from "./Slider";
import { ButtonGroup, Toolbar, ToolbarSeparator } from "./Toolbar";
import { Checkbox, CheckboxGroup, Switch } from "./Toggles";

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

const column = { display: "grid", gap: "var(--stoa-space-3)", justifyItems: "start" } as const;

/** Off and on, with and without a description. Space toggles a focused
 * switch. */
export const SwitchStates: StoryObj = {
  render: () => {
    const [live, setLive] = useState(true);
    const [sound, setSound] = useState(false);
    return (
      <div style={column}>
        <Switch isSelected={live} onChange={setLive} description="Prices move as trades arrive.">
          Live updates
        </Switch>
        <Switch isSelected={sound} onChange={setSound}>
          Sound on fills
        </Switch>
      </div>
    );
  },
};

/** Disabled, off and on. The reason is shown under the label and announced
 * with the switch, so the state is explained, not only greyed out. */
export const SwitchDisabled: StoryObj = {
  render: () => (
    <div style={column}>
      <Switch isSelected={false} onChange={() => {}} isDisabled disabledReason="Needs a live feed; this is a replay.">
        Live updates
      </Switch>
      <Switch isSelected onChange={() => {}} isDisabled disabledReason="Set by your organisation.">
        Confirm orders
      </Switch>
    </div>
  ),
};

/** The small size, for a toolbar or a settings row. */
export const SwitchSmall: StoryObj = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <Switch size="small" isSelected={on} onChange={setOn}>
        Reduced motion
      </Switch>
    );
  },
};

/** Unchecked, checked, mixed and disabled. */
export const CheckboxStates: StoryObj = {
  render: () => {
    const [fees, setFees] = useState(false);
    const [totals, setTotals] = useState(true);
    return (
      <div style={column}>
        <Checkbox isSelected={fees} onChange={setFees} description="Commission and exchange fees.">
          Show fees
        </Checkbox>
        <Checkbox isSelected={totals} onChange={setTotals}>
          Show totals
        </Checkbox>
        <Checkbox isSelected={false} isIndeterminate onChange={() => {}}>
          All columns
        </Checkbox>
        <Checkbox isSelected onChange={() => {}} isDisabled>
          Price (always shown)
        </Checkbox>
      </div>
    );
  },
};

const COLUMNS = [
  { value: "time", label: "Time" },
  { value: "side", label: "Side" },
  { value: "price", label: "Price" },
  { value: "size", label: "Size" },
];

/** A group under one label, with a mixed "all" box above it that checks
 * or clears every column. */
export const CheckboxGroupWithAll: StoryObj = {
  render: () => {
    const [value, setValue] = useState(["time", "price"]);
    const all = value.length === COLUMNS.length;
    return (
      <div style={column}>
        <Checkbox
          isSelected={all}
          isIndeterminate={value.length > 0 && !all}
          onChange={(on) => setValue(on ? COLUMNS.map((c) => c.value) : [])}
        >
          All columns
        </Checkbox>
        <CheckboxGroup label="Show columns" value={value} onChange={setValue} description="Hidden columns stay in the export.">
          {COLUMNS.map((c) => (
            <Checkbox key={c.value} value={c.value}>
              {c.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    );
  },
};

const sliders = { display: "grid", gap: "var(--stoa-space-4)", maxInlineSize: 320 } as const;

/** A plain number, and a formatted one with a hint. The format is what is
 * shown and what is announced (aria-valuetext). */
export const SliderStates: StoryObj = {
  render: () => {
    const [depth, setDepth] = useState(12);
    const [opacity, setOpacity] = useState(60);
    return (
      <div style={sliders}>
        <Slider label="Book depth" min={4} max={40} step={2} value={depth} onChange={setDepth} hint="Levels shown on each side." />
        <Slider label="Heatmap opacity" value={opacity} onChange={setOpacity} step={5} format={(v) => `${v} %`} />
      </div>
    );
  },
};

/** Disabled: the value is still shown, the track and thumb go grey. */
export const SliderDisabled: StoryObj = {
  render: () => (
    <div style={sliders}>
      <Slider label="Book depth" min={4} max={40} value={12} onChange={() => {}} isDisabled hint="Fixed while the replay loads." />
    </div>
  ),
};

/** The small size: smaller text, the same track height, which is the
 * minimum target. */
export const SliderSmall: StoryObj = {
  render: () => {
    const [speed, setSpeed] = useState(1);
    return (
      <div style={sliders}>
        <Slider size="small" label="Speed" min={0.25} max={4} step={0.25} value={speed} onChange={setSpeed} format={(v) => `${v}x`} />
      </div>
    );
  },
};

/** One Tab stop: Tab enters at the control used last and leaves in one
 * press; the arrow keys move through every enabled control, groups
 * included, reversed in a right-to-left page; Home and End go to the
 * ends. A separator stands between groups. */
export const ToolbarTransport: StoryObj = {
  render: () => {
    const [playing, setPlaying] = useState(false);
    return (
      <Toolbar label="Playback">
        <Button variant="primary" onPress={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </Button>
        <ToolbarSeparator />
        <ButtonGroup label="Step">
          <Button>Back 1 min</Button>
          <Button isDisabled>Forward 1 min</Button>
          <Button>Live</Button>
        </ButtonGroup>
        <ToolbarSeparator />
        <Button variant="ghost">Reset view</Button>
      </Toolbar>
    );
  },
};

/** A button group on its own, outside a toolbar: each button is its own
 * Tab stop. */
export const ButtonGroupAlone: StoryObj = {
  render: () => (
    <ButtonGroup label="Zoom">
      <Button>Zoom in</Button>
      <Button>Fit</Button>
      <Button>Zoom out</Button>
    </ButtonGroup>
  ),
};
