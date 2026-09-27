# Component vocabulary

Import everything from "@stoa/react". Use only these components plus
plain `div`, `section`, `header`, `main`, `aside`, `nav`, `h1`-`h3`, `p`.
Do not write CSS; layout comes from the components.

Page shells
- Page({ title, children }): the whole screen.
- Header({ title, subtitle, actions }): top of a page or region.
- Sidebar({ children }): navigation or a secondary column.
- Section({ title, children }): a titled region.
- Card({ title, children }): a bordered container.
- Tabs({ items: { id, label, content }[] }).
- Drawer({ title, open, children }): a panel over the page.

Data
- Metric({ label, value, delta?, unit? }): one number with a label.
- Delta({ value, basis }): a signed change against a basis.
- Trend({ series }): a small line of a series.
- Chart({ type: "line" | "bar" | "scatter", series, x, y }).
- DataTable({ columns, rows, selectable?, stickyFirstColumn?, onRowSelect? }).
- Comparison({ entities, metrics }): entities side by side on shared metrics.
- Timeline({ events }): events over time.
- AuditLog({ entries }): who did what, when.
- Status({ tone, label }).
- EmptyData, PartialData, StaleData({ since }), ErrorData({ retry }).

Controls
- FilterBar({ filters }): filters that persist while working.
- SavedViews({ views }): named filter and column sets.
- Button({ label, onPress, variant? }).
- BulkActions({ actions }): actions on selected rows.

Patterns (composed shells)
- Explorer({ toolbar, table, detail }): browse and filter many records.
- Compare({ entities, metrics, evidence }): two or more entities on shared metrics.
- Inspector({ primary, context, history, actions }): one record in depth.
- Monitor({ signals, exceptions }): watch values and surface exceptions.
- ReviewQueue({ items, current, decision }): work through items one by one.
- Dashboard({ metrics, charts, table }): overview of many measures.
