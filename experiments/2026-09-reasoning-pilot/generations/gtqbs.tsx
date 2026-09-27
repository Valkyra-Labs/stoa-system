// Goal: let the teacher see at a glance how the whole class did on the unit
// test, see which questions and standards the class struggled with, and then
// act on individual students, all without leaving the screen. Layout puts
// the whole-class read (headline numbers, score distribution, trend against
// past tests) at the top, question-level results directly under it since
// that is what points at what to reteach, and the full, filterable student
// roster with bulk actions last, where the teacher decides what to do next
// for individual students.

import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Trend,
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
  { band: "90-100", count: 5 },
  { band: "80-89", count: 9 },
  { band: "70-79", count: 7 },
  { band: "60-69", count: 4 },
  { band: "Below 60", count: 3 },
];

const averageTrend = [
  { label: "Unit 1", value: 72 },
  { label: "Unit 2", value: 75 },
  { label: "Unit 3", value: 74 },
  { label: "Unit 4", value: 77 },
];

const questionColumns = [
  { key: "question", label: "Question" },
  { key: "standard", label: "Standard" },
  { key: "correct", label: "% correct" },
  { key: "status", label: "Status" },
];

const questionRows = [
  { question: "Q1", standard: "Writing linear equations", correct: "92%", status: <Status tone="success" label="Solid" /> },
  { question: "Q2", standard: "Writing linear equations", correct: "88%", status: <Status tone="success" label="Solid" /> },
  { question: "Q3", standard: "Slope-intercept form", correct: "81%", status: <Status tone="success" label="Solid" /> },
  { question: "Q4", standard: "Slope-intercept form", correct: "76%", status: <Status tone="warning" label="Review" /> },
  { question: "Q5", standard: "Graphing inequalities", correct: "54%", status: <Status tone="critical" label="Reteach" /> },
  { question: "Q6", standard: "Graphing inequalities", correct: "61%", status: <Status tone="critical" label="Reteach" /> },
  { question: "Q7", standard: "Solving systems (substitution)", correct: "71%", status: <Status tone="warning" label="Review" /> },
  { question: "Q8", standard: "Solving systems (substitution)", correct: "68%", status: <Status tone="warning" label="Review" /> },
  { question: "Q9", standard: "Solving systems (elimination)", correct: "84%", status: <Status tone="success" label="Solid" /> },
  { question: "Q10", standard: "Interpreting slope in context", correct: "58%", status: <Status tone="critical" label="Reteach" /> },
  { question: "Q11", standard: "Interpreting slope in context", correct: "73%", status: <Status tone="warning" label="Review" /> },
  { question: "Q12", standard: "Mixed review", correct: "89%", status: <Status tone="success" label="Solid" /> },
];

const studentColumns = [
  { key: "name", label: "Student" },
  { key: "score", label: "Score" },
  { key: "grade", label: "Grade" },
  { key: "standardsMissed", label: "Standards missed" },
  { key: "status", label: "Status" },
];

