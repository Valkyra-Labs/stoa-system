// Goal: let a portfolio manager, first thing in the morning, see what in
// their book moved overnight and understand why, without hunting across
// screens. Layout puts the headline numbers (how big is today) at the very
// top, the ranked list of movers (what moved) directly below where the eye
// lands next, and the explanatory signals/events/comparison (why it moved)
// in a tabbed section beneath that so the primary scan path stays a single
// top-to-bottom pass: size of the day, then which names, then the reasons.
// A sidebar carries book selection and saved views so switching context
// never disrupts the main reading order.

import {
  Page,
  Header,
  Sidebar,
  Section,
  Metric,
  Chart,
  DataTable,
  Timeline,
  Comparison,
  Status,
  FilterBar,
  SavedViews,
  Button,
  BulkActions,
  Tabs,
  Monitor,
} from "@stoa/react";

const books = [
  { id: "global-macro", label: "Global Macro Equity", active: true },
  { id: "em-credit", label: "EM Credit", active: false },
  { id: "rates", label: "Rates & FX", active: false },
  { id: "watchlist", label: "Watchlist Only", active: false },
];

const savedViews = [
  { id: "top-movers", label: "Top movers", active: true },
  { id: "flagged", label: "Flagged for review", active: false },
  { id: "earnings-today", label: "Reporting today", active: false },
];

const filters = [
  {
    id: "asset-class",
    label: "Asset class",
    value: "All",
    options: ["All", "Equity", "Credit", "Rates", "FX"],
  },
  {
    id: "region",
    label: "Region",
    value: "All",
    options: ["All", "Americas", "EMEA", "APAC"],
  },
  {
    id: "min-move",
    label: "Min. move",
    value: "1%",
    options: ["Any", "1%", "2%", "5%"],
  },
];

const navSeries = [
  {
    name: "Book NAV",
    data: [
      { x: "16:00", y: 128.4 },
      { x: "18:00", y: 128.6 },
      { x: "20:00", y: 128.1 },
      { x: "22:00", y: 127.3 },
      { x: "00:00", y: 126.9 },
      { x: "02:00", y: 127.5 },
      { x: "04:00", y: 128.8 },
      { x: "06:00", y: 129.7 },
      { x: "07:30", y: 130.2 },
    ],
  },
];

const moversColumns = [
  { key: "ticker", label: "Ticker" },
  { key: "name", label: "Name" },
  { key: "sector", label: "Sector" },
  { key: "lastPrice", label: "Last price" },
  { key: "changePct", label: "Chg %" },
  { key: "changeAbs", label: "Chg $" },
  { key: "contributionBps", label: "Contribution (bps)" },
  { key: "status", label: "Status" },
];

const moversRows = [
  {
    id: "nvda",
    ticker: "NVDA",
    name: "NVIDIA Corp",
    sector: "Semiconductors",
    lastPrice: "$187.42",
    changePct: "+6.8%",
    changeAbs: "+$11.94",
    contributionBps: "+34",
    status: <Status tone="positive" label="Earnings beat" />,
  },
  {
    id: "xom",
    ticker: "XOM",
    name: "Exxon Mobil",
    sector: "Energy",
    lastPrice: "$104.11",
    changePct: "-4.2%",
    changeAbs: "-$4.57",
    contributionBps: "-19",
    status: <Status tone="warning" label="Guidance cut" />,
  },
  {
    id: "jpm",
    ticker: "JPM",
    name: "JPMorgan Chase",
    sector: "Financials",
    lastPrice: "$212.90",
    changePct: "+2.1%",
    changeAbs: "+$4.38",
    contributionBps: "+11",
    status: <Status tone="neutral" label="In line" />,
  },
  {
    id: "tsla",
    ticker: "TSLA",
    name: "Tesla Inc",
    sector: "Consumer Discretionary",
    lastPrice: "$241.05",
    changePct: "-7.9%",
    changeAbs: "-$20.71",
    contributionBps: "-28",
    status: <Status tone="critical" label="Recall announced" />,
  },
  {
    id: "unh",
    ticker: "UNH",
    name: "UnitedHealth Group",
    sector: "Health Care",
    lastPrice: "$498.60",
    changePct: "+1.4%",
    changeAbs: "+$6.88",
    contributionBps: "+7",
    status: <Status tone="neutral" label="No news" />,
  },
  {
    id: "bidu",
    ticker: "BIDU",
    name: "Baidu Inc",
    sector: "Communication Services",
    lastPrice: "$98.33",
    changePct: "-2.6%",
    changeAbs: "-$2.63",
    contributionBps: "-6",
    status: <Status tone="warning" label="Stale price feed" />,
  },
];

const bulkActions = [
  { label: "Add to watchlist", onPress: () => {} },
  { label: "Flag for review", onPress: () => {} },
  { label: "Export selection", onPress: () => {} },
];

