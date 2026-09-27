import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  DataTable,
  Status,
  Comparison,
  Delta,
  Button,
  BulkActions,
} from "@stoa/react";

export default function TestReviewScreen() {
  // Intent: Review the class test results and decide on instructional next steps
  // Information: Class average, distribution, individual student scores, pass/fail breakdown
  // Decision: Should we move forward, reteach, or provide targeted support?
  // Pattern: Review (class performance overview) + comparison (struggling vs proficient)

  const classData = {
    testName: "Unit 3: Fractions",
    date: "2026-09-27",
    passingScore: 70,
    classSize: 28,
    classAverage: 73,
    classAverageBasis: 65, // previous test
    passing: 21,
    failing: 7,
  };

  const studentResults = [
    // Struggling students (below 70)
    { id: "S001", name: "Alex Johnson", score: 52, status: "below" },
    { id: "S002", name: "Maria Garcia", score: 61, status: "below" },
    { id: "S003", name: "Jordan Lee", score: 65, status: "below" },
    { id: "S004", name: "Casey Williams", score: 58, status: "below" },
    { id: "S005", name: "Avery Brown", score: 68, status: "below" },
    { id: "S006", name: "Sam Rodriguez", score: 64, status: "below" },
    { id: "S007", name: "Taylor Martinez", score: 69, status: "below" },
    // Proficient students (70-85)
    { id: "S008", name: "Morgan Davis", score: 71, status: "passing" },
    { id: "S009", name: "Chris Anderson", score: 74, status: "passing" },
    { id: "S010", name: "Riley Taylor", score: 76, status: "passing" },
    { id: "S011", name: "Blake Thompson", score: 73, status: "passing" },
    { id: "S012", name: "Jamie Jackson", score: 75, status: "passing" },
    { id: "S013", name: "Quinn Martin", score: 77, status: "passing" },
    { id: "S014", name: "Dana White", score: 72, status: "passing" },
    { id: "S015", name: "River Harris", score: 78, status: "passing" },
    { id: "S016", name: "Skyler Martin", score: 74, status: "passing" },
    { id: "S017", name: "Reese Clark", score: 70, status: "passing" },
    { id: "S018", name: "Cameron Lewis", score: 75, status: "passing" },
    { id: "S019", name: "Alex Miller", score: 73, status: "passing" },
    { id: "S020", name: "Casey Young", score: 76, status: "passing" },
    { id: "S021", name: "Jesse King", score: 71, status: "passing" },
    // Advanced students (above 85)
    { id: "S022", name: "Jordan Wright", score: 88, status: "advanced" },
    { id: "S023", name: "Avery Lopez", score: 92, status: "advanced" },
    { id: "S024", name: "Morgan Hall", score: 87, status: "advanced" },
    { id: "S025", name: "Casey Allen", score: 94, status: "advanced" },
    { id: "S026", name: "Sam Young", score: 89, status: "advanced" },
    { id: "S027", name: "Riley Scott", score: 91, status: "advanced" },
    { id: "S028", name: "Skyler Green", score: 93, status: "advanced" },
  ];

  const strugglingStudents = studentResults.filter((s) => s.score < 70);
  const passingStudents = studentResults.filter(
    (s) => s.score >= 70 && s.score < 85
  );
  const advancedStudents = studentResults.filter((s) => s.score >= 85);

  const columns = [
    { id: "name", label: "Student Name" },
    { id: "score", label: "Score", align: "right" },
    { id: "status", label: "Performance Level" },
  ];

  const rows = studentResults.map((student) => ({
    id: student.id,
    name: student.name,
    score: `${student.score}%`,
    status: (
      <Status
        tone={
          student.score < 70
            ? "critical"
            : student.score >= 85
              ? "positive"
              : "neutral"
        }
        label={
          student.score < 70
            ? "Below Passing"
            : student.score >= 85
              ? "Advanced"
              : "Proficient"
        }
      />
    ),
  }));

  const comparisonMetrics = [
    { label: "Average Score", id: "average" },
    { label: "Passing Rate", id: "passRate" },
    { label: "Student Count", id: "count" },
  ];

  const comparisonEntities = [
    {
      name: "Below Passing (Need Intervention)",
      metrics: {
        average: { value: 62, basis: 70 },
        passRate: { value: 0, basis: 100 },
        count: { value: strugglingStudents.length },
      },
    },
    {
      name: "Proficient (On Track)",
      metrics: {
        average: { value: 74, basis: 70 },
        passRate: { value: 100, basis: 100 },
        count: { value: passingStudents.length },
      },
    },
    {
      name: "Advanced (Ready to Extend)",
      metrics: {
        average: { value: 91, basis: 70 },
        passRate: { value: 100, basis: 100 },
        count: { value: advancedStudents.length },
      },
    },
  ];

  return (
    <Page title="Test Review & Next Steps">
      <Header
        title={classData.testName}
        subtitle={`Class of ${classData.classSize} students, marked on ${classData.date}`}
      />

      <Section title="Class Summary">
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <Metric label="Class Average" value={classData.classAverage} unit="%" />
          <Metric
            label="Passing Students"
            value={classData.passing}
            delta={
              <Delta
                value={classData.passing - classData.classSize / 2}
                basis={classData.classSize}
              />
            }
          />
          <Metric label="Below Passing" value={classData.failing} unit="students" />
        </div>
      </Section>

      <Section title="Performance Groups">
        <Comparison entities={comparisonEntities} metrics={comparisonMetrics} />
      </Section>

      <Section title="Individual Results">
        <Card title={`Struggling Students (${strugglingStudents.length})`}>
          <DataTable
            columns={columns}
            rows={rows.filter((r) =>
              strugglingStudents.map((s) => s.id).includes(r.id)
            )}
            selectable
          />
          <p style={{ marginTop: "16px", fontSize: "14px" }}>
            These students scored below the passing threshold. Consider small
            group reteaching or one-on-one support.
          </p>
        </Card>

        <Card
          title={`Proficient Students (${passingStudents.length})`}
          style={{ marginTop: "24px" }}
        >
          <DataTable
            columns={columns}
            rows={rows.filter((r) =>
              passingStudents.map((s) => s.id).includes(r.id)
            )}
          />
        </Card>

        <Card
          title={`Advanced Students (${advancedStudents.length})`}
          style={{ marginTop: "24px" }}
        >
          <DataTable
            columns={columns}
            rows={rows.filter((r) =>
              advancedStudents.map((s) => s.id).includes(r.id)
            )}
          />
          <p style={{ marginTop: "16px", fontSize: "14px" }}>
            These students have demonstrated mastery. Consider extension
            activities or enrichment opportunities.
          </p>
        </Card>
      </Section>

      <Section title="Next Steps">
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button label="Plan Intervention Groups" />
          <Button label="Assign Differentiated Practice" />
          <Button label="Move Forward to Unit 4" />
          <Button label="Assign Review Homework" />
        </div>
      </Section>
    </Page>
  );
}
