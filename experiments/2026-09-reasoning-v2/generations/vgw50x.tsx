import { Page, Header, Card, Metric, Trend, Status, Button, EmptyData, Tabs } from "@stoa/react";

const FundA = {
  name: "Aggressive Growth Fund",
  ticker: "AGGR",
  returns: 14.2,
  volatility: 22.5,
  beta: 1.35,
  sharpe: 0.65,
  history: [8, 10, 12, 11, 14, 15, 14.2],
  label: "High Growth",
};

const FundB = {
  name: "Stable Income Fund",
  ticker: "STBL",
  returns: 8.5,
  volatility: 12.0,
  beta: 0.85,
  sharpe: 0.82,
  history: [7, 7.2, 7.5, 7.6, 8.0, 8.3, 8.5],
  label: "Stable Income",
};

function ComparisonScreen() {
  return (
    <Page title="Fund Selection">
      <Header title="Fund Comparison" subtitle="Select between two options for your client" />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "16px" }}>
        <Card title="Summary">
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div>
              <Metric label="Expected Return" value={FundA.returns} unit="%" />
              <Metric label="Risk (Volatility)" value={FundA.volatility} unit="%" />
              <Metric label="Sharpe Ratio" value={FundA.sharpe} />
            </div>
            <div>
              <Metric label="Expected Return" value={FundB.returns} unit="%" />
              <Metric label="Risk (Volatility)" value={FundB.volatility} unit="%" />
              <Metric label="Sharpe Ratio" value={FundB.sharpe} />
            </div>
          </div>
        </Card>

        <Tabs
          items={[
            { id: "fundA", label: FundA.name, content: "Details for " + FundA.name },
            { id: "fundB", label: FundB.name, content: "Details for " + FundB.name },
          ]}
        />

        <Card title="Performance History">
          <div style={{ display: "flex", gap: "48px" }}>
            <div>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                {FundA.name} (12M)
              </p>
              <Trend series={FundA.history} />
            </div>
            <div>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                {FundB.name} (12M)
              </p>
              <Trend series={FundB.history} />
            </div>
          </div>
        </Card>

        <Card title="Risk Profile Analysis">
          <p>
            <strong>{FundA.name}</strong> offers higher potential returns but carries significantly higher volatility ({FundA.volatility}% vs {FundB.volatility}%). Suitable for clients with high risk tolerance.
          </p>
          <p>
            <strong>{FundB.name}</strong> provides steady, lower-risk returns with a superior risk-adjusted ratio ({FundB.sharpe} vs {FundA.sharpe}). Ideal for conservative investors seeking income stability.
          </p>
        </Card>

        <Card title="Decision Recommendation">
          <Status tone="success" label="Recommended for High Growth Clients" />
          <Status tone="neutral" label="Recommended for Conservative Clients" />
          <Button label="Save Comparison" variant="primary" onPress={() => {}} />
          <Button label="Export Report" variant="secondary" onPress={() => {}} />
        </Card>
      </div>
    </Page>
  );
}

export default ComparisonScreen;
