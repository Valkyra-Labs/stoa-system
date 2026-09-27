import { Page, Header, Sidebar, Section, Card, Comparison, Metric, Delta, Button } from "@stoa/react";

export default function FundRecommendation() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Fund Recommendation" subtitle="Choose the best fund for the client" />
      <Section title="Funds Comparison">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Stability Fund" }
          ]}
          metrics={[
            { id: "return", label: "1-Year Return", unit: "%" },
            { id: "risk", label: "Risk Level", unit: "%" },
            { id: "expense", label: "Expense Ratio", unit: "%" },
            { id: "investment", label: "Minimum Investment", unit: "USD" }
          ]}
        >
          <Metric id="fund1.return" value={12.5} delta={2.1} basis={10.4} unit="%" />
          <Metric id="fund2.return" value={8.2} delta={-1.3} basis={9.5} unit="%" />
          <Metric id="fund1.risk" value={15} delta={-0.5} basis={15.5} unit="%" />
          <Metric id="fund2.risk" value={10} delta={0.2} basis={9.8} unit="%" />
          <Metric id="fund1.expense" value={0.5} delta={0} basis={0.5} unit="%" />
          <Metric id="fund2.expense" value={0.7} delta={0} basis={0.7} unit="%" />
          <Metric id="fund1.investment" value={1000} delta={0} basis={1000} unit="USD" />
          <Metric id="fund2.investment" value={5000} delta={0} basis={5000} unit="USD" />
        </Comparison>
      </Section>
      <Section title="Recommendation">
        <Card title="Recommendation">
          <p>Based on the 1-Year Return and Risk Level, the Growth Fund is recommended for its higher return and slightly lower risk compared to the Stability Fund.</p>
          <Button label="Recommend Growth Fund" onPress={() => console.log("Recommend Growth Fund")} variant="primary" />
          <Button label="Recommend Stability Fund" onPress={() => console.log("Recommend Stability Fund")} variant="secondary" />
        </Card>
      </Section>
    </Page>
  );
}
