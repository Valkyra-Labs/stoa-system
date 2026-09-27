import { Page, Header, Section, Card, Comparison, Metric, EmptyData, Status, Button } from "@stoa/react";

// Realistic placeholder data for fund comparison
const fundA = {
  id: "fund-a",
  name: "Growth Horizon Fund",
  manager: "Elena Rostova",
  fees: "0.85%",
  risk: "High",
  performance: {
    lastMonth: 3.2,
    lastQuarter: 12.5,
    lastYear: 28.4,
    fiveYears: 145.2,
    sharpeRatio: 1.85,
  },
  notes: "Strong recent momentum in tech sector.",
};

const fundB = {
  id: "fund-b",
  name: "Steady Capital Fund",
  manager: "Marcus Thorne",
  fees: "0.60%",
  risk: "Medium",
  performance: {
    lastMonth: 1.1,
    lastQuarter: 4.8,
    lastYear: 9.2,
    fiveYears: 112.8,
    sharpeRatio: 1.42,
  },
  notes: "Consistent performance, lower volatility.",
};

const targetYield = 11.0;
const maxVolatility = 22.0;

export default function FundSelectionScreen() {
  return (
    <Page title="Fund Selection">
      <Header title="Client Fund Recommendation" subtitle="Comparing options for the 60/40 portfolio allocation">
        <Button label="Generate Report" onPress={() => console.log("Report generated")} variant="primary" />
      </Header>

      <Section title="Comparative Analysis" children={
        <Comparison
          entities={[fundA, fundB]}
          metrics={[
            { key: "return_ytd", label: "Return YTD", unit: "%" },
            { key: "volatility", label: "Volatility", unit: "%" },
            { key: "sharpe", label: "Sharpe Ratio", unit: "" },
            { key: "fees", label: "Expense Ratio", unit: "%" },
            { key: "risk", label: "Risk Profile", unit: "" },
          ]}
        />
      } />

      <Section title="Client Objectives & Constraints">
        <Card title="Target Metrics">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Metric label="Target Annual Return" value={targetYield} unit="%" />
            <Metric label="Maximum Tolerable Volatility" value={maxVolatility} unit="%" />
            <Metric label="Current Allocation Size" value="60%" unit="%" />
          </div>
        </Card>
      </Section>

      <Section title="Recommendation Summary">
        <Card title="Selected Fund: Growth Horizon Fund">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Metric label="Projected Return" value="28.4%" unit="%" delta={15.2} basis="target" />
            <Metric label="Risk Level" value="High" unit="" status={{ tone: "warning", label: "Within limits" }} />
            <Metric label="Fee Impact" value="0.85%" unit="%" />
            <div>
              <Status tone="info" label="Reasoning" />
              <p>Selected due to superior recent momentum and Sharpe ratio, aligning with the client's appetite for growth despite higher volatility.</p>
            </div>
            <div style={{ marginTop: "auto" }}>
              <Button label="Proceed with Allocation" onPress={() => console.log("Allocating")} variant="primary" />
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
