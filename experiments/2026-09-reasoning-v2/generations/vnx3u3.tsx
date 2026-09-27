import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, DataTable, FilterBar, Button, SavedViews, Status, EmptyData } from "@stoa/react";

const PortfolioChangeScreen = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const positions = [
    { id: 1, name: "Tech Fund", value: 1500000, delta: 12000, reason: "Market rebound in tech sector" },
    { id: 2, name: "Energy Sector", value: 850000, delta: -15000, reason: "Oil prices dropped" },
    { id: 3, name: "Bond Portfolio", value: 2200000, delta: 2500, reason: "Interest rates stable" },
    { id: 4, name: "Real Estate", value: 1100000, delta: -8000, reason: "Rental demand softened" },
  ];

  const metrics = [
    { label: "Total Value", value: 5650000, delta: 18000, unit: "$" },
    { label: "Net Change", value: 18000, delta: 0.32, unit: "%" },
    { label: "Top Gainers", value: 2, delta: 1, unit: "positions" },
    { label: "Top Losers", value: 2, delta: -1, unit: "positions" },
  ];

  return (
    <Page title="Portfolio Changes Since Yesterday">
      <Header title="Portfolio Changes" subtitle={`Since ${yesterday.toDateString()}`} actions={<Button label="Refresh" variant="primary" />} />
      <Sidebar>
        <FilterBar filters={["All", "Gainers", "Losers"]} />
        <SavedViews views={["Daily", "Weekly", "Monthly"]} />
      </Sidebar>
      <main>
        <Section title="Overview">
          <Card>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", flexWrap: "wrap" }}>
              {metrics.map((metric, i) => (
                <Metric key={i} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
              ))}
            </div>
          </Card>
        </Section>
        <Section title="Position Changes">
          <Card>
            <DataTable
              columns={[{ header: "Name", key: "name" }, { header: "Value", key: "value" }, { header: "Delta", key: "delta" }, { header: "Reason", key: "reason" }]}
              rows={positions}
              selectable
            />
          </Card>
        </Section>
        <Section title="Performance Summary">
          <Card>
            <Tabs items={[
              { id: "1", label: "Performance Chart", content: <Chart type="line" series={[{ name: "Tech Fund", data: [1500000, 1620000, 1650000] }]} x="Date" y="Value" /> },
              { id: "2", label: "Comparison", content: <Comparison entities={["Tech Fund", "Energy Sector"]} metrics={["Value", "Delta"]} /> },
            ]} />
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default PortfolioChangeScreen;
