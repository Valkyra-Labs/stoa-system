import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Chart,
  DataTable,
  Status,
  Button,
  BulkActions,
  Tabs,
  Delta,
} from "@stoa/react";

const studentResults = [
  { id: "s001", name: "Alice Johnson", score: 92, status: "excellent", timeSpent: "18 min" },
  { id: "s002", name: "Bob Smith", score: 78, status: "pass", timeSpent: "22 min" },
  { id: "s003", name: "Carol White", score: 88, status: "excellent", timeSpent: "20 min" },
  { id: "s004", name: "David Chen", score: 65, status: "needs_review", timeSpent: "25 min" },
  { id: "s005", name: "Emma Davis", score: 85, status: "pass", timeSpent: "19 min" },
  { id: "s006", name: "Frank Miller", score: 72, status: "needs_review", timeSpent: "28 min" },
  { id: "s007", name: "Grace Lee", score: 95, status: "excellent", timeSpent: "17 min" },
  { id: "s008", name: "Henry Brown", score: 81, status: "pass", timeSpent: "21 min" },
  { id: "s009", name: "Iris Martinez", score: 58, status: "needs_review", timeSpent: "30 min" },
  { id: "s010", name: "Jack Taylor", score: 89, status: "excellent", timeSpent: "19 min" },
  { id: "s011", name: "Karen Wilson", score: 76, status: "pass", timeSpent: "23 min" },
  { id: "s012", name: "Leo Anderson", score: 68, status: "needs_review", timeSpent: "26 min" },
  { id: "s013", name: "Maya Patel", score: 93, status: "excellent", timeSpent: "18 min" },
  { id: "s014", name: "Noah Thomas", score: 79, status: "pass", timeSpent: "22 min" },
  { id: "s015", name: "Olivia Garcia", score: 86, status: "pass", timeSpent: "20 min" },
  { id: "s016", name: "Paul Jackson", score: 61, status: "needs_review", timeSpent: "29 min" },
  { id: "s017", name: "Quinn Roberts", score: 91, status: "excellent", timeSpent: "17 min" },
  { id: "s018", name: "Rachel Green", score: 83, status: "pass", timeSpent: "21 min" },
  { id: "s019", name: "Sam Harris", score: 74, status: "needs_review", timeSpent: "24 min" },
  { id: "s020", name: "Tina Clark", score: 87, status: "excellent", timeSpent: "19 min" },
  { id: "s021", name: "Uma Lewis", score: 80, status: "pass", timeSpent: "22 min" },
  { id: "s022", name: "Victor Martin", score: 66, status: "needs_review", timeSpent: "27 min" },
  { id: "s023", name: "Wendy Scott", score: 90, status: "excellent", timeSpent: "18 min" },
  { id: "s024", name: "Xavier Moore", score: 77, status: "pass", timeSpent: "23 min" },
  { id: "s025", name: "Yara Knight", score: 84, status: "pass", timeSpent: "21 min" },
  { id: "s026", name: "Zoe Hill", score: 94, status: "excellent", timeSpent: "16 min" },
  { id: "s027", name: "Adam Cole", score: 75, status: "pass", timeSpent: "24 min" },
  { id: "s028", name: "Bella Ross", score: 70, status: "needs_review", timeSpent: "25 min" },
];

const scoreDistribution = [
  { range: "90-100", count: 6, fill: "excellent" },
  { range: "80-89", count: 8, fill: "pass" },
  { range: "70-79", count: 8, fill: "pass" },
  { range: "60-69", count: 5, fill: "needs_review" },
  { range: "<60", count: 1, fill: "needs_review" },
];

export default function UnitTestReview() {
  const classAverage = Math.round(
    studentResults.reduce((sum, s) => sum + s.score, 0) / studentResults.length
  );
  const passCount = studentResults.filter((s) => s.score >= 70).length;
  const excellentCount = studentResults.filter((s) => s.score >= 85).length;
  const needsReviewCount = studentResults.filter((s) => s.score < 70).length;

  const columns = [
    { key: "name", label: "Student Name", sortable: true },
    { key: "score", label: "Score", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "timeSpent", label: "Time Spent", sortable: false },
  ];

  const rows = studentResults.map((student) => ({
    ...student,
    status: (
      <Status
        tone={
          student.score >= 85
            ? "success"
            : student.score >= 70
              ? "neutral"
              : "warning"
        }
        label={
          student.score >= 85
            ? "Excellent"
            : student.score >= 70
              ? "Pass"
              : "Needs Review"
        }
      />
    ),
  }));

  const nextSteps =
    needsReviewCount > 0
      ? `Schedule 1-on-1 sessions with ${needsReviewCount} students who scored below 70`
      : "Class is ready to move forward";

  return (
    <Page title="Unit Test Results">
      <Header
        title="Unit Test Results"
        subtitle="Advanced Algebra - Period 4"
        actions={[
          <Button label="Export Report" variant="secondary" />,
          <Button label="Send Feedback" variant="primary" />,
        ]}
      />

      <Section title="Class Overview">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          <Metric label="Class Average" value={classAverage} unit="%" />
          <Metric label="Pass Rate" value={`${passCount}/28`} />
          <Metric label="Excellent" value={excellentCount} />
          <Metric label="Needs Review" value={needsReviewCount} />
        </div>
      </Section>

      <Tabs
        items={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div style={{ paddingTop: "16px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <h3>Score Distribution</h3>
                  <Chart
                    type="bar"
                    series={[
                      {
                        name: "Count",
                        data: scoreDistribution.map((d) => d.count),
                      },
                    ]}
                    x={{ categories: scoreDistribution.map((d) => d.range) }}
                    y={{ label: "Number of Students" }}
                  />
                </div>
                <Card title="Next Steps" children={<p>{nextSteps}</p>} />
              </div>
            ),
          },
          {
            id: "results",
            label: "Individual Results",
            content: (
              <div style={{ paddingTop: "16px" }}>
                <DataTable
                  columns={columns}
                  rows={rows}
                  selectable={true}
                  stickyFirstColumn={true}
                />
                <div style={{ marginTop: "16px" }}>
                  <BulkActions
                    actions={[
                      { label: "Send to Selected", variant: "primary" },
                      { label: "Flag for Review", variant: "secondary" },
                    ]}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
    </Page>
  );
}
