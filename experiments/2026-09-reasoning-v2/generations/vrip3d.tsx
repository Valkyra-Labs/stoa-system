import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  DataTable,
  FilterBar,
  BulkActions,
  Status,
  Tabs,
  EmptyData,
  StaleData,
} from "@stoa/react";

const portfolioData = [
  {
    id: "P-1024",
    symbol: "NVDA",
    name: "NVIDIA Corp",
    position: 45,
    current: 118.42,
    yesterday: 115.20,
    target: 125.00,
    costBasis: 98.50,
    pnl: 892.50,
    pnlPct: 18.2,
    reason: "Q3 AI chip demand surge exceeded consensus estimates.",
    evidence: "Earnings call transcript, sector analyst upgrades.",
  },
  {
    id: "P-1025",
    symbol: "AMD",
    name: "Advantage Micro",
    position: 30,
    current: 142.10,
    yesterday: 148.75,
    target: 150.00,
    costBasis: 135.00,
    pnl: -198.00,
    pnlPct: -4.6,
    reason: "Data center guidance cut due to server shipment delays.",
    evidence: "Earnings call transcript, supply chain reports.",
  },
  {
    id: "P-1026",
    symbol: "TSLA",
    name: "Tesla Inc",
    position: 20,
    current: 248.50,
    yesterday: 252.30,
    target: 260.00,
    costBasis: 220.00,
    pnl: 580.00,
    pnlPct: 12.9,
    reason: "FSD V12 beta launch driving short-term volatility.",
    evidence: "Product release event, option chain data.",
  },
  {
    id: "P-1027",
    symbol: "MSFT",
    name: "Microsoft",
    position: 15,
    current: 412.00,
    yesterday: 410.50,
    target: 425.00,
    costBasis: 380.00,
    pnl: 480.00,
    pnlPct: 8.4,
    reason: "Cloud infrastructure growth acceleration.",
    evidence: "Weekly revenue update, analyst upgrades.",
  },
  {
    id: "P-1028",
    symbol: "AAPL",
    name: "Apple Inc",
    position: 50,
    current: 185.30,
    yesterday: 186.90,
    target: 195.00,
    costBasis: 175.00,
    pnl: 520.00,
    pnlPct: 5.9,
    reason: "Weak iPhone 16 pre-order data in China.",
    evidence: "Retailer sales reports, analyst downgrades.",
  },
  {
    id: "P-1029",
    symbol: "AMZN",
    name: "Amazon",
    position: 25,
    current: 178.20,
    yesterday: 179.50,
    target: 185.00,
    costBasis: 165.00,
    pnl: 325.00,
    pnlPct: 8.0,
    reason: "Prime membership growth slowing in Europe.",
    evidence: "Retail analytics, macroeconomic indicators.",
  },
];

export default function PortfolioBook() {
  return (
    <Page title="Morning Book Review">
      <Header
        title="Portfolio Book"
        subtitle="Daily review of P&L and market drivers"
        actions={
          <>
            <Status tone="success" label="Data Fresh: Yesterday 08:00" />
          </>
        }
      />
      <main>
        <Section title="Exceptions & Action Items">
          <p className="sr-only">
            Items needing attention sorted by largest P&L change.
          </p>
          <Card title="Top Moves Today">
            <DataTable
              columns={[
                { key: "symbol", label: "Symbol", sticky: true },
                { key: "pnl", label: "P&L", align: "right" },
                { key: "pnlPct", label: "% Change", align: "right" },
                { key: "reason", label: "Driver", width: 200 },
              ]}
              rows={portfolioData}
              onRowSelect={(row) => {
                // Drill down action
              }}
              selectable
            />
          </Card>
        </Section>

        <Section title="Current Positions Overview">
          <p className="sr-only">
            Full position list sorted by percentage change magnitude.
          </p>
          <Card title="Position Details">
            <Tabs
              items={[
                {
                  id: "table",
                  label: "Full List",
                  content: (
                    <DataTable
                      columns={[
                        { key: "symbol", label: "Symbol", sticky: true },
                        { key: "current", label: "Price", align: "right" },
                        { key: "pnl", label: "P&L", align: "right" },
                        { key: "pnlPct", label: "%", align: "right" },
                        { key: "target", label: "Target", align: "right" },
                      ]}
                      rows={portfolioData}
                      selectable
                    />
                  ),
                },
                {
                  id: "metrics",
                  label: "Key Metrics",
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Metric label="Total P&L" value={2474.5} unit="USD" />
                      <Metric label="Avg Realization" value={12.37} unit="%" />
                      <Metric label="Target Hit Rate" value={65} unit="%" />
                      <Metric label="Stale Signals" value={2} unit="%" />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Section>

        <Section title="Market Context & Evidence">
          <Card title="Why these moved?">
            <p className="mb-4">
              The largest moves are driven by earnings surprises and product launches.
              Review the evidence column for source verification.
            </p>
            <DataTable
              columns={[
                { key: "symbol", label: "Symbol", sticky: true },
                { key: "reason", label: "Driver", width: 250 },
                { key: "evidence", label: "Source", width: 250 },
              ]}
              rows={portfolioData}
              onRowSelect={(row) => {
                // Show evidence detail
              }}
            />
          </Card>
        </Section>

        <Section title="Controls">
          <FilterBar
            filters={[
              {
                key: "status",
                label: "Status",
                options: ["All", "In Profit", "In Loss", "At Target"],
              },
              {
                key: "threshold",
                label: "Min P&L",
                type: "number",
                value: 0,
              },
            ]}
          />
          <BulkActions
            actions={[
              {
                label: "Close All",
                variant: "danger",
                onPress: () => alert("Confirm: Close all positions?"),
              },
              {
                label: "Rebalance to Target",
                variant: "primary",
                onPress: () => alert("Simulate rebalance based on targets."),
              },
            ]}
          />
        </Section>
      </main>
    </Page>
  );
}
