// Intent: review — work through the class's marked test one student at a time and decide what happens next.
// Information: 28 students' scores and per-question correctness on the Unit 4 test, the 70% passing threshold
//   and the prior unit test as bases for judging each score, and which questions/topics the class missed widely
//   (that is what "what to do next" hinges on before any single student is looked at).
// Decision: for the class, which topics need reteaching before moving on; for each student, whether to assign a
//   retest, pull them into a small-group reteach, or mark them reviewed. The evidence for that (their wrong
//   answers, their trend against the last test) has to sit beside the list, not behind a second page.
// Pattern: ReviewQueue (exceptions — the lowest scores — first, evidence and decision next to the queue), with a
//   question-level table above it, since the class-wide decision starts from which questions failed, not from
//   any one student.

import {
  Page,
  Header,
  Section,
  DataTable,
  Comparison,
  ReviewQueue,
  FilterBar,
  Status,
  Delta,
  Trend,
  Metric,
  Button,
} from "@stoa/react";

const names = [
  "Priya N.", "Marcus T.", "Jaylen O.", "Sofia R.", "Ethan K.", "Mia D.", "Andre P.",
  "Grace L.", "Noah B.", "Ava M.", "Liam S.", "Zoe H.", "Caleb W.", "Isabella F.",
  "Diego V.", "Chloe N.", "Omar Y.", "Lily J.", "Kenji T.", "Nadia R.", "Owen C.",
  "Ruby A.", "Xavier M.", "Elena P.", "Tobias G.", "Harper Q.", "Dev S.", "Willow E.",
];

// Ascending so the lowest scores — the exceptions — lead the list.
const scores = [
  42, 48, 55, 58, 61, 64, 68,
  71, 72, 74, 75, 77, 78, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 93, 95, 98,
];

const PASSING = 70;
const TARGET_AVERAGE = 80;

function statusFor(score: number): "critical" | "warning" | "success" {
  if (score < PASSING) return "critical";
  if (score < 80) return "warning";
  return "success";
}

function focusFor(score: number): string {
  if (score < PASSING) return "Retest: cell membrane & osmosis";
  if (score < 80) return "Reteach: osmosis";
  return "On track";
}

const students = names.map((name, i) => {
  const score = scores[i];
  // Placeholder prior-unit-test score, varied so trends aren't uniform.
  const prevScore = Math.max(30, Math.min(100, score + (i % 3 === 0 ? -4 : i % 3 === 1 ? 6 : -2)));
  const earlierScore = Math.max(30, Math.min(100, prevScore + (i % 2 === 0 ? -3 : 3)));
  return {
    id: `student-${i + 1}`,
    name,
    score,
    status: statusFor(score),
    focus: focusFor(score),
    trendSeries: [earlierScore, prevScore, score],
  };
});

const questionBreakdown = [
  { question: "Q1", topic: "Cell membrane", correctPct: 46, missedBy: 34, status: "critical" as const },
  { question: "Q7", topic: "Osmosis", correctPct: 52, missedBy: 28, status: "critical" as const },
  { question: "Q4", topic: "Mitosis stages", correctPct: 61, missedBy: 19, status: "warning" as const },
  { question: "Q9", topic: "Organelle function", correctPct: 68, missedBy: 12, status: "warning" as const },
  { question: "Q2", topic: "Cell membrane", correctPct: 79, missedBy: 1, status: "warning" as const },
  { question: "Q5", topic: "Mitosis stages", correctPct: 86, missedBy: -6, status: "success" as const },
  { question: "Q3", topic: "Organelle function", correctPct: 89, missedBy: -9, status: "success" as const },
  { question: "Q6", topic: "Osmosis", correctPct: 93, missedBy: -13, status: "success" as const },
  { question: "Q8", topic: "Cell membrane", correctPct: 96, missedBy: -16, status: "success" as const },
  { question: "Q10", topic: "Mitosis stages", correctPct: 100, missedBy: -20, status: "success" as const },
];

const questionColumns = [
  { key: "question", label: "Question" },
  { key: "topic", label: "Topic" },
  { key: "correctPct", label: "Correct", align: "right" as const },
  { key: "vsTarget", label: "vs. 80% target", align: "right" as const },
  { key: "status", label: "Status" },
];

