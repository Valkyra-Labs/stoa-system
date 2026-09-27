import { Page, Header, Section, Card, Metric, Delta, Chart, DataTable, Button, Tabs, Sidebar, FilterBar, Status, EmptyData } from "@stoa/react";

const mockData = {
  classResults: {
    totalStudents: 28,
    averageScore: 68.5,
    passRate: 75,
    highestScore: 95,
    lowestScore: 32,
    scoreDistribution: [
      { range: "90-100", count: 5 },
      { range: "80-89", count: 7 },
      { range: "70-79", count: 6 },
      { range: "60-69", count: 5 },
      { range: "50-59", count: 3 },
      { range: "40-49", count: 2 },
      { range: "30-39", count: 0 },
    ],
  },
  studentScores: [
    { id: "S001", name: "Alice", score: 88, grade: "B" },
    { id: "S002", name: "Bob", score: 72, grade: "C" },
    { id: "S003", name: "Charlie", score: 92, grade: "A" },
    { id: "S004", name: "David", score: 65, grade: "D" },
    { id: "S005", name: "Eve", score: 81, grade: "B" },
    { id: "S006", name: "Frank", score: 78, grade: "C" },
    { id: "S007", name: "Grace", score: 95, grade: "A" },
    { id: "S008", name: "Hank", score: 60, grade: "D" },
    { id: "S009", name: "Ivy", score: 84, grade: "B" },
    { id: "S010", name: "Jack", score: 76, grade: "C" },
    { id: "S011", name: "Kate", score: 91, grade: "A" },
    { id: "S012", name: "Leo", score: 68, grade: "D" },
    { id: "S013", name: "Mia", score: 87, grade: "B" },
    { id: "S014", name: "Nina", score: 73, grade: "C" },
    { id: "S015", name: "Owen", score: 90, grade: "A" },
    { id: "S016", name: "Paul", score: 62, grade: "D" },
    { id: "S017", name: "Quinn", score: 85, grade: "B" },
    { id: "S018", name: "Raj", score: 77, grade: "C" },
    { id: "S019", name: "Sara", score: 93, grade: "A" },
    { id: "S020", name: "Tom", score: 66, grade: "D" },
    { id: "S021", name: "Uma", score: 89, grade: "B" },
    { id: "S022", name: "Vincent", score: 74, grade: "C" },
    { id: "S023", name: "Wendy", score: 94, grade: "A" },
    { id: "S024", name: "Xavier", score: 69, grade: "D" },
    { id: "S025", name: "Yvonne", score: 83, grade: "B" },
    { id: "S026", name: "Zack", score: 75, grade: "C" },
    { id: "S027", name: "Anna", score: 96, grade: "A" },
    { id: "S028", name: "Ben", score: 64, grade: "D" },
  ],
  classPerformance: {
    previousAverage: 72,
    improvement: 6.5,
    topPerformers: [
      { name: "Charlie", score: 92 },
      { name: "Grace", score: 95 },
      { name: "Sara", score: 93 },
      { name: "Wendy", score: 94 },
      { name: "Anna", score: 96 },
    ],
    lowPerformers: [
      { name: "David", score: 65 },
      { name: "Hank", score: 60 },
      { name: "Leo", score: 68 },
      { name: "Paul", score: 62 },
      { name: "Tom", score: 66 },
      { name: "Xavier", score: 69 },
      { name: "Ben", score: 64 },
    ],
  },
};

const UnitTestReviewPage = () => {
  return (
    <Page title="Unit Test Review">
      <Header title="Unit Test Review" subtitle="Class of 28 students" actions={<Button label="Export Results" />} />
      <Section title="Class Overview">
        <Card>
          <Metric label="Total Students" value={mockData.classResults.totalStudents} />
          <Metric label="Average Score" value={mockData.classResults.averageScore} unit="%" />
          <Metric label="Pass Rate" value={mockData.classResults.passRate} unit="%" />
          <Metric label="Highest Score" value={mockData.classResults.highestScore} unit="%" />
          <Metric label="Lowest Score" value={mockData.classResults.lowestScore} unit="%" />
          <Delta value={mockData.classResults.improvement} basis={mockData.classResults.previousAverage} />
        </Card>
      </Section>
      <Section title="Score Distribution">
        <Card>
          <Chart type="bar" series={mockData.classResults.scoreDistribution} x="range" y="count" />
        </Card>
      </Section>
      <Section title="Student Performance">
        <Card>
          <Tabs
            items={[
              { id: "all", label: "All Students" },
              { id: "top", label: "Top Performers" },
              { id: "low", label: "Low Performers" },
            ]}
          >
            {({ activeTab }) => (
              <DataTable
                columns={[
                  { key: "name", label: "Student" },
                  { key: "score", label: "Score", format: (v) => `${v}%` },
                  { key: "grade", label: "Grade" },
                ]}
                rows={
                  activeTab === "all"
                    ? mockData.studentScores
                    : activeTab === "top"
                    ? mockData.classPerformance.topPerformers
                    : mockData.classPerformance.lowPerformers
                }
              />
            )}
          </Tabs>
        </Card>
      </Section>
      <Section title="Next Steps">
        <Card>
          <h3>Actions to Consider</h3>
          <ul>
            <li>
              <Status tone="success">Review top performers for recognition</Status>
            </li>
            <li>
              <Status tone="warning">Provide additional support to low performers</Status>
            </li>
            <li>
              <Status tone="info">Plan a review session for common mistakes</Status>
            </li>
            <li>
              <Status tone="info">Consider adjusting the difficulty of upcoming assessments</Status>
            </li>
          </ul>
          <Button label="Generate Report" />
        </Card>
      </Section>
    </Page>
  );
};

export default UnitTestReviewPage;
