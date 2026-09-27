import { Page, Header, Sidebar, Section, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, Status, EmptyData, StaleData, FilterBar, Button, BulkActions, Explorer } from "@stoa/react";

export default function PortfolioOverview() {
  return (
    <Page title="Portfolio Overview">
      <Header title="Portfolio Overview" subtitle="Changes since yesterday" actions={<Button label="Refresh" />} />
      <Section title="Top Changes">
        <DataTable
          columns={[
            { label: "Symbol", key: "symbol" },
            { label: "Change", key: "change" },
            { label: "Volume", key: "volume" },
            { label: "Value", key: "value" }
          ]}
          rows={[
            { symbol: "AAPL", change: <Delta value={-2.5} basis={150.0} />, volume: 12000, value: 147500 },
            { symbol: "GOOGL", change: <Delta value={1.2} basis={2500.0} />, volume: 5000, value: 251200 },
            { symbol: "MSFT", change: <Delta value={-0.8} basis={300.0} />, volume: 8000, value: 299200 }
          ]}
          selectable
          stickyFirstColumn
          onRowSelect={() => console.log("Row selected")}
        />
      </Section>
      <Section title="Portfolio Performance">
        <Comparison
          entities={[
            { id: "Total", metrics: [{ label: "Value", value: 500000, delta: <Delta value={-1500} basis={515000} />, unit: "USD" }] },
            { id: "Equities", metrics: [{ label: "Value", value: 350000, delta: <Delta value={-1000} basis={360000} />, unit: "USD" }] },
            { id: "Bonds", metrics: [{ label: "Value", value: 150000, delta: <Delta value={-500} basis={155000} />, unit: "USD" }] }
          ]}
        />
      </Section>
      <Section title="Market Trends">
        <Chart type="line" series={[{ label: "S&P 500", data: [{ x: "2023-11-01", y: 4000 }, { x: "2023-11-02", y: 4020 }, { x: "2023-11-03", y: 4010 }] }]} x="date" y="value" />
      </Section>
      <Sidebar>
        <Section title="Quick Actions">
          <Button label="Buy AAPL" />
          <Button label="Sell GOOGL" />
          <Button label="Rebalance" />
        </Section>
      </Sidebar>
    </Page>
  );
}
