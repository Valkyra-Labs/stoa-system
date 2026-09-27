// Screen goal: Help a teacher review class performance on a unit test and
// identify next instructional steps. Prioritizes class overview metrics at
// top for quick assessment, followed by topic-level analysis and individual
// student results. Layout supports scanning for struggling areas and finding
// students needing intervention, enabling rapid decision-making about reteaching
// and remediation strategies.

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
} from "@stoa/react";

export default function UnitTestReview() {
  const classMetrics = [
    { label: "Class Average", value: "72.5", unit: "%" },
    { label: "Pass Rate (70+)", value: "18", unit: "of 28" },
    { label: "Needs Support", value: "10", unit: "students" },
  ];

  const studentData = [
    { name: "Aisha Chen", score: 94, topic1: 18, topic2: 19, topic3: 20 },
    { name: "Benjamin Moore", score: 78, topic1: 14, topic2: 16, topic3: 17 },
    { name: "Carla Santos", score: 65, topic1: 11, topic2: 13, topic3: 14 },
    { name: "David Park", score: 88, topic1: 17, topic2: 18, topic3: 19 },
    { name: "Elena Rossi", score: 92, topic1: 18, topic2: 19, topic3: 20 },
    { name: "Fiona Jones", score: 55, topic1: 9, topic2: 10, topic3: 12 },
    { name: "Garrett Brown", score: 81, topic1: 15, topic2: 17, topic3: 18 },
    { name: "Hannah Lee", score: 73, topic1: 12, topic2: 15, topic3: 16 },
    { name: "Isaac Wright", score: 47, topic1: 8, topic2: 9, topic3: 11 },
    { name: "Julia Martinez", score: 89, topic1: 17, topic2: 18, topic3: 19 },
    { name: "Kevin Davis", score: 71, topic1: 13, topic2: 14, topic3: 15 },
    { name: "Lily Jackson", score: 68, topic1: 11, topic2: 13, topic3: 14 },
    { name: "Marcus Thompson", score: 85, topic1: 16, topic2: 17, topic3: 18 },
    { name: "Nina Ahmed", score: 76, topic1: 14, topic2: 15, topic3: 17 },
    { name: "Owen Smith", score: 91, topic1: 18, topic2: 19, topic3: 20 },
    { name: "Priya Patel", score: 54, topic1: 9, topic2: 10, topic3: 11 },
    { name: "Quinn Foster", score: 82, topic1: 15, topic2: 17, topic3: 18 },
    { name: "Rachel Green", score: 64, topic1: 10, topic2: 12, topic3: 14 },
    { name: "Samuel Hall", score: 87, topic1: 16, topic2: 18, topic3: 19 },
    { name: "Tessa White", score: 79, topic1: 14, topic2: 16, topic3: 17 },
    { name: "Ulysses King", score: 52, topic1: 8, topic2: 9, topic3: 11 },
    { name: "Veronica Lopez", score: 86, topic1: 16, topic2: 18, topic3: 19 },
    { name: "William Clark", score: 69, topic1: 12, topic2: 13, topic3: 15 },
    { name: "Ximena Rodriguez", score: 93, topic1: 18, topic2: 19, topic3: 20 },
    { name: "Yuki Tanaka", score: 75, topic1: 13, topic2: 15, topic3: 16 },
    { name: "Zachary Miller", score: 48, topic1: 8, topic2: 9, topic3: 10 },
    { name: "Amy Taylor", score: 90, topic1: 18, topic2: 19, topic3: 20 },
    { name: "Bradley Evans", score: 66, topic1: 10, topic2: 12, topic3: 14 },
  ];

  const topicResults = [
    { name: "Fractions & Division", classAvg: 68, attempts: 280 },
    { name: "Multi-step Word Problems", classAvg: 65, attempts: 280 },
    { name: "Decimal Operations", classAvg: 82, attempts: 280 },
  ];

  const riskStudents = studentData.filter((s) => s.score < 70);

  const scoreRanges = [
    { range: "90–100", count: 5 },
    { range: "80–89", count: 8 },
    { range: "70–79", count: 5 },
    { range: "60–69", count: 6 },
    { range: "Below 60", count: 4 },
  ];

  return (
    <Page title="Unit Test Review">
      <Header
        title="Mathematics Unit 4 Assessment Results"
        subtitle="28 students completed the unit test on fractions, decimals, and word problems"
      />

      <Section title="Class Performance Summary">
        <div style={{ display: "flex", gap: "2rem" }}>
          {classMetrics.map((m, i) => (
            <Metric
              key={i}
              label={m.label}
              value={m.value}
              unit={m.unit}
            />
          ))}
        </div>
      </Section>

      <Section title="Score Distribution">
        <Chart
          type="bar"
          series={[{ name: "Students", data: scoreRanges.map((r) => r.count) }]}
          x={scoreRanges.map((r) => r.range)}
          y="Number of Students"
        />
      </Section>

      <Section title="Performance by Topic">
        <DataTable
          columns={[
            { id: "topic", label: "Topic" },
            { id: "avg", label: "Class Average" },
            { id: "status", label: "Assessment" },
          ]}
          rows={topicResults.map((t) => {
            const tone =
              t.classAvg >= 80
                ? "positive"
                : t.classAvg >= 70
                  ? "neutral"
                  : "warning";
            return {
              topic: t.name,
              avg: t.classAvg + "%",
              status: (
                <Status
                  tone={tone}
                  label={
                    t.classAvg >= 80
                      ? "Solid"
                      : t.classAvg >= 70
                        ? "Developing"
                        : "Needs Review"
                  }
                />
              ),
            };
          })}
        />
      </Section>

      <Section title="Students Needing Support">
        <Card title={`${riskStudents.length} students scoring below 70`}>
          <DataTable
            columns={[
              { id: "name", label: "Student" },
              { id: "score", label: "Score" },
              { id: "action", label: "Suggested Action" },
            ]}
            rows={riskStudents.map((s) => ({
              name: s.name,
              score: s.score + "%",
              action: (
                <Status
                  tone={s.score < 60 ? "warning" : "neutral"}
                  label={s.score < 60 ? "1-on-1 Conference" : "Small Group"}
                />
              ),
            }))}
          />
        </Card>
      </Section>

      <Section title="All Student Results">
        <DataTable
          columns={[
            { id: "name", label: "Student Name" },
            { id: "score", label: "Total Score" },
            { id: "mastery", label: "Level" },
          ]}
          rows={studentData.map((s) => {
            const level =
              s.score >= 90
                ? "Exceeds"
                : s.score >= 80
                  ? "Proficient"
                  : s.score >= 70
                    ? "Developing"
                    : "Emerging";
            const tone =
              s.score >= 80
                ? "positive"
                : s.score >= 70
                  ? "neutral"
                  : "warning";
            return {
              name: s.name,
              score: s.score + "%",
              mastery: <Status tone={tone} label={level} />,
            };
          })}
          stickyFirstColumn
        />
      </Section>

      <Section title="Recommended Next Steps">
        <Card>
          <p>
            Based on test results, consider the following instructional moves:
          </p>
          <ul>
            <li>
              Reteach fractions and word problems to the 10 students scoring
              below 70
            </li>
            <li>
              Use small group sessions on multi-step problem-solving before
              advancing
            </li>
            <li>
              Provide extension work on decimal applications for the 5 students
              scoring above 90
            </li>
            <li>
              Schedule individual conferences with the 4 students scoring below
              60
            </li>
          </ul>
        </Card>
      </Section>
    </Page>
  );
}
