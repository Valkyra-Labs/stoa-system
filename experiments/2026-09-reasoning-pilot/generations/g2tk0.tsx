// Intent: Monitor class test performance and identify students needing intervention
// Information: All 28 student scores, class average, pass rate, score distribution, students below passing threshold
// Decision: Should we reteach, move forward, or provide targeted support based on performance patterns?
// Pattern: Monitor pattern—exceptions and action items first, then class health metrics and full data

import { Page, Header, Section, Card, DataTable, Metric, Delta, Chart, Status } from "@stoa/react";

export default function TestResultsReview() {
  const passingScore = 70;
  const classSize = 28;

  // Realistic test score data for 28 students
  const studentScores = [
    { id: "s001", name: "Alex Johnson", score: 92 },
    { id: "s002", name: "Bailey Chen", score: 88 },
    { id: "s003", name: "Casey Rodriguez", score: 85 },
    { id: "s004", name: "Devon Williams", score: 82 },
    { id: "s005", name: "Emma Davis", score: 80 },
    { id: "s006", name: "Falcon Martinez", score: 78 },
    { id: "s007", name: "Grace Lee", score: 76 },
    { id: "s008", name: "Henry Brown", score: 75 },
    { id: "s009", name: "Iris Taylor", score: 74 },
    { id: "s010", name: "Jack Anderson", score: 72 },
    { id: "s011", name: "Kelly Jackson", score: 71 },
    { id: "s012", name: "Liam White", score: 70 },
    { id: "s013", name: "Maya Harris", score: 68 },
    { id: "s014", name: "Noah Thompson", score: 66 },
    { id: "s015", name: "Olivia Garcia", score: 64 },
    { id: "s016", name: "Parker Moore", score: 62 },
    { id: "s017", name: "Quinn Martin", score: 60 },
    { id: "s018", name: "Riley Clark", score: 58 },
    { id: "s019", name: "Sam Lewis", score: 56 },
    { id: "s020", name: "Taylor Hall", score: 54 },
    { id: "s021", name: "Uma Scott", score: 52 },
    { id: "s022", name: "Victor Green", score: 50 },
    { id: "s023", name: "Wren Adams", score: 48 },
    { id: "s024", name: "Xavier Nelson", score: 46 },
    { id: "s025", name: "Yara Carter", score: 44 },
    { id: "s026", name: "Zain Mitchell", score: 42 },
    { id: "s027", name: "Amy Roberts", score: 40 },
    { id: "s028", name: "Blake Phillips", score: 38 },
  ];

  const scores = studentScores.map(s => s.score);
  const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const passed = scores.filter(s => s >= passingScore).length;
  const passRate = Math.round((passed / classSize) * 100);
  const below60 = scores.filter(s => s < 60).length;
  const previousAverage = 75; // basis for comparison
  const delta = average - previousAverage;

  // Sort by score ascending to show struggling students first
  const sortedStudents = [...studentScores].sort((a, b) => a.score - b.score);

  const tableRows = sortedStudents.map(student => ({
    id: student.id,
    name: student.name,
    score: student.score,
    status: student.score >= passingScore ? "pass" : student.score >= 60 ? "warning" : "fail",
  }));

  const scoreDistribution = [
    { range: "90-100", count: 1 },
    { range: "80-89", count: 3 },
    { range: "70-79", count: 6 },
    { range: "60-69", count: 7 },
    { range: "50-59", count: 7 },
    { range: "40-49", count: 4 },
  ];

  return (
    <Page title="Unit Test Results Review">
      <Header
        title="Unit Test Results: Quadratic Equations"
        subtitle="Class of 28 students | Completed today"
        actions={undefined}
      />

      <Section title="Class Performance Summary">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <Metric
            label="Class Average"
            value={average}
            unit="%"
            delta={delta > 0 ? { value: delta, basis: "previous unit" } : { value: delta, basis: "previous unit" }}
          />
          <Metric
            label="Pass Rate"
            value={passRate}
            unit="%"
            delta={{ value: passRate - 79, basis: "target 79%" }}
          />
          <Metric
            label="Students Passing"
            value={passed}
            unit={`of ${classSize}`}
          />
          <Metric
            label="Needs Intervention"
            value={below60}
            unit="students"
          />
        </div>
      </Section>

      <Section title="Score Distribution">
        <Chart
          type="bar"
          series={[{ id: "count", label: "Students", data: scoreDistribution.map(d => d.count) }]}
          x={{ key: "range", label: "Score Range" }}
          y={{ key: "count", label: "Number of Students" }}
        />
      </Section>

      <Section title="Students Needing Attention (Below 60%)">
        <Card>
          <DataTable
            columns={[
              { id: "name", label: "Student", type: "string" },
              { id: "score", label: "Score", type: "number", align: "right" },
              { id: "status", label: "Status", type: "string" },
            ]}
            rows={tableRows.filter(r => r.status === "fail").map(r => ({
              name: r.name,
              score: r.score,
              status: <Status tone={r.status === "fail" ? "error" : "warning"} label={r.score < 50 ? "Far Below" : "Below Passing"} />,
            }))}
            stickyFirstColumn={true}
          />
        </Card>
      </Section>

      <Section title="All Student Results">
        <Card>
          <DataTable
            columns={[
              { id: "name", label: "Student", type: "string" },
              { id: "score", label: "Score", type: "number", align: "right" },
              { id: "status", label: "Status", type: "string" },
            ]}
            rows={tableRows.map(r => ({
              name: r.name,
              score: r.score,
              status: r.score >= passingScore
                ? <Status tone="success" label="Pass" />
                : r.score >= 60
                ? <Status tone="warning" label="Low Pass" />
                : <Status tone="error" label="Fail" />,
            }))}
            stickyFirstColumn={true}
          />
        </Card>
      </Section>

      <Section title="Next Steps">
        <Card>
          <div>
            <p><strong>Class Health:</strong> {passRate >= 80 ? "On track—move forward" : passRate >= 70 ? "Review struggling students" : "Reteach recommended"}</p>
            <p><strong>Recommendation:</strong> {below60 > 7 ? "Reteach core concepts with full class, then provide targeted support to " + below60 + " students." : "Provide small-group intervention to " + below60 + " students while moving forward with class."}</p>
            <p><strong>Focus Areas:</strong> Review test items where more than 50% of the class scored below 70%.</p>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
