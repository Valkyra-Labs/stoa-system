import { Page, Header, Sidebar, Section, Card, Tabs, Metric, DataTable, Status, EmptyData, Button } from "@stoa/react";

const MOCK_ASSETS = [
  { id: "ASSET_001", symbol: "TECH_GROWTH", name: "Tech Growth Fund", prevClose: 145.20, currentClose: 158.45, changePct: 9.1, changeType: "up", volatility: "high", reason: "AI sector surge", newsCount: 12 },
  { id: "ASSET_002", symbol: "BLUE_CHIP", name: "Blue Chip Index", prevClose: 3200.50, currentClose: 3185.10, changePct: -0.5, changeType: "down", volatility: "low", reason: "Market correction", newsCount: 3 },
  { id: "ASSET_003", symbol: "EMERGING_MKT", name: "Emerging Markets", prevClose: 890.00, currentClose: 920.50, changePct: 3.4, changeType: "up", volatility: "med", reason: "Commodities rally", newsCount: 5 },
  { id: "ASSET_004", symbol: "RETAIL_SEC", name: "Retail Sector", prevClose: 112.00, currentClose: 108.50, changePct: -3.1, changeType: "down", volatility: "med", reason: "Sales data miss", newsCount: 8 },
  { id: "ASSET_005", symbol: "GREEN_ENG", name: "Green Energy", prevClose: 65.00, currentClose: 65.10, changePct: 0.2, changeType: "flat", volatility: "low", reason: "Stable", newsCount: 1 },
  { id: "ASSET_006", symbol: "FIN_TECH", name: "FinTech Corp", prevClose: 210.00, currentClose: 195.00, changePct: -7.1, changeType: "down", volatility: "high", reason: "Regulatory warning", newsCount: 15 },
];

const AssetDetail = ({ asset }: { asset: typeof MOCK_ASSETS[0] }) => (
  <Section title={`Detail: ${asset.name} (${asset.symbol})`}>
    <Card title="Price Movement" children={<div className="flex gap-4"> <Metric label="Yesterday Close" value={asset.prevClose} /> <Metric label="Current Close" value={asset.currentClose} /> <Metric label="Change" value={asset.changePct} delta={asset.changeType === 'up' ? 'up' : asset.changeType === 'down' ? 'down' : 'flat'} /> </div>}>
    </Card>
    <Card title="Catalyst & Evidence" children={
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4>Primary Reason</h4>
          <Status tone="info" label={asset.reason} />
          <p className="mt-2 text-sm text-gray-500">Analysis indicates the move is driven by {asset.reason === 'AI sector surge' ? 'recent earnings reports and analyst upgrades' : 'sector-wide sentiment shifts'}. Volume has increased by 240% compared to the previous session.</p>
        </div>
        <div>
          <h4>News Feed (Last 24h)</h4>
          <div className="space-y-2">
            {Array.from({ length: Math.min(asset.newsCount, 3) }).map((_, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <span className="text-sm">{`Item ${i+1}: ${asset.reason} confirmation.`}</span>
              </div>
            ))}
            {asset.newsCount > 3 && <p className="text-sm text-gray-500">...and {asset.newsCount - 3} more items</p>}
          </div>
        </div>
      </div>
    }>
    </Card>
    <Card title="Technical Context" children={
      <div className="flex gap-4">
        <div className="flex-1">
          <h4>RSI (14)</h4>
          <Metric label="Value" value={asset.changeType === 'up' ? 72 : asset.changeType === 'down' ? 28 : 45} />
        </div>
        <div className="flex-1">
          <h4>Volatility Index</h4>
          <Metric label="Level" value={asset.volatility === 'high' ? 'High' : asset.volatility === 'med' ? 'Medium' : 'Low'} />
        </div>
      </div>
    }>
    </Card>
  </Section>
);

const PortfolioExplorer = ({ assets }: { assets: typeof MOCK_ASSETS }) => (
  <Section title="Portfolio Scan">
    <Card title="Assets with Significant Movement">
      <DataTable
        columns={[
          { key: "symbol", label: "Symbol" },
          { key: "name", label: "Name" },
          { key: "changePct", label: "Change %", format: (v) => `${v > 0 ? '+' : ''}${v}%`, align: "right" },
          { key: "reason", label: "Catalyst" },
          { key: "newsCount", label: "News", align: "right" },
        ]}
        rows={assets}
        onRowSelect={(asset) => {
          const detail = document.getElementById(`detail-${asset.id}`);
          if (detail) detail.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />
    </Card>
    <Section title="Action Required">
      <Card title="Immediate Attention" children={
        <div className="flex gap-4">
          {assets.filter(a => Math.abs(a.changePct) > 5).map(asset => (
            <Button key={asset.id} label={`Review ${asset.name}`} onPress={() => document.getElementById(`detail-${asset.id}`)?.scrollIntoView({ behavior: "smooth" })} variant="primary" />
          ))}
        </div>
      }>
      </Card>
    </Section>
  </Section>
);

export default function PortfolioMorningScreen() {
  return (
    <Page title="Portfolio Morning Brief">
      <Header title="Portfolio Overview" subtitle="Daily Market Movement" />
      <main className="p-6">
        <Sidebar children={
          <nav className="space-y-1">
            <button className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded">All Assets</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">High Volatility</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Sector Rotation</button>
          </nav>
        } />
        <PortfolioExplorer assets={MOCK_ASSETS} />
      </main>
    </Page>
  );
}
