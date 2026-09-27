import { Page, Header, Sidebar, Section, Card, Comparison, Chart, DataTable, Button } from "@stoa/react";

export default function FundComparison() {
  return (
    <Page title="Fund Comparison">
      <Header title="Choose the Best Fund" subtitle="Compare and recommend one of two funds" />
      <main>
        <Section title="Overview">
          <Comparison
            entities={[
              { id: "fundA", label: "Fund A" },
              { id: "fundB", label: "Fund B" },
            ]}
            metrics={[
              { label: "1-Year Return", metric: "return_1_year" },
              { label: "3-Year Average Return", metric: "return_3_year" },
              { label: "Risk", metric: "risk" },
            ]}
          />
        </Section>
        <Section title="Detailed Comparison">
          <Card title="Historical Performance">
            <Chart
              type="line"
              series={[
                { id: "fundA", label: "Fund A", data: [[1, 10], [2, 15], [3, 12], [4, 14]] },
                { id: "fundB", label: "Fund B", data: [[1, 8], [2, 12], [3, 10], [4, 13]] },
              ]}
              x="year"
              y="return"
            />
          </Card>
          <Card title="Risk Metrics">
            <DataTable
              columns={[
                { label: "Metric", key: "metric" },
                { label: "Value", key: "value" },
              ]}
              rows={[
                { metric: "Standard Deviation", value: "5.2%", id: "fundA" },
                { metric: "Standard Deviation", value: "4.8%", id: "fundB" },
                { metric: "Sharpe Ratio", value: "0.6", id: "fundA" },
                { metric: "Sharpe Ratio", value: "0.7", id: "fundB" },
              ]}
            />
          </Card>
        </Section>
        <Section title="Recommendation">
          <Card title="Summary and Recommendation">
            <p>Based on the analysis, <strong>Fund B</strong> is recommended due to its higher average returns and slightly lower risk.</p>
            <Button label="Recommend Fund B" onPress={() => console.log("Recommended Fund B")} />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
