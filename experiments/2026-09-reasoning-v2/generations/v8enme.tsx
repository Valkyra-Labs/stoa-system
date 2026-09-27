import { Page, Header, Section, Card, Metric, Delta, DataTable, FilterBar, Button, Tabs, Status } from "@stoa/react";

const portfolioAssets = [
  { id: "AAPL", name: "Apple Inc.", value: 192.45, change: 2.3, reason: "Positive earnings report" },
  { id: "TSLA", name: "Tesla Inc.", value: 265.12, change: -4.7, reason: "Market volatility" },
  { id: "GOOGL", name: "Alphabet Inc.", value: 138.65, change: 0.8, reason: "No significant news" },
  { id: "AMZN", name: "Amazon.com Inc.", value: 135.20, change: -1.2, reason: "Supply chain issues" },
  { id: "NVDA", name: "NVIDIA Corporation", value: 315.70, change: 5.1, reason: "AI demand surge" },
];

const PortfolioOverview = () => {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Changes Since Yesterday" subtitle="Review market movements and understand their impact" />
      <FilterBar filters={["All", "Up", "Down"]} />
      <Section title="Key Metrics">
        <Card title="Total Portfolio Value">
          <Metric label="Value" value="$1,250,000" unit="USD" />
          <Delta value={3.2} basis="Yesterday" />
        </Card>
        <Card title="Gross Gain/Loss">
          <Metric label="Total" value="$37,500" unit="USD" />
          <Delta value={2.1} basis="Yesterday" />
        </Card>
      </Section>
      <Section title="Portfolio Changes">
        <DataTable
          columns={[{ key: "name", label: "Asset" }, { key: "change", label: "Change" }, { key: "reason", label: "Reason" }]}
          rows={portfolioAssets}
          selectable
        />
      </Section>
      <Section title="Detailed Analysis">
        <Card title="Top Gainers">
          <DataTable
            columns={[{ key: "name", label: "Asset" }, { key: "value", label: "Value" }, { key: "change", label: "Change" }]}
            rows={portfolioAssets.filter(asset => asset.change > 0)}
          />
        </Card>
        <Card title="Top Losers">
          <DataTable
            columns={[{ key: "name", label: "Asset" }, { key: "value", label: "Value" }, { key: "change", label: "Change" }]}
            rows={portfolioAssets.filter(asset => asset.change < 0)}
          />
        </Card>
      </Section>
      <Section title="Actions">
        <Button label="Rebalance Portfolio" variant="primary" />
        <Button label="View Full Report" variant="secondary" />
      </Section>
    </Page>
  );
};

export default PortfolioOverview;
