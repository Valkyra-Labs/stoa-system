import { useId, type ReactNode } from "react";

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

/** A row of small labelled values (for example performance counters). */
export function StatBar({ items, label }: { items: { label: string; value: string }[]; label: string }) {
  return (
    <dl className="stoa-statbar" aria-label={label}>
      {items.map((i) => (
        <div key={i.label} className="stoa-statbar__item">
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
