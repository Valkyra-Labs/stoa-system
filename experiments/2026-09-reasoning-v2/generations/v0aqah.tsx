import { Page, Header, Sidebar, Section, Card, Chart, Comparison, DataTable } from "@stoa/react";

export default function SchoolPerformance() {
  return (
    <Page title="School Performance Report">
      <Header title="School Performance Report" subtitle="Term Summary" />
      <Sidebar>
        <p>Navigation to different sections</p>
      </Sidebar>
      <main>
        <Section title="Key Metrics">
          <Card title="Enrollment">
            <Metric label="Total Students" value={1200} unit="students" />
            <Metric label="New Students" value={150} delta={20} unit="students" />
          </Card>
          <Card title="Funding">
            <Metric label="Total Budget" value={2500000} unit="USD" />
            <Metric label="Funding Shortfall" value={-150000} unit="USD" />
          </Card>
        </Section>
        <Section title="Trends">
          <Card title="Student Enrollment Trends">
            <Chart type="line" series={[{ data: [[1, 1180], [2, 1190], [3, 1200]] }]} x="month" y="enrollment" />
          </Card>
        </Section>
        <Section title="Comparison">
          <Card title="Comparison of Academic Performance">
            <Comparison
              entities={[
                { id: "math", label: "Mathematics" },
                { id: "english", label: "English" }
              ]}
              metrics={[
                { id: "pass_rate", label: "Pass Rate" },
                { id: "avg_score", label: "Average Score" }
              ]}
            />
          </Card>
        </Section>
        <Section title="Detailed Data">
          <Card title="Student Performance by Class">
            <DataTable
              columns={[
                { label: "Class", key: "class" },
                { label: "Teacher", key: "teacher" },
                { label: "Pass Rate", key: "pass_rate", type: "percentage" }
              ]}
              rows={[
                { class: "Math 101", teacher: "Ms. Smith", pass_rate: 0.9 },
                { class: "English 101", teacher: "Mr. Jones", pass_rate: 0.85 }
              ]}
            />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
