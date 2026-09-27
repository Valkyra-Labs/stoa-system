import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Tabs,
  Drawer,
  Metric,
  Delta,
  Trend,
  Chart,
  DataTable,
  Comparison,
  Timeline,
  AuditLog,
  Status,
  EmptyData,
  PartialData,
  StaleData,
  ErrorData,
  FilterBar,
  SavedViews,
  Button,
  BulkActions,
  Explorer,
  Compare,
  Inspector,
  Monitor,
  ReviewQueue,
  Dashboard,
} from "@stoa/react";

const bookMetrics = [
  { label: "Total AUM", value: "$482.6M" },
  { label: "Day P&L", value: "+$3.14M", delta: { value: "+0.65%", basis: "vs prior close" } },
  { label: "MTD P&L", value: "+$11.9M", delta: { value: "+2.53%", basis: "vs month start" } },
  { label: "Net Exposure", value: "62.4%", delta: { value: "-1.1pt", basis: "vs yesterday" } },
];

const bookTrendSeries = [
  { date: "Mon", value: 471.2 },
  { date: "Tue", value: 474.8 },
  { date: "Wed", value: 473.5 },
  { date: "Thu", value: 479.5 },
  { date: "Fri", value: 482.6 },
];

const moverColumns = [
  { key: "ticker", label: "Ticker" },
  { key: "name", label: "Name" },
  { key: "price", label: "Last" },
  { key: "change", label: "Chg %" },
  { key: "pnl", label: "P&L Impact" },
  { key: "weight", label: "Weight" },
  { key: "reason", label: "Likely Driver" },
];

const moverRows = [
  {
    id: "nvda",
    ticker: "NVDA",
    name: "NVIDIA Corp",
    price: "$187.42",
    change: "+4.8%",
    pnl: "+$1.42M",
    weight: "8.1%",
    reason: "Beat on data-center revenue, guidance raised",
  },
  {
    id: "xom",
    ticker: "XOM",
    name: "Exxon Mobil",
    price: "$114.05",
    change: "-3.1%",
    pnl: "-$610K",
    weight: "4.4%",
    reason: "Crude down on inventory build",
  },
  {
    id: "jpm",
    ticker: "JPM",
    name: "JPMorgan Chase",
    price: "$243.18",
    change: "+1.9%",
    pnl: "+$388K",
    weight: "5.2%",
    reason: "Sector-wide move ahead of rate decision",
  },
  {
    id: "tsla",
    ticker: "TSLA",
    name: "Tesla Inc",
    price: "$251.60",
    change: "-2.4%",
    pnl: "-$402K",
    weight: "3.6%",
    reason: "Delivery numbers below street estimate",
  },
  {
    id: "pg",
    ticker: "PG",
    name: "Procter & Gamble",
    price: "$168.90",
    change: "+0.3%",
    pnl: "+$41K",
    weight: "2.8%",
    reason: "No material news, drifting with tape",
  },
];

const moverFilters = [
  { id: "assetClass", label: "Asset Class", value: "All Equities" },
  { id: "desk", label: "Desk", value: "Global Macro" },
  { id: "threshold", label: "Min Move", value: ">1%" },
];

const savedBookViews = [
  { id: "top-movers", label: "Top Movers" },
  { id: "risk-flags", label: "Risk Flags" },
  { id: "earnings-today", label: "Reporting Today" },
];

const bulkMoverActions = [
  { id: "flag", label: "Flag for Review" },
  { id: "watch", label: "Add to Watchlist" },
  { id: "note", label: "Attach Note" },
];

const driverComparisonEntities = [
  { id: "nvda", label: "NVDA" },
  { id: "xom", label: "XOM" },
  { id: "tsla", label: "TSLA" },
];

const driverComparisonMetrics = [
  { key: "changePct", label: "Chg %" },
  { key: "volume", label: "Volume vs 30D Avg" },
  { key: "sentiment", label: "News Sentiment" },
];

const driverComparisonData = {
  entities: driverComparisonEntities,
  metrics: [
    { key: "changePct", label: "Chg %", values: { nvda: "+4.8%", xom: "-3.1%", tsla: "-2.4%" } },
    { key: "volume", label: "Volume vs 30D Avg", values: { nvda: "2.3x", xom: "1.4x", tsla: "1.9x" } },
    { key: "sentiment", label: "News Sentiment", values: { nvda: "Positive", xom: "Neutral", tsla: "Negative" } },
  ],
};

