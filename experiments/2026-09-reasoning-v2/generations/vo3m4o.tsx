import { Page, Header, Section, Card, Metric, Delta, Tabs, Timeline, Sidebar, DataTable, Status, EmptyData } from "@stoa/react";

const TermReportPage = () => {
  return (
    <Page title="Term Performance Overview">
      <Header title="Term Performance Overview" subtitle="School Year 2023-2024" />
      <Section title="Key Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Student Engagement">
            <Metric label="Average Attendance" value="92.5%" unit="%" />
            <Delta value={+1.2} basis="89.3%" />
          </Card>
          <Card title="Academic Performance">
            <Metric label="Average Test Score" value="82.4" unit="points" />
            <Delta value={+3.1} basis="79.3" />
          </Card>
          <Card title="Staff Satisfaction">
            <Metric label="Survey Score" value="4.2" unit="scale 5" />
            <Delta value={-0.3} basis="4.5" />
          </Card>
        </div>
      </Section>
      <Section title="Performance Trends">
        <Card title="Academic Trends">
          <Trend series={[75, 78, 81, 82, 83, 84, 85]} />
        </Card>
        <Card title="Attendance Trends">
          <Trend series={[88, 89, 90, 91, 92, 92, 93]} />
        </Card>
      </Section>
      <Section title="Recent Events">
        <Timeline events={[
          { date: "2024-03-15", title: "Parent-Teacher Conferences", description: "Conducted for all grade levels." },
          { date: "2024-03-10", title: "Staff Training", description: "New curriculum implementation." },
          { date: "2024-02-28", title: "School Safety Audit", description: "Completed with no major findings." }
        ]} />
      </Section>
      <Section title="Detailed Data">
        <DataTable
          columns={[{ key: "student", label: "Student" }, { key: "grade", label: "Grade" }, { key: "score", label: "Score" }]}
          rows={[
            { student: "Alice Smith", grade: "10", score: "88" },
            { student: "Bob Johnson", grade: "11", score: "92" },
            { student: "Charlie Lee", grade: "12", score: "85" }
          ]}
          selectable
        />
      </Section>
      <Sidebar>
        <Card title="Reports">
          <Status tone="success" label="Annual Report (2023-2024)" />
          <Status tone="info" label="Staff Evaluation Summary" />
          <Status tone="warning" label="Pending: Student Progress Reports" />
        </Card>
      </Sidebar>
    </Page>
  );
};

export default TermReportPage;
