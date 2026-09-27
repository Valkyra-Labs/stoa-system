import { Page, Header, Section, Card, Tabs, Metric, Delta, Chart, DataTable, Timeline, Status, EmptyData, Button, FilterBar, SavedViews, Explorer, Inspector, Monitor, ReviewQueue, Dashboard } from "@stoa/react";

export default function SchoolPerformanceOverview() {
  return (
    <Page title="School Performance Overview">
      <Header title="Term Performance Summary" subtitle="Presented to the Board" actions={<Button label="Export Report" variant="secondary" />} />
      
      <Section title="Key Metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <Card title="Student Engagement">
            <Metric label="Average Engagement Score" value="8.2" unit="out of 10" />
            <Delta value="0.3" basis="Last Term" />
          </Card>
          <Card title="Teacher Satisfaction">
            <Metric label="Average Satisfaction Score" value="7.8" unit="out of 10" />
            <Delta value="0.2" basis="Last Term" />
          </Card>
          <Card title="Parent Involvement">
            <Metric label="Average Participation Rate" value="65%" />
            <Delta value="5" basis="Last Term" />
          </Card>
        </div>
      </Section>

      <Section title="Performance Trends">
        <Chart type="line" series={[{ name: "Student Engagement", data: [7.5, 8.0, 8.2, 8.3] }]} />
      </Section>

      <Section title="Recent Events">
        <Timeline events={[
          { date: "2024-02-15", description: "Launched new after-school program" },
          { date: "2024-03-01", description: "Increased teacher training hours by 20%" },
          { date: "2024-04-10", description: "Parent-teacher conference attendance up 15%" }
        ]} />
      </Section>

      <Section title="Student Performance">
        <DataTable
          columns={[{ key: "student", label: "Student" }, { key: "math", label: "Math Score" }, { key: "english", label: "English Score" }]}
          rows={[
            { student: "Alice Johnson", math: "85", english: "92" },
            { student: "James Smith", math: "78", english: "84" },
            { student: "Maria Garcia", math: "90", english: "88" }
          ]}
          selectable
        />
      </Section>

      <Section title="Status Summary">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <Card title="School Rating">
            <Status tone="success" label="Excellent" />
          </Card>
          <Card title="Financial Health">
            <Status tone="warning" label="Stable" />
          </Card>
          <Card title="Safety Rating">
            <Status tone="success" label="High" />
          </Card>
        </div>
      </Section>

      <Section title="Empty States">
        <EmptyData message="No data available for this term." />
      </Section>
    </Page>
  );
}
