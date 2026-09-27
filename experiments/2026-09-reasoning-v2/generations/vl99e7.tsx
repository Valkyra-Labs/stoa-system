import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Status, AuditLog } from "@stoa/react";

const Term = "Spring 2024";
const School = "Oakwood Academy";

const metrics = [
  { label: "Student Attendance", value: 94.2, delta: 0.8, unit: "%" },
  { label: "Standardized Test Avg", value: 78, delta: -2.1, unit: "pts" },
  { label: "Teacher Retention", value: 91, delta: 1.5, unit: "%" },
  { label: "STEM Program Enrol.", value: 142, delta: 12, unit: "students" },
];

const enrollmentTrend = [
  { x: "Jan", y: 1200 },
  { x: "Mar", y: 1250 },
  { x: "May", y: 1280 },
];

const programHighlights = [
  { id: 1, title: "Math Mastery", description: "92% of students scored proficient.", status: "success" },
  { id: 2, title: "Art Initiative", description: "50 new studios built.", status: "neutral" },
  { id: 3, title: "Budget Allocation", description: "15% increase in arts funding.", status: "success" },
];

export default function BoardDashboard() {
  return (
    <Page title={`${Term} | ${School} Performance Report`}>
      <Header title={`${Term} Annual Report`} subtitle={School} />

      <main>
        <Section title="Key Performance Indicators">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {metrics.map((m) => (
              <Card key={m.label} title={m.label}>
                <Metric value={m.value} delta={m.delta} unit={m.unit} />
                <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
                  <Delta value={m.delta} basis={m.unit} />
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Enrollment & Academic Trends">
          <Card title="Student Enrollment Growth">
            <Chart type="line" series={[{ name: "Total Students", data: enrollmentTrend }]} x={["Jan", "Mar", "May"]} y={[1200, 1250, 1280]} />
          </Card>
        </Section>

        <Section title="Program Highlights & Achievements">
          <DataTable columns={[
            { key: "title", label: "Program", width: "40%" },
            { key: "description", label: "Summary", width: "55%" },
            { key: "status", label: "Status", width: "5%" },
          ]} rows={programHighlights.map((p) => ({ ...p, status: <Status tone={p.status as any} label={p.status === "success" ? "On Track" : "Review" } /> }))} />
        </Section>

        <Section title="Governance & Approvals">
          <AuditLog entries={[
            { id: 1, actor: "Board of Directors", action: "Approved Spring Budget", time: "2024-03-15" },
            { id: 2, actor: "Principal", action: "Presented STEM Expansion Plan", time: "2024-03-10" },
            { id: 3, actor: "Finance Committee", action: "Reviewed Arts Fund Allocation", time: "2024-03-05" },
          ]} />
        </Section>
      </main>
    </Page>
  );
}
