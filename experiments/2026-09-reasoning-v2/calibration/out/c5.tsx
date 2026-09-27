import { Page, Header, Section, Card, Metric, Delta, Chart, DataTable, Status, EmptyData, Button, FilterBar, SavedViews, BulkActions } from "@stoa/react";

const mockData = {
  classAverage: 72.5,
  highestScore: 98,
  lowestScore: 45,
  passRate: 75,
  failRate: 25,
  classSize: 28,
  scores: [78, 82, 65, 90, 70, 88, 60, 95, 75, 85, 68, 92, 73, 80, 62, 94, 77, 84, 66, 91, 74, 81, 63, 93, 76, 83, 67, 96],
  studentNames: [
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry", "Isabel", "Jack", "Kate", "Liam", "Mia", "Nora", "Oliver", "Peter", "Quinn", "Rachel", "Sam", "Tom", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zoe"
  ],
  metrics: [
    { name: "Score", value: 72.5 },
    { name: "Highest", value: 98 },
    { name: "Lowest", value: 45 },
    { { name: "Pass Rate", value: 75 },
    { name: "Fail Rate", value: 25 }
  ],
  charts: [
    {
      type: "bar",
      series: [
        { name: "Pass", value: 75 },
        { name: "Fail", value: 25 }
      ]
    },
    {
      type: "line",
      series: [
        { name: "Class Average", values: [72.5, 73.5, 74.5, 75.5, 76.5] }
      ]
    }
  ],
  filters: [
    { id: "scoreRange", label: "Score Range", options: ["All", "Pass", "Fail"] },
    { id: "studentName", label: "Student Name", options: ["All", "Alice", "Bob", "Charlie"] }
  ],
  savedViews: [
    { id: "default", name: "Default View", filters: { scoreRange: "All" } },
    { id: "passing", name: "Passing Students", filters: { scoreRange: "Pass" } },
    { id: "failing", name: "Failing Students", filters: { scoreRange: "Fail" } }
  ],
  bulkActions: [
    { id: "emailParents", label: "Email Parents", description: "Send an email to the parents of selected students" },
    { id: "scheduleTutoring", label: "Schedule Tutoring", description: "Schedule one-on-one tutoring sessions for selected students" }
  ]
};

export default function ReviewClassPerformance() {
  return (
    <Page title="Class Test Review">
      <Header title="Class Test Review" subtitle="Reviewing results and planning next steps" />
      <main>
        <Section title="Class Overview">
          <Card title="Class Summary">
            <div className="grid grid-cols-2 gap-4">
              <Metric label="Class Average" value={mockData.classAverage} unit="%" />
              <Metric label="Highest Score" value={mockData.highestScore} unit="%" />
              <Metric label="Lowest Score" value={mockData.lowestScore} unit="%" />
              <Metric label="Pass Rate" value={mockData.passRate} unit="%" />
              <Metric label="Fail Rate" value={mockData.failRate} unit="%" />
              <Metric label="Class Size" value={mockData.classSize} />
            </div>
          </Card>
        </Section>

        <Section title="Performance Analysis">
          <Card title="Pass/Fail Distribution">
            <Chart type="bar" series={mockData.charts[0].series} />
          </Card>
          <Card title="Trend Over Time">
            <Chart type="line" series={mockData.charts[1].series} />
          </Card>
        </Section>

        <Section title="Student Performance">
          <Card title="Student Scores">
            <DataTable
              columns={[
                { id: "name", label: "Student" },
                { id: "score", label: "Score", type: "number" }
              ]}
              rows={mockData.studentNames.map((name, index) => ({
                name,
                score: mockData.scores[index]
              }))}
              selectable
              stickyFirstColumn
            />
          </Card>
        </Section>

        <Section title="Next Steps">
          <Card title="Bulk Actions">
            <BulkActions actions={mockData.bulkActions} />
          </Card>
          <Card title="Saved Views">
            <SavedViews views={mockData.savedViews} />
          </Card>
        </Section>
      </main>

      <aside>
        <Section title="Filters">
          <FilterBar filters={mockData.filters} />
        </Section>
      </aside>
    </Page>
  );
}
