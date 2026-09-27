import { Page, Header, Sidebar, Section, Card, Tabs, Drawer, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, FilterBar, SavedViews, Button, BulkActions, Explorer } from "@stoa/react";

const portfolioData = [
  { id: "AAPL", name: "Apple Inc.", price: 150.75, volume: 123456, returns: 0.02 },
  { id: "MSFT", name: "Microsoft Corp.", price: 250.50, volume: 234567, returns: -0.01 },
  { id: "GOOGL", name: "Alphabet Inc.", price: 2800.00, volume: 345678, returns: 0.015 },
];

const portfolioEvents = [
  { id: "AAPL", timestamp: "2023-10-01T10:00:00Z", event: "Price increased by 2%" },
  { id: "MSFT", timestamp: "2023-10-01T11:00:00Z", event: "Volume decreased by 15%" },
  { id: "GOOGL", timestamp: "2023-10-01T12:00:00Z", event: "Returns improved by 1%" },
];

const PortfolioManagerScreen = () => {
  return (
    <Page title="Portfolio Manager">
      <Header title="Portfolio Overview" subtitle="Review changes since yesterday" />
      <Section title="Summary">
        <Card title="Key Metrics">
          <Metric label="Total Value" value={1000000} unit="$" />
          <Metric label="Total Volume" value={703591} unit="shares" />
          <Metric label="Overall Returns" value={0.01} delta={0.005} />
        </Card>
        <Card title="Recent Events">
          <Timeline events={portfolioEvents} />
        </Card>
      </Section>
      <Explorer
        toolbar={<FilterBar filters={[{ label: "Asset", options: ["AAPL", "MSFT", "GOOGL"] }]} />}
        table={
          <DataTable
            columns={[
              { label: "ID", key: "id" },
              { label: "Name", key: "name" },
              { label: "Price", key: "price" },
              { label: "Volume", key: "volume" },
              { label: "Returns", key: "returns" },
            ]}
            rows={portfolioData}
            selectable
          />
        }
        detail={
          <Card title="Asset Detail">
            <Metric label="Price" value={150.75} delta={0.02} unit="$" />
            <Metric label="Volume" value={123456} delta={-0.15} unit="shares" />
            <Metric label="Returns" value={0.02} delta={0.005} />
            <Chart type="line" series={[{ data: [[0, 149.0], [1, 150.75]], label: "Price" }]} x="day" y="price" />
            <Timeline events={portfolioEvents} />
          </Card>
        }
      />
    </Page>
  );
};

export default PortfolioManagerScreen;
