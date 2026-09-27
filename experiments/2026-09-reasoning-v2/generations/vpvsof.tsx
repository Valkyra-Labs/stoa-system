import { Page, Header, Section, Card, Tabs, Button, Metric, Delta, DataTable, EmptyData, StaleData, ErrorData } from "@stoa/react";

const placeholderData = [
  { id: 1, symbol: "AAPL", ticker: "Apple Inc.", prevClose: 175.50, current: 178.20, delta: 2.70, deltaPct: 1.54, reason: "Sector rotation into tech" },
  { id: 2, symbol: "MSFT", ticker: "Microsoft Corp", prevClose: 320.10, current: 325.80, delta: 5.70, deltaPct: 1.78, reason: "AI partnership announcement" },
  { id: 3, symbol: "GOOGL", ticker: "Alphabet Inc", prevClose: 135.20, current: 133.90, delta: -1.30, deltaPct: -0.96, reason: "Regulatory filing delay" },
  { id: 4, symbol: "AMZN", ticker: "Amazon.com", prevClose: 130.00, current: 132.45, delta: 2.45, deltaPct: 1.88, reason: "Cloud growth estimates raised" },
  { id: 5, symbol: "NVDA", ticker: "NVIDIA Corp", prevClose: 460.00, current: 458.20, delta: -1.80, deltaPct: -0.39, reason: "Short-term profit taking" },
  { id: 6, symbol: "TSLA", ticker: "Tesla Inc", prevClose: 245.00, current: 248.50, delta: 3.50, deltaPct: 1.43, reason: "Production capacity update" },
];

const Explorer = () => (
  <Section title="Morning Book: Movement Since Yesterday">
    <Card title="Market Movements" className="mb-4">
      <DataTable
        columns={[
          { key: "symbol", label: "Symbol" },
          { key: "ticker", label: "Company" },
          { key: "prevClose", label: "Prev Close" },
          { key: "current", label: "Current", stickyFirstColumn: false },
          { key: "delta", label: "Delta", stickyFirstColumn: false },
          { key: "deltaPct", label: "Change", stickyFirstColumn: false },
          { key: "reason", label: "Reason" },
        ]}
        rows={placeholderData}
        onRowSelect={(row) => {
          // In a real app, this would open an Inspector or Drawer
          console.log("Inspecting:", row);
        }}
      />
    </Card>

    <Section title="Exceptions & Actions Required">
      <Card title="Positions with Significant Moves">
        {placeholderData.filter(item => Math.abs(item.delta) > 2).length === 0 ? (
          <EmptyData message="No significant movements detected today." />
        ) : (
          <div className="grid gap-4">
            {placeholderData.filter(item => Math.abs(item.delta) > 2).map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1">
                  <Metric label={item.symbol} value={item.current} unit="USD" />
                  <Metric label="Previous" value={item.prevClose} unit="USD" />
                  <Delta value={item.deltaPct} basis="vs yesterday" />
                </div>
                <div className="flex flex-col gap-2">
                  <Status tone="warning" label={item.delta > 0 ? "Outperformance" : "Underperformance"} />
                  <p className="text-sm text-gray-600">{item.reason}</p>
                  <Button label="Review Rationale" variant="primary" onPress={() => console.log("Reviewing rationale for", item.symbol)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Section>
  </Section>
);

const Status = ({ tone, label }: { tone: "success" | "warning" | "error", label: string }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
    tone === "success" ? "bg-green-100 text-green-800" :
    tone === "warning" ? "bg-yellow-100 text-yellow-800" :
    "bg-red-100 text-red-800"
  }`}>
    {label}
  </span>
);

const Dashboard = () => (
  <Page title="Portfolio Book">
    <Header title="Morning Book" subtitle="Market movements since yesterday" />
    <main className="p-6">
      <Section title="Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Metric label="Total P&L" value="2.4%" delta={1.2} unit="%" />
          <Metric label="Avg Daily Vol" value="18.5" delta={-2.1} unit="%" />
          <Metric label="Top Mover" value="MSFT" />
        </div>
      </Section>
      <Explorer />
    </main>
  </Page>
);

export default Dashboard;
