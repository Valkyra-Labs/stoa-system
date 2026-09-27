import { Page, Header, Section, Card, Metric, Delta, Comparison, Button, Tabs, Status, EmptyData } from "@stoa/react";

const FundA = {
  name: "Fund Alpha",
  returns: {
    annualized: 8.2,
    10Year: 7.5,
    5Year: 6.8,
    1Year: 4.1,
  },
  risk: {
    volatility: 12.3,
    maxDrawdown: -22.4,
  },
  fees: {
    expenseRatio: 0.75,
    loadFee: 0.0,
  },
  assets: 1.2e9,
  performance: "Above Market",
};

const FundB = {
  name: "Fund Beta",
  returns: {
    annualized: 7.8,
    10Year: 7.2,
    5Year: 6.5,
    1Year: 3.9,
  },
  risk: {
    volatility: 10.1,
    maxDrawdown: -18.2,
  },
  fees: {
    expenseRatio: 0.65,
    loadFee: 0.0,
  },
  assets: 8.5e8,
  performance: "In Line with Market",
};

const PageComponent = () => (
  <Page title="Fund Recommendation">
    <Header title="Choose Your Fund" subtitle="Compare Fund Alpha and Fund Beta based on performance, risk, and fees" />
    <Section title="Fund Overview">
      <Comparison
        entities={[FundA, FundB]}
        metrics={[
          {
            label: "Annualized Return (%)",
            value: (fund) => fund.returns.annualized,
            delta: (fund) => fund.returns.annualized - FundB.returns.annualized,
          },
          {
            label: "10-Year Return (%)",
            value: (fund) => fund.returns.10Year,
            delta: (fund) => fund.returns.10Year - FundB.returns.10Year,
          },
          {
            label: "Risk (Volatility)",
            value: (fund) => fund.risk.volatility,
            delta: (fund) => fund.risk.volatility - FundB.risk.volatility,
          },
          {
            label: "Max Drawdown (%)",
            value: (fund) => fund.risk.maxDrawdown,
            delta: (fund) => fund.risk.maxDrawdown - FundB.risk.maxDrawdown,
          },
          {
            label: "Expense Ratio (%)",
            value: (fund) => fund.fees.expenseRatio,
            delta: (fund) => fund.fees.expenseRatio - FundB.fees.expenseRatio,
          },
        ]}
      />
    </Section>
    <Section title="Fund Details">
      <Card title="Fund Alpha">
        <Metric label="Annualized Return" value={FundA.returns.annualized} unit="%" />
        <Metric label="10-Year Return" value={FundA.returns.10Year} unit="%" />
        <Metric label="Risk (Volatility)" value={FundA.risk.volatility} unit="%" />
        <Metric label="Max Drawdown" value={FundA.risk.maxDrawdown} unit="%" />
        <Metric label="Expense Ratio" value={FundA.fees.expenseRatio} unit="%" />
        <Metric label="Assets Under Management" value={FundA.assets} unit="$B" />
      </Card>
      <Card title="Fund Beta">
        <Metric label="Annualized Return" value={FundB.returns.annualized} unit="%" />
        <Metric label="10-Year Return" value={FundB.returns.10Year} unit="%" />
        <Metric label="Risk (Volatility)" value={FundB.risk.volatility} unit="%" />
        <Metric label="Max Drawdown" value={FundB.risk.maxDrawdown} unit="%" />
        <Metric label="Expense Ratio" value={FundB.fees.expenseRatio} unit="%" />
        <Metric label="Assets Under Management" value={FundB.assets} unit="$B" />
      </Card>
    </Section>
    <Section title="Recommendation">
      <Card>
        <h3>Recommendation Summary</h3>
        <p>
          Based on the performance, risk, and fees, Fund Alpha appears to be the better option for long-term growth with slightly higher returns and acceptable risk. However, Fund Beta offers lower risk and slightly lower fees, making it a safer choice for risk-averse investors.
        </p>
        <Button label="Select Fund Alpha" variant="primary" />
        <Button label="Select Fund Beta" variant="secondary" />
      </Card>
    </Section>
  </Page>
);

export default PageComponent;
