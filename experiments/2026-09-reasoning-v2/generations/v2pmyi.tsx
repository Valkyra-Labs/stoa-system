import { Page, Header, Section, Card, Comparison, Metric, Delta, Status, Button } from "@stoa/react";

const FundA = {
  name: "Fund Alpha",
  returns: 8.2,
  volatility: 12.5,
  fees: 1.2,
  drawdown: -15.3,
  riskRating: "Medium",
  performance: "Stable growth with moderate risk",
};

const FundB = {
  name: "Fund Beta",
  returns: 9.8,
  volatility: 18.2,
  fees: 0.8,
  drawdown: -22.1,
  riskRating: "High",
  performance: "Strong returns with higher volatility",
};

const Recommendation = {
  title: "Recommendation",
  summary: "Fund Beta offers higher returns but with increased risk. Fund Alpha provides stable growth with lower volatility.",
  decision: "Recommend Fund Beta for clients with a higher risk tolerance and longer investment horizon.",
};

export default function FundComparisonPage() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Fund Recommendation" subtitle="Choose the best fund for your client" />
      <Section title="Fund Comparison">
        <Comparison
          entities={[FundA, FundB]}
          metrics={[
            { label: "Returns (%)", value: "returns", delta: "delta" },
            { label: "Volatility (%)", value: "volatility", delta: "delta" },
            { label: "Fees (%)", value: "fees", delta: "delta" },
            { label: "Drawdown (%)", value: "drawdown", delta: "delta" },
            { label: "Risk Rating", value: "riskRating" },
          ]}
        >
          {(fund) => (
            <Card title={fund.name}>
              <Metric label="Returns" value={fund.returns} unit="%" />
              <Metric label="Volatility" value={fund.volatility} unit="%" />
              <Metric label="Fees" value={fund.fees} unit="%" />
              <Metric label="Drawdown" value={fund.drawdown} unit="%" />
              <Metric label="Risk Rating" value={fund.riskRating} />
              <p>{fund.performance}</p>
            </Card>
          )}
        </Comparison>
      </Section>
      <Section title="Recommendation">
        <Card>
          <h3>{Recommendation.title}</h3>
          <p>{Recommendation.summary}</p>
          <Status tone="success" label={Recommendation.decision} />
          <Button label="Save Recommendation" variant="primary" />
        </Card>
      </Section>
    </Page>
  );
}
