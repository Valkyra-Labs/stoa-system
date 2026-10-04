import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CodeView, LogView } from "./Code";
import { Button } from "./Controls";
import { AlertDialog, Dialog, Sheet } from "./Dialog";
import { Metric } from "./Metric";
import { Panel, StatBar } from "./Panel";
import { ReorderableList, type ReorderableItem } from "./ReorderableList";
import { ShortcutList, ShortcutsDialog, type ShortcutGroup } from "./Shortcuts";
import { StepList, type Step } from "./StepList";

const meta: Meta = { title: "Overlays, lists and content" };
export default meta;

function RenameDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog
      title="Rename run"
      defaultOpen={defaultOpen}
      trigger={<Button>Rename run</Button>}
      actions={(close) => (
        <>
          <Button onPress={close}>Keep name</Button>
          <Button variant="primary" onPress={close}>
            Save
          </Button>
        </>
      )}
    >
      <p>The run keeps its history and its settings; only the name changes.</p>
    </Dialog>
  );
}

/** Closed: the trigger. Escape closes the dialog, Tab stays inside it,
 * and focus returns to the trigger. */
export const DialogClosed: StoryObj = { render: () => <RenameDialog /> };

/** Open: title, body, actions and the close button. */
export const DialogOpen: StoryObj = { render: () => <RenameDialog defaultOpen /> };

function FilterSheet({ placement }: { placement: "end" | "bottom" | "auto" }) {
  return (
    <Sheet
      title="Filters"
      placement={placement}
      defaultOpen
      trigger={<Button>Filters</Button>}
      actions={(close) => (
        <Button variant="primary" onPress={close}>
          Apply
        </Button>
      )}
    >
      <p>Venues, sides and sizes to show in the trades table.</p>
    </Sheet>
  );
}

/** A side panel from the inline end: the right in left-to-right text, the
 * left in right-to-left. */
export const SheetEnd: StoryObj = { render: () => <FilterSheet placement="end" /> };

/** A bottom sheet. */
export const SheetBottom: StoryObj = { render: () => <FilterSheet placement="bottom" /> };

/** "auto": the side panel on a wide screen, the bottom sheet on a narrow
 * one. */
export const SheetAuto: StoryObj = { render: () => <FilterSheet placement="auto" /> };

/** A destructive confirmation: focus starts on the safe action. */
export const AlertDestructive: StoryObj = {
  render: () => (
    <AlertDialog
      title="Delete this run?"
      confirmLabel="Delete run"
      tone="destructive"
      defaultOpen
      trigger={<Button>Delete run</Button>}
      onConfirm={() => {}}
    >
      <p>Its history and settings cannot be restored.</p>
    </AlertDialog>
  ),
};

/** A neutral confirmation. */
export const AlertNeutral: StoryObj = {
  render: () => (
    <AlertDialog
      title="Restart the replay?"
      confirmLabel="Restart"
      defaultOpen
      trigger={<Button>Restart</Button>}
      onConfirm={() => {}}
    >
      <p>Playback goes back to the open; your marks stay.</p>
    </AlertDialog>
  ),
};

const SHORTCUTS: ShortcutGroup[] = [
  {
    title: "Playback",
    shortcuts: [
      { keys: ["Space"], description: "Play or pause" },
      { keys: ["Shift", "→"], description: "Step forward one trade" },
      { keys: ["Shift", "←"], description: "Step back one trade" },
    ],
  },
  {
    title: "View",
    shortcuts: [
      { keys: ["Ctrl", "K"], description: "Find a symbol" },
      { keys: ["?"], description: "Show these shortcuts" },
    ],
  },
];

/** The shortcuts help dialog. */
export const ShortcutsOpen: StoryObj = {
  render: () => <ShortcutsDialog title="Keyboard shortcuts" groups={SHORTCUTS} defaultOpen trigger={<Button>Shortcuts</Button>} />,
};

/** A shortcut whose control is disabled stays listed, muted. */
export const ShortcutsWithDisabled: StoryObj = {
  render: () => (
    <ShortcutsDialog
      title="Keyboard shortcuts"
      groups={[
        {
          title: "Export",
          shortcuts: [
            { keys: ["E"], description: "Export the view as CSV", isDisabled: true },
            { keys: ["?"], description: "Show these shortcuts" },
          ],
        },
      ]}
      defaultOpen
      trigger={<Button>Shortcuts</Button>}
    />
  ),
};

/** The same list outside a dialog, for example on a help page. */
export const ShortcutsInline: StoryObj = {
  render: () => (
    <Panel title="Keyboard shortcuts">
      <ShortcutList groups={SHORTCUTS} />
    </Panel>
  ),
};

const PIPELINE: ReorderableItem[] = [
  { id: "fetch", textValue: "Fetch prices" },
  { id: "parse", textValue: "Parse the book" },
  { id: "check", textValue: "Check limits" },
  { id: "send", textValue: "Send the order" },
];

function Pipeline({ initial = PIPELINE, removable = false, allowsDragging = true }: { initial?: ReorderableItem[]; removable?: boolean; allowsDragging?: boolean }) {
  const [items, setItems] = useState(initial);
  return (
    <ReorderableList
      label="Pipeline"
      items={items}
      onReorder={setItems}
      allowsDragging={allowsDragging}
      onRemove={removable ? (item) => setItems((all) => all.filter((other) => other.id !== item.id)) : undefined}
      renderItem={(item) => item.textValue}
    />
  );
}

