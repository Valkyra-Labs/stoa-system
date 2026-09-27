import { Page, Header, Section, Card, Tabs, Metric, Delta, Trend, DataTable, Comparison, Timeline, AuditLog, Button, FilterBar, SavedViews } from "@stoa/react";

const portfolioData = [
  { id: "AAPL", name: "Apple Inc.", change: 2.5, delta: 1.2, reason: "Strong Q3 earnings", timestamp: "2023-10-05T09:30:00Z" },
  { id: "TSLA", name: "Tesla Inc.", change: -4.1, delta: -2.8, reason: "Production slowdown", timestamp: "2023-10-05T10:15:00Z" },
  { id: "GOOGL", name: "Alphabet Inc.", change: 0.8, delta: 0.5, reason: "Positive regulatory update", timestamp: "2023-10-05T11:00:00Z" },
  { id: "AMZN", name: "Amazon.com Inc.", change: -1.3, delta: -1.0, reason: "Inventory concerns", timestamp: "2023-10-05T12:45:00Z" },
  { id: "NVDA", name: "NVIDIA Corporation", change: 3.2, delta: 2.1, reason: "AI demand surge", timestamp: "2023-10-05T14:30:00Z" },
];

const yesterdayData = [
  { id: "AAPL", name: "Apple Inc.", change: 1.3, delta: 0.9, reason: "Moderate Q3 earnings", timestamp: "2023-10-04T16:00:00Z" },
  { id: "TSLA", name: "Tesla Inc.", change: -3.2, delta: -2.5, reason: "Production slowdown", timestamp: "2023-10-04T17:15:00Z" },
  { id: "GOOGL", name: "Alphabet Inc.", change: 0.3, delta: 0.2, reason: "Positive regulatory update", timestamp: "2023-10-04T18:00:00Z" },
  { id: "AMZN", name: "Amazon.com Inc.", change: -1.8, delta: -1.5, reason: "Inventory concerns", timestamp: "2023-10-04T20:45:00Z" },
  { id: "NVDA", name: "NVIDIA Corporation", change: 2.7, delta: 2.0, reason: "AI demand surge", timestamp: "2023-10-04T22:30:00Z" },
];

const todayData = [
  { id: "AAPL", name: "Apple Inc.", change: 2.5, delta: 1.2, reason: "Strong Q3 earnings", timestamp: "2023-10-05T09:30:00Z" },
  { id: "TSLA", name: "Tesla Inc.", change: -4.1, delta: -2.8, reason: "Production slowdown", timestamp: "2023-10-05T10:15:00Z" },
  { id: "GOOGL", name: "Alphabet Inc.", change: 0.8, delta: 0.5, reason: "Positive regulatory update", timestamp: "2023-10-05T11:00:00Z" },
  { id: "AMZN", name: "Amazon.com Inc.", change: -1.3, delta: -1.0, reason: "Inventory concerns", timestamp: "2023-10-05T12:45:00Z" },
  { id: "NVDA", name: "NVIDIA Corporation", change: 3.2, delta: 2.1, reason: "AI demand surge", timestamp: "2023-10-05T14:30:00Z" },
];

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const portfolioTrends = [
  { id: "AAPL", name: "Apple Inc.", change: 2.5, delta: 1.2, reason: "Strong Q3 earnings" },
  { id: "TSLA", name: "Tesla Inc.", change: -4.1, delta: -2.8, reason: "Production slowdown" },
  { id: "GOOGL", name: "Alphabet Inc.", change: 0.8, delta: 0.5, reason: "Positive regulatory update" },
  { id: "AMZN", name: "Amazon.com Inc.", change: -1.3, delta: -1.0, reason: "Inventory concerns" },
  { id: "NVDA", name: "NVIDIA Corporation", change: 3.2, delta: 2.1, reason: "AI demand surge" },
];

const auditLog = [
  { id: "AAPL", action: "Price update", timestamp: "2023-10-05T09:30:00Z", user: "System" },
  { id: "TSLA", action: "Price update", timestamp: "2023-10-05T10:15:00Z", user: "System" },
  { id: "GOOGL", action: "Price update", timestamp: "2023-10-05T11:00:00Z", user: "System" },
  { id: "AMZN", action: "Price update", timestamp: "2023-10-05T12:45:00Z", user: "System" },
  { id: "NVDA", action: "Price update", timestamp: "2023-10-05T14:30:00Z", user: "System" },
];

export default function PortfolioOverview() {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Changes Since Yesterday" subtitle={`As of ${today.toLocaleDateString()}`} actions={<Button label="Refresh" />} />
      <Section title="Key Movements">
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <Metric label="Total Value" value="$12.4B" unit="USD" />
            <Metric label="Change" value="1.8%" delta={1.2} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <Metric label="Benchmarks" value="S&P 500: +0.9%" />
            <Metric label="Volatility" value="1.5%" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <Metric label="Top Gainers" value="AAPL (+2.5%)" />
            <Metric label="Top Losers" value="TSLA (-4.1%)" />
          </div>
          <Trend series={portfolioTrends} />
        </Card>
      </Section>
      <Section title="Comparison">
        <Comparison
          entities={portfolioData}
          metrics={[
            { name: "Change", value: (item) => item.change, delta: (item) => item.delta, reason: (item) => item.reason },
          ]}
        />
      </Section>
      <Section title="Timeline of Changes">
        <Timeline events={portfolioData.map((item) => ({
          time: item.timestamp,
          description: `${item.name} changed by ${item.change}%: ${item.reason}`
        }))} />
      </Section>
      <Section title="Audit Log">
        <AuditLog entries={auditLog} />
      </Section>
      <Section title="Detailed View">
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "change", label: "Change", format: (value) => `${value}%` },
            { key: "delta", label: "Delta", format: (value) => `${value}%` },
            { key: "reason", label: "Reason" },
          ]}
          rows={portfolioData}
        />
      </Section>
    </Page>
  );
}
