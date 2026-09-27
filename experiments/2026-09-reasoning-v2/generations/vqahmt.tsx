import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Chart,
  DataTable,
  FilterBar,
  Button,
  Status,
  Tabs,
  Drawer
} from "@stoa/react";

// --- Mock Data ---

const WEEKLY_METRICS = [
  { label: "Revenue", value: "$4,250,000", delta: 12, unit: "vs last week" },
  { label: "Operating Expenses", value: "$1,820,000", delta: -2, unit: "vs last week" },
  { label: "Net Profit", value: "$2,150,000", delta: 8, unit: "vs last week" },
  { label: "Cash Flow", value: "$310,000", delta: 5, unit: "vs last week" },
];

const DEPARTMENT_METRICS = [
  { id: "dept-1", name: "Sales", revenue: 2100000, expense: 800000, profit: 1300000, budget: 2000000 },
  { id: "dept-2", name: "Engineering", revenue: 0, expense: 1200000, profit: -1200000, budget: 1000000 },
  { id: "dept-3", name: "Marketing", revenue: 500000, expense: 300000, profit: 200000, budget: 400000 },
  { id: "dept-4", name: "HR", revenue: 0, expense: 150000, profit: -150000, budget: 100000 },
];

const EXCEPTIONS = [
  { id: 1, dept: "Engineering", metric: "Expense", value: "$1.2M", threshold: "$1.0M", trend: "up" },
  { id: 2, dept: "Sales", metric: "Revenue", value: "$2.1M", threshold: "$1.9M", trend: "up" },
  { id: 3, dept: "Marketing", metric: "ROI", value: "4.5x", threshold: "3.0x", trend: "up" },
];

// --- Main Component ---

export default function FinanceDashboard() {
  const [drawerOpen, setDrawerOpen] = false;

  return (
    <Page title="Weekly Financial Overview">
      {/* Header */}
      <Header 
        title="Weekly Financial Overview" 
        subtitle="Monday, October 23, 2023 | Q3 Review"
        actions={
          <>
            <Button label="Generate Report" variant="primary" />
            <Button label="Export CSV" />
          </>
        }
      />

      <main>
        <Sidebar>
          <nav>
            <ul>
              <li><a href="#">All Departments</a></li>
              <li><a href="#">High Performers</a></li>
              <li><a href="#">Budget Variance</a></li>
              <li><a href="#">Cash Flow</a></li>
            </ul>
          </nav>
        </Sidebar>

        <section className="dashboard-content">
          <Section title="Executive Summary">
            <div className="metrics-grid">
              {WEEKLY_METRICS.map((m) => (
                <Card key={m.label} title={m.label}>
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-delta">
                    {m.delta > 0 ? "+" : ""}{m.delta}% {m.unit}
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Department Performance vs Budget">
            <Tabs 
              items={[
                { id: "all", label: "All Units" },
                { id: "top", label: "Top Performers" },
                { id: "bottom", label: "Under Budget" },
              ]}
            >
              <div className="chart-container">
                <Chart 
                  type="bar" 
                  series={[
                    { 
                      name: "Actual Revenue", 
                      data: DEPARTMENT_METRICS.map(d => d.revenue), 
                      color: "#10b981" 
                    },
                    { 
                      name: "Budgeted Revenue", 
                      data: DEPARTMENT_METRICS.map(d => d.budget), 
                      color: "#6366f1" 
                    },
                  ]}
                  x={DEPARTMENT_METRICS.map(d => d.name)}
                  y={["Revenue", "Expenses", "Profit"]}
                />
              </div>
            </Tabs>
          </Section>

          <Section title="Detailed Department Breakdown">
            <FilterBar 
              filters={[
                { key: "dept", label: "Department", options: DEPARTMENT_METRICS.map(d => d.name) },
                { key: "period", label: "Period", options: ["Current Week", "YTD", "Q3"] },
              ]}
            />
            <DataTable 
              columns={[
                { key: "name", label: "Department" },
                { key: "revenue", label: "Revenue ($)" },
                { key: "expense", label: "Expenses ($)" },
                { key: "profit", label: "Net Profit ($)" },
                { key: "budget", label: "Budget ($)" },
              ]}
              rows={DEPARTMENT_METRICS}
              stickyFirstColumn
            />
          </Section>

          <Section title="Alerts & Exceptions">
            <div className="alerts-grid">
              {EXCEPTIONS.map((exc) => (
                <Card key={exc.id} title={`${exc.dept} - ${exc.metric}`}>
                  <div className="alert-content">
                    <Status tone={exc.trend === "up" ? "success" : "warning"} label={exc.value} />
                    <p>Current: {exc.value} | Threshold: {exc.threshold}</p>
                    <Button label="Investigate" onPress={() => setDrawerOpen(true)} />
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        </section>

        <Drawer 
          title="Investigate Exception" 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
        >
          <div className="drawer-content">
            <p>Details for Engineering Expense overrun.</p>
            <p>Review Q3 capital expenditure requests.</p>
            <Button label="Approve Request" variant="primary" />
            <Button label="Flag for Audit" variant="secondary" />
          </div>
        </Drawer>
      </main>
    </Page>
  );
}
