import { Page, Header, Sidebar, Section, Card, Metric, Delta, Chart, DataTable, Comparison, Timeline, Status, EmptyData, FilterBar, SavedViews, Button, BulkActions } from "@stoa/react";

export default function PortfolioOverview() {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Overview" subtitle="Performance since yesterday" />
      <div style={{ display: "flex" }}>
        <Sidebar>
          <Section title="Filters">
            <FilterBar filters={[
              { label: "Asset Type", options: ["Equity", "Bond", "Commodity"] },
              { label: "Sector", options: ["Technology", "Finance", "Healthcare"] }
            ]} />
            <SavedViews views={[
              { label: "All Assets", filters: [] },
              { label: "Equities Only", filters: [{ label: "Asset Type", value: "Equity" }] }
            ]} />
          </Section>
        </Sidebar>
        <main style={{ flex: 1, padding: "1rem" }}>
          <Section title="Portfolio Summary">
            <Metric label="Total Value" value={1000000} delta={{ value: 5000, basis: "previous day" }} unit="USD" />
            <Metric label="Daily Return" value={0.05} delta={{ value: -0.01, basis: "previous day" }} unit="%" />
            <Metric label="Volatility" value={0.02} delta={{ value: 0.005, basis: "previous day" }} unit="%" />
          </Section>
          <Section title="Top Performers">
            <Comparison entities={[
              { id: "AAPL", metrics: { value: 100, delta: { value: 5, basis: "previous day" } } },
              { id: "MSFT", metrics: { value: 95, delta: { value: -2, basis: "previous day" } }
            ]} />
          </Section>
          <Section title="Detailed View">
            <Card title="Apple Inc. (AAPL)">
              <Metric label="Daily Return" value={5} delta={{ value: 1, basis: "previous day" }} unit="%" />
              <Metric label="Volatility" value={2} delta={{ value: 0.5, basis: "previous day" }} unit="%" />
              <Timeline events={[
                { date: "2023-11-01", label: "Positive Earnings Report", type: "positive" },
                { date: "2023-11-02", label: "Market Downturn", type: "negative" }
              ]} />
            </Card>
            <Card title="Microsoft Corp. (MSFT)">
              <Metric label="Daily Return" value={-2} delta={{ value: -3, basis: "previous day" }} unit="%" />
              <Metric label="Volatility" value={3} delta={{ value: 0.75, basis: "previous day" }} unit="%" />
              <Timeline events={[
                { date: "2023-11-01", label: "Negative Earnings Report", type: "negative" },
                { date: "2023-11-02", label: "Market Downturn", type: "negative" }
              ]} />
            </Card>
          </Section>
        </main>
      </div>
    </Page>
  );
}
