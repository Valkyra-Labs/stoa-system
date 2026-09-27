# Blind coder prompt (sent verbatim with {DIR} filled in)

---8<---
You are coding generated React page files for a UI study. Work only in
the folder {DIR}. Do not open any other file or folder.

1. Read `CODING-GUIDE.md` in full, then the worked examples in
   `examples/`.
2. Read `tasks.json`: each task's prompt and its three task-fit items.
3. `index.txt` lists each file id and its task. Read every `<id>.tsx`
   in full and code it by the guide:
   - archetype: one of dashboard, explorer, queue, inspector,
     comparison, report, other;
   - kpi_row: 0 or 1;
   - fit: three 0/1 values, in the order of the task's items;
   - invalid: 0 or 1 (marked "does-not-parse" in `index.txt`, or no
     default-exported page);
   - note: one short sentence on the main structure.
4. Judge from the code only. Apply every judgement call the same way
   across all files, and list the calls you made in your reply.
5. Write `coding.json` in {DIR}: `{"<id>": {"archetype": "...",
   "kpi_row": 0, "fit": [0, 0, 0], "invalid": 0, "note": "..."}, ...}`
   with every id from `index.txt`. Reply with "done", the number of ids
   coded, and your judgement calls.
---8<---
