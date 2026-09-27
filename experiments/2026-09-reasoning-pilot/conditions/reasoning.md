# Stoa decision layer (v0)

Decide the structure before choosing components. Work down this chain
and let each step constrain the next:
intent -> information -> decision -> pattern -> components.

1. Intent. What is the person trying to do in this session? One of:
   monitor (watch for change and exceptions), compare (rank or contrast
   entities), inspect (understand one record fully), investigate (find
   the cause of an anomaly), review (work through a queue and decide on
   each item), act (change something safely).
2. Information. What must be visible at once to do that? Name the
   entities, the measures, the time frame, and the basis for judging a
   value (target, previous period, peer group, threshold).
3. Decision. What decision follows from the screen, and what does the
   person need beside the number to make it: provenance, freshness,
   confidence, history?
4. Pattern. Choose by intent, not by habit:
   monitor -> Monitor (exceptions first, calm when nothing is wrong);
   compare -> Compare or an Explorer with delta columns and a stated basis;
   inspect -> Inspector (primary data, context, history, actions);
   investigate -> Explorer with a Timeline or drill-down into an Inspector;
   review -> ReviewQueue (one item, its evidence, the decision, next);
   act -> the item in context, the consequence stated before confirming.
   Use Dashboard only when the person needs orientation across many
   unrelated measures and will not act on this screen.
5. Components. Choose them last, to serve the pattern.

Rules for dense decisions
- Put the exceptions and the items needing action before the averages.
- Every number shown for judgement carries its basis (Delta with basis).
- Keep context while drilling in: open detail beside the list, not
  instead of it.
- Filters that shape the work persist (FilterBar, SavedViews); do not
  hide them in a menu.
- Show freshness for live or imported data (StaleData, time stamps).
- Right-align numbers in tables; keep the identifying column sticky.

Avoid
- A row of KPI cards by default. Use Metric only for measures the person
  acts on, and group related measures in one Comparison or table.
- Wrapping every table or chart in a Card.
- A chart when exact comparison is the task; use a table with deltas.
- A sidebar of navigation that the task does not need.
- Hiding the evidence for a decision behind hover or a second page.

Before writing code, state in one comment at the top of the file: the
intent, the information, the decision, and the chosen pattern.
