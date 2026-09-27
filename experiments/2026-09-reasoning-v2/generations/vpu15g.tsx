import { Page, Header, Sidebar, Section, Card, Chart, DataTable, Comparison, Timeline, Metric, Delta, Status, EmptyData } from "@stoa/react";

const SchoolDashboard = () => {
  return (
    <Page title="School Performance Overview">
      <Header title="School Performance Overview" subtitle="Term Progress Report" actions={[]} />
      <Sidebar>
        <Section title="Quick Links">
          <Card title="Student Progress Reports">View detailed student performance data</Card>
          <Card title="Staff Feedback">Access staff satisfaction surveys</Card>
          <Card title="Budget Overview">Review financial allocations and usage</Card>
        </Section>
      </Sidebar>
      <main>
        <Section title="Key Metrics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <Card title="Student Performance">
              <Metric label="Average Score" value="82.5" unit="%" delta={+2.3} />
              <Delta value={+2.3} basis="Last Term" />
            </Card>
            <Card title="Staff Satisfaction">
              <Metric label="Average Rating" value="4.2" unit="scale 5" delta={-0.5} />
              <Delta value={-0.5} basis="Last Term" />
            </Card>
            <Card title="Budget Utilization">
              <Metric label="Spent" value="$2.1M" unit="USD" />
              <Metric label="Remaining" value="$0.9M" unit="USD" />
            </Card>
          </div>
        </Section>
        <Section title="Performance Trends">
          <Chart type="line" series={[{ name: "Student Scores", data: [78, 80, 82, 84, 86] }]} />
        </Section>
        <Section title="Comparison">
          <Comparison
            entities={["Current Term", "Last Term"]}
            metrics={[
              { label: "Average Score", value: [82.5, 80.2] },
              { label: "Staff Satisfaction", value: [4.2, 4.7] },
              { label: "Budget Spent", value: ["$2.1M", "$1.9M"] },
            ]}
          />
        </Section>
        <Section title="Recent Activity">
          <Timeline
            events={[
              { date: "2023-09-15", description: "New curriculum implemented in Science department" },
              { date: "2023-09-20", description: "Staff satisfaction survey completed by 95% of staff" },
              { date: "2023-09-25", description: "Budget allocation approved for new computer lab" },
            ]}
          />
        </Section>
        <Section title="Detailed Data">
          <DataTable
            columns={[{ label: "Student ID", key: "id" }, { label: "Subject", key: "subject" }, { label: "Score", key: "score" }]}
            rows={[
              { id: "S1234", subject: "Math", score: 88 },
              { id: "S1235", subject: "Science", score: 92 },
              { id: "S1236", subject: "English", score: 85 },
            ]}
          />
        </Section>
      </main>
    </Page>
  );
};

export default SchoolDashboard;
