# Interface rules

Follow these rules when you build the screen. They apply to every
screen; none of them depends on the task.

Order and emphasis
- Put the exceptions and the items needing action before the averages.
- Sort lists of changes by the size of the change, largest first, unless
  the person asked for another order.
- Show at most one level of emphasis per region; the most important
  value on the screen should be obvious without reading every label.

Numbers
- Every number shown for judgement carries its basis: the target, the
  previous period, the peer group or the threshold (Delta with basis).
- Right-align numbers in tables and keep the identifying column sticky.
- Show units and time frames next to the values, not in a legend.
- Show freshness for live or imported data (StaleData, time stamps).

Working with lists
- Keep context while drilling in: open detail beside the list, not
  instead of it.
- Filters that shape the work persist (FilterBar, SavedViews); do not
  hide them in a menu.
- Offer BulkActions when the same action applies to many rows.
- Show how far the person has got through a list of work: done,
  remaining, current position.

Evidence and actions
- Put the evidence for a decision next to the decision: the reason,
  the history, the source. Do not hide it behind hover or a second page.
- State the consequence of an action before it runs, next to the
  button that runs it.
- Give every destructive or irreversible action a confirmation step.

States
- Design the empty, partial, stale and error states of every data
  region (EmptyData, PartialData, StaleData, ErrorData), not only the
  full one.

Avoid
- A row of KPI cards by default. Use Metric only for measures the person
  acts on, and group related measures in one Comparison or table.
- Wrapping every table or chart in a Card.
- A chart when exact comparison is the task; use a table with deltas.
- A sidebar of navigation that the task does not need.
- Decorative regions that carry no information the person uses.
- Repeating the same number in two places on the screen.

Before writing code, state in one comment at the top of the file which
of these rules shaped the screen most.
