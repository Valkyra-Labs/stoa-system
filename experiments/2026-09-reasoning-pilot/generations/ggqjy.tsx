// Intent: investigate - the teacher just marked a unit test and needs to find
//   which topics caused the class's misses and which students need support,
//   in order to decide what to reteach and who to follow up with.
// Information: 28 students with their score, delta against the class average
//   and the 70% passing threshold, and their weakest topic; the 10 test
//   questions with class-wide % correct against an 80% mastery target and
//   the topic each question covers; for the student currently drilled into,
//   their per-question points and their score trend across recent unit tests.
// Decision: which topics to reteach to the whole class (evidenced by the
//   question breakdown), and which individual students to flag for a
//   small-group reteach or a retest (evidenced by score delta, weakest
//   topic, and whether the shortfall is new or a continuing trend).
// Pattern: Explorer (student roster with persistent filters, plus a detail
//   panel that stays open beside the list) for the per-student decision,
//   paired with a question-level table (exact comparison, so a table
//   rather than a chart) for the class-wide diagnosis that the reteach
//   decision rests on.

import {
  Page,
  Header,
  Section,
  Explorer,
  FilterBar,
  SavedViews,
  DataTable,
  BulkActions,
  Metric,
  Delta,
  Status,
  Trend,
  Button,
} from "@stoa/react";

const CLASS_AVERAGE = 78;
const PASSING_THRESHOLD = 70;
const MASTERY_TARGET = 80;

function statusFor(score: number) {
  if (score < PASSING_THRESHOLD) {
    return { tone: "negative" as const, label: "Below threshold" };
  }
  if (score < 80) {
    return { tone: "warning" as const, label: "Approaching mastery" };
  }
  return { tone: "positive" as const, label: "On track" };
}

const students = [
  { id: "s01", name: "Marcus Webb", score: 58, topic: "Systems of equations word problems" },
  { id: "s02", name: "Aaliyah Chen", score: 62, topic: "Systems of equations word problems" },
  { id: "s03", name: "Devon Price", score: 64, topic: "Systems of equations word problems" },
  { id: "s04", name: "Sofia Martins", score: 66, topic: "Systems of equations word problems" },
  { id: "s05", name: "Ethan Cole", score: 68, topic: "Systems of equations word problems" },
  { id: "s06", name: "Priya Nair", score: 69, topic: "Multi-step equations" },
  { id: "s07", name: "Jayden Brooks", score: 70, topic: "Systems of equations word problems" },
  { id: "s08", name: "Lucia Fernandez", score: 71, topic: "Slope-intercept form" },
  { id: "s09", name: "Omar Haddad", score: 72, topic: "Graphing linear equations" },
  { id: "s10", name: "Grace Kim", score: 73, topic: "Multi-step equations" },
  { id: "s11", name: "Tyler Reeves", score: 74, topic: "Systems of equations word problems" },
  { id: "s12", name: "Amara Johnson", score: 75, topic: "Slope-intercept form" },
  { id: "s13", name: "Noah Bennett", score: 76, topic: "Graphing linear equations" },
  { id: "s14", name: "Isabella Ruiz", score: 77, topic: "Multi-step equations" },
  { id: "s15", name: "Caleb Osei", score: 78, topic: "Slope-intercept form" },
  { id: "s16", name: "Mei Lin Tan", score: 79, topic: "Graphing linear equations" },
  { id: "s17", name: "Diego Alvarez", score: 80, topic: "None" },
  { id: "s18", name: "Harper Douglas", score: 81, topic: "None" },
  { id: "s19", name: "Zainab Ali", score: 82, topic: "None" },
  { id: "s20", name: "Connor Walsh", score: 83, topic: "None" },
  { id: "s21", name: "Fatima Siddiqui", score: 84, topic: "None" },
  { id: "s22", name: "Jamal Carter", score: 85, topic: "None" },
  { id: "s23", name: "Riley Thompson", score: 86, topic: "None" },
  { id: "s24", name: "Sara Novak", score: 88, topic: "None" },
  { id: "s25", name: "Leo Andersson", score: 90, topic: "None" },
  { id: "s26", name: "Ingrid Haas", score: 92, topic: "None" },
  { id: "s27", name: "Kwame Asante", score: 94, topic: "None" },
  { id: "s28", name: "Yuki Tanaka", score: 96, topic: "None" },
].sort((a, b) => a.score - b.score);

const belowThreshold = students.filter((s) => s.score < PASSING_THRESHOLD);

const questionBreakdown = [
  { id: "q9", question: "Q9 - Systems word problem A", topic: "Systems of equations word problems", correctPct: 43 },
  { id: "q10", question: "Q10 - Systems word problem B", topic: "Systems of equations word problems", correctPct: 46 },
  { id: "q6", question: "Q6 - Slope-intercept B", topic: "Slope-intercept form", correctPct: 61 },
  { id: "q4", question: "Q4 - Multi-step B", topic: "Multi-step equations", correctPct: 64 },
  { id: "q8", question: "Q8 - Graphing B", topic: "Graphing linear equations", correctPct: 68 },
  { id: "q7", question: "Q7 - Graphing A", topic: "Graphing linear equations", correctPct: 75 },
  { id: "q3", question: "Q3 - Multi-step A", topic: "Multi-step equations", correctPct: 79 },
  { id: "q5", question: "Q5 - Slope-intercept A", topic: "Slope-intercept form", correctPct: 82 },
  { id: "q2", question: "Q2 - One-step B", topic: "One-step equations", correctPct: 89 },
  { id: "q1", question: "Q1 - One-step A", topic: "One-step equations", correctPct: 96 },
];

// Selected student for the detail panel: the lowest score, since that is
// where a reteach-or-retest decision is most urgent.
const selectedStudent = students[0];

