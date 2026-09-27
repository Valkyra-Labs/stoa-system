import { Page, Header, Sidebar, Section, Card, Metric, Delta, Chart, DataTable, Comparison, Timeline, AuditLog, Status, Tabs, Drawer, FilterBar, SavedViews, Button, BulkActions } from "@stoa/react";

export default function PortfolioDashboard() {
  return (
    <Page title="Portfolio Dashboard">
      <Header title="Portfolio Dashboard" subtitle="Morning Overview" actions={<Button label="Refresh" variant="primary" />} />
      <main>
        <Section title="Summary Metrics">
          <Card title="Total Portfolio Value">
            <Metric label="Value" value={1000000} delta={-5000} unit="USD" />
          </Card>
          <Card title="Net Gain/Loss">
            <Metric label="Net Gain/Loss" value={-5000} delta={-2000} unit="USD" />
          </Card>
        </Section>
        <Section title="Top Movers">
          <Card title="Top Movers">
            <DataTable
              columns={[
                { label: "Asset", key: "asset" },
                { label: "Change", key: "change" },
                { label: "Value", key: "value" },
              ]}
              rows={[
                { asset: "AAPL", change: -1.5, value: 150 },
                { asset: "GOOGL", change: 2.0, value: 200 },
                { asset: "MSFT", change: -0.5, value: 120 },
              ]}
            />
            <Chart type="line" series={[{ data: [[0, 150], [1, 148], [2, 145]] }]} x="time" y="value" />
          </Card>
        </Section>
        <Section title="Reasons for Movement">
          <Card title="Market Trends">
            <Timeline events={[
              { time: "2023-10-01T12:00:00Z", label: "Market Downturn", description: "Stock market experiences a significant decline." },
              { time: "2023-10-01T14:30:00Z", label: "Tech Sector Rally", description: "Tech stocks recover from earlier losses." },
            ]} />
          </Card>
          <Card title="News Events">
            <AuditLog entries={[
              { time: "2023-10-01T09:00:00Z", user: "Finance Analyst", action: "Updated AAPL forecast", details: "New earnings report suggests lower-than-expected profits." },
              { time: "2023-10-01T11:00:00Z", user: "Market Reporter", action: "Published GOOGL news", details: "GOOGL announces new product release, driving stock up." },
            ]} />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
