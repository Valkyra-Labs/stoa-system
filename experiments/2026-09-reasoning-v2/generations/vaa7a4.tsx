import { Page, Header, Comparison, Section, Button } from "@stoa/react";

const FundComparisonPage = () => {
  return (
    <Page title="Fund Comparison">
      <Header title="Compare Funds" subtitle="Choose the best fund for your client" />
      <Comparison
        entities={[
          {
            id: "fund1",
            label: "Growth Fund",
            metrics: [
              { label: "1-Year Return", value: 8.2, unit: "%" },
              { label: "Expense Ratio", value: 0.5, unit: "%" },
              { label: "Risk Level", value: 6, unit: "out of 10" },
            ],
          },
          {
            id: "fund2",
            label: "Income Fund",
            metrics: [
              { label: "1-Year Return", value: 5.5, unit: "%" },
              { label: "Expense Ratio", value: 0.3, unit: "%" },
              { label: "Risk Level", value: 3, unit: "out of 10" },
            ],
          },
        ]}
      />
      <Section title="Recommendation">
        <p>Based on the comparison, the Growth Fund offers higher returns but comes with higher risk and expenses.</p>
        <p>The Income Fund is more conservative with lower returns and expenses, but also lower risk.</p>
        <p>Which fund would you recommend?</p>
        <Button label="Recommend Growth Fund" variant="primary" />
        <Button label="Recommend Income Fund" variant="secondary" />
      </Section>
    </Page>
  );
};

export default FundComparisonPage;
