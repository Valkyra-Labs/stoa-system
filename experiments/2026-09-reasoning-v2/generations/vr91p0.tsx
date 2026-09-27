import { Page, Header, Section, Card, Metric, Delta, DataTable, FilterBar, Button, BulkActions, Status, EmptyData, StaleData } from "@stoa/react";

const assets = [
  { id: "AAPL", name: "Apple Inc.", change: 2.3, basis: 150.2, unit: "USD", reason: "Positive earnings report" },
  { id: "TSLA", name: "Tesla Inc.", change: -4.1, basis: 260.5, unit: "USD", reason: "Supply chain delays" },
  { id: "AMZN", name: "Amazon.com", change: 1.8, basis: 135.7, unit: "USD", reason: "Increased demand for logistics" },
  { id: "NVDA", name: "NVIDIA Corp.", change: -2.9, basis: 300.1, unit: "USD", reason: "Market volatility" },
  { id: "GOOGL", name: "Alphabet Inc.", change: 0.5, basis: 130.3, unit: "USD", reason: "Positive analyst coverage" },
];

const staleAssets = [
  { id: "MSFT", name: "Microsoft Corp.", change: 3.2, basis: 320.4, unit: "USD", reason: "Stale data" },
  { id: "FB", name: "Meta Platforms", change: -1.2, basis: 280.6, unit: "USD", reason: "Stale data" },
];

const columns = [
  { key: "name", label: "Asset" },
  { key: "change", label: "Change" },
  { key: "basis", label: "Basis" },
  { key: "unit", label: "Unit" },
  { key: "reason", label: "Reason" },
];

export default function PortfolioOverview() {
  return (
    <Page title="Portfolio Overview">
      <Header title="What Moved Since Yesterday" subtitle="Key changes and reasons" actions={<Button label="Refresh" />} />
      <Section title="Top Changes">
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <Metric label="Total Value" value="12,500.00" unit="USD" />
            <Metric label="Total Change" value="3.2" delta={2.1} unit="USD" />
            <Status tone="info" label="Stale data since 2 hours ago" />
          </div>
        </Card>
      </Section>
      <Section title="Assets with Significant Movement">
        <Card>
          {assets.length > 0 ? (
            <DataTable
              columns={columns}
              rows={assets}
              selectable
              stickyFirstColumn
              onRowSelect={(selected) => alert(`Selected: ${selected.name}`)}
            />
          ) : (
            <EmptyData message="No significant changes detected" />
          )}
        </Card>
      </Section>
      <Section title="Stale Data">
        <Card>
          {staleAssets.length > 0 ? (
            <DataTable
              columns={columns}
              rows={staleAssets}
              selectable
              stickyFirstColumn
            />
          ) : (
            <EmptyData message="No stale data" />
          )}
        </Card>
      </Section>
      <FilterBar filters={[{ id: "time", label: "Time Period", options: ["Yesterday", "Last Week", "All Time"] }]} />
      <BulkActions>
        <Button label="Sell Selected" variant="destructive" />
        <Button label="Buy Selected" />
      </BulkActions>
    </Page>
  );
}
