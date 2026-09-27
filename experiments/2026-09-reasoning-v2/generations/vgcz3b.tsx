import { Page, Header, Section, Comparison, Button } from "@stoa/react";

const FundComparison = () => {
  return (
    <Page title="Fund Comparison">
      <Header title="Choose the Best Fund" subtitle="Compare two funds and make a recommendation" />
      <Section title="Fund Comparison">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Stable Fund" },
          ]}
          metrics={[
            { label: "1-Year Return", field: "oneYearReturn" },
            { label: "3-Year Average Return", field: "threeYearAverageReturn" },
            { label: "Expense Ratio", field: "expenseRatio" },
            { label: "Standard Deviation", field: "standardDeviation" },
          ]}
        />
      </Section>
      <Section title="Recommendation">
        <div>
          <Button label="Recommend Growth Fund" variant="primary" />
          <Button label="Recommend Stable Fund" variant="secondary" />
        </div>
      </Section>
    </Page>
  );
};

export default FundComparison;
