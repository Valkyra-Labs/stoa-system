import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Delta,
  Trend,
  Chart,
  DataTable,
  Status,
  FilterBar,
  Button,
  Tabs,
  Drawer
} from "@stoa/react";

const METRICS = [
  { label: "Revenue", value: 425000, delta: 12, unit: "k" },
  { label: "OpEx", value: 180000, delta: -5, unit: "k" },
  { label: "Gross Margin", value: 57.8, delta: 0.4, unit: "%" },
  { label: "EBITDA", value: 245000, delta: 8, unit: "k" },
  { label: "Cash Flow", value: 31000, delta: -2, unit: "k" },
];

const DEPT_METRICS = [
  { id: "prod", label: "Product", revenue: 210000, margin: 60, count: 45 },
  { id: "sales", label: "Sales", revenue: 120000, margin: 45, count: 32 },
  { id: "ops", label: "Operations", revenue: 95000, margin: 55, count: 28 },
];

export default function FinanceDashboard() {
  return (
    <Page title="Weekly Financial Review">
      <Header
        title="Weekly Financial Review"
        subtitle="Monday, 2023-10-23 | Q3 2023"
        actions={
          <Button label="Export Report" variant="secondary" />
        }
      />
      <Sidebar>
        <Section title="Navigation">
          <nav>
            <a href="#">Overview</a>
            <a href="#">Departments</a>
            <a href="#">Budgets</a>
            <a href="#">Audit Log</a>
          </nav>
        </Section>
      </Sidebar>
      <main>
        <Section title="Executive Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {METRICS.map((m) => (
              <Card key={m.label} title={m.label}>
                <Metric label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
                <Trend
                  series={[
                    { x: "W-4", y: m.value - 10000 },
                    { x: "W-3", y: m.value - 5000 },
                    { x: "W-2", y: m.value },
                    { x: "W-1", y: m.value + 2000 },
                    { x: "W0", y: m.value + 4000 },
                  ]}
                />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Department Performance vs Budget">
          <Tabs
            items={[
              { id: "all", label: "All Departments" },
              { id: "prod", label: "Product Division" },
              { id: "sales", label: "Sales Division" },
            ]}
          >
            {() => (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                  <Card title="Revenue & Margin Trends">
                    <Chart
                      type="bar"
                      series={DEPT_METRICS}
                      x={["Q2", "Q3", "Q4"]}
                      y={["Revenue", "Margin %"]}
                    />
                  </Card>
                </div>
                <div>
                  <Card title="Activity Volume">
                    <Chart
                      type="line"
                      series={DEPT_METRICS.map((d) => ({ ...d, name: d.label }))}
                      x={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
                      y={DEPT_METRICS.map((d) => d.count)}
                    />
                  </Card>
                </div>
              </div>
            )}
          </Tabs>
        </Section>

        <Section title="Detailed Transaction Review">
          <FilterBar
            filters={[
              { type: "range", label: "Date Range", min: "2023-09-01", max: "2023-09-30" },
              { type: "select", label: "Department", options: DEPT_METRICS.map(d => d.label) },
              { type: "select", label: "Status", options: ["Approved", "Pending", "Rejected"] },
            ]}
          />
          <DataTable
            columns={[
              { key: "dept", label: "Department", width: "20%" },
              { key: "revenue", label: "Revenue ($)" },
              { key: "margin", label: "Margin %", width: "15%" },
              { key: "count", label: "Transactions", width: "10%" },
              { key: "status", label: "Status", width: "15%" },
              { key: "actions", label: "Actions", width: "15%" },
            ]}
            rows={[
              { id: 1, dept: "Product", revenue: 210000, margin: 60, count: 45, status: "Approved", actions: "View" },
              { id: 2, dept: "Sales", revenue: 120000, margin: 45, count: 32, status: "Pending", actions: "Review" },
              { id: 3, dept: "Ops", revenue: 95000, margin: 55, count: 28, status: "Approved", actions: "View" },
              { id: 4, dept: "Product", revenue: 85000, margin: 58, count: 12, status: "Rejected", actions: "Appeal" },
            ]}
            selectable
            onRowSelect={(row) => console.log("Selected:", row)}
          />
          <BulkActions
            actions={[
              { label: "Approve Selected", onPress: () => alert("Approved") },
              { label: "Reject Selected", onPress: () => alert("Rejected") },
            ]}
          />
        </Section>
      </main>
      <Drawer title="Audit Log" open={false}>
        <AuditLog entries={[
          { id: 1, user: "Alice", action: "Updated Budget", time: "10:00 AM" },
          { id: 2, user: "Bob", action: "Exported Report", time: "09:30 AM" },
        ]} />
      </Drawer>
    </Page>
  );
}

// Helper components for brevity in this single-file demo
const BulkActions = ({ actions }: { actions: { label: string; onPress: () => void }[] }) => (
  <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
    {actions.map((a) => (
      <Button key={a.label} label={a.label} onPress={a.onPress} />
    ))}
  </div>
);

const AuditLog = ({ entries }: { entries: { id: number; user: string; action: string; time: string }[] }) => (
  <div style={{ marginTop: "1rem", maxHeight: "200px", overflowY: "auto" }}>
    {entries.map((e) => (
      <div key={e.id} style={{ borderBottom: "1px solid #eee", padding: "0.5rem 0" }}>
        <strong>{e.user}</strong> - {e.action} at {e.time}
      </div>
    ))}
  </div>
);
