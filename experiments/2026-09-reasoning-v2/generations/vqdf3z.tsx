import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Tabs, Sidebar, FilterBar, Button, Status } from "@stoa/react";

const weeklyData = {
  week: "Week 42 (2023-10-23 to 2023-10-27)",
  revenue: 1250000,
  revenueDelta: 12000,
  revenueDeltaBasis: 1238000,
  expenses: 820000,
  expensesDelta: -15000,
  expensesDeltaBasis: 835000,
  profit: 430000,
  profitDelta: 25000,
  profitDeltaBasis: 405000,
  trends: [
    { name: "Revenue", value: 1250000, change: 12000 },
    { name: "Expenses", value: 820000, change: -15000 },
    { name: "Profit", value: 430000, change: 25000 },
  ],
  chartData: [
    { date: "2023-10-23", revenue: 300000, expenses: 150000 },
    { date: "2023-10-24", revenue: 320000, expenses: 160000 },
    { date: "2023-10-25", revenue: 310000, expenses: 155000 },
    { date: "2023-10-26", revenue: 320000, expenses: 165000 },
    { date: "2023-10-27", revenue: 300000, expenses: 150000 },
  ],
  departments: [
    { name: "Sales", revenue: 450000, expenses: 200000 },
    { name: "Marketing", revenue: 300000, expenses: 180000 },
    { name: "Engineering", revenue: 250000, expenses: 220000 },
    { name: "HR", revenue: 150000, expenses: 120000 },
    { name: "Finance", revenue: 100000, expenses: 100000 },
  ],
};

const WeeklyOverview = () => {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Overview" subtitle="Week 42 (2023-10-23 to 2023-10-27)" actions={<Button label="View Details" />} />
      <Section title="Key Metrics">
        <Card>
          <Metric label="Revenue" value={weeklyData.revenue} delta={<Delta value={weeklyData.revenueDelta} basis={weeklyData.revenueDeltaBasis} />} unit="USD" />
          <Metric label="Expenses" value={weeklyData.expenses} delta={<Delta value={weeklyData.expensesDelta} basis={weeklyData.expensesDeltaBasis} />} unit="USD" />
          <Metric label="Profit" value={weeklyData.profit} delta={<Delta value={weeklyData.profitDelta} basis={weeklyData.profitDeltaBasis} />} unit="USD" />
        </Card>
      </Section>
      <Section title="Trends">
        <Card>
          <Trend series={weeklyData.trends} />
        </Card>
      </Section>
      <Section title="Revenue and Expenses Over Time">
        <Card>
          <Chart type="line" series={weeklyData.chartData.map((d) => ({ x: d.date, y: d.revenue })), series={weeklyData.chartData.map((d) => ({ x: d.date, y: d.expenses }))} />
        </Card>
      </Section>
      <Section title="Departmental Breakdown">
        <Card>
          <DataTable
            columns={[{ name: "Department", sortable: true }, { name: "Revenue", sortable: true }, { name: "Expenses", sortable: true }]}
            rows={weeklyData.departments.map((d) => ({ department: d.name, revenue: d.revenue, expenses: d.expenses }))}
          />
        </Card>
      </Section>
    </Page>
  );
};

export default WeeklyOverview;
