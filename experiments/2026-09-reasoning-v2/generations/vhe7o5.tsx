import { Page, Sidebar, Header, Comparison, Button } from "@stoa/react";

export default function FundRecommendation() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Choose the Best Fund" subtitle="Recommend a fund for the client" />
      <Sidebar>
        <Section title="Funds">
          <Button variant="primary" label="Fund A" onPress={() => console.log("Recommend Fund A")} />
          <Button variant="secondary" label="Fund B" onPress={() => console.log("Recommend Fund B")} />
        </Section>
      </Sidebar>
      <main>
        <Comparison
          entities={[
            { id: "fund-a", label: "Fund A" },
            { id: "fund-b", label: "Fund B" },
          ]}
          metrics={[
            { label: "1-Year Return", values: { "fund-a": 0.12, "fund-b": 0.08 } },
            { label: "3-Year Return", values: { "fund-a": 0.20, "fund-b": 0.15 } },
            { label: "5-Year Return", values: { "fund-a": 0.25, "fund-b": 0.20 } },
            { label: "Risk Rating", values: { "fund-a": 3, "fund-b": 4 } },
            { label: "Expense Ratio", values: { "fund-a": 0.5, "fund-b": 0.7 } },
          ]}
        />
      </main>
    </Page>
  );
}
