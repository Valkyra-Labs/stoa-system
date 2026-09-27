import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Status, EmptyData, Button, FilterBar, Tabs, Drawer } from "@stoa/react";

const WeeklyFinanceOverview = () => {
  const weeklyData = [
    { department: "Sales", revenue: 125000, expenses: 45000, profit: 80000, variance: 5000, trend: "up" },
    { department: "Marketing", revenue: 85000, expenses: 32000, profit: 53000, variance: -2000, trend: "stable" },
    { department: "Engineering", revenue: 95000, expenses: 60000, profit: 35000, variance: 1500, trend: "down" },
    { department: "HR", revenue: 50000, expenses: 25000, profit: 25000, variance: 0, trend: "stable" },
    { department: "Finance", revenue: 60000, expenses: 20000, profit: 40000, variance: 3000, trend: "up" }
  ];

  const metrics = [
    { label: "Total Revenue", value: 420000, delta: 12000, unit: "USD" },
    { label: "Total Expenses", value: 182000, delta: -3000, unit: "USD" },
    { label: "Net Profit", value: 238000, delta: 8000, unit: "USD" }
  ];

  const chartData = [
    { week: "Week 1", revenue: 125000, expenses: 45000, profit: 80000 },
    { week: "Week 2", revenue: 130000, expenses: 46000, profit: 84000 },
    { week: "Week 3", revenue: 128000, expenses: 44000, profit: 84000 },
    { week: "Week 4", revenue: 132000, expenses: 47000, profit: 85000 }
  ];

  const auditLog = [
    { timestamp: "2023-04-10 10:00", user: "admin", action: "Updated revenue for Sales department" },
    { timestamp: "2023-04-10 09:30", user: "admin", action: "Added new entry for HR department" },
    { timestamp: "2023-04-09 17:45", user: "admin", action: "Reviewed financial data" }
  ];

  return (
    <Page title="Weekly Finance Overview">
      <Header title="Weekly Finance Overview" subtitle="Monday Review" actions={<Button label="Export" variant="secondary" />} />
      <Section title="Key Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} title={metric.label}>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{metric.unit}</p>
                </div>
                <div>
                  {metric.delta !== undefined && (
                    <Delta value={metric.delta} basis={metric.value} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Departmental Breakdown">
        <Card title="Performance Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weeklyData.map((item, index) => (
              <Card key={index} title={item.department}>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Revenue</span>
                    <span className="font-medium">{item.revenue.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Expenses</span>
                    <span className="font-medium">{item.expenses.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Profit</span>
                    <span className="font-medium">{item.profit.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Variance</span>
                    <span className={`font-medium ${item.variance > 0 ? "text-green-500" : "text-red-500"}`}>
                      {item.variance.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Trend</span>
                    <span className={`font-medium ${item.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {item.trend}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </Section>
      <Section title="Trend Analysis">
        <Card title="Weekly Revenue and Expenses">
          <Chart type="line" series={[{ data: chartData.map(d => d.revenue) }, { data: chartData.map(d => d.expenses) }]} x={chartData.map(d => d.week)} y="USD" />
        </Card>
      </Section>
      <Section title="Audit Log">
        <Card title="Recent Activity">
          {auditLog.length > 0 ? (
            <DataTable
              columns={["Timestamp", "User", "Action"]}
              rows={auditLog.map(entry => [
                entry.timestamp,
                entry.user,
                entry.action
              ])}
            />
          ) : (
            <EmptyData message="No audit log entries found" />
          )}
        </Card>
      </Section>
      <Drawer title="Data Sources" open={false}>
        <Card title="Data Sources">
          <p className="text-sm text-gray-500">
            This report is generated from the company's internal financial system, updated weekly. All figures are in USD and represent the latest available data.
          </p>
        </Card>
      </Drawer>
    </Page>
  );
};

export default WeeklyFinanceOverview;
