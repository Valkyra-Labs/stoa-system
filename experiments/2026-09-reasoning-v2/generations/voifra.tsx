import {
  Page,
  Header,
  Section,
  Card,
  Tabs,
  Drawer,
  Metric,
  DataTable,
  FilterBar,
  Button,
  Status,
  Trend,
} from "@stoa/react";

export default function MorningBook() {
  const topMovers = [
    { id: 1, symbol: "TSLA", name: "Tesla Inc.", price: 245.32, change: 8.45, changePct: 3.55, delta: 8.45, volume: "12.4M" },
    { id: 2, symbol: "NVDA", name: "NVIDIA Corp.", price: 890.10, change: -15.20, changePct: -1.67, delta: -15.20, volume: "45.1M" },
    { id: 3, symbol: "AAPL", name: "Apple Inc.", price: 182.50, change: 0.50, changePct: 0.28, delta: 0.50, volume: "52.3M" },
    { id: 4, symbol: "MSFT", name: "Microsoft Corp.", price: 415.20, change: -2.10, changePct: -0.50, delta: -2.10, volume: "18.9M" },
    { id: 5, symbol: "AMZN", name: "Amazon.com", price: 178.90, change: 5.60, changePct: 3.22, delta: 5.60, volume: "28.7M" },
    { id: 6, symbol: "GOOGL", name: "Alphabet Inc.", price: 142.10, change: 1.20, changePct: 0.85, delta: 1.20, volume: "21.5M" },
    { id: 7, symbol: "META", name: "Meta Platforms", price: 485.60, change: 12.40, changePct: 2.62, delta: 12.40, volume: "15.2M" },
    { id: 8, symbol: "AMD", name: "Adv. Micro Devices", price: 180.40, change: 6.80, changePct: 3.90, delta: 6.80, volume: "35.4M" },
    { id: 9, symbol: "NFLX", name: "Netflix Inc.", price: 620.10, change: -8.90, changePct: -1.41, delta: -8.90, volume: "8.9M" },
    { id: 10, symbol: "DIS", name: "Walt Disney", price: 95.30, change: 2.10, changePct: 2.25, delta: 2.10, volume: "11.2M" },
  ];

  const topGainers = topMovers.filter(m => m.changePct > 0).slice(0, 3);
  const topLosers = topMovers.filter(m => m.changePct < 0).slice(0, 3);

  return (
    <Page title="Morning Book Review">
      <Header title="Portfolio Dashboard" subtitle="Market Moves & Drivers" actions={<Button label="Full Report" variant="secondary" />} />

      <Section title="Market Overview">
        <Card title="Total Portfolio P&L">
          <Metric label="Net Change" value="1.24%" delta="0.45%" />
          <Metric label="Total Value" value="$42,850,000" unit="USD" />
          <Metric label="Volatility Index" value="18.5" unit="SPX" />
        </Card>
      </Section>

      <Section title="Top Movers Since Yesterday">
        <FilterBar filters={{ sortBy: "changePct", order: "desc" }} />
        <DataTable
          columns={[
            { key: "symbol", label: "Symbol", width: "120px" },
            { key: "name", label: "Name", width: "180px" },
            { key: "price", label: "Price", width: "100px" },
            { key: "change", label: "Change $", width: "100px" },
            { key: "changePct", label: "Change %", width: "80px" },
            { key: "volume", label: "Volume", width: "80px" },
          ]}
          rows={topMovers}
          selectable
          onRowSelect={(row) => {
            // In a real app, this would open an Inspector modal
            alert(`Inspecting ${row.symbol}: ${row.name}`);
          }}
        />
      </Section>

      <Section title="Why It Moved: Top 3 Gainers">
        <Drawer title="Top Gainers" open={true}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {topGainers.map((m) => (
              <Card key={m.id} title={m.name}>
                <Metric label="Current Price" value={m.price.toFixed(2)} />
                <Metric label="Delta" value={m.change.toFixed(2)} delta={m.changePct} />
                <Trend series={[m.price - 5, m.price - 4, m.price - 3, m.price - 2, m.price - 1, m.price, m.price + 1]} />
                <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#555" }}>
                  <Status tone="success" label="Earnings Beat" />
                  <p>Analysts raised estimates following Q3 earnings beat.</p>
                </div>
              </Card>
            ))}
          </div>
        </Drawer>
      </Section>

      <Section title="Why It Moved: Top 3 Losers">
        <Drawer title="Top Losers" open={true}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {topLosers.map((m) => (
              <Card key={m.id} title={m.name}>
                <Metric label="Current Price" value={m.price.toFixed(2)} />
                <Metric label="Delta" value={m.change.toFixed(2)} delta={m.changePct} />
                <Trend series={[m.price + 2, m.price + 1.5, m.price, m.price - 0.5, m.price - 1, m.price - 1.5, m.price - 2]} />
                <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#555" }}>
                  <Status tone="error" label="Supply Shock" />
                  <p>Sudden regulatory announcement caused short-term sell-off.</p>
                </div>
              </Card>
            ))}
          </div>
        </Drawer>
      </Section>
    </Page>
  );
}
