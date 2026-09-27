import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Chart,
  DataTable,
  Status,
  FilterBar,
  SavedViews,
  Button,
  BulkActions,
  Dashboard,
} from "@stoa/react";

const scoreDistribution = [
  { range: "90-100", students: 3 },
  { range: "80-89", students: 7 },
  { range: "70-79", students: 9 },
  { range: "60-69", students: 5 },
  { range: "50-59", students: 2 },
  { range: "Below 50", students: 2 },
];

const unitTrend = [
  { unit: "Unit 1", average: 78 },
  { unit: "Unit 2", average: 76 },
  { unit: "Unit 3", average: 77 },
  { unit: "Unit 4", average: 73 },
];

const questionAccuracy = [
  { question: "Q1", correctRate: 93 },
  { question: "Q2", correctRate: 89 },
  { question: "Q3", correctRate: 85 },
  { question: "Q4", correctRate: 80 },
  { question: "Q5", correctRate: 82 },
  { question: "Q6", correctRate: 46 },
  { question: "Q7", correctRate: 75 },
  { question: "Q8", correctRate: 88 },
  { question: "Q9", correctRate: 52 },
  { question: "Q10", correctRate: 79 },
];

function statusForScore(score: number) {
  if (score >= 90) return <Status tone="success" label="Excelling" />;
  if (score >= 70) return <Status tone="info" label="On track" />;
  if (score >= 60) return <Status tone="warning" label="Watch" />;
  return <Status tone="danger" label="Needs support" />;
}

function gradeForScore(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const rawScores: { name: string; score: number; missed: string }[] = [
  { name: "Ava Thompson", score: 96, missed: "None" },
  { name: "Liam Chen", score: 92, missed: "Q9" },
  { name: "Sofia Ramirez", score: 90, missed: "Q6" },
  { name: "Noah Patel", score: 88, missed: "Q6, Q9" },
  { name: "Emma Johnson", score: 87, missed: "Q4, Q9" },
  { name: "Mason Kim", score: 85, missed: "Q6, Q10" },
  { name: "Olivia Garcia", score: 83, missed: "Q6, Q9" },
  { name: "Ethan Nguyen", score: 82, missed: "Q5, Q6" },
  { name: "Isabella Rossi", score: 81, missed: "Q6, Q9" },
  { name: "Lucas Martin", score: 80, missed: "Q6, Q7, Q9" },
  { name: "Mia Williams", score: 79, missed: "Q4, Q6, Q9" },
  { name: "Aiden Brooks", score: 78, missed: "Q6, Q9, Q10" },
  { name: "Charlotte Davis", score: 77, missed: "Q3, Q6, Q9" },
  { name: "Elijah Wright", score: 76, missed: "Q6, Q7, Q9" },
  { name: "Amelia Scott", score: 75, missed: "Q5, Q6, Q9" },
  { name: "James Rivera", score: 74, missed: "Q6, Q8, Q9" },
  { name: "Harper Bennett", score: 73, missed: "Q4, Q6, Q9, Q10" },
  { name: "Benjamin Ortiz", score: 72, missed: "Q2, Q6, Q9" },
  { name: "Ella Foster", score: 70, missed: "Q6, Q7, Q9, Q10" },
  { name: "Lucas Meyer", score: 68, missed: "Q3, Q6, Q7, Q9" },
  { name: "Grace Coleman", score: 66, missed: "Q4, Q6, Q9, Q10" },
  { name: "Henry Diaz", score: 64, missed: "Q1, Q6, Q7, Q9" },
  { name: "Chloe Barnes", score: 62, missed: "Q4, Q5, Q6, Q9" },
  { name: "Jack Sullivan", score: 60, missed: "Q3, Q6, Q7, Q9, Q10" },
  { name: "Zoey Fisher", score: 58, missed: "Q2, Q4, Q6, Q9, Q10" },
  { name: "Owen Reed", score: 52, missed: "Q3, Q5, Q6, Q7, Q9" },
  { name: "Layla Morgan", score: 46, missed: "Q1, Q4, Q6, Q7, Q9, Q10" },
  { name: "Carter Hughes", score: 38, missed: "Q2, Q3, Q6, Q7, Q9, Q10" },
];

const studentColumns = [
  { key: "name", label: "Student" },
  { key: "score", label: "Score" },
  { key: "grade", label: "Grade" },
  { key: "missed", label: "Questions missed" },
  { key: "status", label: "Status" },
];

const studentRows = rawScores.map((s) => ({
  name: s.name,
  score: `${s.score}%`,
  grade: gradeForScore(s.score),
  missed: s.missed,
  status: statusForScore(s.score),
}));

const followUpColumns = [
  { key: "name", label: "Student" },
  { key: "score", label: "Score" },
  { key: "missed", label: "Questions missed" },
  { key: "status", label: "Status" },
];

const followUpRows = rawScores
  .filter((s) => s.score < 70)
  .map((s) => ({
    name: s.name,
    score: `${s.score}%`,
    missed: s.missed,
    status: statusForScore(s.score),
  }));

export default function UnitTestReviewPage() {
  return (
    <Page title="Unit 4 Test Review">
      <Header
        title="Unit 4 Test — Linear Equations"
        subtitle="Period 3 Algebra I · 28 students · Graded Sep 26, 2026"
        actions={
          <>
            <Button label="Export grades" variant="secondary" onPress={() => {}} />
            <Button label="Message parents" variant="primary" onPress={() => {}} />
          </>
        }
      />

      <Section title="Class performance">
        <Dashboard
          metrics={[
            <Metric
              key="average"
              label="Class average"
              value="73%"
              delta={<Delta value={-4} basis="vs Unit 3" />}
            />,
            <Metric key="median" label="Median score" value="76%" />,
            <Metric key="passing" label="Passing (70%+)" value="19 / 28" />,
            <Metric key="lowest" label="Lowest score" value="38%" />,
          ]}
          charts={[
            <Chart
              key="distribution"
              type="bar"
              series={scoreDistribution}
              x="range"
              y="students"
            />,
            <Chart key="trend" type="line" series={unitTrend} x="unit" y="average" />,
          ]}
          table={
            <DataTable
              columns={studentColumns}
              rows={studentRows}
              selectable
              stickyFirstColumn
              onRowSelect={() => {}}
            />
          }
        />
      </Section>

      <Section title="Where the class struggled">
        <Card title="Per-question accuracy">
          <Chart type="bar" series={questionAccuracy} x="question" y="correctRate" />
          <p>
            Question 6 and Question 9 (isolating a variable on both sides of the
            equation) had the lowest accuracy in the class, well below every other
            item on the test.
          </p>
        </Card>
      </Section>

      <Section title="Students to follow up with">
        <FilterBar
          filters={[
            { id: "scoreRange", label: "Score range", type: "range", min: 0, max: 100 },
            {
              id: "status",
              label: "Status",
              type: "select",
              options: ["Needs support", "Watch", "On track", "Excelling"],
            },
          ]}
        />
        <SavedViews
          views={[
            { id: "below70", label: "Below 70%" },
            { id: "missedQ6Q9", label: "Missed Q6 and Q9" },
            { id: "allStudents", label: "All students" },
          ]}
        />
        <DataTable
          columns={followUpColumns}
          rows={followUpRows}
          selectable
          stickyFirstColumn
          onRowSelect={() => {}}
        />
        <BulkActions
          actions={[
            { id: "assign", label: "Assign remediation packet", onPress: () => {} },
            { id: "email", label: "Email parents", onPress: () => {} },
            { id: "schedule", label: "Schedule 1:1 review", onPress: () => {} },
          ]}
        />
      </Section>
    </Page>
  );
}
