import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, Button, FilterBar, SavedViews, BulkActions } from "@stoa/react";

export default function MorningReview() {
  return (
    <Page title="Morning Review">
      <Header title="Morning Review" subtitle="Overview of portfolio changes since yesterday" />
      <Section title="Summary Metrics">
        <Card title="Portfolio Performance">
          <Metric label="Total Return" value={0.2} delta={-0.05} unit="%" />
          <Metric label="Exposure" value={95} delta={5} unit="%" />
          <Metric label="Risk" value={2.1} delta={-0.3} unit="%" />
        </Card>
      </Section>
      <Section title="Top Movers">
        <DataTable
          columns={[
            { label: "Asset", key: "asset" },
            { label: "Change", key: "change" },
            { label: "Impact", key: "impact" },
          ]}
          rows={[
            { asset: "Tech ETF", change: 2.5, impact: "High" },
            { asset: "Energy Stock", change: -3.0, impact: "Medium" },
            { asset: "Real Estate Fund", change: 1.2, impact: "Low" },
          ]}
        />
      </Section>
      <Section title="Detailed Analysis">
        <Tabs items={[
          { id: "tech-etf", label: "Tech ETF", content: (
            <Card title="Tech ETF Analysis">
              <Chart type="line" series={[{ label: "Price", data: [{ x: 1, y: 100 }, { x: 2, y: 105 }] }]} x="day" y="price" />
              <Chart type="bar" series={[{ label: "Volume", data: [{ x: 1, y: 1000 }, { x: 2, y: 1200 }] }]} x="day" y="volume" />
              <p>Recent news and analysis about the tech ETF.</p>
            </Card>
          )},
          { id: "energy-stock", label: "Energy Stock", content: (
            <Card title="Energy Stock Analysis">
              <Chart type="line" series={[{ label: "Price", data: [{ x: 1, y: 50 }, { x: 2, y: 45 }] }]} x="day" y="price" />
              <Chart type="bar" series={[{ label: "Volume", data: [{ x: 1, y: 500 }, { x: 2, y: 600 }] }]} x="day" y="volume" />
              <p>Recent news and analysis about the energy stock.</p>
            </Card>
          )},
        ]} />
      </Section>
    </Page>
  );
}