const selectedStudentAnswers = [
  { id: "q1", question: "Q1 - One-step A", topic: "One-step equations", points: 9, outOf: 10 },
  { id: "q2", question: "Q2 - One-step B", topic: "One-step equations", points: 8, outOf: 10 },
  { id: "q3", question: "Q3 - Multi-step A", topic: "Multi-step equations", points: 9, outOf: 10 },
  { id: "q4", question: "Q4 - Multi-step B", topic: "Multi-step equations", points: 5, outOf: 10 },
  { id: "q5", question: "Q5 - Slope-intercept A", topic: "Slope-intercept form", points: 7, outOf: 10 },
  { id: "q6", question: "Q6 - Slope-intercept B", topic: "Slope-intercept form", points: 4, outOf: 10 },
  { id: "q7", question: "Q7 - Graphing A", topic: "Graphing linear equations", points: 6, outOf: 10 },
  { id: "q8", question: "Q8 - Graphing B", topic: "Graphing linear equations", points: 5, outOf: 10 },
  { id: "q9", question: "Q9 - Systems word problem A", topic: "Systems of equations word problems", points: 2, outOf: 10 },
  { id: "q10", question: "Q10 - Systems word problem B", topic: "Systems of equations word problems", points: 3, outOf: 10 },
];

const selectedStudentHistory = [
  { label: "Unit 2 test", value: 64 },
  { label: "Unit 3 test", value: 60 },
  { label: "Unit 4 test", value: 58 },
];

const studentColumns = [
  { key: "name", label: "Student" },
  { key: "score", label: "Score", align: "right" },
  { key: "delta", label: `vs. class avg (${CLASS_AVERAGE}%)`, align: "right" },
  { key: "status", label: "Status" },
  { key: "topic", label: "Weakest topic" },
];

const studentRows = students.map((s) => ({
  id: s.id,
  name: s.name,
  score: `${s.score}%`,
  delta: <Delta value={s.score - CLASS_AVERAGE} basis={`class avg ${CLASS_AVERAGE}%`} />,
  status: <Status tone={statusFor(s.score).tone} label={statusFor(s.score).label} />,
  topic: s.topic,
}));

const questionColumns = [
  { key: "question", label: "Question" },
  { key: "topic", label: "Topic" },
  { key: "correctPct", label: "% correct", align: "right" },
  { key: "delta", label: `vs. target (${MASTERY_TARGET}%)`, align: "right" },
];

const questionRows = questionBreakdown.map((q) => ({
  id: q.id,
  question: q.question,
  topic: q.topic,
  correctPct: `${q.correctPct}%`,
  delta: <Delta value={q.correctPct - MASTERY_TARGET} basis={`target ${MASTERY_TARGET}% correct`} />,
}));

const answerColumns = [
  { key: "question", label: "Question" },
  { key: "topic", label: "Topic" },
  { key: "points", label: "Points", align: "right" },
];

const answerRows = selectedStudentAnswers.map((a) => ({
  id: a.id,
  question: a.question,
  topic: a.topic,
  points: `${a.points} / ${a.outOf}`,
}));

const filters = [
  {
    id: "status",
    label: "Status",
    options: ["All", "Below threshold", "Approaching mastery", "On track"],
  },
  {
    id: "topic",
    label: "Weakest topic",
    options: [
      "All",
      "Systems of equations word problems",
      "Slope-intercept form",
      "Multi-step equations",
      "Graphing linear equations",
      "One-step equations",
      "None",
    ],
  },
];

const savedViews = [
  { id: "needs-support", label: "Needs support", active: true },
  { id: "ready-to-move-on", label: "Ready to move on", active: false },
];

const bulkActions = [
  { id: "flag-reteach", label: "Flag for small-group reteach", onPress: () => {} },
  { id: "assign-retest", label: "Assign systems-of-equations retest", onPress: () => {} },
];

export default function UnitTestReviewPage() {
  return (
    <Page title="Unit 4 Test Review">
      <Header
        title="Algebra I - Unit 4: Linear Equations"
        subtitle={`Period 3 - 28 students - graded Sep 26 - class average ${CLASS_AVERAGE}%`}
        actions={<Button label="Export to gradebook" onPress={() => {}} variant="secondary" />}
      />

      <div>
        <Metric label="Below passing threshold" value={belowThreshold.length} unit="students" />
        <Metric label="Weakest question" value={`${questionBreakdown[0].correctPct}%`} unit="correct" />
      </div>

      <Section title="Where the class struggled">
        <DataTable columns={questionColumns} rows={questionRows} stickyFirstColumn />
      </Section>

      <Explorer
        toolbar={
          <div>
            <FilterBar filters={filters} />
            <SavedViews views={savedViews} />
            <BulkActions actions={bulkActions} />
          </div>
        }
        table={
          <DataTable
            columns={studentColumns}
            rows={studentRows}
            selectable
            stickyFirstColumn
            onRowSelect={() => {}}
          />
        }
        detail={
          <Section title={`${selectedStudent.name} - question detail`}>
            <Metric label="Score" value={`${selectedStudent.score}%`} />
            <Delta value={selectedStudent.score - CLASS_AVERAGE} basis={`class avg ${CLASS_AVERAGE}%`} />
            <Delta value={selectedStudent.score - PASSING_THRESHOLD} basis={`passing threshold ${PASSING_THRESHOLD}%`} />
            <Trend series={selectedStudentHistory} />
            <DataTable columns={answerColumns} rows={answerRows} stickyFirstColumn />
            <Button label="Flag for small-group reteach" onPress={() => {}} />
            <Button label="Assign retest" onPress={() => {}} variant="secondary" />
          </Section>
        }
      />
    </Page>
  );
}
