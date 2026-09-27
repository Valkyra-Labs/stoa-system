import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Trend,
  Chart,
  DataTable,
  Tabs,
  Status,
} from "@stoa/react";

export default function PortfolioManager() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const portfolioMetrics = [
    { label: "Portfolio Value", value: "$2,847,500", delta: 45200, unit: "USD" },
    { label: "Daily P&L", value: "$45,200", delta: null },
    { label: "Return YTD", value: "12.3%", delta: 0.8 },
    { label: "Volatility", value: "14.2%", delta: -0.3 },
  ];

  const positions = [
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: 500,
      price: "$189.45",
      value: "$94,725",
      change: 2.3,
      changeAmt: "$2,125",
      weight: "3.3%",
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      quantity: 300,
      price: "$418.75",
      value: "$125,625",
      change: -1.2,
      changeAmt: "-$1,535",
      weight: "4.4%",
    },
    {
      id: "3",
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      quantity: 200,
      price: "$142.30",
      value: "$28,460",
      change: 5.7,
      changeAmt: "$1,525",
      weight: "1.0%",
    },
    {
      id: "4",
      symbol: "TSLA",
      name: "Tesla Inc.",
      quantity: 150,
      price: "$285.60",
      value: "$42,840",
      change: -3.4,
      changeAmt: "-$1,520",
      weight: "1.5%",
    },
    {
      id: "5",
      symbol: "VOO",
      name: "Vanguard S&P 500 ETF",
      quantity: 800,
      price: "$511.20",
      value: "$408,960",
      change: 0.8,
      changeAmt: "$3,270",
      weight: "14.3%",
    },
  ];

  const performanceSeries = [
    { name: "Portfolio", data: [100, 101.2, 100.8, 102.5, 103.1, 104.2, 105.8] },
    { name: "S&P 500", data: [100, 100.9, 100.3, 101.8, 102.1, 102.9, 104.1] },
  ];

  const allocationData = [
    { name: "Large Cap", value: 45, series: [] },
    { name: "Mid Cap", value: 25, series: [] },
    { name: "Small Cap", value: 15, series: [] },
    { name: "Fixed Income", value: 10, series: [] },
    { name: "Cash", value: 5, series: [] },
  ];

  const newsItems = [
    {
      id: "1",
      title: "Fed holds rates steady, signals caution",
      impact: "Market rally in tech sector",
      sentiment: "positive",
    },
    {
      id: "2",
      title: "AI chip shortage eases in Q4",
      impact: "NVDA and TSLA benefit",
      sentiment: "positive",
    },
    {
      id: "3",
      title: "Energy prices spike on geopolitical tensions",
      impact: "Mixed signals for growth stocks",
      sentiment: "neutral",
    },
  ];

  return (
    <Page title="Portfolio Manager">
      <Header
        title="Good Morning"
        subtitle={`${today} | Portfolio at a glance`}
        actions={[
          { label: "Rebalance", onPress: () => {} },
          { label: "Trade", onPress: () => {} },
        ]}
      />

      <main>
        <Section title="Portfolio Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {portfolioMetrics.map((metric, i) => (
              <Card key={i}>
                <Metric
                  label={metric.label}
                  value={metric.value}
                  unit={metric.unit}
                  delta={
                    metric.delta !== null ? (
                      <Delta value={metric.delta} basis={metric.delta > 0 ? "gain" : "loss"} />
                    ) : undefined
                  }
                />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Performance & Allocation">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Card title="7-Day Performance">
              <Chart
                type="line"
                series={performanceSeries}
                x={{ label: "Day" }}
                y={{ label: "Indexed Return" }}
              />
            </Card>
            <Card title="Asset Allocation">
              <Chart
                type="bar"
                series={[
                  {
                    name: "Allocation %",
                    data: allocationData.map((d) => d.value),
                  },
                ]}
                x={{ label: "Asset Class" }}
                y={{ label: "%" }}
              />
            </Card>
          </div>
        </Section>

        <Section title="Positions">
          <DataTable
            columns={[
              { key: "symbol", label: "Symbol", width: "80px" },
              { key: "name", label: "Company", width: "180px" },
              { key: "quantity", label: "Qty", width: "80px" },
              { key: "price", label: "Price", width: "100px" },
              { key: "value", label: "Value", width: "120px" },
              { key: "change", label: "Day Change", width: "120px" },
              { key: "weight", label: "Weight", width: "80px" },
            ]}
            rows={positions}
            stickyFirstColumn={true}
          />
        </Section>

        <Section title="Market Context">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Card title="Market Drivers">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.75rem",
                    borderLeft: "3px solid var(--border-color)",
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: "0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    {item.impact}
                  </p>
                  <Status
                    tone={
                      item.sentiment === "positive" ? "success" : item.sentiment === "negative" ? "error" : "neutral"
                    }
                    label={item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                  />
                </div>
              ))}
            </Card>

            <Card title="Key Metrics">
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    Market Breadth
                  </p>
                  <Metric label="Advancing / Declining" value="2,847 / 1,250" />
                </div>
                <div>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    Sector Leaders
                  </p>
                  <Metric label="Technology" value="+3.2%" />
                </div>
                <div>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    VIX Index
                  </p>
                  <Metric label="Volatility" value="16.45" delta={-1.2} />
                </div>
              </div>
            </Card>
          </div>
        </Section>
      </main>
    </Page>
  );
}
