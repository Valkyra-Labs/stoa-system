import { Page, Header, Sidebar, Section, Card, Tabs, Button, Metric, Delta, Chart, DataTable, Comparison, Timeline, EmptyData, Status, FilterBar, SavedViews, BulkActions } from "@stoa/react";

const FundComparisonPage = () => {
  return (
    <Page title="Fund Recommendation">
      <Header title="Choose a Fund" subtitle="Compare Fund A and Fund B to make an informed recommendation" actions={<Button label="Recommend" variant="primary" />} />
      <Sidebar>
        <Section title="Navigation">
          <Tabs
            items={[
              { id: "overview", label: "Overview" },
              { id: "performance", label: "Performance" },
              { id: "risk", label: "Risk" },
              { id: "fees", label: "Fees" }
            ]}
          />
        </Section>
      </Sidebar>
      <main>
        <Section title="Fund Comparison">
          <Comparison
            entities={['Fund A', 'Fund B']}
            metrics={[
              { label: "Annual Return", value: "12.5%", delta: "+1.2%", unit: "%" },
              { label: "Risk Score", value: "7.2", delta: "-0.5", unit: "scale" },
              { label: "Fee Rate", value: "0.75%", delta: "-0.1%", unit: "%" }
            ]}
          />
        </Section>
        <Section title="Performance">
          <Chart type="line" series={[{ name: "Fund A", data: [10, 12, 15, 14, 16] }, { name: "Fund B", data: [8, 9, 11, 10, 12] }]} />
        </Section>
        <Section title="Recommendation">
          <Card title="Recommendation Summary">
            <p>Based on performance, risk, and fees, Fund A is recommended for its higher return and lower risk profile.</p>
            <Button label="Finalize Recommendation" variant="primary" />
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default FundComparisonPage;
