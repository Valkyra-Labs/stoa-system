import { Page, Header, Section, Card, Metric, Chart, Timeline, DataTable, Status, EmptyData } from "@stoa/react";

const SchoolTermDashboard = () => {
  // Placeholder Data
  const metrics = [
    { label: "Total Enrollment", value: 1245, unit: "students", delta: 2.3 },
    { label: "Avg. Test Score (Math)", value: 78, unit: "%", delta: -1.5 },
    { label: "Teacher Retention Rate", value: 94, unit: "%", delta: 0.5 },
    { label: "Budget Utilization", value: 82, unit: "%", delta: 1.2 },
  ];

  const chartSeries = [
    { label: "Enrollment", data: [1100, 1120, 1150, 1180, 1210, 1245] },
    { label: "Test Scores", data: [72, 74, 73, 76, 77, 78] },
  ];

  const timelineEvents = [
    { date: "Aug 15", title: "New Student Admissions", description: "45 new students enrolled." },
    { date: "Sep 10", title: "Science Fair Winners", description: "12 teams awarded scholarships." },
    { date: "Oct 05", title: "Budget Review Meeting", description: "Approved Q3 spending plan." },
    { date: "Nov 12", title: "Parent-Teacher Conference", description: "1500+ attendees recorded." },
  ];

  const comparisonEntities = [
    { name: "Our School", score: 78, trend: "up" },
    { name: "Regional Avg", score: 72, trend: "flat" },
    { name: "State Top Tier", score: 85, trend: "up" },
  ];

  const tableColumns = [
    { key: "department", label: "Department" },
    { key: "budget", label: "Budget Allocated" },
    { key: "spent", label: "Spent (Q3)" },
    { key: "status", label: "Status" },
  ];

  const tableRows = [
    { id: 1, department: "Arts", budget: 150000, spent: 142500, status: "On Track" },
    { id: 2, department: "Science", budget: 200000, spent: 198000, status: "On Track" },
    { id: 3, department: "Sports", budget: 300000, spent: 285000, status: "At Risk" },
    { id: 4, department: "Technology", budget: 120000, spent: 115000, status: "On Track" },
  ];

  return (
    <Page title="Annual Term Report - Board Presentation">
      <Header title="St. Jude's Academy" subtitle="2023-2024 Annual Term Report" />

      <main>
        {/* Executive Summary Metrics */}
        <Section title="Term Overview">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {metrics.map((m) => (
              <Card key={m.label} title={m.label}>
                <Metric value={m.value} unit={m.unit} delta={m.delta} />
              </Card>
            ))}
          </div>
        </Section>

        {/* Visual Trends */}
        <Section title="Performance Trends">
          <Card title="Key Metrics Over Time">
            <Chart
              type="line"
              series={chartSeries}
              x="term_quarter"
              y="value"
            />
          </Card>
        </Section>

        {/* Comparative Analysis */}
        <Section title="Comparative Performance">
          <Card title="School vs. Regional Comparison">
            <Comparison
              entities={comparisonEntities}
              metrics={[
                { label: "Average Test Score", value: 78 },
                { label: "Teacher Satisfaction", value: 91 },
                { label: "Graduation Rate", value: 96 },
              ]}
            />
          </Card>
        </Section>

        {/* Timeline of Events */}
        <Section title="Term Highlights">
          <Card title="Key Milestones">
            <Timeline events={timelineEvents} />
          </Card>
        </Section>

        {/* Detailed Data Table */}
        <Section title="Departmental Budget & Status">
          <Card title="Q3 Financial Overview">
            <DataTable
              columns={tableColumns}
              rows={tableRows}
              stickyFirstColumn
            />
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default SchoolTermDashboard;
