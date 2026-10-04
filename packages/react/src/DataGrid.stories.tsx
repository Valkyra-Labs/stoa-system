import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { I18nProvider } from "react-aria-components";
import { DataGrid, type DataGridSort } from "./DataGrid";
import { TextField } from "./Form";
import { Panel } from "./Panel";
import { sampleOrderColumns, sampleOrders, type SampleOrder } from "./gridFixtures";

const meta: Meta = { title: "Data/DataGrid" };
export default meta;

const orderKey = (o: SampleOrder) => o.id;

// Built once per page, so a story's first render measures the grid, not
// the data.
let fiftyThousand: SampleOrder[] | null = null;
const largeRows = () => (fiftyThousand ??= sampleOrders(50_000));

/** 50,000 orders by 30 columns. Only the rows and columns in view are in
 * the DOM; order and account stay pinned while the grid scrolls sideways.
 * Sort from a header (click, or Enter on it), select with Space, Shift
 * with an arrow, or Ctrl or Cmd with A; type in the search field to mark
 * matches. packages/react/e2e/data-grid.measure.mjs measures this story. */
export const FiftyThousandRows: StoryObj = {
  render: () => {
    const rows = largeRows();
    const columns = useMemo(() => sampleOrderColumns(), []);
    const [search, setSearch] = useState("");
    // Read by packages/react/e2e/data-grid.measure.mjs: the time from this
    // render to the first painted frame with cells.
    if (typeof performance !== "undefined") performance.mark("stoa-data-grid-render");
    return (
      <Panel title="Orders">
        <div style={{ display: "grid", gap: "var(--stoa-space-3)" }}>
          <div style={{ maxInlineSize: 320 }}>
            <TextField label="Mark matches" value={search} onChange={setSearch} />
          </div>
          <DataGrid label="Orders" rows={rows} columns={columns} rowKey={orderKey} selectionMode="multiple" highlight={search} />
        </div>
      </Panel>
    );
  },
};

/** Status and note are editable: Enter or F2 opens the editor, Enter
 * saves, Escape cancels. A note longer than 40 characters is refused, and
 * so is a rejected status without a note; the error is announced. Sort
 * and selection are controlled by the story. */
export const Editable: StoryObj = {
  render: () => {
    const [rows, setRows] = useState(() => sampleOrders(200, 5));
    const columns = useMemo(() => sampleOrderColumns(), []);
    const [sort, setSort] = useState<DataGridSort | null>({ column: "id", direction: "ascending" });
    const [selected, setSelected] = useState<Set<string>>(() => new Set());
    return (
      <Panel title="Orders">
        <DataGrid
          label="Orders, editable"
          rows={rows}
          columns={columns}
          rowKey={orderKey}
          selectionMode="multiple"
          sort={sort}
          onSortChange={setSort}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          onEdit={({ rowKey, column, value }) =>
            setRows((previous) => previous.map((o) => (o.id === rowKey ? { ...o, [column]: value } : o)))
          }
        />
      </Panel>
    );
  },
};

/** No rows: the header stays, with the locale's sentence under it. */
export const Empty: StoryObj = {
  render: () => (
    <Panel title="Orders">
      <DataGrid label="Orders" rows={[]} columns={sampleOrderColumns()} rowKey={orderKey} selectionMode="multiple" />
    </Panel>
  ),
};

/** Rows on their way: skeleton lines under the header, the grid busy, and
 * the loading announced. */
export const Loading: StoryObj = {
  render: () => (
    <Panel title="Orders">
      <DataGrid label="Orders" rows={[]} columns={sampleOrderColumns()} rowKey={orderKey} selectionMode="multiple" loading />
    </Panel>
  ),
};

/** Arabic, right to left, whatever the toolbar says: pinned columns at
 * the right edge, the arrows mirrored, Arabic words and Arabic-Indic
 * digits. */
export const RightToLeft: StoryObj = {
  render: () => {
    const rows = useMemo(() => sampleOrders(5_000, 3), []);
    const columns = useMemo(() => sampleOrderColumns("ar"), []);
    return (
      <div dir="rtl" lang="ar">
        <I18nProvider locale="ar-u-nu-arab">
          <Panel title="الأوامر">
            <DataGrid label="الأوامر" rows={rows} columns={columns} rowKey={orderKey} selectionMode="multiple" />
          </Panel>
        </I18nProvider>
      </div>
    );
  },
};
