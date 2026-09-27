import { Page, Header, Section, Comparison, Button } from "@stoa/react";

const FundComparisonPage = () => {
  return (
    <Page title="Fund Comparison">
      <Header title="Choose the Best Fund" subtitle="Recommend a fund to the client" />
      <Section title="Fund Metrics">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Income Fund" },
          ]}
          metrics={[
            { id: "performance", label: "1-Year Performance", unit: "%" },
            { id: "risk", label: "Risk Rating" },
            { id: "expenseRatio", label: "Expense Ratio", unit: "%" },
            { id: "diversification", label: "Asset Diversification" },
          ]}
        />
      </Section>
      <Section title="Recommendation">
        <Button
          label="Recommend Growth Fund"
          onPress={() => console.log("Growth Fund recommended")}
          variant="primary"
        />
        <Button
          label="Recommend Income Fund"
          onPress={() => console.log("Income Fund recommended")}
          variant="secondary"
        />
      </Section>
    </Page>
  );
};

export default FundComparisonPage;
