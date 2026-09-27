import { Page, Header, Section, Card, Tabs, Metric, Delta, Button, FilterBar, SavedViews, Status, EmptyData } from "@stoa/react";

const fundA = {
  name: "Global Equity Fund",
  performance: { value: 12.5, delta: 3.2, unit: "%" },
  risk: { value: 7.8, unit: "sigma" },
  fees: { value: 1.2, unit: "%" },
  volatility: { value: 15.4, unit: "%" },
  expenseRatio: { value: 0.8, unit: "%" },
  inceptionDate: "2010-01-01",
  manager: "Jane Smith",
  description: "A diversified portfolio of global equities with a focus on long-term growth."
};

const fundB = {
  name: "Value Discovery Fund",
  performance: { value: 9.8, delta: -1.5, unit: "%" },
  risk: { value: 5.2, unit: "sigma" },
  fees: { value: 1.5, unit: "%" },
  volatility: { value: 10.2, unit: "%" },
  expenseRatio: { value: 1.0, unit: "%" },
  inceptionDate: "2015-05-01",
  manager: "John Doe",
  description: "A value-oriented fund targeting undervalued stocks with strong fundamentals."
};

const recommendation = {
  fund: fundA.name,
  rationale: "Fund A offers higher returns and a better risk-adjusted performance, making it more suitable for long-term growth."
};

export default function FundComparison() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Fund Recommendation" subtitle="Compare two funds and select the best option for your client" />
      <Section title="Recommendation Summary">
        <Card>
          <p>{recommendation.rationale}</p>
          <Button label="View Full Analysis" variant="primary" />
        </Card>
      </Section>
      <Section title="Fund Comparison">
        <Tabs
          items={[
            { id: "fund-a", label: "Fund A", content: <Card><Metric label="Performance" value={fundA.performance.value} delta={fundA.performance.delta} unit={fundA.performance.unit} /> <Metric label="Risk" value={fundA.risk.value} unit={fundA.risk.unit} /> <Metric label="Fees" value={fundA.fees.value} unit={fundA.fees.unit} /> <Metric label="Volatility" value={fundA.volatility.value} unit={fundA.volatility.unit} /> <Metric label="Expense Ratio" value={fundA.expenseRatio.value} unit={fundA.expenseRatio.unit} /> <p>{fundA.description}</p></Card> },
            { id: "fund-b", label: "Fund B", content: <Card><Metric label="Performance" value={fundB.performance.value} delta={fundB.performance.delta} unit={fundB.performance.unit} /> <Metric label="Risk" value={fundB.risk.value} unit={fundB.risk.unit} /> <Metric label="Fees" value={fundB.fees.value} unit={fundB.fees.unit} /> <Metric label="Volatility" value={fundB.volatility.value} unit={fundB.volatility.unit} /> <Metric label="Expense Ratio" value={fundB.expenseRatio.value} unit={fundB.expenseRatio.unit} /> <p>{fundB.description}</p></Card> }
          ]}
        />
      </Section>
      <Section title="Additional Analysis">
        <Card>
          <p>Based on historical data and risk-adjusted returns, Fund A is recommended for clients seeking long-term growth with a moderate risk tolerance.</p>
        </Card>
      </Section>
      <Section title="Tools">
        <Card>
          <FilterBar filters={[{ label: "Performance", value: "high" }, { label: "Risk", value: "low" }]} />
          <SavedViews views={[{ name: "Default View", filters: [{ label: "Performance", value: "high" }, { label: "Risk", value: "low" }] }]} />
        </Card>
      </Section>
    </Page>
  );
}
