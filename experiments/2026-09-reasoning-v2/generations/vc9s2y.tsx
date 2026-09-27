import { Page, Header, Section, Card, Tabs, Metric, Delta, DataTable, Status, EmptyData, StaleData, ErrorData, Button, BulkActions } from "@stoa/react";

export default function PortfolioMorningView() {
  const metrics = [
    { label: "Net Asset Value", value: 4205000000, delta: 12500000, unit: "USD" },
    { label: "Daily Return", value: 0.0234, delta: 0.0012, unit: "%" },
    { label: "Volatility (30d)", value: 0.0189, delta: 0.0045, unit: "" },
    { lastUpdated: "2023-10-27T08:00:00Z" }
  ];

  const alerts = [
    {
      id: 1,
      entity: "Equity Fund Alpha",
      metric: "Daily Return",
      value: -0.045,
      delta: -0.008,
      basis: "Prev Day",
      reason: "Sector rotation out of Tech",
      severity: "critical",
      source: "Morningstar"
    },
    {
      id: 2,
      entity: "Bond Portfolio Beta",
      metric: "Volatility",
      value: 0.032,
      delta: 0.009,
      basis: "Target",
      reason: "Liquidity crunch in high yield",
      severity: "warning",
      source: "Internal Model"
    }
  ];

  const movements = [
    { id: 101, entity: "Tech Sector ETF", change: 1.25, prev: 1.20, date: "2023-10-26" },
    { id: 102, entity: "Emerging Markets", change: 0.85, prev: 0.92, date: "2023-10-26" },
    { id: 103, entity: "US Treasuries", change: -0.05, prev: -0.08, date: "2023-10-26" },
    { id: 104, entity: "Commodities", change: 0.42, prev: 0.38, date: "2023-10-26" },
    { id: 105, entity: "Small Cap Growth", change: -0.15, prev: -0.12, date: "2023-10-26" },
  ];

  const columns = [
    { key: "entity", label: "Entity", sticky: true },
    { key: "metric", label: "Metric" },
    { key: "value", label: "Current", align: "right" },
    { key: "delta", label: "Change", align: "right" },
    { key: "basis", label: "Basis", align: "right" },
    { key: "source", label: "Source" },
    { key: "action", label: "Action", align: "center" }
  ];

  return (
    <Page title="Portfolio Morning Book">
      <Header title="Portfolio Book" subtitle="Oct 27, 2023" actions={<Button label="Export Report" />} />
      
      <Section title="Portfolio Health">
        <div className="grid">
          <Card title="Key Metrics">
            <Metric label="Net Asset Value" value={4205000000} delta={12500000} unit="USD" />
            <Metric label="Daily Return" value={0.0234} delta={0.0012} unit="%" />
            <Metric label="Volatility (30d)" value={0.0189} delta={0.0045} />
          </Card>
          <Card title="Data Freshness">
            {metrics.lastUpdated ? (
              <Status tone="success" label={`Data updated ${metrics.lastUpdated}`.split(" ")[1]} />
            ) : (
              <StaleData since="2023-10-26T14:00:00Z" />
            )}
          </Card>
        </div>
      </Section>

      <Section title="Critical Alerts">
        {alerts.length > 0 ? (
          <DataTable columns={columns} rows={alerts} />
        ) : (
          <EmptyData message="No critical alerts detected." />
        )}
      </Section>

      <Section title="Market Movements (Yesterday)">
        {movements.length > 0 ? (
          <DataTable 
            columns={columns} 
            rows={movements} 
            onRowSelect={(row) => alert(`Detail view for ${row.entity}`)}
          />
        ) : (
          <EmptyData message="No significant movements recorded." />
        )}
      </Section>

      <Section title="Quick Actions">
        <BulkActions actions={[
          { label: "Rebalance Portfolio", onPress: () => alert("Rebalancing initiated") },
          { label: "Review Risk Model", onPress: () => alert("Risk model review started") }
        ]} />
        <Button label="View Full Audit Log" />
      </Section>
    </Page>
  );
}
