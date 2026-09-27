import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, Chart, DataTable, Comparison, Timeline, Status, EmptyData } from "@stoa/react";

const WeeklyFinanceDashboard = () => {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Weekly Financial Summary" subtitle="Monday, April 8, 2024" actions={<Button label="Refresh" onPress={() => {}} variant="primary" />} />
      <Sidebar>
        <Section title="Quick Links">
          <Card>
            <ul>
              <li><Button label="Revenue Report" onPress={() => {}} /></li>
              <li><Button label="Expense Breakdown" onPress={() => {}} /></li>
              <li><Button label="Cash Flow Analysis" onPress={() => {}} /></li>
            </ul>
          </Card>
        </Section>
        <Section title="Filters">
          <FilterBar filters={[{ label: "Week", value: "Week 12", options: ["Week 12", "Week 11", "Week 10"] }]} />
        </Section>
      </Sidebar>
      <main>
        <Section title="Key Metrics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <Metric label="Revenue" value="$12.5M" delta={+3.2} unit="USD" />
            <Metric label="Expenses" value="$8.9M" delta={-1.5} unit="USD" />
            <Metric label="Net Profit" value="$3.6M" delta={+4.8} unit="USD" />
          </div>
        </Section>
        <Section title="Trend Overview">
          <Card>
            <Chart type="line" series={[{ name: "Revenue", data: [10, 12, 14, 16, 18, 20] }]} x="Week" y="Revenue (M USD)" />
          </Card>
        </Section>
        <Section title="Weekly Data">
          <DataTable
            columns={[{ name: "Week", key: "week" }, { name: "Revenue", key: "revenue" }, { name: "Expenses", key: "expenses" }, { name: "Profit", key: "profit" }]}
            rows={[
              { week: "Week 12", revenue: "$12.5M", expenses: "$8.9M", profit: "$3.6M" },
              { week: "Week 11", revenue: "$12.0M", expenses: "$9.1M", profit: "$2.9M" },
              { week: "Week 10", revenue: "$11.8M", expenses: "$9.3M", profit: "$2.5M" }
            ]}
            selectable
          />
        </Section>
        <Section title="Comparison">
          <Comparison entities={["Week 12", "Week 11"]} metrics={[{ name: "Revenue", value: "12.5M" }, { name: "Profit", value: "3.6M" }]} />
        </Section>
      </main>
    </Page>
  );
};

export default WeeklyFinanceDashboard;
