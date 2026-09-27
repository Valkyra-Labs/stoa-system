# Calibration coder prompt (Claude, from code; sent verbatim with {DIR})

---8<---
You are coding generated React page files for a measurement study. Work
only in the folder {DIR}. Do not open any other file or folder.

1. Read `RUBRIC-DRAFT.md` (sections "Principle" and "Features") and
   `features.json`: seven yes/no questions, each with what counts and
   what does not.
2. `index.txt` lists each file id and its task; `tasks.json` holds the
   task prompts. Read every `<id>.tsx` in full.
3. For each file answer every feature 1 (yes) or 0 (no), judging what a
   user would see on screen when the page renders, from the code only.
   Do not name an archetype. Add a one-sentence note on anything that
   made a question hard to answer.
4. Write `coding.json` in {DIR}: `{"<id>": {"features": [F1, F2, F3, F4,
   F5, F6, F7], "note": "..."}, ...}` with every id from `index.txt`.
   Reply with "done", the number of ids coded, and the judgement calls
   you made, applied the same way to every file.
---8<---
