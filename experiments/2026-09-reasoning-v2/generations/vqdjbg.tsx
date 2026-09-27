import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Delta,
  Comparison,
  DataTable,
  Status,
  EmptyData,
  StaleData,
  FilterBar,
  BulkActions,
  Button,
  Tabs,
} from "@stoa/react";

const MOCK_POSITIONS = [
  { symbol: "AAPL", shares: 1250, avgCost: 142.50, current: 178.20, change: 35.70, pct: 25.0, reason: "Tech earnings beat" },
  { symbol: "MSFT", shares: 800, avgCost: 310.00, current: 365.40, change: 55.40, pct: 17.9, reason: "Cloud growth" },
  { symbol: "NVDA", shares: 450, avgCost: 420.00, current: 520.10, change: 100.10, pct: 23.8, reason: "AI demand surge" },
  { symbol: "GOOGL", shares: 600, avgCost: 125.00, current: 138.90, change: 13.90, pct: 11.1, reason: "Ads recovery" },
  { symbol: "TSLA", shares: 900, avgCost: 210.00, current: 185.30, change: -24.70, pct: -11.8, reason: "Margin compression" },
  { symbol: "AMZN", shares: 550, avgCost: 130.00, current: 142.10, change: 12.10, pct: 9.3, reason: "Retail volume" },
  { symbol: "META", shares: 700, avgCost: 290.00, current: 275.40, change: -14.60, pct: -5.0, reason: "Ad spend cut" },
  { symbol: "AMD", shares: 300, avgCost: 95.00, current: 108.20, change: 13.20, pct: 13.9, reason: "Datacenter orders" },
];

const MOCK_PEEKS = [
  { entity: "AAPL", metric: "Sector", value: 12.5, delta: 2.1, basis: "Peer Avg" },
  { entity: "NVDA", metric: "Valuation", value: 28.4, delta: 4.2, basis: "Target" },
  { symbol: "TSLA", metric: "Debt", value: 4.1, delta: -0.8, basis: "YTD" },
];

const ActionHistory = [
  { action: "Rebalance", target: "AAPL", time: "08:42", user: "PM" },
  { action: "Stop Loss", target: "TSLA", time: "07:15", user: "PM" },
  { action: "Add Position", target: "AMD", time: "06:30", user: "PM" },
];

export default function PortfolioBook() {
  return (
    <Page title="Portfolio Book - Morning Review">
      <Header
        title="Portfolio Book"
        subtitle="Morning Review: Market Open"
        actions={
          <Button label="Generate Report" variant="primary" />
        }
      />
      <Sidebar>
        <nav>
          <ul>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Holdings</a></li>
            <li><a href="#">Allocations</a></li>
            <li><a href="#">Journal</a></li>
          </ul>
        </nav>
      </Sidebar>
      <main>
        <Section title="Market Context & Freshness">
          <Card title="Market Status">
            <div style={{ display: "flex", gap: 16 }}>
              <Metric label="S&P 500" value={4782.3} delta={1.2} unit="%" />
              <Metric label="VIX" value={14.2} delta={-0.5} unit="%" />
              <Metric label="Bond Yield" value={4.35} delta={0.02} unit="%" />
            </div>
            <Status tone="neutral" label="Data Freshness: 12m (Market Open)" />
          </Card>
        </Section>

        <Section title="Top Movers (Yesterday vs Today)">
          <FilterBar filters={[
            { key: "sector", label: "Sector", value: "All" },
            { key: "type", label: "Type", value: "All" },
          ]} />
          <DataTable
            columns={[
              { key: "symbol", label: "Symbol", sticky: true },
              { key: "change", label: "Change", type: "number" },
              { key: "pct", label: "% Change", type: "number" },
              { key: "reason", label: "Reason" },
            ]}
            rows={MOCK_POSITIONS.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))}
            onRowSelect={(row) => {
              // Drill down logic would go here
            }}
          />
          <BulkActions actions={[
            { label: "Rebalance Top 5", count: 5 },
            { label: "Review Bottom 5", count: 5 },
          ]} />
        </Section>

        <Section title="Anomaly Deep Dive">
          <Tabs
            items={[
              { id: "comparison", label: "Peer Comparison", content: (
                <Comparison
                  entities={MOCK_PEEKS.map(e => ({ id: e.entity, name: e.entity }))}
                  metrics={MOCK_PEEKS.map(e => ({ name: e.metric, value: e.value, delta: e.delta, basis: e.basis }))}
                />
              )},
              { id: "history", label: "Recent Actions", content: (
                <div>
                  <h3>Recent Trade Actions</h3>
                  <ul>
                    {ActionHistory.map((h, i) => (
                      <li key={i}>
                        <Status tone="info" label={h.action} />
                        Target: {h.target} | Time: {h.time} | By: {h.user}
                      </li>
                    ))}
                  </ul>
                </div>
              )},
            ]}
          />
        </Section>

        <Section title="Risk Metrics">
          <Card title="Portfolio Leverage">
            <Metric label="Net Long" value={0.42} delta={0.05} unit="%" />
            <Metric label="Max Drawdown" value={-8.4} delta={-1.2} unit="%" />
            <Metric label="Sharpe Ratio" value={1.85} delta={0.1} unit="" />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
