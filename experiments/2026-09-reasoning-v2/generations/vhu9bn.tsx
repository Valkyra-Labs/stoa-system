import { Page, Header, Sidebar, Section, Card, Tabs, Metric, DataTable, Status, Button } from "@stoa/react";

const PAGE_TITLE = "Morning Brief: Portfolio Movement";

const recentActivity = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", change: 1.24, pct: 0.8, reason: "Earnings Beat", time: "08:15 AM" },
  { id: "2", symbol: "NVDA", name: "NVIDIA Corp.", change: -0.52, pct: -1.2, reason: "Chip Shortage Report", time: "07:45 AM" },
  { id: "3", symbol: "TSLA", name: "Tesla Inc.", change: 2.10, pct: 2.5, reason: "Delivery Guidance", time: "06:30 AM" },
  { id: "4", symbol: "MSFT", name: "Microsoft", change: 0.05, pct: 0.02, reason: "Market Stabilization", time: "09:00 AM" },
  { id: "5", symbol: "AMZN", name: "Amazon", change: -0.33, pct: -0.5, reason: "Sector Rotation", time: "08:45 AM" },
  { id: "6", symbol: "GOOGL", name: "Alphabet", change: 0.45, pct: 0.3, reason: "Analyst Upgrade", time: "07:00 AM" },
];

const sectorBreakdown = [
  { label: "Tech", value: 42.5, delta: 1.2, unit: "% of AUM" },
  { label: "Healthcare", value: 28.3, delta: -0.4, unit: "% of AUM" },
  { label: "Financials", value: 15.1, delta: 0.8, unit: "% of AUM" },
  { id: "Energy", label: "Energy", value: 8.2, delta: 2.1, unit: "% of AUM" },
];

const topMovers = [
  { id: "m1", symbol: "TSLA", direction: "up", amount: 2.10, type: "price" },
  { id: "m2", symbol: "NVDA", direction: "down", amount: 0.52, type: "price" },
  { id: "m3", symbol: "SPY", direction: "neutral", amount: 0.00, type: "index" },
];

export default function PortfolioBriefing() {
  return (
    <Page title={PAGE_TITLE}>
      <Header title={PAGE_TITLE} subtitle="Daily portfolio movement overview" />

      <Section title="Performance Summary">
        <Card title="Key Metrics">
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Metric label="Total Portfolio Value" value="$142.5M" />
            <Metric label="YTD Return" value="12.4%" delta={2.1} />
            <Metric label="Daily Change" value="0.8%" delta={0.15} />
          </div>
        </Card>
      </Section>

      <Section title="Significant Movements">
        <Card title="Top Movers (Yesterday)">
          <DataTable
            columns={[
              { key: "symbol", label: "Symbol" },
              { key: "direction", label: "Direction" },
              { key: "amount", label: "Change" },
              { key: "type", label: "Type" },
            ]}
            rows={topMovers}
          />
        </Card>
      </Section>

      <Section title="Sector Allocation Shifts">
        <Card title="Allocation Changes vs. Yesterday">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sectorBreakdown.map((sector) => (
              <div key={sector.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  <strong>{sector.label}</strong>
                  {sector.delta > 0 ? " (+)" : "(-)"} {Math.abs(sector.delta)}%
                </span>
                <Metric label={sector.unit} value={sector.value} delta={sector.delta} />
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Activity Feed">
        <Card title="Recent Significant Events">
          <DataTable
            columns={[
              { key: "symbol", label: "Asset" },
              { key: "change", label: "Change" },
              { key: "pct", label: "% Change" },
              { key: "reason", label: "Reason" },
              { key: "time", label: "Time" },
            ]}
            rows={recentActivity}
            selectable
          />
        </Card>
      </Section>

      <Section title="Action Items">
        <Card title="Pending Reviews">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Rebalance Review</strong>
                <p style={{ margin: 0, color: "gray" }}>Tech sector exposure exceeds target by 1.5%. Consider trimming.</p>
              </div>
              <Button label="Review Details" onPress={() => {}} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Quarterly Rebalance</strong>
                <p style={{ margin: 0, color: "gray" }}>Scheduled for end of month. Current allocation is within 0.2% tolerance.</p>
              </div>
              <Button label="View Schedule" onPress={() => {}} />
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
