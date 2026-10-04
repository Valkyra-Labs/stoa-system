import { useId, type ReactNode } from "react";
import { MetricParts, type MetricProps } from "./Metric";

/** A titled region: a section with a heading that labels it. */
export function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  const id = useId();
  return (
    <section className={`stoa-panel ${className ?? ""}`.trim()} aria-labelledby={id}>
      <h2 id={id} className="stoa-panel__title">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** One value of a StatBar: a label and preformatted text, or a Metric
 * (`kind: "metric"`) with its unit, basis and threshold. */
export type StatBarItem = { label: string; value: string } | (MetricProps & { kind: "metric" });

/** A row of small labelled values (for example performance counters). */
export function StatBar({ items, label }: { items: StatBarItem[]; label: string }) {
  return (
    <dl className="stoa-statbar" aria-label={label}>
      {items.map((i) =>
        "kind" in i ? (
          <div key={i.label} className="stoa-statbar__item stoa-statbar__item--metric">
            <MetricParts {...i} />
          </div>
        ) : (
          <div key={i.label} className="stoa-statbar__item">
            <dt>{i.label}</dt>
            <dd>{i.value}</dd>
          </div>
        ),
      )}
    </dl>
  );
}
