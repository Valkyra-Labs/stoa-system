import { Page, Header, Section, Card, Tabs, Metric, Delta, Comparison, Timeline, Status, Button } from "@stoa/react";

const FundData = {
  FundA: {
    name: "Fund A",
    returns: 8.2,
    risk: 5.8,
    fees: 1.2,
    benchmark: "S&P 500",
    performance: [
      { year: 2020, return: 12.3 },
      { year: 2021, return: -4.1 },
      { year: 2022, return: 15.6 },
      { year: 2023, return: 6.7 },
    ],
    riskTrend: "Stable",
    volatility: "Moderate",
    manager: "Alpha Management",
    inception: "2010",
    rating: "4.5/5",
  },
  FundB: {
    name: "Fund B",
    returns: 7.8,
    risk: 4.5,
    fees: 0.9,
    benchmark: "FTSE 100",
    performance: [
      { year: 2020, return: 10.2 },
      { year: 2021, return: -3.8 },
      { year: 2022, return: 13.4 },
      { year: 2023, return: 5.9 },
    ],
    riskTrend: "Decreasing",
    volatility: "Low",
    manager: "Beta Capital",
    inception: "2015",
    rating: "4.2/5",
  },
};

export default function FundComparison() {
  return (
    <Page title="Fund Recommendation">
      <Header
        title="Fund Recommendation"
        subtitle="Compare Fund A and Fund B to make an informed decision"
        actions={
          <Button label="Save Recommendation" variant="primary" />
        }
      />
      <Section title="Fund Overview">
        <Comparison
          entities={[FundData.FundA, FundData.FundB]}
          metrics={[
            { label: "Annual Return", value: (d) => d.returns },
            { label: "Risk Score", value: (d) => d.risk },
            { label: "Fees (%)", value: (d) => d.fees },
            { label: "Benchmark", value: (d) => d.benchmark },
            { label: "Rating", value: (d) => d.rating },
          ]}
        />
      </Section>
      <Section title="Performance History">
        <Tabs
          items={[
            { id: "performance", label: "Performance", content: <Timeline events={FundData.FundA.performance} /> },
            { id: "benchmark", label: "Benchmark", content: <Timeline events={FundData.FundB.performance} /> },
          ]}
        />
      </Section>
      <Section title="Risk Analysis">
        <Card title="Risk Trends">
          <p>{FundData.FundA.riskTrend} vs. {FundData.FundB.riskTrend}</p>
        </Card>
        <Card title="Volatility">
          <p>{FundData.FundA.volatility} vs. {FundData.FundB.volatility}</p>
        </Card>
      </Section>
      <Section title="Recommendation">
        <Card title="Final Recommendation">
          <p>
            Based on the comparison, Fund B appears to offer a better balance of returns and risk, with lower fees and a more stable risk profile.
          </p>
          <Button label="Select Fund B" variant="primary" />
        </Card>
      </Section>
    </Page>
  );
}
