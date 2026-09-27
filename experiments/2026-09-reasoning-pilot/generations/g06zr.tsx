import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Delta,
  Chart,
  DataTable,
  Button,
  Status,
} from "@stoa/react";

export default function UnitTestReview() {
  const classMetrics = {
    average: 76.5,
    passingStudents: 22,
    totalStudents: 28,
    passRate: 78.6,
  };

  const scoreDistribution = [
    { range: "90-100", count: 8 },
    { range: "80-89", count: 14 },
    { range: "70-79", count: 4 },
    { range: "60-69", count: 2 },
    { range: "below 60", count: 0 },
  ];

  const studentResults = [
    { id: 1, name: "Alice Johnson", score: 95, status: "Pass", effort: "Strong understanding" },
    { id: 2, name: "Bob Smith", score: 88, status: "Pass", effort: "Good" },
    { id: 3, name: "Carol White", score: 92, status: "Pass", effort: "Excellent" },
    { id: 4, name: "David Brown", score: 71, status: "Pass", effort: "Needs review" },
    { id: 5, name: "Emma Davis", score: 65, status: "Fail", effort: "Significant gaps" },
    { id: 6, name: "Frank Wilson", score: 84, status: "Pass", effort: "Good" },
    { id: 7, name: "Grace Lee", score: 91, status: "Pass", effort: "Strong" },
    { id: 8, name: "Henry Miller", score: 59, status: "Fail", effort: "Needs tutoring" },
    { id: 9, name: "Iris Taylor", score: 87, status: "Pass", effort: "Very good" },
    { id: 10, name: "Jack Martinez", score: 78, status: "Pass", effort: "Adequate" },
    { id: 11, name: "Kate Anderson", score: 93, status: "Pass", effort: "Excellent" },
    { id: 12, name: "Leo Thomas", score: 82, status: "Pass", effort: "Good" },
    { id: 13, name: "Mia Jackson", score: 68, status: "Fail", effort: "Needs practice" },
    { id: 14, name: "Noah Garcia", score: 85, status: "Pass", effort: "Strong" },
    { id: 15, name: "Olivia Rodriguez", score: 76, status: "Pass", effort: "Needs improvement" },
    { id: 16, name: "Paul Harris", score: 89, status: "Pass", effort: "Very good" },
    { id: 17, name: "Quinn Clark", score: 81, status: "Pass", effort: "Good" },
    { id: 18, name: "Rachel Lewis", score: 94, status: "Pass", effort: "Excellent" },
    { id: 19, name: "Sam Walker", score: 72, status: "Pass", effort: "Needs review" },
    { id: 20, name: "Tara Hall", score: 86, status: "Pass", effort: "Strong" },
    { id: 21, name: "Uma Young", score: 79, status: "Pass", effort: "Adequate" },
    { id: 22, name: "Victor King", score: 83, status: "Pass", effort: "Good" },
    { id: 23, name: "Wendy Scott", score: 58, status: "Fail", effort: "Needs tutoring" },
    { id: 24, name: "Xavier Green", score: 90, status: "Pass", effort: "Strong" },
    { id: 25, name: "Yara Adams", score: 75, status: "Pass", effort: "Needs improvement" },
    { id: 26, name: "Zoe Nelson", score: 84, status: "Pass", effort: "Good" },
    { id: 27, name: "Aaron Carter", score: 69, status: "Fail", effort: "Needs practice" },
    { id: 28, name: "Bella Mitchell", score: 80, status: "Pass", effort: "Good" },
  ];

  return (
    <Page title="Unit Test Review">
      <Header
        title="Unit Test Results"
        subtitle="Class of 28 students"
        actions={[
          <Button label="Export Results" />,
          <Button label="Schedule Retake" variant="secondary" />,
        ]}
      />

      <div style={{ display: "flex", gap: "2rem" }}>
        <main style={{ flex: 1 }}>
          <Section title="Class Performance Overview">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              <Metric label="Class Average" value={classMetrics.average} unit="%" />
              <Metric label="Pass Rate" value={classMetrics.passRate} unit="%" />
              <Metric label="Passing Students" value={classMetrics.passingStudents} />
              <Metric label="Failing Students" value={6} />
            </div>
          </Section>

          <Card title="Score Distribution">
            <Chart
              type="bar"
              series={[
                {
                  name: "Students",
                  data: scoreDistribution.map((item) => ({ x: item.range, y: item.count })),
                },
              ]}
              x="range"
              y="count"
            />
          </Card>

          <Section title="Individual Student Results">
            <DataTable
              columns={[
                { key: "name", label: "Student Name" },
                { key: "score", label: "Score" },
                { key: "status", label: "Status" },
                { key: "effort", label: "Notes" },
              ]}
              rows={studentResults}
              selectable={true}
            />
          </Section>
        </main>

        <aside style={{ width: "20rem" }}>
          <Card title="Next Steps">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3>Students Needing Support</h3>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>6 students scored below 70</p>
                <Button label="Schedule Tutoring" />
              </div>
              <div>
                <h3>Review & Reteach</h3>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>Most students need practice with Unit concepts</p>
                <Button label="Plan Lesson" />
              </div>
              <div>
                <h3>Extension</h3>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>8 students scored 90 or above</p>
                <Button label="Challenge Activity" />
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </Page>
  );
}
