import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Chart,
  DataTable,
  Comparison,
  Status,
  EmptyData,
  Tabs,
} from "@stoa/react";

export default function SchoolDashboard() {
  // --- Data: Academic Performance (K-12) ---
  const academicMetrics = [
    { label: "Average Math Score", value: 84.2, delta: 2.1, unit: "%" },
    { label: "Average Science Score", value: 79.5, delta: -1.3, unit: "%" },
    { label: "Reading Proficiency", value: 88.1, delta: 0.5, unit: "%" },
    { label: "STEM Enrollment", value: 420, delta: 12, unit: "students" },
    { label: "Graduation Rate", value: 96.5, delta: 0.2, unit: "%" },
  ];

  const scienceTrend = [
    { quarter: "Q1", value: 78.2 },
    { quarter: "Q2", value: 79.5 },
    { quarter: "Q3", value: 77.1 },
    { quarter: "Q4", value: 79.5 },
  ];

  // --- Data: Operational Health ---
  const operationalMetrics = [
    { label: "Attendance Rate", value: 94.5, delta: 0.8, unit: "%" },
    { label: "Budget Utilization", value: 72.3, delta: 5.1, unit: "%" },
    { label: "Staff Turnover", value: 4.2, delta: -0.5, unit: "%" },
    { label: "Facility Maintenance", value: 98.0, delta: 0.0, unit: "%" },
  ];

  // --- Data: Entity Comparison (Grade Levels) ---
  const gradeData = [
    { entity: "Grades 6-8", math: 86, science: 82, reading: 89, budget: 1200000 },
    { entity: "Grades 9-10", math: 81, science: 78, reading: 85, budget: 1450000 },
    { entity: "Grades 11-12", math: 85, science: 80, reading: 87, budget: 1600000 },
  ];

  // --- Data: Recent Alerts ---
  const alerts = [
    { id: 1, type: "low", message: "Science scores dropped in Q3", date: "2023-10-15" },
    { id: 2, type: "info", message: "Budget allocation approved for STEM", date: "2023-10-12" },
    { id: 3, type: "warning", message: "Facility maintenance due in 30 days", date: "2023-10-10" },
  ];

  return (
    <Page title="School Performance Dashboard">
      <Header
        title="Annual Report Preview"
        subtitle="Term 2023-2024 | For Board Review"
        actions={
          <>
            <Status tone="success" label="Data Fresh" />
            <Status tone="neutral" label="Export PDF" />
          </>
        }
      />

      <main>
        {/* Section 1: Executive Summary Metrics */}
        <Section title="Key Performance Indicators">
          <Card title="Academic Excellence">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {academicMetrics.map((m) => (
                <Metric key={m.label} label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
              ))}
            </div>
          </Card>
          <Card title="Operational Health">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {operationalMetrics.map((m) => (
                <Metric key={m.label} label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
              ))}
            </div>
          </Card>
        </Section>

        {/* Section 2: Trend Analysis */}
        <Section title="Science Performance Trend (Grades 6-8)">
          <Card title="Quarterly Average Scores">
            <Chart
              type="line"
              series={scienceTrend}
              x={scienceTrend.map((p) => p.quarter)}
              y={scienceTrend.map((p) => p.value)}
            />
          </Card>
        </Section>

        {/* Section 3: Entity Comparison */}
        <Section title="Grade-Level Comparison">
          <Card title="Performance & Budget by Grade Level">
            <Comparison
              entities={gradeData}
              metrics={[
                { label: "Avg Math", key: "math" },
                { label: "Avg Science", key: "science" },
                { label: "Avg Reading", key: "reading" },
                { label: "Budget ($K)", key: "budget" },
              ]}
            />
          </Card>
        </Section>

        {/* Section 4: Data Table with Drilldown */}
        <Section title="Detailed Breakdown">
          <Card title="Term Statistics">
            <DataTable
              columns={[
                { key: "entity", label: "Grade Level", width: 120 },
                { key: "math", label: "Math Avg", width: 80 },
                { key: "science", label: "Science Avg", width: 80 },
                { key: "reading", label: "Reading Avg", width: 80 },
                { key: "budget", label: "Budget ($K)", width: 120 },
              ]}
              rows={gradeData}
              selectable
              stickyFirstColumn
            />
          </Card>
        </Section>

        {/* Section 5: Alerts */}
        <Section title="Board Attention Required">
          <Card title="Recent Alerts">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Status
                    tone={alert.type === "low" ? "warning" : alert.type === "warning" ? "error" : "success"}
                    label={alert.type}
                  />
                  <div>
                    <p><strong>{alert.message}</strong></p>
                    <p style={{ fontSize: "0.85rem", color: "#666" }}>
                      Reported: {alert.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </main>
    </Page>
  );
}
