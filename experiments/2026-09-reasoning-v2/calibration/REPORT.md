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

## Addendum: determinism (same day)

Same prompt (components condition, T1), qwen3:8b, thinking off.

| engine | settings | runs | identical |
|---|---|---|---|
| ollama 0.32.1 | temperature 0, seed 1 | 2 | yes (2,045 tokens both) |
| ollama 0.32.1 | temperature 0.7, seed 1 | 2 | no (finding 5) |
| llama.cpp server b10150 (dee2a846b), one slot | temperature 0.7, top_p 0.8, seed 1, prompt cache on | 2 | no (1,947 then 2,064 tokens) |
| same | prompt cache off (`cache_prompt: false`) | 2, plus the first run above | yes, all three byte-identical (1,947 tokens) |

Reading: sampling with a seed is deterministic; the variation came from
reusing the cached prompt between requests, which changes the numerics
of the prompt pass. With one slot and the prompt cache off, llama.cpp
reproduces a sampled generation exactly on this machine (3 of 3). This
is one prompt and one model; the full run should re-generate a random
sample of files and report how many match byte for byte.

## Addendum: two-turn timing and reproducibility on llama.cpp (same day)

`runner/llama.mjs`, llama.cpp 10150 (dee2a846b), one slot, prompt cache off,
temperature 0.7, top_p 0.8, seed 1, task P2 (portfolio manager), the
four draft conditions after the planning-comment lines were removed and
lengths balanced (generic 370, rules 373, reasoning 378 words). Plan
turn, then file turn. Files in `timing/out/`.

| model | wall time per two-turn generation | files that parse | repeat of the reasoning run |
|---|---|---|---|
| qwen3:8b | 26 to 33 s | 5 of 5 | plan and file byte-identical |
| qwen2.5:14b | 33 to 60 s | 4 of 5 (t11 does not parse) | plan and file byte-identical |
| qwen3.5:4b | not run | | ollama's GGUF does not load in this llama.cpp build: `qwen35.rope.dimension_sections has wrong array length; expected 4, got 3` |

- The plan turn is followed: each plan speaks in its condition's terms
  (the reasoning plans answer steps 1 to 5; the rules plans name
  rules), unlike the single-turn planning comment (1 of 4).
- Reproducibility now holds on two models and both turns.
- At these times 288 generations over three models of this size take
  roughly three hours; the third model's time is unknown until it runs.

## Addendum: qwen3.5:4b and a blind-coder dry run (same day)

- qwen3.5:4b from `bartowski/Qwen_Qwen3.5-4B-GGUF` (Q4_K_M, sha256
  verified): loads in llama.cpp, 28 to 46 s per two-turn generation,
  repeat run byte-identical in both turns, plans in plain text (no
  thinking leaked with thinking off).
- Blind coder dry run (Opus subagent, the pre-registered prompt and
  guide) on the 10 two-turn timing files: valid JSON for all ids,
  identical codes for the byte-identical repeats, t11 marked invalid.
  Its seven judgement calls were adopted into the guide as fixed rules,
  and invalid files are now marked mechanically. The codes themselves
  are not used anywhere.