const studentRows = [
  { name: "Ava Thompson", score: "96%", grade: "A", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Emma Garcia", score: "94%", grade: "A", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Liam Chen", score: "93%", grade: "A", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Noah Patel", score: "91%", grade: "A", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Olivia Kim", score: "90%", grade: "A", standardsMissed: "Graphing inequalities", status: <Status tone="success" label="On track" /> },
  { name: "Mason Lee", score: "88%", grade: "B", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Sophia Nguyen", score: "87%", grade: "B", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Ethan Brooks", score: "86%", grade: "B", standardsMissed: "Graphing inequalities", status: <Status tone="success" label="On track" /> },
  { name: "Isabella Rossi", score: "85%", grade: "B", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Lucas Martin", score: "84%", grade: "B", standardsMissed: "Interpreting slope in context", status: <Status tone="success" label="On track" /> },
  { name: "Mia Alvarez", score: "83%", grade: "B", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Jackson Wright", score: "82%", grade: "B", standardsMissed: "Solving systems (substitution)", status: <Status tone="success" label="On track" /> },
  { name: "Amelia Suzuki", score: "81%", grade: "B", standardsMissed: "—", status: <Status tone="success" label="On track" /> },
  { name: "Aiden Cole", score: "80%", grade: "B", standardsMissed: "Graphing inequalities", status: <Status tone="success" label="On track" /> },
  { name: "Harper Diaz", score: "79%", grade: "C", standardsMissed: "Graphing inequalities", status: <Status tone="warning" label="Watch" /> },
  { name: "Benjamin Fox", score: "78%", grade: "C", standardsMissed: "Interpreting slope in context", status: <Status tone="warning" label="Watch" /> },
  { name: "Evelyn Osei", score: "77%", grade: "C", standardsMissed: "Solving systems (substitution)", status: <Status tone="warning" label="Watch" /> },
  { name: "Elijah Novak", score: "76%", grade: "C", standardsMissed: "Graphing inequalities, Interpreting slope in context", status: <Status tone="warning" label="Watch" /> },
  { name: "Abigail Reyes", score: "75%", grade: "C", standardsMissed: "Interpreting slope in context", status: <Status tone="warning" label="Watch" /> },
  { name: "Logan Park", score: "74%", grade: "C", standardsMissed: "Graphing inequalities", status: <Status tone="warning" label="Watch" /> },
  { name: "Emily Santos", score: "73%", grade: "C", standardsMissed: "Solving systems (substitution), Interpreting slope in context", status: <Status tone="warning" label="Watch" /> },
  { name: "Jacob Turner", score: "69%", grade: "D", standardsMissed: "Graphing inequalities, Solving systems (substitution)", status: <Status tone="critical" label="Needs support" /> },
  { name: "Ella Whitfield", score: "66%", grade: "D", standardsMissed: "Graphing inequalities, Interpreting slope in context", status: <Status tone="critical" label="Needs support" /> },
  { name: "Michael Duncan", score: "64%", grade: "D", standardsMissed: "Solving systems (substitution), Interpreting slope in context", status: <Status tone="critical" label="Needs support" /> },
  { name: "Avery Singh", score: "61%", grade: "D", standardsMissed: "Graphing inequalities, Solving systems (substitution)", status: <Status tone="critical" label="Needs support" /> },
  { name: "Daniel Ross", score: "58%", grade: "F", standardsMissed: "Graphing inequalities, Solving systems (substitution), Interpreting slope in context", status: <Status tone="critical" label="Needs support" /> },
  { name: "Scarlett Meyer", score: "52%", grade: "F", standardsMissed: "Graphing inequalities, Solving systems (substitution), Interpreting slope in context", status: <Status tone="critical" label="Needs support" /> },
  { name: "Matthew Ibrahim", score: "45%", grade: "F", standardsMissed: "Graphing inequalities, Solving systems (substitution), Interpreting slope in context", status: <Status tone="critical" label="Needs support" /> },
];

const filters = [
  { label: "Score band", options: ["All", "90-100", "80-89", "70-79", "60-69", "Below 60"] },
  { label: "Status", options: ["All", "On track", "Watch", "Needs support"] },
  { label: "Standard missed", options: ["All", "Graphing inequalities", "Solving systems (substitution)", "Interpreting slope in context", "Slope-intercept form"] },
];

const savedViews = [
  { label: "Needs support (7)" },
  { label: "Watch (7)" },
  { label: "On track (14)" },
  { label: "All students (28)" },
];

const bulkActions = [
  { label: "Assign reteach practice", onPress: () => {} },
  { label: "Schedule retest", onPress: () => {} },
  { label: "Send note home", onPress: () => {} },
];

export default function UnitTestReview() {
  return (
    <Page title="Unit 4 Test Review">
      <Header
        title="Algebra I, Period 3"
        subtitle="Unit 4: Linear Systems - 28 students - graded September 25, 2026"
        actions={[
          <Status tone="success" label="Grading complete" />,
          <Button label="Export report" variant="secondary" onPress={() => {}} />,
          <Button label="Message parents" onPress={() => {}} />,
        ]}
      />

      <Section title="Class overview">
        <Dashboard
          metrics={[
            <Metric label="Class average" value="77%" delta={{ value: "+3", basis: "vs. Unit 3 (74%)" }} />,
            <Metric label="Median score" value="80%" />,
            <Metric label="Passed (70%+)" value="21 / 28" />,
            <Metric label="Below proficiency" value="7" delta={{ value: "+2", basis: "vs. Unit 3 (5 students)" }} />,
          ]}
          charts={[
            <Card title="Score distribution">
              <Chart type="bar" series={scoreDistribution} x="band" y="count" />
            </Card>,
            <Card title="Class average, last four unit tests">
              <Trend series={averageTrend} />
            </Card>,
          ]}
          table={
            <Card title="Question-level results">
              <p>Weakest standards this unit: graphing inequalities and interpreting slope in context.</p>
              <DataTable columns={questionColumns} rows={questionRows} />
            </Card>
          }
        />
      </Section>

      <Section title="Students">
        <FilterBar filters={filters} />
        <SavedViews views={savedViews} />
        <Card title="Class roster">
          <DataTable
            columns={studentColumns}
            rows={studentRows}
            selectable
            stickyFirstColumn
            onRowSelect={() => {}}
          />
          <BulkActions actions={bulkActions} />
        </Card>
      </Section>
    </Page>
  );
}
