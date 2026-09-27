import { Page, Header, Section, Card, Metric, Comparison, EmptyData, Status, Button } from "@stoa/react";

export default function SchoolTermOverview() {
  const metrics = [
    { label: "Enrollment", value: 1245, delta: 8, unit: "students", basis: "previous term" },
    { label: "Academic Progress", value: 92, delta: -3, unit: "%", basis: "target" },
    { label: "Budget Utilization", value: 88, delta: 12, unit: "%", basis: "allocated" },
    { label: "Staff Retention", value: 4, delta: 0, unit: "%", basis: "previous term" },
  ];

  const highPriorityIssues = [
    {
      title: "Academic Progress Decline",
      value: -3,
      unit: "%",
      basis: "target",
      context: "Core subjects underperforming compared to district average.",
      status: "critical",
    },
    {
      title: "Budget Overspend Risk",
      value: 12,
      unit: "%",
      basis: "allocated",
      context: "Technology upgrades delayed, pushing spending into Q4.",
      status: "warning",
    },
  ];

  const stableMetrics = [
    { label: "Enrollment", value: 1245, delta: 8, unit: "students", basis: "previous term" },
    { label: "Staff Retention", value: 4, delta: 0, unit: "%", basis: "previous term" },
    { label: "Parent Satisfaction", value: 48, delta: 2, unit: "%", basis: "previous term" },
  ];

  return (
    <Page title="Annual Term Report" subtitle="Board Presentation Overview">
      <Header title="Term Overview" subtitle="Q3 - 2023/2024" />

      <Section title="Critical Exceptions & Urgent Matters">
        {highPriorityIssues.length === 0 ? (
          <EmptyData message="No critical issues identified this term." />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {highPriorityIssues.map((issue) => (
              <Card key={issue.title} title={issue.title}>
                <Metric label={issue.title} value={issue.value} unit={issue.unit} delta={issue.value} basis={issue.basis} />
                <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#555" }}>{issue.context}</p>
                <Status tone={issue.status} label={issue.status === "critical" ? "Immediate Action Required" : "Monitor Closely"} />
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Key Performance Indicators">
        <Comparison entities={["School", "District Average"]} metrics={metrics} />
      </Section>

      <Section title="Detailed Metrics Breakdown">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {stableMetrics.map((m) => (
            <Card key={m.label} title={m.label}>
              <Metric label={m.label} value={m.value} delta={m.delta} unit={m.unit} basis={m.basis} />
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}
