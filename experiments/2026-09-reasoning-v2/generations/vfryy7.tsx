import { Page, Header, Section, Card, Metric, Delta, Chart, Tabs, Sidebar, DataTable, Status } from "@stoa/react";

const weeklyData = {
  week: "Week 42",
  date: "2023-09-25",
  revenue: 1250000,
  revenueDelta: 12000,
  revenueDeltaBasis: 1250000 - 12000,
  expenses: 850000,
  expensesDelta: -5000,
  expensesDeltaBasis: 850000 + 5000,
  profit: 400000,
  profitDelta: 20000,
  profitDeltaBasis: 400000 - 20000,
  keyMetrics: [
    { name: "Revenue", value: 1250000, delta: 12000, deltaBasis: 1250000 - 12000, unit: "USD" },
    { name: "Expenses", value: 850000, delta: -5000, deltaBasis: 850000 + 5000, unit: "USD" },
    { name: "Profit", value: 400000, delta: 20000, deltaBasis: 400000 - 20000, unit: "USD" },
  ],
  chartData: {
    type: "line",
    series: [
      { name: "Revenue", data: [1200000, 1220000, 1240000, 1250000] },
      { name: "Expenses", data: [800000, 820000, 840000, 850000] },
      { name: "Profit", data: [400000, 400000, 400000, 400000] },
    ],
    x: "Week",
    y: "USD",
  },
  comparisonData: [
    { name: "This Week", revenue: 1250000, expenses: 850000, profit: 400000 },
    { name: "Last Week", revenue: 1238000, expenses: 845000, profit: 393000 },
  ],
};

export default function WeeklyFinanceOverview() {
  return (
    <Page title="Weekly Finance Overview">
      <Header
        title="Weekly Finance Overview"
        subtitle={`Week ${weeklyData.week} - ${weeklyData.date}`}
        actions={
          <div>
            <Button label="Export" variant="secondary" />
            <Button label="Compare" variant="secondary" />
          </div>
        }
      />
      <Section title="Key Metrics">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {weeklyData.keyMetrics.map((metric, index) => (
            <Card key={index}>
              <Metric label={metric.name} value={metric.value} delta={metric.delta} deltaBasis={metric.deltaBasis} unit={metric.unit} />
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Financial Trends">
        <Chart type="line" series={weeklyData.chartData.series} x={weeklyData.chartData.x} y={weeklyData.chartData.y} />
      </Section>
      <Section title="Week-over-Week Comparison">
        <DataTable
          columns={[
            { key: "name", label: "Metric" },
            { key: "thisWeek", label: "This Week" },
            { key: "lastWeek", label: "Last Week" },
            { key: "delta", label: "Delta" },
          ]}
          rows={weeklyData.comparisonData.map((item) => ({
            name: item.name,
            thisWeek: item.revenue,
            lastWeek: item.expenses,
            delta: item.revenue - item.expenses,
          }))}
        />
      </Section>
      <Sidebar>
        <Card>
          <h3>Recent Activity</h3>
          <ul>
            <li>Revenue increased by 1.6% from last week.</li>
            <li>Expenses decreased by 0.6% from last week.</li>
            <li>Profit increased by 1.5% from last week.</li>
          </ul>
        </Card>
      </Sidebar>
    </Page>
  );
}

function Button({ label, onPress, variant = "primary" }) {
  return (
    <button
      onClick={onPress}
      style={{
        padding: "0.5rem 1rem",
        margin: "0.5rem",
        backgroundColor: variant === "primary" ? "#007bff" : "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
