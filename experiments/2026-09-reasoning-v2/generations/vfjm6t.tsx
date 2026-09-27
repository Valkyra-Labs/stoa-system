import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, Status, EmptyData } from '@stoa/react';

const schoolData = {
  attendance: {
    current: 92.5,
    previous: 91.8,
    target: 95,
  },
  testScores: {
    current: 82,
    previous: 79,
    target: 85,
  },
  staffPerformance: {
    current: 88,
    previous: 85,
    target: 90,
  },
  budget: {
    current: 2.4,
    previous: 2.3,
    target: 2.5,
  },
  events: [
    { date: '2023-09-01', description: 'Back-to-school event' },
    { date: '2023-10-15', description: 'Parent-teacher conference' },
    { date: '2023-11-05', description: 'Staff development day' },
  ],
  audit: [
    { user: 'admin', action: 'updated budget', timestamp: '2023-10-10T14:30:00Z' },
    { user: 'teacher', action: 'submitted report', timestamp: '2023-10-12T09:15:00Z' },
  ],
};

export default function SchoolPerformance() {
  return (
    <Page title="School Performance Overview">
      <Header title="School Performance" subtitle="Term Report for the Board" />
      <Section title="Key Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Attendance Rate">
            <Metric label="Current" value={schoolData.attendance.current} delta={schoolData.attendance.previous} unit="%" />
            <Trend series={[91.8, 92.2, 92.5]} />
          </Card>
          <Card title="Test Scores">
            <Metric label="Current" value={schoolData.testScores.current} delta={schoolData.testScores.previous} unit="%" />
            <Trend series={[79, 81, 82]} />
          </Card>
          <Card title="Staff Performance">
            <Metric label="Current" value={schoolData.staffPerformance.current} delta={schoolData.staffPerformance.previous} unit="%" />
            <Trend series={[85, 86, 88]} />
          </Card>
          <Card title="Budget Utilization">
            <Metric label="Current" value={schoolData.budget.current} delta={schoolData.budget.previous} unit="M$" />
            <Trend series={[2.3, 2.4, 2.4]} />
          </Card>
        </div>
      </Section>
      <Section title="Performance Comparison">
        <Comparison
          entities={['School A', 'School B', 'School C']}
          metrics={[
            { label: 'Attendance Rate', values: [93, 91, 90] },
            { label: 'Test Scores', values: [84, 83, 82] },
            { label: 'Staff Performance', values: [89, 87, 86] },
          ]}
        />
      </Section>
      <Section title="Recent Events">
        <Timeline events={schoolData.events} />
      </Section>
      <Section title="Audit Log">
        <DataTable
          columns={['User', 'Action', 'Timestamp']}
          rows={schoolData.audit.map((entry) => [entry.user, entry.action, entry.timestamp])}
        />
      </Section>
      <Section title="Status Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Overall Status">
            <Status tone="success" label="On Track" />
          </Card>
          <Card title="Areas for Improvement">
            <Status tone="warning" label="Attendance" />
          </Card>
        </div>
      </Section>
    </Page>
  );
}
