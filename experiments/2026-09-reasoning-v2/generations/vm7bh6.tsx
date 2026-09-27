import { Page, Header, Section, Card, Metric, Delta, DataTable, Button, FilterBar, Tabs } from "@stoa/react";

const weeklyData = [
  { department: "Sales", revenue: 125000, expenses: 45000, profit: 80000, variance: "+12%", week: "Week 42" },
  { department: "Marketing", revenue: 85000, expenses: 32000, profit: 53000, variance: "-5%", week: "Week 42" },
  { department: "Engineering", revenue: 95000, expenses: 60000, profit: 35000, variance: "+8%", week: "Week 42" },
  { department: "HR", revenue: 30000, expenses: 22000, profit: 8000, variance: "-10%", week: "Week 42" },
];

const weeklyMetrics = [
  { label: "Total Revenue", value: 335000, delta: "+15%", unit: "USD" },
  { label: "Total Expenses", value: 159000, delta: "+8%", unit: "USD" },
  { label: "Net Profit", value: 176000, delta: "+12%", unit: "USD" },
];

const weeklyComparison = [
  { department: "Sales", revenue: 125000, expenses: 45000, profit: 80000, variance: "+12%", week: "Week 42" },
  { department: "Marketing", revenue: 85000, expenses: 32000, profit: 53000, variance: "-5%", week: "Week 42" },
];

const weeklyTrend = [
  { week: "Week 41", revenue: 111000, expenses: 41000, profit: 70000 },
  { week: "Week 42", revenue: 125000, expenses: 45000, profit: 80000 },
];

const weeklyAudit = [
  { timestamp: "2023-08-28T09:00:00Z", user: "jane.doe", action: "updated", description: "Updated Sales revenue for Week 42" },
  { timestamp: "2023-08-28T09:15:00Z", user: "jane.doe", action: "updated", description: "Updated Marketing expenses for Week 42" },
];

export default function WeeklyOverview() {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Weekly Financial Overview" subtitle="Monday Morning Check" actions={<Button label="Export" variant="secondary" />} />
      <Section title="Key Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklyMetrics.map((metric, index) => (
            <Card key={index} title={metric.label}>
              <Metric value={metric.value} delta={metric.delta} unit={metric.unit} />
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Department Performance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyComparison.map((dept, index) => (
            <Card key={index} title={dept.department}>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Revenue" value={dept.revenue} delta={dept.variance} />
                <Metric label="Expenses" value={dept.expenses} delta={dept.variance} />
                <Metric label="Profit" value={dept.profit} delta={dept.variance} />
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Trend Analysis">
        <Card title="Revenue vs Expenses">
          <div className="grid grid-cols-2 gap-4">
            <Trend series={weeklyTrend.map((t) => ({ x: t.week, y: t.revenue }))} />
            <Trend series={weeklyTrend.map((t) => ({ x: t.week, y: t.expenses }))} />
          </div>
        </Card>
      </Section>
      <Section title="Audit Log">
        <Card>
          <DataTable
            columns={[{ name: "Timestamp" }, { name: "User" }, { name: "Action" }, { name: "Description" }]}
            rows={weeklyAudit.map((audit) => [
              audit.timestamp,
              audit.user,
              audit.action,
              audit.description,
            ])}
            selectable
          />
        </Card>
      </Section>
    </Page>
  );
}