const monitorSignals = [
  {
    id: "sig-1",
    label: "US CPI print",
    detail: "Headline CPI +0.1% below consensus, released 05:30 ET.",
    tone: "positive",
  },
  {
    id: "sig-2",
    label: "Semiconductor sector strength",
    detail: "Sector up 3.9% overnight on NVDA earnings read-through.",
    tone: "positive",
  },
  {
    id: "sig-3",
    label: "Energy weakness",
    detail: "Brent crude -3.1% on demand concerns, dragging XOM and peers.",
    tone: "warning",
  },
];

const monitorExceptions = [
  {
    id: "exc-1",
    label: "BIDU pricing feed",
    detail: "Vendor B feed has not updated since 04:12 ET.",
    since: "3h 20m",
  },
  {
    id: "exc-2",
    label: "TSLA options chain",
    detail: "Implied vol surface incomplete for 2 near-dated expiries.",
    since: "0h 45m",
  },
];

const corporateEvents = [
  {
    id: "ev-1",
    time: "06:00 ET",
    label: "NVDA reports Q3 earnings",
    detail: "EPS $1.28 vs $1.14 est.; raised full-year guidance.",
  },
  {
    id: "ev-2",
    time: "06:30 ET",
    label: "XOM cuts capex guidance",
    detail: "FY guidance lowered by 8% citing refining margins.",
  },
  {
    id: "ev-3",
    time: "07:05 ET",
    label: "TSLA recall filing",
    detail: "NHTSA filing covers 220k vehicles for steering software.",
  },
  {
    id: "ev-4",
    time: "07:15 ET",
    label: "JPM analyst day",
    detail: "Reaffirmed medium-term ROE target of 17%.",
  },
];

const comparisonEntities = [
  { id: "nvda", name: "NVIDIA (NVDA)" },
  { id: "tsla", name: "Tesla (TSLA)" },
  { id: "xom", name: "Exxon Mobil (XOM)" },
];

const comparisonMetrics = [
  {
    label: "Change %",
    values: { nvda: "+6.8%", tsla: "-7.9%", xom: "-4.2%" },
  },
  {
    label: "Contribution (bps)",
    values: { nvda: "+34", tsla: "-28", xom: "-19" },
  },
  {
    label: "Volume vs 30d avg",
    values: { nvda: "3.1x", tsla: "2.4x", xom: "1.6x" },
  },
  {
    label: "Primary driver",
    values: {
      nvda: "Earnings beat",
      tsla: "Recall filing",
      xom: "Guidance cut",
    },
  },
];

export default function MorningBookReview() {
  return (
    <Page title="Morning Book Review">
      <Header
        title="Morning Book Review"
        subtitle="Global Macro Equity Book · Tuesday, Sep 27 2026 · Data as of 07:32 ET"
        actions={[
          <Button key="refresh" label="Refresh data" variant="secondary" onPress={() => {}} />,
          <Button key="export" label="Export summary" variant="primary" onPress={() => {}} />,
        ]}
      />
      <Sidebar>
        <h3>Books</h3>
        {books.map((book) => (
          <Button
            key={book.id}
            label={book.label}
            variant={book.active ? "primary" : "ghost"}
            onPress={() => {}}
          />
        ))}
        <h3>Saved views</h3>
        <SavedViews views={savedViews} />
      </Sidebar>
      <main>
        <FilterBar filters={filters} />

        <Section title="Book overview">
          <Metric label="Total NAV" value="$130.2M" delta={{ value: "+1.4%", basis: "vs yesterday close" }} />
          <Metric label="Day P&L" value="+$1.83M" delta={{ value: "+1.4%", basis: "vs prior close" }} unit="USD" />
          <Metric label="Positions moved >2%" value="14" delta={{ value: "+5", basis: "vs typical day" }} />
          <Metric label="Open data exceptions" value="2" delta={{ value: "0", basis: "vs yesterday" }} />
          <Chart type="line" series={navSeries} x="Time (overnight)" y="Indexed NAV" />
        </Section>

        <Section title="What moved overnight">
          <DataTable
            columns={moversColumns}
            rows={moversRows}
            selectable
            stickyFirstColumn
            onRowSelect={() => {}}
          />
          <BulkActions actions={bulkActions} />
        </Section>

        <Section title="Understand why it moved">
          <Tabs
            items={[
              {
                id: "signals",
                label: "Market signals",
                content: <Monitor signals={monitorSignals} exceptions={monitorExceptions} />,
              },
              {
                id: "events",
                label: "Corporate events",
                content: <Timeline events={corporateEvents} />,
              },
              {
                id: "compare",
                label: "Compare top movers",
                content: <Comparison entities={comparisonEntities} metrics={comparisonMetrics} />,
              },
            ]}
          />
        </Section>
      </main>
    </Page>
  );
}
