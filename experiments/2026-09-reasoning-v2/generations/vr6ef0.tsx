import { Page, Header, Sidebar, Section, Card, Metric, Delta, Chart, DataTable, Comparison, Timeline, Status, EmptyData } from "@stoa/react";

const SchoolDashboard = () => {
  return (
    <Page title="School Performance Overview">
      <Header title="School Performance Overview" subtitle="Term Progress Report" actions={[]} />
      <Sidebar>
        <Section title="Navigation">
          <Card>
            <ul>
              <li>Student Performance</li>
              <li>Staff Engagement</li>
              <li>Financial Health</li>
              <li>Parent Satisfaction</li>
            </ul>
          </Card>
        </Section>
      </Sidebar>
      <main>
        <Section title="Key Metrics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <Metric label="Students Enrolled" value="624" unit="students" />
            <Metric label="Average Test Score" value="82.5" unit="%" />
            <Metric label="Staff Retention Rate" value="92%" unit="%" />
          </div>
        </Section>
        <Section title="Performance Trends">
          <Chart type="line" series={[{ name: "Math Scores", data: [78, 81, 84, 86, 88] }]} x="Term" y="Score" />
        </Section>
        <Section title="Comparison with Previous Term">
          <Comparison
            entities={[{ name: "Current Term", metrics: { score: 88, enrollment: 624 } }, { name: "Previous Term", metrics: { score: 82, enrollment: 612 } }]}
          />
        </Section>
        <Section title="Recent Events">
          <Timeline events={[{ date: "2023-09-15", description: "New STEM program launched" }, { date: "2023-09-20", description: "Parent-teacher meetings held" }]} />
        </Section>
        <Section title="Financial Overview">
          <DataTable
            columns={[{ key: "item", label: "Item" }, { key: "amount", label: "Amount" }]}
            rows={[{ item: "Operating Budget", amount: "$1,250,000" }, { item: "Capital Expenditures", amount: "$300,000" }]}
          />
        </Section>
        <Section title="Status Indicators">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <Status tone="success" label="On Track" />
            <Status tone="warning" label="Needs Review" />
            <Status tone="error" label="Critical" />
          </div>
        </Section>
      </main>
    </Page>
  );
};

export default SchoolDashboard;
