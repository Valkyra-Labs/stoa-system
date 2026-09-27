# Coding guide (draft, fixed before generation once approved)

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

When two archetypes seem to fit, choose the one the page's main region
serves and write a one-sentence note. A pattern component name in the
code (`Explorer`, `ReviewQueue`, ...) is a hint, not the answer: a
`ReviewQueue` whose items are only listed, with no current item and no
decision, is an explorer.

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

1 if the file does not parse as TSX or has no default-exported page
component. An invalid file gets archetype "other" and 0 on every item.

## Worked examples

Two per archetype, taken from the Stage 0 generations and the
calibration files, are added here before the run, with the reasons.
