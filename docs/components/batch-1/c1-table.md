# C1: Table

Why: Themis's audit view renders a raw `<table className="stoa-table">`
using Stoa's internal class; Tyche's TradeTable hard-codes English
headers and `en-US`, and shows bare headers when empty.

Build `Table` for data grids that are read, not edited:
- columns: id, header (a node, so it can be translated), alignment
  (numbers right-aligned with tabular figures), optional cell renderer;
- rows: data plus a stable key; optional row header column (`th scope`);
- caption (visible or visually hidden) and an accessible name;
- empty state: a message row spanning all columns (text passed in);
- optional sticky header and sticky first column;
- density follows the density tokens (row height, padding, font size).

Then rebuild `TradeTable` on `Table` without changing its public props,
adding: localisable column headers and a `locale` for number and time
formatting (default stays `en-US`), and an empty row. Its tests must
still pass.

Out of scope: sorting, selection, virtualisation, editing.
