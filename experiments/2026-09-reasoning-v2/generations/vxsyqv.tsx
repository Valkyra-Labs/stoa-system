import { Page, Header, Section, Card, Metric, DataTable, Comparison, Status, StaleData, EmptyData } from "@stoa/react";

export default function BoardOverview() {
  const metrics = [
    { label: "Enrollment", value: 1245, basis: "Target: 1300", delta: -45 },
    { label: "Average Test Score", value: 78.2, basis: "Last Term: 76.5", delta: 1.7 },
    { label: "Staff Turnover", value: 12, basis: "Policy Limit: 15", delta: -3 },
    { label: "Budget Utilization", value: 89, basis: "Plan: 92%", unit: "%", delta: -3 },
  ];

  const recentEvents = [
    { id: 1, date: "2023-10-01", type: "achievement", message: "Science Olympiad team wins regional final", impact: "positive" },
    { id: 2, date: "2023-10-05", type: "alert", message: "Budget overrun in IT infrastructure", impact: "critical" },
    { id: 3, date: "2023-10-12", type: "achievement", message: "New library wing opens to students", impact: "positive" },
    { id: 4, date: "2023-10-15", type: "alert", message: "Attendance dip in Grade 9 (5%)", impact: "warning" },
  ];

  return (
    <Page title="Term Overview Board Presentation">
      <Header title="Academic Year 2023-24 | Term 2" subtitle="Board Review Deck" />

      <Section title="Critical Alerts & Exceptions">
        <Card title="Exceptions Requiring Attention">
          <DataTable
            columns={[
              { key: "date", label: "Date" },
              { key: "message", label: "Issue", sticky: true },
              { key: "impact", label: "Severity" },
            ]}
            rows={recentEvents}
            onRowSelect={(row) => {
              console.log("Selected:", row);
            }}
          />
        </Card>
      </Section>

      <Section title="Performance Summary">
        <Card title="Key Metrics vs Targets">
          <Comparison entities={["Current Term", "Last Term"]} metrics={metrics} />
        </Card>
        <Card title="Live Operational Status">
          <Metric label="Real-time Data Freshness" value="Updated 2m ago" />
          <Status tone="neutral" label="System Health" />
          <Status tone="success" label="Budget Status" />
        </Card>
      </Section>

      <Section title="Recent Milestones & Context">
        <Card title="Timeline of Events">
          <DataTable
            columns={[
              { key: "date", label: "Date" },
              { key: "message", label: "Event" },
              { key: "impact", label: "Type" },
            ]}
            rows={recentEvents}
            onRowSelect={(row) => {
              console.log("Selected:", row);
            }}
          />
        </Card>
      </Section>

      <Section title="Data Integrity">
        <Card title="Data Freshness Notice">
          <StaleData since="Imported 24 hours ago" />
          <p>
            The enrollment figures reflect the most recent automated import. Manual adjustments are pending review.
          </p>
        </Card>
      </Section>
    </Page>
  );
}
