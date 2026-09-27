import { Page, Header, Section, Card, Metric, Delta, Status, StaleData, Chart, DataTable, FilterBar, Button, BulkActions } from "@stoa/react";

const WeeklyFinanceDashboard = () => {
  const metrics = [
    { label: "Revenue", value: 1250000, delta: 15000, unit: "USD", basis: "previous week" },
    { label: "Expenses", value: 820000, delta: -12000, unit: "USD", basis: "previous week" },
    { label: "Net Profit", value: 430000, delta: 25000, unit: "USD", basis: "previous week" },
    { label: "Cash Flow", value: 310000, delta: 18000, unit: "USD", basis: "previous week" },
  ];

  const chartSeries = [
    { name: "Revenue", data: [1200000, 1250000, 1300000, 1350000] },
    { name: "Expenses", data: [780000, 820000, 850000, 880000] },
  ];

  const tableData = [
    { id: 1, date: "2023-04-03", revenue: 1200000, expenses: 780000, netProfit: 420000 },
    { id: 2, date: "2023-04-10", revenue: 1250000, expenses: 820000, netProfit: 430000 },
    { id: 3, date: "2023-04-17", revenue: 1300000, expenses: 850000, netProfit: 450000 },
    { id: 4, date: "2023-04-24", revenue: 1350000, expenses: 880000, netProfit: 470000 },
  ];

  const filters = [
    { label: "Week", value: "Week 1", options: ["Week 1", "Week 2", "Week 3"] },
    { label: "Department", value: "All", options: ["All", "Sales", "Marketing", "Operations"] },
  ];

  const bulkActions = [
    { label: "Export to CSV", variant: "secondary" },
    { label: "Delete Selected", variant: "destructive" },
  ];

  return (
    <Page title="Weekly Finance Overview">
      <Header
        title="Weekly Finance Overview"
        subtitle="Monday Review - April 3, 2023"
        actions={
          <Button label="Refresh" onPress={() => {}} />
        }
      />
      <Section title="Key Metrics">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {metrics.map((metric, index) => (
            <Metric
              key={index}
              label={metric.label}
              value={metric.value}
              delta={metric.delta}
              unit={metric.unit}
              basis={metric.basis}
            />
          ))}
        </div>
      </Section>
      <Section title="Trend Analysis">
        <Chart
          type="line"
          series={chartSeries}
          x="Week"
          y="USD"
        />
      </Section>
      <Section title="Weekly Breakdown">
        <DataTable
          columns={["Date", "Revenue", "Expenses", "Net Profit"]}
          rows={tableData}
          selectable
          stickyFirstColumn
          onRowSelect={(selected) => console.log(selected)}
        />
        <BulkActions actions={bulkActions} />
      </Section>
      <Section title="Data Status">
        <Status tone="info" label="Data is current" />
        <StaleData since="2023-04-03T08:00:00Z" />
      </Section>
    </Page>
  );
};

export default WeeklyFinanceDashboard;
