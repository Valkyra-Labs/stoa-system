import { Page, Header, Section, Card, Metric, DataTable, Status, EmptyData, StaleData, FilterBar, Button } from "@stoa/react";

export default function PortfolioMorningView() {
  const filters = [
    { id: "assetClass", label: "Asset Class", value: "all", options: ["Equity", "Fixed Income", "Cash"] },
    { id: "region", label: "Region", value: "US", options: ["US", "EM", "Europe"] }
  ];

  const savedViews = [
    { id: "yesterday", label: "Yesterday's Moves", description: "Top 20 movers" },
    { id: "volatility", label: "High Volatility", description: "Assets with >5% change" }
  ];

  const portfolioChanges = [
    { id: "1", symbol: "AAPL", assetClass: "Equity", region: "US", prev: 175.50, current: 182.30, delta: 6.80, deltaPct: 3.88, reason: "Strong earnings beat; AI chip demand surge" },
    { id: "2", symbol: "NVDA", assetClass: "Equity", region: "US", prev: 820.10, current: 845.00, delta: 24.90, deltaPct: 3.04, reason: "Data center revenue guidance raised" },
    { id: "3", symbol: "TSLA", assetClass: "Equity", region: "US", prev: 180.00, current: 168.50, delta: -11.50, deltaPct: -6.39, reason: "Delivery numbers missed; margin compression fears" },
    { id: "4", symbol: "MSFT", assetClass: "Equity", region: "US", prev: 380.00, current: 385.20, delta: 5.20, deltaPct: 1.37, reason: "Cloud AI integration news" },
    { id: "5", symbol: "GOOGL", assetClass: "Equity", region: "US", prev: 140.00, current: 138.80, delta: -1.20, deltaPct: -0.86, reason: "Antitrust lawsuit settlement uncertainty" },
    { id: "6", symbol: "BTC", assetClass: "Crypto", region: "EM", prev: 42000, current: 45500, delta: 3500, deltaPct: 8.33, reason: "Institutional inflow; ETF approval rumors" },
    { id: "7", symbol: "EURUSD", assetClass: "FX", region: "Europe", prev: 1.09, current: 1.07, delta: -0.02, deltaPct: -1.84, reason: "ECB hawkish stance; US yield spread widening" },
    { id: "8", symbol: "TLT", assetClass: "Fixed Income", region: "US", prev: 95.00, current: 92.40, delta: -2.60, deltaPct: -2.74, reason: "Inverted yield curve; recession risk pricing in" },
    { id: "9", symbol: "VIX", assetClass: "Vol", region: "US", prev: 13.5, current: 18.2, delta: 4.7, deltaPct: 34.81, reason: "Market volatility spike after TSLA news" },
    { id: "10", symbol: "XAU", assetClass: "Commodity", region: "EM", prev: 2000, current: 2050, delta: 50, deltaPct: 2.5, reason: "Safe-haven demand amid geopolitical tension" }
  ];

  return (
    <Page title="Portfolio Morning Brief">
      <Header title="Portfolio Moves" subtitle="Yesterday's significant changes" actions={<Button label="Export Report" variant="secondary" />}>
        <Button label="Refresh Data" />
      </Header>

      <Section title="Filter Your View">
        <FilterBar filters={filters} />
        <div style={{ display: "flex", gap: "10px" }}>
          {savedViews.map((view) => (
            <Button key={view.id} label={view.label} variant="secondary" onPress={() => alert(`Loaded view: ${view.description}`)} />
          ))}
        </div>
      </Section>

      <Section title="Top Movers (Absolute Change)">
        <Card title="Largest Gains & Losses">
          <DataTable 
            columns={[
              { key: "symbol", label: "Symbol" },
              { key: "prev", label: "Prev Price", align: "right" },
              { key: "current", label: "Current Price", align: "right" },
              { key: "delta", label: "Change", align: "right" },
              { key: "deltaPct", label: "Change %", align: "right" },
              { key: "assetClass", label: "Class" },
              { key: "region", label: "Region", align: "left" }
            ]}
            rows={portfolioChanges}
            stickyFirstColumn={true}
          />
        </Card>
      </Section>

      <Section title="Why It Moved (Evidence & Actions)">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {portfolioChanges.slice(0, 3).map((item) => (
            <Card key={item.id} title={`${item.symbol} - ${item.delta > 0 ? "Up" : "Down"} ${Math.abs(item.delta)} (${item.deltaPct}%)`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                  <Metric label="Driver" value={item.reason} />
                  <Status tone="neutral" label={`Last updated: 08:42 AM`} />
                </div>
                <div>
                  <Button label="View Full Report" onPress={() => alert(`Opening detailed report for ${item.symbol}`)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Data Integrity">
        <Card title="Data Freshness">
          <div style={{ display: "flex", gap: "20px" }}>
            <Metric label="Market Data" value="Live" unit="Real-time feed" />
            <Metric label="Fund Valuations" value="09:00 AM" unit="Settlement time" />
            <Status tone="warning" label="Stale Data Alert" />
          </div>
          <div style={{ marginTop: "16px" }}>
            <StaleData since="08:00 AM" message="Historical data for 2023 pre-market session is now stale." />
          </div>
        </Card>
      </Section>
    </Page>
  );
}
