import { Page, Header, Section, Metric, Chart, DataTable } from "@stoa/react";

const schoolMetrics = [
  { label: "Student Attendance", value: 92, delta: -1, unit: "%" },
  { label: "Academic Performance", value: 85, delta: 2, unit: "%" },
  { label: "Staff Engagement", value: 88, delta: 0, unit: "%" },
];

const attendanceData = [
  { period: "Week 1", attendance: 93 },
  { period: "Week 2", attendance: 92 },
  { period: "Week 3", attendance: 91 },
  { period: "Week 4", attendance: 90 },
];

const performanceData = [
  { period: "Week 1", performance: 83 },
  { period: "Week 2", performance: 84 },
  { period: "Week 3", performance: 85 },
  { period: "Week 4", performance: 86 },
];

const engagementData = [
  { period: "Week 1", engagement: 88 },
  { period: "Week 2", engagement: 88 },
  { period: "Week 3", engagement: 88 },
  { period: "Week 4", engagement: 88 },
];

const columns = [
  { label: "Period", key: "period" },
  { label: "Attendance", key: "attendance" },
  { label: "Performance", key: "performance" },
  { label: "Engagement", key: "engagement" },
];

const rows = [
  { period: "Week 1", attendance: 93, performance: 83, engagement: 88 },
  { period: "Week 2", attendance: 92, performance: 84, engagement: 88 },
  { period: "Week 3", attendance: 91, performance: 85, engagement: 88 },
  { period: "Week 4", attendance: 90, performance: 86, engagement: 88 },
];

const SchoolDashboard = () => (
  <Page title="School Performance Overview">
    <Header title="School Performance Overview" subtitle="Term Summary" />
    <Section title="Key Metrics">
      <Metric label="Student Attendance" value={92} delta={-1} unit="%" />
      <Metric label="Academic Performance" value={85} delta={2} unit="%" />
      <Metric label="Staff Engagement" value={88} delta={0} unit="%" />
    </Section>
    <Section title="Attendance Trends">
      <Chart
        type="line"
        series={[
          { label: "Attendance", data: attendanceData.map((d) => d.attendance) },
        ]}
        x={attendanceData.map((d) => d.period)}
        y={attendanceData.map((d) => d.attendance)}
      />
    </Section>
    <Section title="Academic Performance Trends">
      <Chart
        type="line"
        series={[
          { label: "Performance", data: performanceData.map((d) => d.performance) },
        ]}
        x={performanceData.map((d) => d.period)}
        y={performanceData.map((d) => d.performance)}
      />
    </Section>
    <Section title="Staff Engagement Trends">
      <Chart
        type="line"
        series={[
          { label: "Engagement", data: engagementData.map((d) => d.engagement) },
        ]}
        x={engagementData.map((d) => d.period)}
        y={engagementData.map((d) => d.engagement)}
      />
    </Section>
    <Section title="Term Summary Table">
      <DataTable columns={columns} rows={rows} />
    </Section>
  </Page>
);

export default SchoolDashboard;
