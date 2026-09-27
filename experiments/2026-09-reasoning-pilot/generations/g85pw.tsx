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
  Button,
  Status,
  Drawer,
} from "@stoa/react";

type Student = {
  id: string;
  name: string;
  score: number;
  grade: string;
  missed: number[];
  status: "Excelling" | "On track" | "Needs support" | "Retake recommended";
};

function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function statusFor(score: number): Student["status"] {
  if (score >= 90) return "Excelling";
  if (score >= 70) return "On track";
  if (score >= 60) return "Needs support";
  return "Retake recommended";
}

const rawStudents: { name: string; score: number; missed: number[] }[] = [
  { name: "Ava Thompson", score: 98, missed: [] },
  { name: "Noah Kim", score: 95, missed: [9] },
  { name: "Isabella Cruz", score: 93, missed: [7] },
  { name: "Liam Patel", score: 91, missed: [7, 9] },
  { name: "Mia Johnson", score: 89, missed: [3, 9] },
  { name: "Ethan Brooks", score: 88, missed: [7, 8] },
  { name: "Sofia Ramirez", score: 86, missed: [2, 7, 9] },
  { name: "Jackson Lee", score: 85, missed: [4, 9] },
  { name: "Amelia Chen", score: 83, missed: [7, 9, 10] },
  { name: "Lucas Nguyen", score: 82, missed: [3, 7] },
  { name: "Charlotte Davis", score: 81, missed: [5, 7, 9] },
  { name: "Benjamin Wright", score: 80, missed: [2, 7, 9] },
  { name: "Harper Torres", score: 79, missed: [4, 7, 9] },
  { name: "Elijah Foster", score: 78, missed: [1, 7, 9] },
  { name: "Emily Sanders", score: 77, missed: [3, 7, 8, 9] },
  { name: "Alexander Ward", score: 76, missed: [2, 7, 9, 10] },
  { name: "Abigail Reed", score: 75, missed: [4, 6, 7, 9] },
  { name: "Daniel Morris", score: 74, missed: [3, 7, 9, 10] },
  { name: "Emma Bennett", score: 73, missed: [2, 5, 7, 9] },
  { name: "Michael Price", score: 71, missed: [4, 7, 8, 9] },
  { name: "Grace Coleman", score: 70, missed: [3, 6, 7, 9] },
  { name: "James Ortiz", score: 68, missed: [2, 4, 7, 9, 10] },
  { name: "Chloe Bailey", score: 65, missed: [3, 5, 7, 8, 9] },
  { name: "William Hayes", score: 63, missed: [2, 4, 6, 7, 9] },
  { name: "Zoe Simmons", score: 60, missed: [1, 3, 7, 8, 9, 10] },
  { name: "Henry Powell", score: 58, missed: [2, 3, 6, 7, 8, 9] },
  { name: "Layla Griffin", score: 52, missed: [1, 2, 4, 6, 7, 8, 9] },
  { name: "Maya Reyes", score: 41, missed: [1, 2, 3, 5, 6, 7, 8, 9, 10] },
];

const students: Student[] = rawStudents.map((s, index) => ({
  id: `student-${index + 1}`,
  name: s.name,
  score: s.score,
  grade: gradeFor(s.score),
  missed: s.missed,
  status: statusFor(s.score),
}));

const toneForStatus: Record<Student["status"], "success" | "neutral" | "warning" | "danger"> = {
  Excelling: "success",
  "On track": "neutral",
  "Needs support": "warning",
  "Retake recommended": "danger",
};

const distributionBands = ["90-100", "80-89", "70-79", "60-69", "Below 60"];
const distributionCounts = distributionBands.map((band) => {
  if (band === "90-100") return students.filter((s) => s.score >= 90).length;
  if (band === "80-89") return students.filter((s) => s.score >= 80 && s.score < 90).length;
  if (band === "70-79") return students.filter((s) => s.score >= 70 && s.score < 80).length;
  if (band === "60-69") return students.filter((s) => s.score >= 60 && s.score < 70).length;
  return students.filter((s) => s.score < 60).length;
});

