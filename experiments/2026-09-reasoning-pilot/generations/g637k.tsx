/**
 * Unit Test Results Review Screen
 *
 * Main goal: Help the teacher quickly assess class performance, identify
 * struggling students, and make data-driven instructional decisions.
 *
 * Layout: Header with key metrics → overview chart → student performance
 * table with actionable status indicators. Metrics-first design lets the
 * teacher see "what happened" before diving into individual results.
 */

import { Page, Header, Section, Card, Metric, Chart, DataTable, Status, Delta } from "@stoa/react";

export default function UnitTestResults() {
  // Test metadata
  const testName = "Algebra Unit 3: Solving Equations";
  const className = "Algebra I - Period 4";
  const totalStudents = 28;
  const totalPoints = 100;

  // Summary statistics
  const scores = [45, 52, 58, 61, 65, 67, 68, 70, 72, 73, 75, 76, 78, 79, 80, 82, 83, 85, 86, 88, 89, 90, 92, 94, 95, 96, 98, 100];
  const averageScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passCount = scores.filter((s) => s >= 70).length;
  const passRate = Math.round((passCount / totalStudents) * 100);
  const needsSupportCount = scores.filter((s) => s < 70).length;

  // Score distribution for chart
  const scoreDistribution = {
    series: [
      {
        id: "frequency",
        label: "Number of Students",
        data: [
          { x: "40-49", y: 1 },
          { x: "50-59", y: 2 },
          { x: "60-69", y: 5 },
          { x: "70-79", y: 8 },
          { x: "80-89", y: 8 },
          { x: "90-100", y: 4 },
        ],
      },
    ],
  };

  // Student data for table
  const studentRows = [
    { id: "s001", name: "Alex Johnson", score: 100, percentage: 100, status: "Proficient", topics: "All mastered" },
    { id: "s002", name: "Bailey Chen", score: 98, percentage: 98, status: "Proficient", topics: "All mastered" },
    { id: "s003", name: "Casey Lopez", score: 96, percentage: 96, status: "Proficient", topics: "All mastered" },
    { id: "s004", name: "Dakota Williams", score: 95, percentage: 95, status: "Proficient", topics: "All mastered" },
    { id: "s005", name: "Emma Davis", score: 94, percentage: 94, status: "Proficient", topics: "All mastered" },
    { id: "s006", name: "Finley Brown", score: 92, percentage: 92, status: "Proficient", topics: "All mastered" },
    { id: "s007", name: "Gabriel Martinez", score: 90, percentage: 90, status: "Proficient", topics: "All mastered" },
    { id: "s008", name: "Harper Wilson", score: 89, percentage: 89, status: "Proficient", topics: "All mastered" },
    { id: "s009", name: "Ivy Taylor", score: 88, percentage: 88, status: "Proficient", topics: "All mastered" },
    { id: "s010", name: "Jordan Anderson", score: 86, percentage: 86, status: "Proficient", topics: "All mastered" },
    { id: "s011", name: "Kyle Thomas", score: 85, percentage: 85, status: "Proficient", topics: "All mastered" },
    { id: "s012", name: "Lucy Jackson", score: 83, percentage: 83, status: "Proficient", topics: "All mastered" },
    { id: "s013", name: "Mason White", score: 82, percentage: 82, status: "Proficient", topics: "All mastered" },
    { id: "s014", name: "Nina Harris", score: 80, percentage: 80, status: "Proficient", topics: "All mastered" },
    { id: "s015", name: "Oscar Martin", score: 79, percentage: 79, status: "Developing", topics: "Linear equations" },
    { id: "s016", name: "Piper Thompson", score: 78, percentage: 78, status: "Developing", topics: "Linear equations" },
    { id: "s017", name: "Quinn Garcia", score: 76, percentage: 76, status: "Developing", topics: "Parentheses, linear" },
    { id: "s018", name: "Riley Moore", score: 75, percentage: 75, status: "Developing", topics: "Parentheses, linear" },
    { id: "s019", name: "Sam Lee", score: 73, percentage: 73, status: "Developing", topics: "Multi-step equations" },
    { id: "s020", name: "Taylor Clark", score: 72, percentage: 72, status: "Developing", topics: "Multi-step equations" },
    { id: "s021", name: "Umar Rodriguez", score: 70, percentage: 70, status: "Developing", topics: "Multi-step equations" },
    { id: "s022", name: "Violet Lewis", score: 68, percentage: 68, status: "Needs Support", topics: "Simplification, solving" },
    { id: "s023", name: "Wyatt Walker", score: 67, percentage: 67, status: "Needs Support", topics: "Simplification, solving" },
    { id: "s024", name: "Xavier Hall", score: 65, percentage: 65, status: "Needs Support", topics: "Simplification, solving" },
    { id: "s025", name: "Yara Young", score: 61, percentage: 61, status: "Needs Support", topics: "Basics, order of ops" },
    { id: "s026", name: "Zeke Hernandez", score: 58, percentage: 58, status: "Needs Support", topics: "Basics, order of ops" },
    { id: "s027", name: "Aurora King", score: 52, percentage: 52, status: "Needs Support", topics: "Basics, order of ops" },
    { id: "s028", name: "Bruno Wright", score: 45, percentage: 45, status: "Needs Support", topics: "All areas" },
  ];

  return (
    <Page title="Unit Test Results">
      <Header
        title={testName}
        subtitle={className}
        actions={<div style={{ display: "flex", gap: "12px" }}></div>}
      />

      <main style={{ padding: "24px" }}>
        {/* Class Performance Summary */}
        <Section title="Class Performance Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <Metric label="Average Score" value={averageScore} unit="/" />
            <Metric label="Highest Score" value={highestScore} unit="/" />
            <Metric label="Lowest Score" value={lowestScore} unit="/" />
            <Metric label="Pass Rate (≥70%)" value={passRate} unit="%" />
            <Metric label="Needs Support" value={needsSupportCount} unit={`/${totalStudents}`} />
            <Metric label="Proficient" value={totalStudents - needsSupportCount} unit={`/${totalStudents}`} />
          </div>
        </Section>

        {/* Score Distribution Chart */}
        <Section title="Score Distribution">
          <Card>
            <Chart
              type="bar"
              series={scoreDistribution.series}
              x="x"
              y="y"
            />
          </Card>
        </Section>

        {/* Student Performance Table */}
        <Section title="Student Performance Details">
          <Card>
            <DataTable
              columns={[
                { id: "name", label: "Student Name", width: "140px" },
                { id: "score", label: "Score", width: "60px" },
                { id: "percentage", label: "%", width: "45px" },
                { id: "status", label: "Status", width: "110px" },
                { id: "topics", label: "Topics Needing Review", width: "180px" },
              ]}
              rows={studentRows}
              stickyFirstColumn
            />
          </Card>
        </Section>

        {/* Action Guidance */}
        <Section title="Next Steps">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            <Card title="Whole Class Instruction">
              <p>Strong pass rate (79%) suggests pacing is appropriate. Focus whole-class review on multi-step equations and parentheses handling—two areas where mid-tier students showed weakness.</p>
            </Card>
            <Card title="Small Group Support">
              <p>{needsSupportCount} students need targeted intervention. Group by topic: 3 students on order of operations basics, 5 on equation simplification, 4 on solving multi-step equations.</p>
            </Card>
            <Card title="Extension for Advanced">
              <p>{totalStudents - needsSupportCount - passCount} students are ready for enrichment. Consider word problems, systems of equations, or real-world applications.</p>
            </Card>
          </div>
        </Section>
      </main>
    </Page>
  );
}
