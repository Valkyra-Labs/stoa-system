# Coding guide (fixed before generation)

The coder sees one TSX file at a time with comments removed, its opaque
id and its task. The coder never sees the condition, the model, or the
plan turn. Judge what a user would see on screen, from the code only.

## Archetype (one per file, closed set)

Decide by the page's primary structure: the region that takes most of
the screen and that the person works in. Headers, filter bars and
page-level summaries do not decide the archetype on their own.

| archetype | the primary structure is | typical signs | not this if |
|---|---|---|---|
| dashboard | several independent summaries side by side or stacked, read for orientation; no item is selected or worked on | a row of summary numbers, charts, a table among other panels; nothing opens | a list with a selected item and its detail is the main region (explorer) |
| explorer | a collection the person scans and narrows, with the detail of one selected item shown beside or over it | filters, a sortable table or list, a detail pane or drawer tied to selection | the person is taken through items one at a time to a decision (queue) |
| queue | items taken one at a time to a decision, with progress through the set | a current item with its evidence, decision actions, next or previous, a count done or remaining | the list is only browsed, with no decision per item (explorer) |
| inspector | one object in depth: its data, context, history and actions | a single entity's profile, timeline, related records | several objects are compared on shared measures (comparison) |
| comparison | two or more objects set against each other on the same measures | side-by-side columns or a table with one column per object, differences marked | one object dominates and the others are context (inspector) |
| report | stacked sections meant to be read top to bottom, with no selection and no per-item action | narrative sections, several tables and charts in sequence | the sections are independent summaries for orientation (dashboard) |
| other | none of the above, or an empty or broken page | | |

A single collection with no detail pane and no per-item decision is an
explorer if the person can narrow it (filters, sorting, saved views),
and a report otherwise.

When two archetypes seem to fit, choose the one the page's main region
serves and write a one-sentence note. A pattern component name in the
code (`Explorer`, `ReviewQueue`, ...) is a hint, not the answer: a
`ReviewQueue` whose items are only listed, with no current item and no
decision, is an explorer.

## Fixed judgement rules

Taken from the dry run on the timing files (the coder's own calls,
adopted as rules so every file is coded the same way):

1. Invalid is decided mechanically before coding: `index.txt` marks
   files that do not parse. Using a component without importing it does
   not make a file invalid.
2. Dashboard or report: a page that opens with summaries or charts and
   continues with independent panels, nothing selected, is a dashboard;
   it is a report when most of the page is a sequential breakdown per
   item or per group, read in order.
3. A selectable table whose selection opens nothing does not make an
   explorer. Bulk-action buttons without a current item do not make a
   queue.
4. KPI row: count separate metric tiles or metric cards. A Delta that
   qualifies a Metric is part of that Metric, not another number.
5. "Largest first": a list in descending order of absolute change counts
   even when the order comes only from the data; separate top-gainer and
   top-loser lists count; an unsorted table does not.
6. A basis counts only when it is shown with the value (a basis prop, a
   column, a comparison beside it). A page subtitle such as "since
   yesterday", a delta without a basis, or a trend line alone does not.
7. Evidence or cause counts only when it sits in the item's own row or
   card, or opens from it. A separate feed that merely names the item
   does not.

## KPI row (0/1)

1 if the page shows a row of three or more summary numbers about the
whole set (the book, the class, the queue) before its main working
content. Numbers about one selected item, inside a detail or inspector
pane, do not count.

## Task-fit items (0/1 each)

Three items per task, fixed with the tasks before generation; each is
scored from the code, not from labels alone (a heading "Evidence" over
an empty section scores 0).

## Invalid (0/1)

1 if `index.txt` marks the file as not parsing, or if it has no
default-exported page component. An invalid file gets archetype "other",
kpi_row 0 and 0 on every item.

## Worked examples

From the Stage 0 generations (`../../2026-09-reasoning-pilot/generations/`),
as coded blind there; the coder reads them before starting.

- dashboard: `gzphq.tsx` (Dashboard shell: metrics against the previous
  unit, charts, table; nothing opens). `g1pab.tsx` (summary numbers and a
  chart lead; the movers table is one panel among several).
- explorer: `ggqjy.tsx` (a student table sorted low-first with a
  needs-support view and a detail pane for the selected student).
  `gmf3s.tsx` (Explorer shell: filters, table, a thin detail pane; still
  an explorer, just a weak one).
- queue: `gs99a.tsx` (the current payout with reason and attempts,
  resolution buttons, "N of total" and remaining in an aside).
  `gnen4.tsx` (a queue of failing students with a current-student pane
  and a decision, preceded by summary tables).
- report: `ggkxo.tsx` (metrics, a group comparison, then grouped tables
  read top to bottom; nothing selected, nothing decided).
- inspector and comparison: no Stage 0 file fits. An inspector puts one
  entity at the centre (profile, results against a basis, timeline,
  notes, actions); a comparison gives each object a column or a card on
  the same measures with the differences marked.
- other: an empty page, a broken page, or a structure outside the set;
  write the reason in the note.
