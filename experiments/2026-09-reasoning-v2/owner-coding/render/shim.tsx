// Plain implementations of the experiment's component vocabulary, used only
// to render generated screens for blind coding. They are deliberately
// neutral and identical for every condition. Props are read leniently,
// because generated code passes many shapes for the same idea.
import React, { useState } from "react";

type Any = any;
const isEl = React.isValidElement;

const TONE: Record<string, string> = {
  success: "#1f7a4d", positive: "#1f7a4d", good: "#1f7a4d", ok: "#1f7a4d", up: "#1f7a4d",
  warning: "#9a5b00", caution: "#9a5b00", attention: "#9a5b00",
  danger: "#b3261e", critical: "#b3261e", error: "#b3261e", negative: "#b3261e", bad: "#b3261e", down: "#b3261e",
  info: "#2a5bd7", accent: "#2a5bd7",
};
const toneColor = (t: Any) => TONE[String(t ?? "").toLowerCase()] ?? "#5f5b53";

export function show(v: Any): React.ReactNode {
  if (v == null || v === false || v === true) return null;
  if (isEl(v)) return v;
  if (typeof v === "function") return null;
  if (Array.isArray(v)) {
    if (v.every((x) => isEl(x))) return v.map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>);
    return v.map((x, i) => (
      <React.Fragment key={i}>{show(x)}{i < v.length - 1 && !isEl(x) ? ", " : null}</React.Fragment>
    ));
  }
  if (v instanceof Date) return v.toLocaleDateString();
  if (typeof v === "object") {
    if ("label" in v && "value" in v) return `${show(v.label)}: ${stringOf(v.value)}`;
    const name = labelOf(v);
    if (name) return name;
    const s = JSON.stringify(v);
    return s.length > 80 ? s.slice(0, 77) + "..." : s;
  }
  if (typeof v === "number") return fmtNum(v);
  return String(v);
}
const stringOf = (v: Any) => (typeof v === "number" ? fmtNum(v) : typeof v === "object" && v ? labelOf(v) || JSON.stringify(v) : String(v ?? ""));
const fmtNum = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { maximumFractionDigits: 2 }));
export function labelOf(o: Any): string {
  if (o == null) return "";
  if (typeof o === "string" || typeof o === "number") return String(o);
  if (isEl(o)) return "";
  return String(o.label ?? o.title ?? o.name ?? o.header ?? o.heading ?? o.displayName ?? o.id ?? o.key ?? "");
}
const safe = (fn: () => Any, fallback: Any = null) => { try { return fn(); } catch { return fallback; } };
const call = (fn: Any, ...args: Any[]) => { if (typeof fn === "function") safe(() => fn(...args)); };

