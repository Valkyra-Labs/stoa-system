import { Page, Header, Section, Card, Metric, Trend, DataTable, Button, Status, Timeline } from "@stoa/react";

const PlaceholderData = {
  metrics: [
    { label: "Price Change", value: -2.4, unit: "%" },
    { label: "Volume Change", value: 15.7, unit: "%", delta: true },
    { label: "Volatility", value: 3.2, unit: "%" },
    { label: "Earnings Surprise", value: 5.1, unit: "%" },
  ],
  events: [
    { time: "08:30", source: "Market", text: "Opening gap down due to sector rotation." },
    { time: "09:15", source: "News", text: "Federal Reserve signals rate pause." },
    { time: "10:00", source: "Company", text: "CEO announces strategic partnership." },
    { time: "14:30", source: "Analyst", text: "Downgrade from 'Buy' to 'Sell'." },
  ],
  auditLog: [
    { user: "System", action: "Updated price feed", time: "2023-10-24T08:30:00Z" },
    { user: "System", action: "Recalculated P&L", time: "2023-10-24T09:00:00Z" },
    { user: "John Doe", action: "Reviewed position", time: "2023-10-24T11:45:00Z" },
  ],
  topMovers: [
    { id: 1, symbol: "AAPL", name: "Apple Inc.", change: -2.4, volume: 15.7, reason: "Tech sector rotation" },
    { id: 2, symbol: "TSLA", name: "Tesla Inc.", change: 5.1, volume: 22.3, reason: "Strategic partnership" },
    { id: 3, symbol: "NVDA", name: "NVIDIA Corp.", change: -1.2, volume: 8.5, reason: "Sector rotation" },
    { id: 4, symbol: "MSFT", name: "Microsoft", change: 0.5, volume: 2.1, reason: "Normal volatility" },
  ],
};

export default function PortfolioMonitorPage() {
  return (
    <Page title="Morning Book: Portfolio Drift">
      <Header
        title="Portfolio Monitor"
        subtitle="Assets moved significantly since 2023-10-23 16:00"
        actions={<Button label="Refresh Data" />}
      />

      <Section title="Portfolio Health Summary">
        <Card title="Overall Metrics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <Metric label="Net P&L" value="-1.2" unit="%" />
            <Metric label="Volatility" value="3.2" unit="%" />
            <Metric label="Correlation" value="0.85" unit="%" />
            <Metric label="Liquidity" value="High" />
          </div>
        </Card>
      </Section>

      <Section title="Top Movers & Context">
        <Card title="Significant Changes">
          <DataTable
            columns={[
              { key: "symbol", label: "Symbol" },
              { key: "name", label: "Name" },
              { key: "change", label: "Change %", type: "number" },
              { key: "volume", label: "Volume Delta", type: "number" },
              { key: "reason", label: "Reason" },
            ]}
            rows={PlaceholderData.topMovers}
            selectable
          />
          <div style={{ marginTop: "16px" }}>
            <Status tone="warning" label="Alert: 3 assets require review" />
          </div>
        </Card>
      </Section>

      <Section title="Chronological Events">
        <Card title="Market Activity Timeline">
          <Timeline events={PlaceholderData.events} />
        </Card>
      </Section>

      <Section title="Audit Trail">
        <Card title="Recent System & User Actions">
          <DataTable
            columns={[
              { key: "user", label: "User" },
              { key: "action", label: "Action" },
              { key: "time", label: "Time" },
            ]}
            rows={PlaceholderData.auditLog}
          />
        </Card>
      </Section>
    </Page>
  );
}
