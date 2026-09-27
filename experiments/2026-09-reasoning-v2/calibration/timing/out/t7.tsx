import { Page, Header, Section, Card, Tabs, Metric, Delta, Timeline, DataTable, Button, FilterBar, Sidebar, EmptyData } from "@stoa/react";

const portfolioChanges = [
  { id: "1", asset: "AAPL", change: "+2.3%", reason: "Positive earnings report", timestamp: "2023-10-05T09:15:00Z" },
  { id: "2", asset: "TSLA", change: "-1.8%", reason: "Regulatory scrutiny", timestamp: "2023-10-05T10:30:00Z" },
  { id: "3", asset: "GOOGL", change: "+0.5%", reason: "Market sentiment shift", timestamp: "2023-10-05T14:45:00Z" },
  { id: "4", asset: "AMZN", change: "-3.2%", reason: "Supply chain issues", timestamp: "2023-10-05T16:20:00Z" },
];

const portfolioMetrics = [
  { label: "Total Value", value: "$12,500,000", delta: "+1.2%", unit: "USD" },
  { label: "Net Change", value: "$150,000", delta: "+0.8%", unit: "USD" },
  { label: "Performance", value: "12.3%", delta: "+1.1%", unit: "%" },
];

const portfolioBenchmarks = [
  { label: "S&P 500", value: "13.7%", delta: "+0.9%", unit: "%" },
  { label: "NASDAQ", value: "15.2%", delta: "+1.5%", unit: "%" },
];

const columns = [
  { key: "asset", label: "Asset" },
  { key: "change", label: "Change" },
  { key: "reason", label: "Reason" },
  { key: "timestamp", label: "Timestamp" },
];

export default function PortfolioChangesPage() {
  return (
    <Page title="Portfolio Changes - Since Yesterday">
      <Header title="Portfolio Changes" subtitle="Since Yesterday" actions={<Button label="Refresh" variant="primary" />} />
      <Section title="Overview">
        <Card>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {portfolioMetrics.map((metric, index) => (
              <Metric key={index} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {portfolioBenchmarks.map((benchmark, index) => (
              <Metric key={index} label={benchmark.label} value={benchmark.value} delta={benchmark.delta} unit={benchmark.unit} />
            ))}
          </div>
        </Card>
      </Section>
      <Section title="Timeline of Changes">
        <Timeline events={portfolioChanges} />
      </Section>
      <Section title="Detailed Changes">
        <DataTable
          columns={columns}
          rows={portfolioChanges}
          selectable
          stickyFirstColumn
          onRowSelect={(selected) => alert(`Selected: ${selected.asset}`)}
        />
      </Section>
      <Section title="Why These Changes?">
        <Card>
          <p>
            These changes reflect recent market movements, company-specific events, and macroeconomic factors. For a deeper dive, use the filter bar to explore specific assets or time frames.
          </p>
          <FilterBar filters={[{ label: "Asset Type", options: ["Stock", "Bond", "ETF"] }]} />
        </Card>
      </Section>
    </Page>
  );
}
