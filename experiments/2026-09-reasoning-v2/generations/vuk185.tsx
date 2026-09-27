import { Page, Header, Sidebar, Section, Card, Tabs, Button, Metric, DataTable, Status, EmptyData } from "@stoa/react";

// Placeholder data for the two funds being compared
const fundA = {
  id: "fund-a",
  name: "Growth Horizon Fund",
  category: "Equity",
  aum: "$450M",
  fee: "0.85%",
  ytdReturn: "+12.4%",
  riskScore: "High",
  topHoldings: ["Tech Corp", "Energy Inc", "Global Corp"],
  description: "Aggressive growth strategy focusing on emerging markets and technology sectors.",
  manager: "Sarah Jenkins",
  inception: "2015"
};

const fundB = {
  id: "fund-b",
  name: "Steady Wealth Fund",
  category: "Balanced",
  aum: "$120M",
  fee: "0.60%",
  ytdReturn: "+5.8%",
  riskScore: "Medium",
  topHoldings: ["Blue Chip Bank", "Healthcare Sys", "Utilities Co"],
  description: "Conservative approach balancing growth with capital preservation through diversified holdings.",
  manager: "Michael Chen",
  inception: "2018"
};

const comparisonMetrics = [
  { label: "YTD Return", valueA: "+12.4%", valueB: "+5.8%", type: "number" },
  { label: "Expense Ratio", valueA: "0.85%", valueB: "0.60%", type: "number" },
  { label: "Max Drawdown (3Y)", valueA: "-22.1%", valueB: "-8.4%", type: "number" },
  { label: "Sharpe Ratio", valueA: "1.1", valueB: "0.9", type: "number" },
  { label: "Holdings Count", valueA: "84", valueB: "56", type: "number" }
];

const performanceSeries = [
  { date: "Jan", valueA: 100, valueB: 100 },
  { date: "Feb", valueA: 105, valueB: 102 },
  { date: "Mar", valueA: 108, valueB: 104 },
  { date: "Apr", valueA: 112, valueB: 106 },
  { date: "May", valueA: 109, valueB: 108 },
  { date: "Jun", valueA: 115, valueB: 110 }
];

export default function FundRecommendationScreen() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Client Fund Selection" subtitle="Compare and select the best option for your client" />
      
      <Section title="Fund Comparison Overview">
        <Card title="Side-by-Side Analysis">
          <Tabs items={[
            { id: "metrics", label: "Key Metrics", content: <MetricComparison metrics={comparisonMetrics} /> },
            { id: "performance", label: "Performance Trend", content: <PerformanceChart series={performanceSeries} /> },
            { id: "details", label: "Fund Details", content: <FundDetails fundA={fundA} fundB={fundB} /> }
          ]} />
        </Card>
      </Section>

      <Section title="Detailed Fund Profiles">
        <Card title={fundA.name} key={fundA.id}>
          <p>{fundA.description}</p>
          <div className="metrics-grid">
            <Metric label="Category" value={fundA.category} />
            <Metric label="AUM" value={fundA.aum} />
            <Metric label="Manager" value={fundA.manager} />
            <Metric label="Inception" value={fundA.inception} />
          </div>
          <div className="holdings-list">
            <h4>Top Holdings</h4>
            {fundA.topHoldings.map((holding, idx) => <p key={idx}>{holding}</p>)}
          </div>
        </Card>

        <Card title={fundB.name} key={fundB.id}>
          <p>{fundB.description}</p>
          <div className="metrics-grid">
            <Metric label="Category" value={fundB.category} />
            <Metric label="AUM" value={fundB.aum} />
            <Metric label="Manager" value={fundB.manager} />
            <Metric label="Inception" value={fundB.inception} />
          </div>
          <div className="holdings-list">
            <h4>Top Holdings</h4>
            {fundB.topHoldings.map((holding, idx) => <p key={idx}>{holding}</p>)}
          </div>
        </Card>
      </Section>

      <Section title="Final Recommendation">
        <Card title="Select Recommended Fund">
          <div className="action-buttons">
            <Button 
              label={`Recommend ${fundA.name}`} 
              onPress={() => alert(`Recommendation set to: ${fundA.name}`)} 
              variant="primary"
            />
            <Button 
              label={`Recommend ${fundB.name}`} 
              onPress={() => alert(`Recommendation set to: ${fundB.name}`)} 
              variant="secondary"
            />
            <Button 
              label="Generate Rationale Report" 
              onPress={() => alert("Generating rationale report...")} 
              variant="tertiary"
            />
          </div>
        </Card>
      </Section>
    </Page>
  );
}

// Helper components for the tabs content
function MetricComparison({ metrics }: { metrics: Array<{ label: string, valueA: string, valueB: string, type: string }> }) {
  return (
    <div className="comparison-table">
      <div className="header-row">
        <div className="label">Metric</div>
        <div className="value-col">Fund A</div>
        <div className="value-col">Fund B</div>
      </div>
      {metrics.map((m, idx) => (
        <div key={idx}>
          <div className="label">{m.label}</div>
          <div className="value-col">{m.valueA}</div>
          <div className="value-col">{m.valueB}</div>
        </div>
      ))}
    </div>
  );
}

function PerformanceChart({ series }: { series: Array<{ date: string, valueA: number, valueB: number }> }) {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-legend">
          <div className="legend-item" style={{ color: '#10b981' }}>Fund A</div>
          <div className="legend-item" style={{ color: '#3b82f6' }}>Fund B</div>
        </div>
        <div className="chart-title">6-Month Performance</div>
      </div>
      <div className="chart-bars">
        {series.map((d, idx) => (
          <div key={idx} className="bar-group">
            <div className="bar-label">{d.date}</div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: `${d.valueA}%`, backgroundColor: '#10b981' }}></div>
              <div className="bar" style={{ height: `${d.valueB}%`, backgroundColor: '#3b82f6' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FundDetails({ fundA, fundB }: { fundA: typeof fundA, fundB: typeof fundB }) {
  return (
    <div className="details-container">
      <div className="detail-card">
        <h3>Current Status</h3>
        <Status tone="success" label="Active" />
        <Status tone="neutral" label="Under Review" />
      </div>
      <div className="detail-card">
        <h3>Next Review Date</h3>
        <p>October 15, 2023</p>
      </div>
      <div className="detail-card">
        <h3>Client Notes</h3>
        <p>Client prefers low volatility options.</p>
      </div>
    </div>
  );
}