const overnightEvents = [
  { time: "6:12 AM", label: "NVDA beats on data-center revenue, raises guidance" },
  { time: "6:40 AM", label: "EIA reports larger than expected crude inventory build" },
  { time: "7:00 AM", label: "TSLA Q3 deliveries miss consensus by 4%" },
  { time: "7:15 AM", label: "FOMC minutes release scheduled for 2:00 PM" },
];

const bookExceptions = [
  { id: "conc-tech", label: "Tech sector concentration above 32% limit", tone: "warning" },
  { id: "var-breach", label: "1-day VaR within 5% of policy limit", tone: "warning" },
  { id: "stale-price", label: "Illiquid bond position priced 3 days stale", tone: "critical" },
];

const selectedPositionInspector = {
  primary: { label: "NVDA — NVIDIA Corp", value: "$187.42", delta: { value: "+4.8%", basis: "vs prior close" } },
  context: [
    { label: "Position Size", value: "212,000 sh" },
    { label: "Cost Basis", value: "$142.10" },
    { label: "Weight", value: "8.1%" },
    { label: "Sector", value: "Semiconductors" },
  ],
  history: [
    { time: "6:12 AM", label: "Earnings beat, data-center revenue up 41% YoY" },
    { time: "6:14 AM", label: "Guidance raised for next quarter" },
    { time: "6:45 AM", label: "Three sell-side upgrades published" },
  ],
  actions: [
    { id: "trim", label: "Trim Position" },
    { id: "hold", label: "Mark Reviewed" },
  ],
};

export default function MorningBookReview() {
  return (
    <Page title="Morning Book Review">
      <Sidebar>
        <nav>
          <SavedViews views={savedBookViews} />
        </nav>
      </Sidebar>

      <Header
        title="Book Overview"
        subtitle="As of 7:02 AM ET — since yesterday's close"
        actions={[
          <Button key="refresh" label="Refresh" onPress={() => {}} />,
          <Button key="export" label="Export Summary" onPress={() => {}} variant="secondary" />,
        ]}
      />

      <Section title="Summary">
        <Card title="Book Health">
          <Metric label={bookMetrics[0].label} value={bookMetrics[0].value} />
          <Metric label={bookMetrics[1].label} value={bookMetrics[1].value} delta={bookMetrics[1].delta} />
          <Metric label={bookMetrics[2].label} value={bookMetrics[2].value} delta={bookMetrics[2].delta} />
          <Metric label={bookMetrics[3].label} value={bookMetrics[3].value} delta={bookMetrics[3].delta} />
          <Trend series={bookTrendSeries} />
        </Card>
        <Card title="5-Day NAV">
          <Chart type="line" series={bookTrendSeries} x="date" y="value" />
        </Card>
      </Section>

      <Section title="What Moved">
        <FilterBar filters={moverFilters} />
        <DataTable
          columns={moverColumns}
          rows={moverRows}
          selectable
          stickyFirstColumn
          onRowSelect={() => {}}
        />
        <BulkActions actions={bulkMoverActions} />
      </Section>

      <Section title="Understand Why">
        <Tabs
          items={[
            {
              id: "drivers",
              label: "Driver Comparison",
              content: (
                <Card title="Top Movers Side by Side">
                  <Comparison entities={driverComparisonData.entities} metrics={driverComparisonData.metrics} />
                </Card>
              ),
            },
            {
              id: "timeline",
              label: "Overnight Timeline",
              content: (
                <Card title="Events Since Yesterday's Close">
                  <Timeline events={overnightEvents} />
                </Card>
              ),
            },
            {
              id: "audit",
              label: "Review Trail",
              content: (
                <Card title="Actions Logged This Morning">
                  <AuditLog
                    entries={[
                      { time: "7:05 AM", label: "M. Ellery flagged XOM for desk review" },
                      { time: "7:08 AM", label: "Risk system auto-flagged tech concentration" },
                    ]}
                  />
                </Card>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Risk Exceptions">
        <Card title="Monitor">
          <Monitor
            signals={[
              { label: "Net Exposure", value: "62.4%" },
              { label: "Gross Exposure", value: "138.9%" },
              { label: "1-Day VaR", value: "$4.82M" },
            ]}
            exceptions={bookExceptions.map((e) => (
              <Status key={e.id} tone={e.tone} label={e.label} />
            ))}
          />
        </Card>
      </Section>

      <Drawer title="Position Detail — NVDA" open={false}>
        <Inspector
          primary={selectedPositionInspector.primary}
          context={selectedPositionInspector.context}
          history={selectedPositionInspector.history}
          actions={selectedPositionInspector.actions}
        />
      </Drawer>
    </Page>
  );
}
