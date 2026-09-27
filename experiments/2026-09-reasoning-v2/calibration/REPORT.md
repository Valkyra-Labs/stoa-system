# Calibration run (not evidence)

2026-09-27, stoa-system at ad8ffbb plus the uncommitted v2 drafts committed
with this report. ollama 0.32.1 on an Apple M4 Pro (24 GB), qwen3:8b
(digest in `out/records.jsonl`), thinking off, temperature 0.7, top_p
0.8, num_ctx 8192, num_predict 4096. One task (the teacher, T1), four
draft conditions (components, generic, rules, reasoning), seeds 1 and 2:
8 generations. Purpose: check the plumbing before a protocol is written.
Nothing here is used as evidence.

## Findings

1. Context and truncation are fine: prompts took 563 (components) to
   1,100 (generic) tokens of 8,192; all 8 stopped normally; all 8 put
   the file in a fenced block and imported only `@stoa/react`.
2. One of 8 files does not parse (c5: a stray brace inside a data
   array). The protocol needs a pre-declared rule for invalid files.
3. The manipulation check fails more often than it passes: the rules
   and reasoning conditions both ask for a planning comment; only 1 of
   4 generations wrote it (c4). The protocol must measure compliance
   per generation, and consider asking for the analysis in a separate
   first turn for every condition.
4. Output length varied from 1,150 to 2,279 tokens; with 2 samples per
   condition no condition effect can be read. Record output tokens as a
   covariate.
5. **A fixed seed does not reproduce the output.** Re-running c1 and c4
   with the same seed and options gave different files (c1: 1,454 then
   1,401 output tokens; c4: 1,643 then 1,620). A manifest can record
   the seed but must not claim reproducible generations on this setup.
   Check temperature 0 and llama.cpp with a single slot before claiming
   anything stronger.
6. Wall time: 30 to 47 s per generation for qwen3:8b with thinking off.
   Other models are unmeasured.
7. The pilot's mechanical extractor still reports a KPI row in 6 of 8;
   it is the extractor that agreed with blind coding on 29 of 36 in
   Stage 0, so this is not a structural result.