const questionRows = questionBreakdown.map((q) => ({
  question: q.question,
  topic: q.topic,
  correctPct: `${q.correctPct}%`,
  vsTarget: <Delta value={q.missedBy} basis="80% target" />,
  status: (
    <Status
      tone={q.status}
      label={q.status === "critical" ? "Reteach" : q.status === "warning" ? "Review" : "Solid"}
    />
  ),
}));

const comparisonEntities = [
  { name: "This test", classAverage: 71, passRate: "79%", median: 75 },
  { name: "Last unit test", classAverage: 76, passRate: "86%", median: 78 },
  { name: "Target", classAverage: TARGET_AVERAGE, passRate: "90%", median: 82 },
];

const comparisonMetrics = [
  { key: "classAverage", label: "Class average" },
  { key: "passRate", label: "Pass rate" },
  { key: "median", label: "Median score" },
];

const failingCount = students.filter((s) => s.status === "critical").length;
const prevFailingCount = 4;

const statusFilters = [
  {
    id: "status",
    label: "Status",
    options: [
      { id: "all", label: `All students (${students.length})` },
      { id: "failing", label: `Failing (${students.filter((s) => s.status === "critical").length})` },
      { id: "borderline", label: `Borderline (${students.filter((s) => s.status === "warning").length})` },
      { id: "passing", label: `Passing (${students.filter((s) => s.status === "success").length})` },
    ],
    value: "failing",
  },
];

const queueItems = students.map((s) => ({
  id: s.id,
  name: s.name,
  score: s.score,
  status: s.status,
  delta: <Delta value={s.score - PASSING} basis="70% passing" />,
  trend: <Trend series={s.trendSeries} />,
  note: s.focus,
}));

const current = students[0];

const currentWrongAnswers = [
  { question: "Q1", topic: "Cell membrane", answerGiven: "B", correctAnswer: "C" },
  { question: "Q2", topic: "Cell membrane", answerGiven: "A", correctAnswer: "D" },
  { question: "Q4", topic: "Mitosis stages", answerGiven: "C", correctAnswer: "A" },
  { question: "Q6", topic: "Osmosis", answerGiven: "B", correctAnswer: "C" },
  { question: "Q7", topic: "Osmosis", answerGiven: "D", correctAnswer: "B" },
  { question: "Q9", topic: "Organelle function", answerGiven: "A", correctAnswer: "B" },
];

const currentDetail = {
  id: current.id,
  name: current.name,
  score: current.score,
  status: current.status,
  header: (
    <Header
      title={current.name}
      subtitle={`Scored ${current.score}% — ${PASSING - current.score} points below passing`}
    />
  ),
  evidence: (
    <DataTable
      columns={[
        { key: "question", label: "Question" },
        { key: "topic", label: "Topic" },
        { key: "answerGiven", label: "Answer given" },
        { key: "correctAnswer", label: "Correct answer" },
      ]}
      rows={currentWrongAnswers}
      stickyFirstColumn
    />
  ),
  history: <Trend series={current.trendSeries} />,
};

const decision = (
  <>
    <Button label="Assign retest" variant="primary" onPress={() => {}} />
    <Button label="Add to small-group reteach" variant="secondary" onPress={() => {}} />
    <Button label="Mark reviewed" variant="ghost" onPress={() => {}} />
  </>
);

export default function UnitTestReviewPage() {
  return (
    <Page title="Unit 4 Test Review">
      <Header
        title="Unit 4: Cell Biology Test"
        subtitle="Period 3 · Ms. Alvarez · Oct 3, 2025 · 28 students"
        actions={<Button label="Export to gradebook" variant="secondary" onPress={() => {}} />}
      />

      <Section title="Class snapshot">
        <Metric
          label="Below passing (70%)"
          value={failingCount}
          unit="students"
          delta={<Delta value={failingCount - prevFailingCount} basis="last unit test" />}
        />
        <Comparison entities={comparisonEntities} metrics={comparisonMetrics} />
      </Section>

      <Section title="Where the class struggled">
        <DataTable columns={questionColumns} rows={questionRows} stickyFirstColumn />
      </Section>

      <Section title="Students to review">
        <FilterBar filters={statusFilters} />
        <ReviewQueue items={queueItems} current={currentDetail} decision={decision} />
      </Section>
    </Page>
  );
}
