import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, Chart, DataTable, Comparison, Timeline, Button } from "@stoa/react";

const FundComparisonPage = () => {
  return (
    <Page title="Fund Recommendation">
      <Header title="Choose the Better Fund" subtitle="Compare Fund A and Fund B based on performance, risk, and fees" />
      <Sidebar>
        <Section title="Navigation">
          <Button label="Overview" />
          <Button label="Performance" />
          <Button label="Risk" />
          <Button label="Fees" />
        </Section>
      </Sidebar>
      <main>
        <Section title="Fund Comparison">
          <Comparison
            entities={[
              { id: "fund-a", name: "Fund A", description: "Growth-oriented with moderate risk" },
              { id: "fund-b", name: "Fund B", description: "Balanced with low risk and stable returns" }
            ]}
            metrics={[
              { name: "Annual Return", value: "8.5%", delta: "+1.2%", unit: "%" },
              { name: "Risk Score", value: "7/10", delta: "-0.5", unit: "" },
              { name: "Expense Ratio", value: "0.75%", delta: "-0.1%", unit: "%" }
            ]}
          />
        </Section>
        <Section title="Performance Over Time">
          <Chart type="line" series={[{ name: "Fund A", data: [5, 6, 7, 8, 9] }, { name: "Fund B", data: [4, 5, 6, 7, 8] }]} x="Year" y="Return" />
        </Section>
        <Section title="Recommendation Summary">
          <Card title="Adviser's Recommendation">
            <p>Based on the performance, risk, and fees, Fund B is recommended for its stable returns and lower risk profile, making it more suitable for conservative investors.</p>
            <Button label="Confirm Recommendation" variant="primary" />
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default FundComparisonPage;
