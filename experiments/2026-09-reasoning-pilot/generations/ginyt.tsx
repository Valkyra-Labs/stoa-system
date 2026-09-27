// Goal: let a teacher who just marked a 28-student unit test see, in one
// glance, how the class did as a whole, then move straight to the two
// decisions that follow from that: which questions need reteaching, and
// which students need individual follow-up. The layout puts the
// class-wide summary (average, distribution, pass rate) at the top since
// it frames everything else, the question-by-question breakdown next
// because it drives whole-class reteaching decisions, and the full
// student roster last as the place to filter, spot decliners, and act on
// individuals via bulk actions.
import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Chart,
  DataTable,
  FilterBar,
  BulkActions,
  Status,
  Button,
} from "@stoa/react";

const scoreDistribution = [
  { band: "90-100", students: 6 },
  { band: "80-89", students: 6 },
  { band: "70-79", students: 6 },
  { band: "60-69", students: 6 },
  { band: "Below 60", students: 4 },
];

const questionBreakdown = {
  columns: [
    { key: "question", label: "Question" },
    { key: "topic", label: "Topic" },
    { key: "correct", label: "Class correct" },
    { key: "status", label: "Status" },
  ],
  rows: [
    { question: "Q1", topic: "Linear equations", correct: "93%", status: "Strong" },
    { question: "Q2", topic: "Systems of equations", correct: "79%", status: "Solid" },
    { question: "Q3", topic: "Quadratic factoring", correct: "54%", status: "Reteach" },
    { question: "Q4", topic: "Graphing parabolas", correct: "61%", status: "Reteach" },
    { question: "Q5", topic: "Word problems: rate", correct: "71%", status: "Solid" },
    { question: "Q6", topic: "Exponent rules", correct: "88%", status: "Strong" },
    { question: "Q7", topic: "Polynomial simplification", correct: "68%", status: "Watch" },
    { question: "Q8", topic: "Word problems: mixture", correct: "49%", status: "Reteach" },
  ],
};

const students = {
  columns: [
    { key: "name", label: "Student" },
    { key: "score", label: "Score" },
    { key: "grade", label: "Grade" },
    { key: "status", label: "Status" },
    { key: "change", label: "Change vs Unit 3" },
  ],
  rows: [
    { name: "Ava Thompson", score: 96, grade: "A", status: "Exceeds", change: "+3" },
    { name: "Liam Brooks", score: 58, grade: "F", status: "Far below", change: "-12" },
    { name: "Sophia Chen", score: 84, grade: "B", status: "Proficient", change: "+2" },
    { name: "Noah Martinez", score: 72, grade: "C", status: "Approaching", change: "-4" },
    { name: "Isabella Wright", score: 91, grade: "A", status: "Exceeds", change: "+5" },
    { name: "Mason Lee", score: 45, grade: "F", status: "Far below", change: "-18" },
    { name: "Mia Patel", score: 88, grade: "B", status: "Proficient", change: "+1" },
    { name: "Ethan Davis", score: 63, grade: "D", status: "Below", change: "-9" },
    { name: "Amelia Kim", score: 79, grade: "C", status: "Approaching", change: "+6" },
    { name: "Lucas Garcia", score: 95, grade: "A", status: "Exceeds", change: "+4" },
    { name: "Harper Nguyen", score: 67, grade: "D", status: "Below", change: "-6" },
    { name: "Benjamin Scott", score: 82, grade: "B", status: "Proficient", change: "0" },
    { name: "Evelyn Torres", score: 55, grade: "F", status: "Far below", change: "-14" },
    { name: "James Rivera", score: 90, grade: "A", status: "Exceeds", change: "+7" },
    { name: "Charlotte Bell", score: 73, grade: "C", status: "Approaching", change: "-2" },
    { name: "Alexander Cruz", score: 61, grade: "D", status: "Below", change: "-10" },
    { name: "Abigail Foster", score: 87, grade: "B", status: "Proficient", change: "+3" },
    { name: "Daniel Reyes", score: 76, grade: "C", status: "Approaching", change: "+1" },
    { name: "Emily Sanders", score: 99, grade: "A", status: "Exceeds", change: "+2" },
    { name: "Matthew Ward", score: 69, grade: "D", status: "Below", change: "-5" },
    { name: "Elizabeth Fox", score: 81, grade: "B", status: "Proficient", change: "+4" },
    { name: "Jackson Price", score: 52, grade: "F", status: "Far below", change: "-16" },
    { name: "Sofia Ramirez", score: 93, grade: "A", status: "Exceeds", change: "+6" },
    { name: "Michael Hayes", score: 74, grade: "C", status: "Approaching", change: "-3" },
    { name: "Avery Coleman", score: 65, grade: "D", status: "Below", change: "-8" },
    { name: "Ella Simmons", score: 85, grade: "B", status: "Proficient", change: "+2" },
    { name: "Sebastian Ortiz", score: 78, grade: "C", status: "Approaching", change: "+5" },
    { name: "Grace Bennett", score: 60, grade: "D", status: "Below", change: "-11" },
  ],
};

const rosterFilters = [
  {
    label: "Status",
    options: ["All", "Exceeds", "Proficient", "Approaching", "Below", "Far below"],
  },
  {
    label: "Change vs Unit 3",
    options: ["All", "Improved", "Unchanged", "Declined 1-9 pts", "Declined 10+ pts"],
  },
];

const rosterBulkActions = [
  { label: "Email guardians", onPress: () => {} },
  { label: "Add to intervention group", onPress: () => {} },
  { label: "Schedule retest", onPress: () => {} },
];

export default function UnitTestReviewPage() {
  return (
    <Page title="Unit 4 Test Review">
      <Header
        title="Unit 4 Test Review"
        subtitle="Algebra II, Period 3 - 28 students - Graded Sep 26, 2026"
        actions={[
          <Button label="Export results" onPress={() => {}} variant="secondary" />,
          <Button label="Share with department" onPress={() => {}} />,
        ]}
      />

      <Section title="Class performance">
        <Status tone="success" label="Grading complete" />
        <Card title="Summary">
          <Metric label="Class average" value={76} unit="%" delta={4} />
          <Metric label="Median score" value={77} unit="%" />
          <Metric label="Pass rate (70%+)" value={64} unit="%" />
          <Metric label="Below proficient" value={10} unit="students" />
        </Card>
        <Card title="Score distribution">
          <Chart type="bar" series={scoreDistribution} x="band" y="students" />
        </Card>
        <Card title="Compared to last unit">
          <Delta value={4} basis="vs Unit 3 average of 72%" />
        </Card>
      </Section>

      <Section title="Question-by-question breakdown">
        <Card title="Where the class struggled">
          <DataTable
            columns={questionBreakdown.columns}
            rows={questionBreakdown.rows}
          />
        </Card>
      </Section>

      <Section title="Students">
        <FilterBar filters={rosterFilters} />
        <DataTable
          columns={students.columns}
          rows={students.rows}
          selectable
          stickyFirstColumn
          onRowSelect={() => {}}
        />
        <BulkActions actions={rosterBulkActions} />
      </Section>
    </Page>
  );
}
