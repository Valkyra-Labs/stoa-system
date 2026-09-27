import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Chart,
  DataTable,
  Button,
  FilterBar,
  Tabs,
  Drawer,
  Status,
  EmptyData,
} from "@stoa/react";

const PortfolioOverview = () => {
  const [isDrawerOpen, setIsDrawerOpen] = false;

  const metrics = [
    { label: "Total AUM", value: "$482.3M", unit: "USD" },
    { label: "YTD Return", value: "12.4%", unit: "%" },
    { label: "Volatility", value: "8.2%", unit: "%" },
  ];

  const topMovers = [
    {
      id: 1,
      ticker: "AAPL",
      name: "Apple Inc.",
      weight: "4.2%",
      change: "2.1%",
      delta: 0.021,
      basis: "Last Close",
      reason: "Earnings beat + Buyback",
    },
    {
      id: 2,
      ticker: "NVDA",
      name: "NVIDIA Corp.",
      weight: "3.8%",
      change: "-1.5%",
      delta: -0.015,
      basis: "Last Close",
      reason: "Chip shortage concern",
    },
    {
      id: 3,
      ticker: "MSFT",
      name: "Microsoft",
      weight: "2.9%",
      change: "0.8%",
      delta: 0.008,
      basis: "Last Close",
      reason: "Cloud growth",
    },
    {
      id: 4,
      ticker: "TSLA",
      name: "Tesla Inc.",
      weight: "1.5%",
      change: "-5.3%",
      delta: -0.053,
      basis: "Last Close",
      reason: "Delivery misses",
    },
    {
      id: 5,
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      weight: "1.2%",
      change: "1.1%",
      delta: 0.011,
      basis: "Last Close",
      reason: "Ad revenue rise",
    },
  ];

  const recentEvents = [
    { time: "08:30", type: "Earnings", entity: "AAPL", desc: "Q4 Revenue beat estimates" },
    { time: "09:15", type: "Analyst", entity: "NVDA", desc: "Downgraded to 'Sell'" },
    { time: "10:00", type: "Trade", entity: "TSLA", desc: "Large short position added" },
    { time: "14:30", type: "Market", entity: "SPY", desc: "Sector rotation to Tech" },
  ];

  const drawerContent = (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Why did {topMovers[0].ticker} move?</h3>
      <p className="text-gray-600">
        Apple reported Q4 earnings of $12.1B vs. $11.8B expected. Revenue beat by 3%.
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        <li>iPhone sales exceeded expectations in China.</li>
        <li>Services revenue grew 11% YoY.</li>
        <li>Share repurchase program accelerated.</li>
      </ul>
      <Button label="View Full Report" onPress={() => setIsDrawerOpen(false)} />
    </div>
  );

  return (
    <Page title="Portfolio Overview" children={<main className="p-6 space-y-6">
      <Header title="Portfolio Performance" subtitle="Daily Review - {new Date().toLocaleDateString()}" />

      {/* High Level Metrics */}
      <Section title="Portfolio Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m, idx) => (
            <Card key={idx} title={m.label} children={
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{m.value}</span>
                {m.delta && (
                  <Delta value={m.delta} basis={m.unit} />
                )}
              </div>
            } />
          ))}
        </div>
      </Section>

      {/* Trend Chart */}
      <Section title="7-Day Performance Trend">
        <Card title="Portfolio Value vs. Benchmark" children={
          <Chart
            type="line"
            series={[
              { label: "Portfolio", data: [480, 482, 481, 485, 488, 487, 482.3] },
              { label: "Benchmark", data: [480, 481, 482, 483, 484, 485, 486] }
            ]}
            x="Day"
            y="Value (M)"
          />
        } />
      </Section>

      {/* Main Table with Filters */}
      <Section title="Positions with Significant Movement">
        <FilterBar filters={{
          filter: { type: "range", label: "Change %", min: -10, max: 10 },
          select: { label: "Asset Class", options: ["Equity", "Fixed Income", "Cash"] }
        }} />
        
        <Card title="Top Movers" children={
          <DataTable
            columns={[
              { key: "ticker", label: "Ticker" },
              { key: "name", label: "Name" },
              { key: "weight", label: "Weight" },
              { key: "change", label: "Change %" },
              { key: "reason", label: "Reason" },
            ]}
            rows={topMovers}
            onRowSelect={(row) => {
              const ticker = row.ticker;
              const reason = row.reason;
              alert(`Drill-down for ${ticker}: ${reason}`);
              // In a real app, this would open a drawer or modal
              setIsDrawerOpen(true);
            }}
          />
        } />
      </Section>

      {/* Recent Activity Feed */}
      <Section title="Market Activity & Events">
        <Card title="Recent Events" children={
          <div className="space-y-3">
            {recentEvents.map((evt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <Status tone={evt.type === "Earnings" ? "success" : evt.type === "Analyst" ? "warning" : "neutral"} label={evt.type} />
                  <div>
                    <p className="font-semibold">{evt.entity} - {evt.desc}</p>
                    <p className="text-sm text-gray-500">{evt.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        } />
      </Section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button label="Download Daily Report" variant="secondary" />
        <Button label="Generate P&L Statement" />
      </div>
    </main>} />
  );
};

export default PortfolioOverview;