/** Move buttons named after each item, drag and drop, and a Remove button;
 * every move is announced. */
export const Reorderable: StoryObj = { render: () => <Pipeline removable /> };

/** Move buttons only. */
export const ReorderableButtonsOnly: StoryObj = { render: () => <Pipeline allowsDragging={false} /> };

/** Nothing to order yet. */
export const ReorderableEmpty: StoryObj = { render: () => <Pipeline initial={[]} /> };

const STEPS: Step[] = [
  { id: "1", title: "Fetch prices", status: "done" },
  { id: "2", title: "Parse the book", status: "running", progress: 0.6, explanation: "Level 3 of 5" },
  {
    id: "3",
    title: "Choose a venue",
    status: "awaiting",
    explanation: "Two venues quote the same price.",
    actions: (
      <>
        <Button>IEX</Button>
        <Button>NYSE</Button>
      </>
    ),
  },
  { id: "4", title: "Send the order", status: "waiting" },
  { id: "5", title: "Hedge", status: "skipped", explanation: "No position to hedge." },
  { id: "6", title: "Rebalance", status: "undone" },
  { id: "7", title: "Report", status: "error", explanation: "The report service did not answer.", actions: <Button>Retry</Button> },
];

/** Every status, each a symbol and a word; the running step pulses unless
 * motion is reduced, and shows its progress. */
export const StepsAllStatuses: StoryObj = {
  render: () => (
    <Panel title="Order">
      <StepList label="Order steps" steps={STEPS} />
    </Panel>
  ),
};

/** The same steps in a ReorderableList. */
export const StepsReorderable: StoryObj = {
  render: () => {
    const [steps, setSteps] = useState(STEPS.slice(0, 4));
    return (
      <Panel title="Order">
        <StepList
          label="Order steps"
          steps={steps}
          reorderable
          onReorder={setSteps}
          onRemove={(step) => setSteps((all) => all.filter((other) => other.id !== step.id))}
        />
      </Panel>
    );
  },
};

const LOG = Array.from({ length: 30 }, (_, i) => {
  const s = String(i).padStart(2, "0");
  return `09:30:${s}.000 INFO  frame ${1000 + i} drawn in ${(12 + (i % 5)).toFixed(1)} ms`;
});

/** A log taller than its height: focus it and scroll with the arrow keys. */
export const Log: StoryObj = { render: () => <LogView label="Renderer log" lines={LOG} /> };

/** Lines that mix scripts: a line given as its parts has its message
 * isolated, so an Arabic message reads right to left with its punctuation
 * in place, while the time and the level stay at the left. */
export const LogMixed: StoryObj = {
  render: () => (
    <LogView
      label="Engine log"
      lines={[
        { time: "10:00:01", level: "INFO", text: "open AAPL" },
        { time: "10:00:02", level: "INFO", text: "تم تحميل السجل: 1200 صفقة." },
        { time: "10:00:03", level: "WARN", text: "seek 10:30:00 (slow)" },
        { time: "10:00:04", level: "INFO", text: "الخطوة 3 من 5." },
      ]}
    />
  ),
};

/** A log in Arabic: the time in Arabic-Indic digits and the level in
 * Arabic are isolated too, so in a right-to-left page they stay in their
 * places at the left instead of joining the message's run. */
export const LogArabic: StoryObj = {
  render: () => (
    <LogView
      label="سجل الوكيل"
      lines={[
        { time: "١٠:٢٥:٠١", level: "النظام", text: "بدأ التشغيل." },
        { time: "١٠:٢٥:٠٢", level: "الوكيل", text: "قرأت ٣ ملفات." },
        { time: "١٠:٢٥:٠٣", level: "الأداة", text: "grep: 12 matches" },
      ]}
    />
  ),
};

const CODE = `import { tokens } from "@valkyra-labs/stoa-tokens";

export function rowHeight(density: "compact" | "regular") {
  // The density tokens set the height; nothing here is a literal.
  return tokens.density[density].rowHeight;
}`;

/** Code, always left to right. */
export const Code: StoryObj = { render: () => <CodeView label="rowHeight.ts" code={CODE} /> };

/** With line numbers, which a copy leaves out. */
export const CodeNumbered: StoryObj = { render: () => <CodeView label="rowHeight.ts" code={CODE} lineNumbers /> };

/** Metrics with a basis and each threshold tone. */
export const Metrics: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--stoa-space-6)" }}>
      <Metric label="Frame time" value={16.9} fractionDigits={1} unit="ms" basis="p95 over 60 s" threshold={{ tone: "negative", label: "Over budget" }} />
      <Metric label="Fill rate" value={98.2} fractionDigits={1} unit="%" basis="last 1,000 orders" threshold={{ tone: "positive", label: "Above target" }} />
      <Metric label="Spread" value={0.05} fractionDigits={2} unit="USD" threshold={{ tone: "neutral", label: "Typical" }} />
      <Metric label="Session" value="10:30:05" />
    </div>
  ),
};

/** A StatBar with plain values and Metric items side by side. */
export const StatBarWithMetrics: StoryObj = {
  render: () => (
    <StatBar
      label="Performance counters"
      items={[
        { label: "frames/s", value: "60" },
        { kind: "metric", label: "frame p95", value: 16.9, fractionDigits: 1, unit: "ms", threshold: { tone: "positive", label: "within budget" } },
        { kind: "metric", label: "book p95", value: 0.5, fractionDigits: 2, unit: "ms", basis: "last 60 s" },
      ]}
    />
  ),
};
