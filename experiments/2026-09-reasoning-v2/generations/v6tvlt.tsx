import { Page, Header, Sidebar, Section, Card, Metric, Delta, Chart, DataTable, FilterBar, SavedViews, Button, Comparison } from "@stoa/react";

export default function PortfolioOverview() {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Overview" subtitle="Changes since yesterday" actions={<Button label="Refresh" />} />
      <Section title="Summary">
        <Card title="Total Portfolio Value">
          <Metric label="Today" value={1050000} unit="USD" />
          <Metric label="Yesterday" value={1000000} unit="USD" />
          <Delta value={50000} basis={1000000} />
        </Card>
        <Card title="Top Movers">
          <Comparison
            entities={[
              { id: "AAPL", metrics: [{ label: "Change", value: 1000, basis: 5000, unit: "USD" }] },
              { id: "GOOGL", metrics: [{ label: "Change", value: -500, basis: 1000, unit: "USD" }] },
              { id: "MSFT", metrics: [{ label: "Change", value: 200, basis: 750, unit: "USD" }] }
            ]}
          />
        </Card>
      </Section>
      <Section title="Detailed View">
        <Chart type="line" series={[{ id: "AAPL", values: [5000, 5100, 5200, 5300] }]} x="day" y="value" />
        <DataTable
          columns={[
            { label: "Symbol", key: "symbol" },
            { label: "Change", key: "change" },
            { label: "Value", key: "value" },
            { label: "Change %", key: "change_percent" }
          ]}
          rows={[
            { symbol: "AAPL", change: 1000, value: 5200, change_percent: 20 },
            { symbol: "GOOGL", change: -500, value: 1000, change_percent: -50 },
            { symbol: "MSFT", change: 200, value: 750, change_percent: 25 }
          ]}
        />
      </Section>
      <Sidebar>
        <FilterBar filters={[
          { id: "sector", label: "Sector", options: ["Technology", "Healthcare", "Finance"] },
          { id: "type", label: "Type", options: ["Stock", "Bond", "ETF"] }
        ]} />
        <SavedViews views={[
          { id: "all", label: "All" },
          { id: "tech", label: "Technology" },
          { id: "finance", label: "Finance" }
        ]} />
      </Sidebar>
    </Page>
  );
}
