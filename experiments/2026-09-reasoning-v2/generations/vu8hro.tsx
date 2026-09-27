import { Page, Header, Section, Card, Tabs, Metric, Comparison, DataTable, Status, EmptyData, StaleData } from "@stoa/react";

export default function StudentPrepScreen() {
  const student = {
    id: "S-402",
    name: "Leo Martinez",
    grade: "3rd",
    dateOfBirth: "2014-05-12",
    enrollmentDate: "2018-09-01",
  };

  const metrics = [
    { label: "Attendance", value: 0.94, basis: "Target: 0.98", delta: -0.04, unit: "rate" },
    { label: "Homework Completion", value: 0.82, basis: "Target: 0.95", delta: -0.13, unit: "rate" },
    { label: "Behavioral Incidents", value: 5, basis: "Target: <2", delta: 3, unit: "count" },
    { label: "Peer Conflict Score", value: 8.5, basis: "Target: <5", delta: 3.5, unit: "score" },
  ];

  const events = [
    { date: "2023-10-15", type: "incident", severity: "high", description: "Verbal altercation with classmate during group work." },
    { date: "2023-10-10", type: "homework", severity: "medium", description: "Missed two consecutive assignments on fractions." },
    { date: "2023-10-05", type: "attendance", severity: "low", description: "Late arrival by 45 minutes." },
    { date: "2023-09-28", type: "positive", severity: "low", description: "Received praise for reading fluency." },
  ];

  return (
    <Page title="Student Meeting Prep: Leo Martinez">
      <Header title={`Student: ${student.name}`} subtitle="Preparation for Parent Conference" />

      <Section title="Immediate Action Items">
        <Card title="Critical Context for Discussion">
          <Comparison entities={[student]} metrics={metrics} />
        </Card>
      </Section>

      <Section title="Recent Timeline">
        <Card title="Behavior & Attendance Log">
          <DataTable
            columns={[
              { key: "date", label: "Date" },
              { key: "type", label: "Type" },
              { key: "severity", label: "Severity" },
              { key: "description", label: "Description" },
            ]}
            rows={events}
          />
        </Card>
      </Section>

      <Section title="Data Freshness & Quality">
        <Card title="Behavioral Log Status">
          {events.length > 0 ? (
            <Status tone="normal" label="Last updated 2 hours ago" />
          ) : (
            <StaleData since="3 days ago" />
          )}
        </Card>
        <Card title="Attendance Records">
          {metrics[0].value < 0.95 ? (
            <Status tone="warning" label="Attendance data incomplete for last week" />
          ) : (
            <Status tone="normal" label="Data current" />
          )}
        </Card>
      </Section>

      <Section title="Meeting Notes Draft">
        <Card title="Key Points to Cover">
          <div>
            <p><strong>Attendance Concern:</strong> Recent decline in attendance affecting learning consistency.</p>
            <p><strong>Behavioral Impact:</strong> Two incidents involving peer conflict require intervention strategies.</p>
            <p><strong>Parent Goal:</strong> Establish a home-school routine to improve homework completion.</p>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
