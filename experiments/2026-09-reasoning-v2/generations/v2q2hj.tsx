import { Page, Header, Section, Card, Comparison, Metric, Delta, Status, Button, EmptyData, ErrorData } from "@stoa/react";

const FundA = {
  name: "Fund Alpha",
  returns: {
    annual: 8.2,
    fiveYear: 12.5,
    tenYear: 15.3,
  },
  risk: {
    volatility: 12.4,
    drawdown: 18.6,
  },
  fees: {
    management: 1.2,
    performance: 0.5,
  },
  assets: 2.1,
  performance: "Above average",
  status: "active",
};

const FundB = {
  name: "Fund Beta",
  returns: {
    annual: 7.8,
    fiveYear: 11.2,
    tenYear: 14.1,
  },
  risk: {
    volatility: 10.8,
    drawdown: 15.2,
  },
  fees: {
    management: 1.0,
    performance: 0.3,
  },
  assets: 1.8,
  performance: "Average",
  status: "active",
};

const FundComparison = () => (
  <Page title="Fund Recommendation">
    <Header title="Choose a Fund" subtitle="Compare Fund Alpha and Fund Beta based on performance, risk, and fees" />
    <Section title="Fund Comparison">
      <Comparison
        entities={[FundA, FundB]}
        metrics={[
          {
            label: "Annual Return (%)",
            value: (fund) => fund.returns.annual,
            delta: (fund) => fund.returns.annual - 7.5,
          },
          {
            label: "5-Year Return (%)",
            value: (fund) => fund.returns.fiveYear,
            delta: (fund) => fund.returns.fiveYear - 10.0,
          },
          {
            label: "10-Year Return (%)",
            value: (fund) => fund.returns.tenYear,
            delta: (fund) => fund.returns.tenYear - 13.0,
          },
          {
            label: "Volatility (%)",
            value: (fund) => fund.risk.volatility,
            delta: (fund) => fund.risk.volatility - 10.0,
          },
          {
            label: "Drawdown (%)",
            value: (fund) => fund.risk.drawdown,
            delta: (fund) => fund.risk.drawdown - 15.0,
          },
          {
            label: "Management Fee (%)",
            value: (fund) => fund.fees.management,
            delta: (fund) => fund.fees.management - 1.0,
          },
          {
            label: "Performance Fee (%)",
            value: (fund) => fund.fees.performance,
            delta: (fund) => fund.fees.performance - 0.5,
          },
          {
            label: "Assets ($B)",
            value: (fund) => fund.assets,
            delta: (fund) => fund.assets - 2.0,
          },
          {
            label: "Performance Rating",
            value: (fund) => fund.performance,
          },
          {
            label: "Status",
            value: (fund) => (
              <Status tone={fund.status === "active" ? "success" : "warning"} label={fund.status} />
            ),
          },
        ]}
      />
    </Section>
    <Section title="Recommendation">
      <Card title="Recommendation">
        <p>Based on the performance, risk, and fees, we recommend:</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <div>
            <Metric label="Fund Alpha" value={FundA.returns.annual} unit="%" delta={FundA.returns.annual - 7.5} />
            <Metric label="5-Year Return" value={FundA.returns.fiveYear} unit="%" delta={FundA.returns.fiveYear - 10.0} />
            <Metric label="10-Year Return" value={FundA.returns.tenYear} unit="%" delta={FundA.returns.tenYear - 13.0} />
            <Metric label="Volatility" value={FundA.risk.volatility} unit="%" delta={FundA.risk.volatility - 10.0} />
            <Metric label="Drawdown" value={FundA.risk.drawdown} unit="%" delta={FundA.risk.drawdown - 15.0} />
            <Metric label="Management Fee" value={FundA.fees.management} unit="%" delta={FundA.fees.management - 1.0} />
            <Metric label="Performance Fee" value={FundA.fees.performance} unit="%" delta={FundA.fees.performance - 0.5} />
            <Metric label="Assets" value={FundA.assets} unit="$B" delta={FundA.assets - 2.0} />
            <Metric label="Performance Rating" value={FundA.performance} />
            <Metric label="Status" value={FundA.status} />
          </div>
          <div>
            <Metric label="Fund Beta" value={FundB.returns.annual} unit="%" delta={FundB.returns.annual - 7.5} />
            <Metric label="5-Year Return" value={FundB.returns.fiveYear} unit="%" delta={FundB.returns.fiveYear - 10.0} />
            <Metric label="10-Year Return" value={FundB.returns.tenYear} unit="%" delta={FundB.returns.tenYear - 13.0} />
            <Metric label="Volatility" value={FundB.risk.volatility} unit="%" delta={FundB.risk.volatility - 10.0} />
            <Metric label="Drawdown" value={FundB.risk.drawdown} unit="%" delta={FundB.risk.drawdown - 15.0} />
            <Metric label="Management Fee" value={FundB.fees.management} unit="%" delta={FundB.fees.management - 1.0} />
            <Metric label="Performance Fee" value={FundB.fees.performance} unit="%" delta={FundB.fees.performance - 0.5} />
            <Metric label="Assets" value={FundB.assets} unit="$B" delta={FundB.assets - 2.0} />
            <Metric label="Performance Rating" value={FundB.performance} />
            <Metric label="Status" value={FundB.status} />
          </div>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <Button label="Recommend Fund Alpha" variant="primary" />
          <Button label="Recommend Fund Beta" variant="primary" />
        </div>
      </Card>
    </Section>
  </Page>
);

export default FundComparison;
