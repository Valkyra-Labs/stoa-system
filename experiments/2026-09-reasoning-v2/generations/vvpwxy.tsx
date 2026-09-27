import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, FilterBar, Button, Sidebar, Tabs } from "@stoa/react";

const MOCK_HOLDINGS = [
  { ticker: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.15, changePercent: 1.24, volume: "45.2M", sector: "Technology", reason: "Earnings beat expectations; AI integration news." },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 320.10, change: -3.45, changePercent: -1.08, volume: "22.1M", sector: "Technology", reason: "Cloud growth slowed; regulatory concerns in EU." },
  { ticker: "TSLA", name: "Tesla Inc.", price: 245.80, change: 12.30, changePercent: 5.28, volume: "89.4M", sector: "Automotive", reason: "Production ramp-up exceeds forecasts; new factory update." },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 480.55, change: 8.90, changePercent: 1.88, volume: "31.5M", sector: "Semiconductors", reason: "Data center demand surge; new chip architecture revealed." },
  { ticker: "JPM", name: "JPMorgan Chase", price: 145.20, change: -0.50, changePercent: -0.34, volume: "8.9M", sector: "Financials", reason: "Stable quarterly results; margin compression fears." },
];

const PAGE_TITLE = "Portfolio Morning Briefing";

export default function PortfolioBriefing() {
  return (
    <Page title={PAGE_TITLE}>
      <Header title={PAGE_TITLE} subtitle="Portfolio Overview • {today}'s Date" actions={<Button label="Refresh Data" onPress={() => {}} variant="primary" />} />
      
      <Section title="Key Performance Indicators">
        <Card title="Portfolio Health">
          <Metric label="Total Value" value="$4.2B" />
          <Metric label="Net Change (YTD)" value="12.4%" delta={12.4} />
          <Metric label="Volatility (30d)" value="18.2%" unit="%" />
        </Card>
      </Section>

      <Section title="Market Movement vs. Yesterday">
        <Card title="Performance Trend">
          <Chart type="line" series={MOCK_HOLDINGS.map(h => ({ id: h.ticker, data: [0, 1.2, 0.8, 2.1, 1.5, 3.4, 4.2] }))} x={["Mon", "Tue", "Wed", "Thu", "Fri", "Today", "YTD"]} y={["% Change"]} />
        </Card>
      </Section>

      <Section title="Holdings Breakdown">
        <FilterBar filters={{ sector: ["All", "Technology", "Automotive", "Financials"], sort: ["Price", "Change", "Volatility"] }} />
        <DataTable 
          columns={[
            { key: "ticker", label: "Ticker", width: "80px" },
            { key: "name", label: "Name", width: "150px" },
            { key: "price", label: "Price", width: "100px" },
            { key: "change", label: "Change", width: "100px" },
            { key: "sector", label: "Sector", width: "100px" },
            { key: "reason", label: "Driver", width: "250px" },
          ]}
          rows={MOCK_HOLDINGS}
          selectable={true}
          stickyFirstColumn={true}
        />
        
        <Card title="Why are prices moving?" style={{ marginTop: "20px" }}>
          <Tabs items={MOCK_HOLDINGS.map(h => ({ id: h.ticker, label: `${h.ticker} (${h.name})`, content: <div><p><strong>Driver:</strong> {h.reason}</p><p><strong>Impact:</strong> High volume trading indicates active sentiment shift.</p></div> })} />
        </Card>
      </Section>

      <Sidebar>
        <div style={{ padding: "16px" }}>
          <h3>Recent Alerts</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>No new exceptions detected.</p>
          <Button label="View Audit Log" onPress={() => {}} variant="secondary" />
        </div>
      </Sidebar>
    </Page>
  );
}
