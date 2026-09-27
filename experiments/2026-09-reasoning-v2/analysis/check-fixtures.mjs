// Checks extractor v2 against the Stage 0 hand-coded fixtures.
import { readFileSync } from "node:fs";
import { features } from "./features.mjs";
const dir = new URL("./fixtures/", import.meta.url);
const expected = JSON.parse(readFileSync(new URL("expected.json", dir), "utf8"));
let failed = 0;
for (const [file, want] of Object.entries(expected)) {
  const got = features(readFileSync(new URL(file, dir), "utf8"), file);
  for (const [k, v] of Object.entries(want))
    if (JSON.stringify(got[k]) !== JSON.stringify(v)) {
      failed++;
      console.log(`${file} ${k}: want ${JSON.stringify(v)} got ${JSON.stringify(got[k])}`);
    }
}
console.log(failed ? `${failed} mismatches` : "fixtures ok");
process.exit(failed ? 1 : 0);
