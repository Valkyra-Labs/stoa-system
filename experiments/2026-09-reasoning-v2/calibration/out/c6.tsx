import { Page, Header, Section, Card, Metric, Delta, Chart, DataTable, Tabs, Button, FilterBar, Status, EmptyData } from "@stoa/react";

const mockData = {
  classResults: {
    totalStudents: 28,
    averageScore: 72.5,
    passingRate: 68,
    highestScore: 98,
    lowestScore: 42,
    distribution: [10, 15, 20, 25, 18, 10, 5],
    performanceTrend: [70, 72, 75, 74, 73, 76, 78],
  },
  studentScores: [
    { id: 1, name: "Alice Johnson", score: 85, grade: "A", comments: "Excellent work!" },
    { id: 2, name: "Bob Smith", score: 68, grade: "B", comments: "Needs more practice." },
    { id: 3, name: "Charlie Brown", score: 55, grade: "C", comments: "Review the material." },
    { id: 4, name: "Diana Evans", score: 92, grade: "A", comments: "Outstanding performance." },
    { id: 5, name: "Edward Wilson", score: 70, grade: "B", comments: "Good effort, could improve." },
    { id: 6, name: "Fiona Miller", score: 65, grade: "C", comments: "Needs to focus more." },
    { id: 7, name: "George Taylor", score: 88, grade: "A", comments: "Strong performance." },
    { id: 8, name: "Hannah White", score: 75, grade: "B", comments: "Keep up the good work." },
    { id: 9, name: "Ian Walker", score: 60, grade: "C", comments: "Review the material again." },
    { id: 10, name: "Julia Anderson", score: 82, grade: "A", comments: "Good job!" },
    { id: 11, name: "Kevin Martin", score: 58, grade: "C", comments: "Needs to improve." },
    { id: 12, name: "Liam Thomas", score: 77, grade: "B", comments: "Good progress." },
    { id: 13, name: "Mia Clark", score: 89, grade: "A", comments: "Excellent!" },
    { id: 14, name: "Noah Lee", score: 67, grade: "C", comments: "Review the basics." },
    { id: 15, name: "Olivia Green", score: 90, grade: "A", comments: "Outstanding!" },
    { id: 16, name: "Peter Harris", score: 73, grade: "B", comments: "Good work." },
    { id: 17, name: "Quinn King", score: 62, grade: "C", comments: "Needs to improve." },
    { id: 18, name: "Rachel Scott", score: 81, grade: "A", comments: "Good job!" },
    { id: 19, name: "Samuel Mitchell", score: 76, grade: "B", comments: "Keep up the good work." },
    { id: 20, name: "Tina Roberts", score: 69, grade: "C", comments: "Review the material." },
    { id: 21, name: "Uma Patel", score: 84, grade: "A", comments: "Excellent!" },
    { id: 22, name: "Victor Lewis", score: 71, grade: "B", comments: "Good effort." },
    { id: 23, name: "Wendy Walker", score: 66, grade: "C", comments: "Needs to focus." },
    { id: 24, name: "Xavier Young", score: 80, grade: "A", comments: "Good job!" },
    { id: 25, name: "Yara Smith", score: 74, grade: "B", comments: "Keep improving." },
    { id: 26, name: "Zachary Moore", score: 64, grade: "C", comments: "Review the material." },
    { id: 27, name: "Ava Thomas", score: 87, grade: "A", comments: "Excellent work!" },
    { id: 28, name: "Benjamin Adams", score: 79, grade: "B", comments: "Good progress." },
  ],
  classPerformance: [
    { id: 1, label: "Average Score", value: 72.5, delta: "+2.5", unit: "points" },
    { id: 2, label: "Passing Rate", value: 68, delta: "+5", unit: "%" },
    { id: 3, label: "Highest Score", value: 98, delta: "+1", unit: "points" },
    { id: 4, label: "Lowest Score", value: 42, delta: "-2", unit: "points" },
    { id: 5, label: "Standard Deviation", value: 12.3, delta: "+1.2", unit: "points" },
  ],
  classTrend: {
    label: "Performance Trend",
    series: [
      { name: "Class Average", data: [70, 72, 75, 74, 73, 76, 78] },
    ],
    x: "Week",
    y: "Score",
  },
  classDistribution: {
    label: "Score Distribution",
    series: [
      { name: "Score Range", data: [10, 15, 20, 25, 18, 10, 5] },
    ],
    x: "Score Range",
    y: "Number of Students",
  },
  classAnalysis: [
    {
      id: 1,
      label: "Top Performing Students",
      value: 10,
      delta: "+2",
      unit: "students",
    },
    {
      id: 2,
      label: "Students Needing Support",
      value: 12,
      delta: "+1",
      unit: "students",
    },
    {
      id: 3,
      label: "Average Time Spent",
      value: 45,
      delta: "-5",
      unit: "minutes",
    },
  ],
};

export default function ClassReviewPage() {
  return (
    <Page title="Class Test Review - Unit 3">
      <Header title="Class Test Review" subtitle="Unit 3 - 28 Students" actions={[<Button label="Export Results" variant="secondary" />]} />
      
      <Section title="Class Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Class Statistics">
            <div className="space-y-2">
              <Metric label="Total Students" value={mockData.classResults.totalStudents} />
              <Metric label="Average Score" value={mockData.classResults.averageScore} delta={"+2.5"} unit="points" />
              <Metric label="Passing Rate" value={mockData.classResults.passingRate} delta={"+5"} unit="%" />
              <Metric label="Highest Score" value={mockData.classResults.highestScore} delta={"+1"} unit="points" />
              <Metric label="Lowest Score" value={mockData.classResults.lowestScore} delta={"-2"} unit="points" />
            </div>
          </Card>
          <Card title="Performance Trend">
            <Chart type="line" series={mockData.classTrend.series} x={mockData.classTrend.x} y={mockData.classTrend.y} />
          </Card>
          <Card title="Score Distribution">
            <Chart type="bar" series={mockData.classDistribution.series} x={mockData.classDistribution.x} y={mockData.classDistribution.y} />
          </Card>
        </div>
      </Section>

      <Section title="Class Analysis">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockData.classAnalysis.map((item) => (
            <Card key={item.id} title={item.label}>
              <Metric value={item.value} delta={item.delta} unit={item.unit} />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Student Performance">
        <FilterBar filters={[{ label: "Grade", options: ["A", "B", "C"] }]} />
        <DataTable
          columns={[
            { header: "Student", key: "name" },
            { header: "Score", key: "score" },
            { header: "Grade", key: "grade" },
            { header: "Comments", key: "comments" },
          ]}
          rows={mockData.studentScores}
          selectable
          stickyFirstColumn
          onRowSelect={(selected) => console.log("Selected student:", selected)}
        />
      </Section>

      <Section title="Next Steps">
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold">Action Plan</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Review common mistakes in the test and create targeted revision materials.</li>
              <li>Offer additional support to students scoring below 60.</li>
              <li>Recognize top performers and encourage them to help peers.</li>
              <li>Plan a follow-up quiz to assess understanding of key concepts.</li>
            </ul>
            <div className="mt-4">
              <Button label="Generate Report" variant="primary" />
              <Button label="Send Feedback" variant="secondary" />
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