function Box({ kind, title, children, style, actions }: Any) {
  return (
    <section className={`s-box s-${kind}`} style={style}>
      {(title || actions) && (
        <div className="s-box-head">
          {title ? <h3 className="s-box-title">{show(title)}</h3> : <span />}
          {actions ? <div className="s-actions">{show(actions)}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

// ---------- page shells ----------

export function Page({ title, children, sidebar, header, actions }: Any) {
  const kids = React.Children.toArray(children);
  const side = kids.filter((k: Any) => isEl(k) && (k.type === Sidebar || k.type === "aside" || k.type === "nav"));
  const rest = kids.filter((k) => !side.includes(k));
  return (
    <div className="s-page">
      {title && <div className="s-page-title">{show(title)}{actions ? <div className="s-actions">{show(actions)}</div> : null}</div>}
      {header ? show(header) : null}
      {side.length || sidebar ? (
        <div className="s-with-side">
          <div>{sidebar ? <Sidebar>{show(sidebar)}</Sidebar> : null}{side}</div>
          <div className="s-stack">{rest}</div>
        </div>
      ) : (
        <div className="s-stack">{rest}</div>
      )}
    </div>
  );
}
export function Header({ title, subtitle, actions, children, description }: Any) {
  return (
    <header className="s-header">
      <div>
        {title ? <h1 className="s-h1">{show(title)}</h1> : null}
        {subtitle || description ? <div className="s-sub">{show(subtitle ?? description)}</div> : null}
        {children}
      </div>
      {actions ? <div className="s-actions">{show(actions)}</div> : null}
    </header>
  );
}
export function Sidebar({ children, title }: Any) {
  return <aside className="s-sidebar">{title ? <div className="s-box-title">{show(title)}</div> : null}{children}</aside>;
}
export function Section({ title, children, actions, description }: Any) {
  return (
    <Box kind="section" title={title} actions={actions}>
      {description ? <div className="s-sub">{show(description)}</div> : null}
      <div className="s-stack">{children}</div>
    </Box>
  );
}
export function Card({ title, children, actions, footer, subtitle }: Any) {
  return (
    <Box kind="card" title={title} actions={actions}>
      {subtitle ? <div className="s-sub">{show(subtitle)}</div> : null}
      <div className="s-stack">{children}</div>
      {footer ? <div className="s-footer">{show(footer)}</div> : null}
    </Box>
  );
}
export function Tabs({ items, tabs, children, defaultValue, defaultSelected }: Any) {
  const list: Any[] = Array.isArray(items) ? items : Array.isArray(tabs) ? tabs : [];
  const first = list.findIndex((t) => (t?.id ?? t?.key) === (defaultValue ?? defaultSelected));
  const [i, setI] = useState(first >= 0 ? first : 0);
  if (!list.length) return <div className="s-stack">{children}</div>;
  const cur = list[Math.min(i, list.length - 1)] ?? {};
  return (
    <div className="s-tabs">
      <div className="s-tablist" role="tablist">
        {list.map((t, k) => (
          <button key={k} role="tab" aria-selected={k === i} className={k === i ? "on" : ""} onClick={() => setI(k)}>
            {labelOf(t) || `Tab ${k + 1}`}
          </button>
        ))}
      </div>
      <div className="s-stack">{show(cur.content ?? cur.panel ?? cur.children ?? cur.render?.())}</div>
    </div>
  );
}
export function Drawer({ title, open, isOpen, children, onClose, onOpenChange }: Any) {
  const shown = open ?? isOpen;
  if (!shown) return null;
  return (
    <div className="s-drawer" role="dialog">
      <div className="s-box-head">
        <h3 className="s-box-title">{show(title)}</h3>
        <button className="s-btn" onClick={() => { call(onClose); call(onOpenChange, false); }}>Close</button>
      </div>
      <div className="s-stack">{children}</div>
    </div>
  );
}

// ---------- data ----------

export function Delta({ value, basis, children, direction }: Any) {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  const up = direction ? direction === "up" : n > 0;
  const down = direction ? direction === "down" : n < 0;
  const text = typeof value === "number" ? `${value > 0 ? "+" : ""}${fmtNum(value)}` : stringOf(value ?? children);
  return (
    <span className="s-delta" style={{ color: up ? TONE.up : down ? TONE.down : "#5f5b53" }}>
      {up ? "▲ " : down ? "▼ " : ""}{text}
      {basis != null && basis !== "" ? <span className="s-basis"> vs {stringOf(basis)}</span> : null}
    </span>
  );
}
export function Metric({ label, value, delta, unit, trend, status, tone, basis, description, children }: Any) {
  let d: React.ReactNode = null;
  if (isEl(delta)) d = delta;
  else if (delta && typeof delta === "object") d = <Delta value={delta.value} basis={delta.basis ?? basis} direction={delta.direction} />;
  else if (delta != null) d = <Delta value={delta} basis={basis} />;
  return (
    <div className="s-metric">
      <div className="s-metric-label">{show(label)}</div>
      <div className="s-metric-value" style={tone || status ? { color: toneColor(tone ?? status) } : undefined}>
        {show(value)}{unit ? <span className="s-unit"> {show(unit)}</span> : null}
      </div>
      {d ? <div>{d}</div> : null}
      {trend ? <Trend series={trend} /> : null}
      {description ? <div className="s-sub">{show(description)}</div> : null}
      {children}
    </div>
  );
}

function numbersOf(series: Any): number[] {
  if (!Array.isArray(series)) return [];
  return series
    .map((p) => (typeof p === "number" ? p : p && typeof p === "object" ? p.value ?? p.y ?? p.v ?? Object.values(p).find((x) => typeof x === "number") : NaN))
    .filter((x) => typeof x === "number" && isFinite(x));
}
export function Trend({ series, data, values }: Any) {
  const ns = numbersOf(series ?? data ?? values);
  if (ns.length < 2) return <span className="s-sub">(trend)</span>;
  return <Spark ns={ns} w={120} h={28} />;
}
function Spark({ ns, w, h }: { ns: number[]; w: number; h: number }) {
  const min = Math.min(...ns), max = Math.max(...ns), span = max - min || 1;
  const pts = ns.map((v, i) => `${(i / (ns.length - 1)) * w},${h - 2 - ((v - min) / span) * (h - 4)}`).join(" ");
  return <svg width={w} height={h} className="s-spark"><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

type Series = { name: string; values: number[] };
function seriesOf(props: Any): { labels: string[]; series: Series[] } {
  const raw = props.series ?? props.data ?? props.datasets ?? [];
  if (!Array.isArray(raw) || !raw.length) return { labels: [], series: [] };
  if (raw.every((x: Any) => typeof x === "number")) return { labels: raw.map((_: Any, i: number) => String(i + 1)), series: [{ name: "", values: raw }] };
  if (raw.every((x: Any) => x && typeof x === "object" && Array.isArray(x.data ?? x.values ?? x.points))) {
    const series = raw.map((s: Any) => ({ name: labelOf(s), values: numbersOf(s.data ?? s.values ?? s.points) }));
    const first = raw[0].data ?? raw[0].values ?? raw[0].points;
    const labels = first.map((p: Any, i: number) => (p && typeof p === "object" ? String(p.x ?? p.label ?? p.date ?? i + 1) : String(i + 1)));
    return { labels, series };
  }
  const objs = raw.filter((x: Any) => x && typeof x === "object");
  const keys = Object.keys(objs[0] ?? {});
  const xKey = typeof props.x === "string" ? props.x : keys.find((k) => typeof objs[0][k] !== "number") ?? keys[0];
  const yKeys: string[] = Array.isArray(props.y) ? props.y : typeof props.y === "string" ? [props.y] : keys.filter((k) => k !== xKey && typeof objs[0][k] === "number");
  return { labels: objs.map((o: Any) => String(o[xKey] ?? "")), series: yKeys.map((k) => ({ name: k, values: objs.map((o: Any) => Number(o[k])) })) };
}
const PALETTE = ["#2a5bd7", "#1f7a4d", "#9a5b00", "#b3261e", "#6b4bb8"];
export function Chart(props: Any) {
  const { labels, series } = safe(() => seriesOf(props), { labels: [], series: [] });
  const type = String(props.type ?? "line");
  const title = props.title ?? props.label;
  const W = 520, H = 160, P = 24;
  const all = series.flatMap((s) => s.values).filter((v) => isFinite(v));
  if (!all.length) return <Box kind="chart" title={title}><div className="s-placeholder">{type} chart (no data)</div></Box>;
  const min = Math.min(0, ...all), max = Math.max(...all), span = max - min || 1;
  const n = Math.max(...series.map((s) => s.values.length));
  const X = (i: number) => P + (n <= 1 ? 0 : (i / (n - 1)) * (W - 2 * P));
  const Y = (v: number) => H - P - ((v - min) / span) * (H - 2 * P);
  return (
    <Box kind="chart" title={title}>
      <svg viewBox={`0 0 ${W} ${H}`} className="s-chart" preserveAspectRatio="none">
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#c9c4b9" />
        {series.map((s, si) =>
          type.includes("bar")
            ? s.values.map((v, i) => {
                const bw = ((W - 2 * P) / n / series.length) * 0.8;
                return <rect key={`${si}-${i}`} x={P + (i * (W - 2 * P)) / n + si * bw} y={Math.min(Y(v), Y(0))} width={bw} height={Math.abs(Y(v) - Y(0))} fill={PALETTE[si % 5]} />;
              })
            : type.includes("scatter")
              ? s.values.map((v, i) => <circle key={`${si}-${i}`} cx={X(i)} cy={Y(v)} r={3} fill={PALETTE[si % 5]} />)
              : <polyline key={si} fill="none" stroke={PALETTE[si % 5]} strokeWidth="2" points={s.values.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} />,
        )}
      </svg>
      <div className="s-legend">
        {series.map((s, i) => s.name ? <span key={i}><i style={{ background: PALETTE[i % 5] }} />{s.name}</span> : null)}
        {labels.length ? <span className="s-sub">{labels[0]} ... {labels[labels.length - 1]}</span> : null}
      </div>
    </Box>
  );
}

const colKey = (c: Any) => (typeof c === "string" ? c : c?.key ?? c?.field ?? c?.accessor ?? c?.accessorKey ?? c?.dataKey ?? c?.dataIndex ?? c?.id ?? c?.name);
function cellOf(row: Any, c: Any, i: number): React.ReactNode {
  return safe(() => {
    const k = colKey(c);
    const val = Array.isArray(row) ? row[i] : typeof k === "function" ? k(row) : row?.[k];
    const r = typeof c === "object" ? c.render ?? c.cell ?? c.renderCell ?? c.format ?? c.formatter : null;
    return typeof r === "function" ? show(r(val, row)) : show(val);
  }, "(error)");
}
export function DataTable({ columns, rows, data, selectable, onRowSelect, onRowClick, onSelect, onSelectionChange, stickyFirstColumn, title, caption, emptyMessage }: Any) {
  const list: Any[] = Array.isArray(rows) ? rows : Array.isArray(data) ? data : [];
  let cols: Any[] = Array.isArray(columns) && columns.length ? columns : list[0] && typeof list[0] === "object" && !Array.isArray(list[0]) ? Object.keys(list[0]).filter((k) => typeof list[0][k] !== "object" || isEl(list[0][k])) : [];
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const pick = onRowSelect ?? onRowClick ?? onSelect;
  return (
    <div className="s-table-wrap">
      {title || caption ? <div className="s-box-title">{show(title ?? caption)}</div> : null}
      <table className="s-table">
        <thead>
          <tr>
            {selectable ? <th /> : null}
            {cols.map((c, i) => <th key={i} className={i === 0 && stickyFirstColumn ? "sticky" : ""}>{typeof c === "string" ? c : labelOf({ label: c.label ?? c.header ?? c.title ?? c.name, key: colKey(c) })}</th>)}
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={cols.length + (selectable ? 1 : 0)} className="s-sub">{show(emptyMessage) ?? "No rows"}</td></tr>
          ) : (
            list.slice(0, 50).map((row, r) => (
              <tr key={r} className={sel === r ? "sel" : pick ? "click" : ""} onClick={() => { if (pick) { setSel(r); call(pick, row, r); } }}>
                {selectable ? (
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={checked.has(r)} onChange={() => { const n = new Set(checked); n.has(r) ? n.delete(r) : n.add(r); setChecked(n); call(onSelectionChange, [...n].map((x) => list[x])); }} />
                  </td>
                ) : null}
                {cols.map((c, i) => {
                  const v = cellOf(row, c, i);
                  return <td key={i} className={`${typeof v === "string" && /^[-+$€£]?[\d,.]+%?$/.test(v) ? "num" : ""} ${i === 0 && stickyFirstColumn ? "sticky" : ""}`}>{v}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {list.length > 50 ? <div className="s-sub">{list.length} rows</div> : null}
    </div>
  );
}

function valueFor(entity: Any, metric: Any, ei: number): React.ReactNode {
  return safe(() => {
    const key = typeof metric === "string" ? metric : metric?.key ?? metric?.id ?? metric?.field ?? metric?.name ?? metric?.label;
    const eKey = labelOf(entity);
    const mv = metric && typeof metric === "object" ? metric.values ?? metric.data : null;
    if (Array.isArray(mv)) return show(mv[ei]);
    if (mv && typeof mv === "object") return show(mv[eKey] ?? mv[entity?.id] ?? Object.values(mv)[ei]);
    if (entity && typeof entity === "object") {
      const pools = [entity, entity.values, entity.metrics, entity.data].filter((p) => p && typeof p === "object");
      for (const p of pools) if (key in p) return show(p[key]);
    }
    return null;
  }, null);
}
export function Comparison({ entities, metrics, items, title }: Any) {
  const ents: Any[] = Array.isArray(entities) ? entities : Array.isArray(items) ? items : [];
  const mets: Any[] = Array.isArray(metrics) ? metrics : [];
  if (!ents.length) return <div className="s-placeholder">Comparison (no entities)</div>;
  return (
    <div className="s-table-wrap">
      {title ? <div className="s-box-title">{show(title)}</div> : null}
      <table className="s-table">
        <thead><tr><th />{ents.map((e, i) => <th key={i}>{labelOf(e) || `#${i + 1}`}</th>)}</tr></thead>
        <tbody>
          {mets.map((m, r) => (
            <tr key={r}><td className="s-rowhead">{typeof m === "string" ? m : labelOf({ label: m.label ?? m.name ?? m.title, key: m.key })}</td>{ents.map((e, i) => <td key={i}>{valueFor(e, m, i) ?? <span className="s-sub">-</span>}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Timeline({ events, items, title }: Any) {
  const list: Any[] = Array.isArray(events) ? events : Array.isArray(items) ? items : [];
  return (
    <div className="s-timeline">
      {title ? <div className="s-box-title">{show(title)}</div> : null}
      {list.map((e, i) => (
        <div key={i} className="s-event">
          <span className="s-when">{show(e?.date ?? e?.time ?? e?.timestamp ?? e?.at ?? e?.when)}</span>
          <span>{show(e?.title ?? e?.label ?? e?.event ?? e?.name)}{e?.description || e?.text || e?.detail ? <span className="s-sub"> {show(e.description ?? e.text ?? e.detail)}</span> : null}</span>
        </div>
      ))}
      {!list.length ? <div className="s-sub">No events</div> : null}
    </div>
  );
}
export function AuditLog({ entries, items, title }: Any) {
  const list: Any[] = Array.isArray(entries) ? entries : Array.isArray(items) ? items : [];
  return (
    <div className="s-timeline">
      {title ? <div className="s-box-title">{show(title)}</div> : null}
      {list.map((e, i) => (
        <div key={i} className="s-event">
          <span className="s-when">{show(e?.when ?? e?.time ?? e?.timestamp ?? e?.date ?? e?.at)}</span>
          <span><b>{show(e?.who ?? e?.user ?? e?.actor ?? e?.by)}</b> {show(e?.action ?? e?.what ?? e?.event ?? e?.description)}</span>
        </div>
      ))}
      {!list.length ? <div className="s-sub">No entries</div> : null}
    </div>
  );
}
export function Status({ tone, label, status, children, variant }: Any) {
  const t = tone ?? variant ?? status;
  return <span className="s-status" style={{ color: toneColor(t), borderColor: toneColor(t) }}>{show(label ?? children ?? status)}</span>;
}
const Notice = (kind: string) => ({ message, children, since, retry, onRetry, title }: Any) => (
  <div className={`s-notice s-${kind}`}>
    <b>{kind === "empty" ? "No data" : kind === "partial" ? "Partial data" : kind === "stale" ? "Stale data" : "Error"}</b>
    {since ? <span> since {show(since)}</span> : null}
    {title || message || children ? <span> {show(title ?? message ?? children)}</span> : null}
    {retry || onRetry ? <button className="s-btn" onClick={() => call(retry ?? onRetry)}>Retry</button> : null}
  </div>
);
export const EmptyData = Notice("empty");
export const PartialData = Notice("partial");
export const StaleData = Notice("stale");
export const ErrorData = Notice("error");

// ---------- controls ----------

export function Button({ label, children, onPress, onClick, variant, disabled }: Any) {
  return (
    <button className={`s-btn ${variant === "primary" ? "primary" : variant === "danger" || variant === "destructive" ? "danger" : ""}`} disabled={!!disabled} onClick={() => { call(onPress); call(onClick); }}>
      {show(label ?? children) || "Button"}
    </button>
  );
}
export function FilterBar({ filters, children }: Any) {
  const list: Any[] = Array.isArray(filters) ? filters : [];
  return (
    <div className="s-filterbar">
      {list.map((f, i) => {
        const opts = f && typeof f === "object" ? f.options ?? f.values ?? f.choices : null;
        const val = f && typeof f === "object" ? f.value ?? f.defaultValue ?? f.selected : null;
        return (
          <span key={i} className="s-filter">
            {labelOf(f) || "Filter"}{val != null ? <b>: {stringOf(Array.isArray(val) ? val.join(", ") : val)}</b> : Array.isArray(opts) && opts.length ? <span className="s-sub"> ({opts.slice(0, 4).map(labelOf).join(" / ")}{opts.length > 4 ? " ..." : ""})</span> : null}
          </span>
        );
      })}
      {!list.length && !children ? <span className="s-sub">Filters (none defined)</span> : null}
      {children}
    </div>
  );
}
export function SavedViews({ views, active, value }: Any) {
  const list: Any[] = Array.isArray(views) ? views : [];
  const [i, setI] = useState(Math.max(0, list.findIndex((v) => labelOf(v) === (active ?? value) || v?.id === (active ?? value))));
  return (
    <div className="s-views">
      <span className="s-sub">Views:</span>
      {list.map((v, k) => <button key={k} className={`s-chip ${k === i ? "on" : ""}`} onClick={() => setI(k)}>{labelOf(v) || `View ${k + 1}`}</button>)}
    </div>
  );
}
export function BulkActions({ actions, children }: Any) {
  const list: Any[] = Array.isArray(actions) ? actions : [];
  return (
    <div className="s-bulk">
      <span className="s-sub">With selected:</span>
      {list.map((a, i) => isEl(a) ? <React.Fragment key={i}>{a}</React.Fragment> : <Button key={i} label={labelOf(a)} onPress={a?.onPress ?? a?.onClick} variant={a?.variant} />)}
      {children}
    </div>
  );
}

// ---------- patterns ----------

function slot(v: Any, kind: string): React.ReactNode {
  if (v == null) return null;
  if (isEl(v) || typeof v !== "object") return show(v);
  if (Array.isArray(v)) {
    if (v.every(isEl)) return v.map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>);
    if (kind === "metrics" || kind === "signals") return <div className="s-row">{v.map((m, i) => isEl(m) ? <React.Fragment key={i}>{m}</React.Fragment> : <Metric key={i} {...(typeof m === "object" ? m : { label: String(m) })} />)}</div>;
    if (kind === "charts") return v.map((c, i) => isEl(c) ? <React.Fragment key={i}>{c}</React.Fragment> : <Chart key={i} {...c} />);
    if (kind === "actions" || kind === "decision") return <div className="s-actions">{v.map((a, i) => isEl(a) ? <React.Fragment key={i}>{a}</React.Fragment> : <Button key={i} label={labelOf(a)} onPress={a?.onPress} variant={a?.variant} />)}</div>;
    if (kind === "history") return <Timeline events={v} />;
    if (kind === "items") return <div className="s-list">{v.map((it, i) => <div key={i} className={`s-list-item ${i === 0 ? "on" : ""}`}>{labelOf(it) || show(it)}</div>)}</div>;
    return <DataTable rows={v} />;
  }
  if (kind === "table" && (v.rows || v.data)) return <DataTable {...v} />;
  return <dl className="s-kv">{Object.entries(v).slice(0, 12).map(([k, x]) => <React.Fragment key={k}><dt>{k}</dt><dd>{show(x)}</dd></React.Fragment>)}</dl>;
}
const Region = ({ name, children }: Any) => <div className={`s-region s-r-${name}`}>{children}</div>;

export function Explorer({ toolbar, table, detail, title, children }: Any) {
  return (
    <Box kind="pattern" title={title}>
      {toolbar ? <Region name="toolbar">{slot(toolbar, "toolbar")}</Region> : null}
      <div className={detail ? "s-split" : ""}>
        <Region name="table">{slot(table, "table")}</Region>
        {detail ? <Region name="detail">{slot(detail, "detail")}</Region> : null}
      </div>
      {children}
    </Box>
  );
}
export function ReviewQueue({ items, current, decision, title, progress, children }: Any) {
  return (
    <Box kind="pattern" title={title}>
      {progress ? <div className="s-sub">{show(progress)}</div> : null}
      <div className="s-queue">
        <Region name="items">{slot(items, "items")}</Region>
        <Region name="current">{slot(current, "current")}</Region>
        <Region name="decision">{slot(decision, "decision")}</Region>
      </div>
      {children}
    </Box>
  );
}
export function Inspector({ primary, context, history, actions, title, children }: Any) {
  return (
    <Box kind="pattern" title={title}>
      <Region name="primary">{slot(primary, "primary")}</Region>
      {context || history ? (
        <div className="s-split even">
          {context ? <Region name="context">{slot(context, "context")}</Region> : <div />}
          {history ? <Region name="history">{slot(history, "history")}</Region> : <div />}
        </div>
      ) : null}
      {actions ? <Region name="actions">{slot(actions, "actions")}</Region> : null}
      {children}
    </Box>
  );
}
export function Compare({ entities, metrics, evidence, title, children }: Any) {
  return (
    <Box kind="pattern" title={title}>
      {Array.isArray(entities) && !entities.every(isEl) ? <Comparison entities={entities} metrics={metrics} /> : <>{slot(entities, "entities")}{slot(metrics, "metrics")}</>}
      {evidence ? <Region name="evidence">{slot(evidence, "evidence")}</Region> : null}
      {children}
    </Box>
  );
}
export function Monitor({ signals, exceptions, title, children }: Any) {
  return (
    <Box kind="pattern" title={title}>
      <Region name="signals">{slot(signals, "signals")}</Region>
      {exceptions ? <Region name="exceptions">{slot(exceptions, "table")}</Region> : null}
      {children}
    </Box>
  );
}
export function Dashboard({ metrics, charts, table, title, children }: Any) {
  return (
    <Box kind="pattern" title={title}>
      {metrics ? <Region name="metrics">{slot(metrics, "metrics")}</Region> : null}
      {charts ? <Region name="charts">{slot(charts, "charts")}</Region> : null}
      {table ? <Region name="table">{slot(table, "table")}</Region> : null}
      {children}
    </Box>
  );
}

/** A component the vocabulary does not have: shown as a plain labelled box. */
export function Unknown({ __name, children, title, label }: Any) {
  return (
    <div className="s-unknown">
      <span className="s-sub">{__name} (not in the vocabulary)</span>
      {title || label ? <div className="s-box-title">{show(title ?? label)}</div> : null}
      {children}
    </div>
  );
}
