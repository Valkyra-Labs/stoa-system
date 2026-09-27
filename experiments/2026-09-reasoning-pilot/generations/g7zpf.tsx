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
  StaleData,
  FilterBar,
  SavedViews,
  Button,
  BulkActions,
  Compare,
  Inspector,
  Monitor,
  Dashboard,
} from "@stoa/react";

const filters = [
  { id: "desk", label: "Desk", value: "Global Macro" },
  { id: "assetClass", label: "Asset Class", value: "All" },
  { id: "horizon", label: "Horizon", value: "Since prior close" },
  { id: "minMove", label: "Min move", value: "0.5%" },
];

const savedViews = [
  { id: "top-movers", label: "Top Movers", active: true },
  { id: "risk-flags", label: "Risk Flags" },
  { id: "earnings-today", label: "Earnings Today" },
  { id: "my-book", label: "My Book" },
];

const overviewMetrics = [
  { label: "Net Asset Value", value: "$412.6M", delta: { value: "+1.8M", basis: "vs prior close" } },
  { label: "Day P&L", value: "+$1.83M", delta: { value: "+0.44%", basis: "vs prior close" } },
  { label: "Gross Exposure", value: "$618.2M", delta: { value: "+2.1M", basis: "vs prior close" } },
  { label: "Net Exposure", value: "$205.4M", delta: { value: "-0.6M", basis: "vs prior close" } },
  { label: "Positions Flagged", value: "6", delta: { value: "+2", basis: "vs yesterday" } },
];

const intradaySeries = {
  name: "Book P&L",
  points: [
    { x: "07:00", y: 0 },
    { x: "08:00", y: 210000 },
    { x: "09:30", y: 640000 },
    { x: "10:00", y: 480000 },
    { x: "11:00", y: 890000 },
    { x: "12:00", y: 1120000 },
    { x: "13:00", y: 1830000 },
  ],
};

const topMoversColumns = [
  { key: "symbol", label: "Symbol" },
  { key: "name", label: "Name" },
  { key: "last", label: "Last" },
  { key: "change", label: "Chg %" },
  { key: "contribution", label: "P&L Contribution" },
  { key: "reason", label: "Primary Driver" },
];

const topMoversRows = [
  { id: "nvda", symbol: "NVDA", name: "NVIDIA Corp", last: "$187.42", change: "+4.8%", contribution: "+$612K", reason: "Guidance raise, beat consensus" },
  { id: "tlt", symbol: "TLT", name: "iShares 20+Y Treasury", last: "$91.05", change: "-1.9%", contribution: "-$318K", reason: "Hot CPI print, yields up" },
  { id: "xom", symbol: "XOM", name: "Exxon Mobil", last: "$121.77", change: "+2.6%", contribution: "+$244K", reason: "Crude rally on OPEC cut" },
  { id: "meta", symbol: "META", name: "Meta Platforms", last: "$602.18", change: "-2.2%", contribution: "-$201K", reason: "Downgrade, ad spend concerns" },
  { id: "jpm", symbol: "JPM", name: "JPMorgan Chase", last: "$238.90", change: "+1.1%", contribution: "+$96K", reason: "Sector rotation into financials" },
];

const signals = [
  { id: "sig-1", label: "NVDA", value: "+4.8%", detail: "Largest positive contributor, on earnings", tone: "positive" },
  { id: "sig-2", label: "TLT", value: "-1.9%", detail: "Rate-sensitive sleeve down on CPI surprise", tone: "negative" },
  { id: "sig-3", label: "Energy sector basket", value: "+2.1%", detail: "Broad move on crude, not stock-specific", tone: "positive" },
  { id: "sig-4", label: "USD/JPY hedge", value: "-0.7%", detail: "Carry unwind overnight in Asia session", tone: "negative" },
];

const exceptions = [
  { id: "exc-1", severity: "high", label: "META", description: "Move exceeds 20-day realized vol by 3.1x" },
  { id: "exc-2", severity: "medium", label: "TLT", description: "Position now outside target duration band" },
  { id: "exc-3", severity: "low", label: "Data feed", description: "Vendor prices for 2 OTC names are stale (see below)" },
];

const staleSince = "06:42 ET";

const auditEntries = [
  { id: "a1", who: "Risk system", when: "07:05 ET", what: "Flagged META move as 3.1x realized vol" },
  { id: "a2", who: "J. Alvarez", when: "07:20 ET", what: "Trimmed TLT by 15,000 units pre-open" },
  { id: "a3", who: "Auto-hedge", when: "08:00 ET", what: "Rebalanced USD/JPY hedge to target delta" },
  { id: "a4", who: "M. Chen", when: "08:41 ET", what: "Added note: watching NVDA for profit-take at +6%" },
];

