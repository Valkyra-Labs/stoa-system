import { Page, Header, Section, Card, Metric, Delta, Tabs, Button, DataTable, FilterBar, Status, EmptyData, Chart, Timeline, AuditLog } from "@stoa/react";

const mockStudents = [
  { id: 1, name: "Alice Johnson", score: 85, grade: "A", feedback: "Excellent work!" },
  { id: 2, name: "Bob Smith", score: 72, grade: "B", feedback: "Good effort, needs improvement." },
  { id: 3, name: "Charlie Brown", score: 68, grade: "C", feedback: "Needs more practice." },
  { id: 4, name: "Diana Evans", score: 55, grade: "D", feedback: "Review the material and ask for help." },
  { id: 5, name: "Ethan Wilson", score: 42, grade: "F", feedback: "Seek immediate assistance." },
];

const mockClassData = {
  totalStudents: 28,
  averageScore: 68.5,
  highestScore: 98,
  lowestScore: 35,
  passRate: 71.4,
  failRate: 28.6,
};

const mockAuditLog = [
  { id: 1, user: "teacher", action: "Test marked", timestamp: "2023-04-05T14:30:00Z" },
  { id: 2, user: "admin", action: "Test published", timestamp: "2023-04-03T10:15:00Z" },
  { id: 3, user: "teacher", action: "Test reviewed", timestamp: "2023-04-05T16:45:00Z" },
];

const mockTimelineEvents = [
  { date: "2023-04-01", description: "Test announced with instructions." },
  { date: "2023-04-03", description: "Test published for students." },
  { date: "2023-04-05", description: "Test marked and reviewed by teacher." },
];

const mockComparisonMetrics = [
  { metric: "Average Score", class: 68.5, target: 75 },
  { metric: "Pass Rate", class: 71.4, target: 80 },
  { metric: "Highest Score", class: 98, target: 95 },
  { metric: "Lowest Score", class: 35, target: 40 },
];

const mockChartData = {
  type: "bar",
  series: [
    { name: "Class Average", data: [68.5] },
    { name: "Target Average", data: [75] },
  ],
  x: "Metric",
  y: "Score",
};

const mockDataTableColumns = [
  { key: "name", label: "Student Name" },
  { key: "score", label: "Score" },
  { key: "grade", label: "Grade" },
  { key: "feedback", label: "Feedback" },
];

export default function ReviewTestResults() {
  return (
    <Page title="Review Unit Test Results">
      <Header title="Unit Test Review" subtitle="Class of 28 Students" actions={<Button label="Export Results" variant="secondary" />} />
      <main>
        <Section title="Class Overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric label="Total Students" value={mockClassData.totalStudents} />
            <Metric label="Average Score" value={mockClassData.averageScore} unit="%" />
            <Metric label="Highest Score" value={mockClassData.highestScore} unit="%" />
            <Metric label="Lowest Score" value={mockClassData.lowestScore} unit="%" />
            <Metric label="Pass Rate" value={mockClassData.passRate} unit="%" />
            <Metric label="Fail Rate" value={mockClassData.failRate} unit="%" />
            <Metric label="Target Average" value={mockClassData.target} unit="%" />
            <Delta value={mockClassData.averageScore} basis={mockClassData.target} tone={mockClassData.averageScore > mockClassData.target ? "positive" : "negative"} />
          </div>
        </Section>

        <Section title="Test Performance">
          <Card title="Class Comparison">
            <Comparison entities={[{ name: "Class", metrics: mockComparisonMetrics }]} />
          </Card>

          <Card title="Score Distribution">
            <Chart type="bar" series={mockChartData.series} x={mockChartData.x} y={mockChartData.y} />
          </Card>
        </Section>

        <Section title="Student Performance">
          <DataTable
            columns={mockDataTableColumns}
            rows={mockStudents}
            selectable
            stickyFirstColumn
            onRowSelect={(selected) => console.log("Selected student:", selected)}
          />
        </Section>

        <Section title="Next Steps">
          <Card title="Action Plan">
            <div className="space-y-2">
              <p>Based on the results, the following actions are recommended:</p>
              <ul className="list-disc list-inside">
                <li>Review the test with students who scored below 60% to identify areas of difficulty.</li>
                <li>Provide additional resources or revision sessions for students who scored between 60-70%.</li>
                <li>Offer targeted support to students who scored below 50% to ensure they understand the material.</li>
                <li>Consider adjusting the teaching approach for topics that many students found challenging.</li>
              </ul>
            </div>
          </Card>

          <Card title="Decisions">
            <div className="space-y-2">
              <p>Decide on the next steps for the class:</p>
              <ul className="list-disc list-inside">
                <li>Plan a revision session for the entire class.</li>
                <li>Offer one-on-one support for students who need it.</li>
                <li>Send out a summary of the test results and areas to focus on.</li>
              </ul>
            </div>
          </Card>
        </Section>

        <Section title="Audit Trail">
          <AuditLog entries={mockAuditLog} />
        </Section>

        <Section title="Timeline">
          <Timeline events={mockTimelineEvents} />
        </Section>
      </main>
    </Page>
  );
}