const questionLabels = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"];
const questionPercentCorrect = [93, 82, 79, 86, 82, 79, 46, 75, 39, 82];

const lowestScorer = students[students.length - 1];

const tableColumns = [
  { key: "name", label: "Student" },
  { key: "score", label: "Score" },
  { key: "grade", label: "Grade" },
  { key: "missed", label: "Missed questions" },
  { key: "status", label: "Status" },
];

const tableRows = students.map((s) => ({
  id: s.id,
  name: s.name,
  score: `${s.score}%`,
  grade: s.grade,
  missed: s.missed.length === 0 ? "None" : s.missed.map((q) => `Q${q}`).join(", "),
  status: <Status tone={toneForStatus[s.status]} label={s.status} />,
}));

export default function UnitTestReviewPage() {
  return (
    <Page title="Unit 4 Test Review">
      <Header
        title="Unit 4 Test — Period 3 Algebra"
        subtitle="28 students · Administered Sep 25, 2026"
        actions={[
          <Button label="Export results" onPress={() => {}} />,
          <Button label="Message parents" onPress={() => {}} variant="primary" />,
        ]}
      />

      <Section title="Class performance">
        <Card title="Class average">
          <Metric label="Average score" value={76} unit="%" delta={<Delta value={5} basis="last test" />} />
        </Card>
        <Card title="Median">
          <Metric label="Median score" value={78} unit="%" />
        </Card>
        <Card title="Pass rate">
          <Metric label="Passing (60%+)" value={89} unit="%" delta={<Delta value={9} basis="last test" />} />
        </Card>
        <Card title="Highest score">
          <Metric label="Top score" value={98} unit="%" />
        </Card>
        <Card title="Lowest score">
          <Metric label="Lowest score" value={41} unit="%" />
        </Card>
      </Section>

      <Section title="Score distribution">
        <Card title="Students per score band">
          <Chart
            type="bar"
            series={[{ label: "Students", data: distributionCounts }]}
            x={distributionBands}
            y={{ label: "Number of students" }}
          />
        </Card>
      </Section>

      <Section title="Question-level breakdown">
        <Card title="Percent correct by question">
          <Chart
            type="bar"
            series={[{ label: "% correct", data: questionPercentCorrect }]}
            x={questionLabels}
            y={{ label: "% correct" }}
          />
          <p>
            Q7 and Q9 show the lowest percent correct across the class and are strong candidates for reteaching
            before the next unit.
          </p>
        </Card>
      </Section>

      <Section title="Students">
        <FilterBar
          filters={[
            {
              id: "band",
              label: "Score band",
              options: ["90-100", "80-89", "70-79", "60-69", "Below 60"],
            },
            {
              id: "status",
              label: "Status",
              options: ["Excelling", "On track", "Needs support", "Retake recommended"],
            },
            {
              id: "flagged",
              label: "Flagged for retake",
              options: ["Yes", "No"],
            },
          ]}
        />
        <DataTable
          columns={tableColumns}
          rows={tableRows}
          selectable
          stickyFirstColumn
          onRowSelect={() => {}}
        />
        <BulkActions
          actions={[
            { label: "Assign retake", onPress: () => {} },
            { label: "Schedule 1:1 check-in", onPress: () => {} },
            { label: "Notify parent", onPress: () => {} },
          ]}
        />
      </Section>

      <Drawer title={`Student detail — ${lowestScorer.name}`} open>
        <Metric label="Score" value={lowestScorer.score} unit="%" />
        <Status tone={toneForStatus[lowestScorer.status]} label={lowestScorer.status} />
        <p>Missed questions: {lowestScorer.missed.map((q) => `Q${q}`).join(", ")}</p>
        <p>
          Scored well below the class average and missed 9 of 10 questions, including every question on
          fraction operations. Recommend a retake after a short reteaching session.
        </p>
        <Button label="Assign retake" onPress={() => {}} variant="primary" />
        <Button label="Schedule 1:1 check-in" onPress={() => {}} />
      </Drawer>
    </Page>
  );
}
