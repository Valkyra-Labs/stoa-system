import { Page, Header, Section, Card, Metric, Delta, DataTable, FilterBar, Button, Tabs, Status, Timeline, EmptyData } from "@stoa/react";

const portfolioData = [
  { id: "1", name: "Tech Corp", value: 1200000, change: 2.5, delta: 30000, reason: "Quarterly earnings report" },
  { id: "2", name: "Energy Inc", value: 850000, change: -1.2, delta: -10200, reason: "Supply chain disruption" },
  { id: "3", name: "HealthCo", value: 1500000, change: 0.8, delta: 12000, reason: "New drug approval" },
  { id: "4", name: "Retail Ltd", value: 600000, change: -3.0, delta: -18000, reason: "Seasonal decline" },
  { id: "5", name: "FinTech", value: 950000, change: 1.5, delta: 14250, reason: "Increased user base" },
];

const portfolioMetrics = [
  { label: "Total Value", value: 5100000, delta: 21250, unit: "$" },
  { label: "Average Daily Change", value: 1.4, unit: "%" },
  { label: "High Volatility", value: 3.0, unit: "%" },
];

const portfolioTimeline = [
  { time: "09:15 AM", event: "Tech Corp: +$30,000 (2.5%)" },
  { time: "10:30 AM", event: "Energy Inc: -$10,200 (-1.2%)" },
  { time: "11:45 AM", event: "HealthCo: +$12,000 (0.8%)" },
  { time: "12:00 PM", event: "Retail Ltd: -$18,000 (-3.0%)" },
  { time: "01:15 PM", event: "FinTech: +$14,250 (1.5%)" },
];

const portfolioColumns = [
  { key: "name", label: "Asset" },
  { key: "value", label: "Value", format: (v) => `$${v}` },
  { key: "change", label: "Change", format: (v) => `${v}%` },
  { key: "delta", label: "Delta", format: (v) => `$${v}` },
  { key: "reason", label: "Reason" },
];

const PortfolioPage = () => (
  <Page title="Portfolio Overview">
    <Header title="Portfolio Summary" subtitle="Changes since yesterday" actions={<Button label="Refresh" variant="secondary" />} />
    <Section title="Key Metrics">
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {portfolioMetrics.map((metric, index) => (
          <Card key={index} title={metric.label}>
            <Metric value={metric.value} delta={metric.delta} unit={metric.unit} />
          </Card>
        ))}
      </div>
    </Section>
    <Section title="Recent Changes">
      <DataTable
        columns={portfolioColumns}
        rows={portfolioData}
        selectable
        stickyFirstColumn
        onRowSelect={(selected) => alert(`Selected: ${selected.name}`)}
      />
    </Section>
    <Section title="Change Reasons">
      <Card>
        <Timeline events={portfolioTimeline} />
      </Card>
    </Section>
    <Section title="High Volatility">
      <Card>
        <DataTable
          columns={portfolioColumns}
          rows={portfolioData.filter((item) => item.change > 2 || item.change < -2)}
          selectable
          stickyFirstColumn
          onRowSelect={(selected) => alert(`Selected: ${selected.name}`)}
        />
      </Card>
    </Section>
  </Page>
);

export default PortfolioPage;