const nvdaHistory = [
  { id: "t1", label: "Pre-market", value: "+2.1%", when: "06:30 ET" },
  { id: "t2", label: "Open", value: "+3.4%", when: "09:30 ET" },
  { id: "t3", label: "Now", value: "+4.8%", when: "13:00 ET" },
];

const nvdaContext = [
  { label: "Position size", value: "42,000 sh" },
  { label: "Avg cost", value: "$151.20" },
  { label: "Weight in book", value: "1.9%" },
  { label: "20d realized vol", value: "38%" },
];

const compareEntities = ["NVDA", "META", "Sector avg"];
const compareMetrics = [
  { label: "Day change", values: ["+4.8%", "-2.2%", "+0.6%"] },
  { label: "P&L contribution", values: ["+$612K", "-$201K", "n/a"] },
  { label: "Move vs 20d vol", values: ["1.3x", "3.1x", "1.0x"] },
  { label: "News catalyst", values: ["Yes", "Yes", "No"] },
];

export default function MorningBookReview() {
  return (
    <Page title="Morning Book Review">
      <Header
        title="Morning Book Review"
        subtitle="Global Macro book — vs prior close, Sep 26 2026"
        actions={[
          <Button key="refresh" label="Refresh" variant="secondary" onPress={() => {}} />,
          <Button key="export" label="Export summary" onPress={() => {}} />,
        ]}
      />

      <Sidebar>
        <SavedViews views={savedViews} />
        <FilterBar filters={filters} />
      </Sidebar>

      <main>
        <Section title="Overview">
          <Dashboard
            metrics={overviewMetrics.map((m) => (
              <Metric key={m.label} label={m.label} value={m.value} delta={<Delta value={m.delta.value} basis={m.delta.basis} />} />
            ))}
            charts={[<Chart key="intraday-pnl" type="line" series={[intradaySeries]} x="time" y="pnl" />]}
            table={
              <DataTable
                columns={topMoversColumns}
                rows={topMoversRows}
                selectable
                stickyFirstColumn
                onRowSelect={() => {}}
              />
            }
          />
        </Section>

        <Section title="What Moved Since Yesterday">
          <Monitor signals={signals} exceptions={exceptions} />
          <StaleData since={staleSince} />
        </Section>

        <Section title="Understand Why">
          <Tabs
            items={[
              {
                id: "inspector",
                label: "NVDA — Top Mover",
                content: (
                  <Inspector
                    primary={<Metric label="NVDA" value="$187.42" delta={<Delta value="+4.8%" basis="vs prior close" />} />}
                    context={
                      <Card title="Position context">
                        {nvdaContext.map((c) => (
                          <p key={c.label}>
                            {c.label}: {c.value}
                          </p>
                        ))}
                      </Card>
                    }
                    history={<Timeline events={nvdaHistory} />}
                    actions={[
                      <Button key="hedge" label="Add hedge" variant="secondary" onPress={() => {}} />,
                      <Button key="trim" label="Trim position" onPress={() => {}} />,
                    ]}
                  />
                ),
              },
              {
                id: "compare",
                label: "Compare Movers",
                content: <Compare entities={compareEntities} metrics={compareMetrics} evidence={<AuditLog entries={auditEntries} />} />,
              },
              {
                id: "audit",
                label: "Overnight Activity",
                content: <AuditLog entries={auditEntries} />,
              },
            ]}
          />
        </Section>

        <Section title="Flagged Positions">
          <Card title="Requires attention">
            <Status tone="warning" label="6 positions flagged" />
            <BulkActions
              actions={[
                <Button key="ack" label="Acknowledge all" variant="secondary" onPress={() => {}} />,
                <Button key="assign" label="Assign to risk desk" onPress={() => {}} />,
              ]}
            />
          </Card>
        </Section>
      </main>

      <Drawer title="META — why did it move?" open={false}>
        <Metric label="META" value="$602.18" delta={<Delta value="-2.2%" basis="vs prior close" />} />
        <Comparison
          entities={["META", "Sector avg"]}
          metrics={[
            { label: "Day change", values: ["-2.2%", "+0.6%"] },
            { label: "Move vs 20d vol", values: ["3.1x", "1.0x"] },
          ]}
        />
        <AuditLog entries={auditEntries.filter((e) => e.what.includes("META"))} />
      </Drawer>
    </Page>
  );
}
