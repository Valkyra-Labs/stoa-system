import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Status, EmptyData } from "@stoa/react";

const weeklyData = {
  revenue: { value: 2500000, delta: 12000, basis: 2380000, unit: "USD" },
  costs: { value: 1850000, delta: -15000, basis: 1800000, unit: "USD" },
  profit: { value: 650000, delta: 25000, basis: 625000, unit: "USD" },
  departments: [
    { name: "Sales", revenue: 1200000, costs: 750000, profit: 450000 },
    { name: "Marketing", revenue: 600000, costs: 450000, profit: 150000 },
    { name: "R&D", revenue: 400000, costs: 550000, profit: -150000 },
    { name: "Support", revenue: 300000, costs: 250000, profit: 50000 },
  ],
  trends: [
    { metric: "Revenue", value: 2500000, trend: "up" },
    { metric: "Costs", value: 1850000, trend: "flat" },
    { metric: "Profit", value: 650000, trend: "up" },
  ],
  chartData: [
    { department: "Sales", revenue: 1200000, costs: 750000 },
    { department: "Marketing", revenue: 600000, costs: 450000 },
    { department: "R&D", revenue: 400000, costs: 550000 },
    { department: "Support", revenue: 300000, costs: 250000 },
  ],
};

export default function WeeklyNumbers() {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Overview" subtitle="Monday Check - Week Ending 2023-10-07" />
      <Section title="Key Metrics">
        <Card>
          <Metric label="Revenue" value={weeklyData.revenue.value} delta={weeklyData.revenue.delta} basis={weeklyData.revenue.basis} unit={weeklyData.revenue.unit} />
          <Metric label="Costs" value={weeklyData.costs.value} delta={weeklyData.costs.delta} basis={weeklyData.costs.basis} unit={weeklyData.costs.unit} />
          <Metric label="Profit" value={weeklyData.profit.value} delta={weeklyData.profit.delta} basis={weeklyData.profit.basis} unit={weeklyData.profit.unit} />
        </Card>
      </Section>
      <Section title="Department Breakdown">
        <Card>
          <DataTable
            columns={[{ key: "name", label: "Department" }, { key: "revenue", label: "Revenue" }, { key: "costs", label: "Costs" }, { key: "profit", label: "Profit" }]}
            rows={weeklyData.departments}
            selectable={false}
            stickyFirstColumn
          />
        </Card>
      </Section>
      <Section title="Trends">
        <Card>
          <Chart type="bar" series={weeklyData.trends} x="metric" y="value" />
        </Card>
      </Section>
      <Section title="Profitability">
        <Card>
          <Chart type="line" series={weeklyData.chartData} x="department" y="revenue" />
          <Chart type="line" series={weeklyData.chartData} x="department" y="costs" />
        </Card>
      </Section>
    </Page>
  );
}
