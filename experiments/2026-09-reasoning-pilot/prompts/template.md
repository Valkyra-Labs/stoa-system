# Generation prompt (filled per run by analysis/plan.mjs)

Each generation is one fresh subagent. The text between the markers is
sent verbatim with {CONDITION}, {TASK} and {PATH} filled in.

---8<---
You are generating one screen for a UI study. Use only what is written
below. Do not read files, search, browse or run commands. Use the Write
tool exactly once.

<context>
{CONDITION}
</context>

Task: {TASK}

Output: one TSX file with a single default-exported page component. Import
only from "@stoa/react" and use only the components and plain elements
the context allows. Put realistic placeholder data inline. Write the file
to {PATH} with the Write tool, then reply with the single word: done
---8<---
