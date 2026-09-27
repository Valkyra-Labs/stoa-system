import { Page, Header, Section, Card, Metric, Delta, Trend, DataTable, Status, EmptyData } from "@stoa/react";

const headerActions = [
  { label: "Export Report", onPress: () => console.log("Export") },
  { label: "Share", onPress: () => console.log("Share") },
];

const metrics = [
  {
    label: "Academic Progress",
    value: "94%",
    delta: { value: "+2.1%", basis: "vs last year" },
    unit: "of students",
  },
  {
    label: "Enrollment Growth",
    value: "1,240",
    delta: { value: "+12%", basis: "vs last year" },
    unit: "students",
  },
  {
    label: "Budget Variance",
    value: "4.2%",
    delta: { value: "-0.5%", basis: "vs target" },
    unit: "of surplus",
  },
  {
    label: "Staff Retention",
    value: "98%",
    delta: { value: "0%", basis: "vs last year" },
    unit: "retained",
  },
];

const trends = [
  { label: "Test Scores", value: "High" },
  { label: "Attendance", value: "Stable" },
  { label: "Budget Utilization", value: "On Track" },
];

const rows = [
  {
    id: 1,
    period: "Term 1",
    category: "Academics",
    metric: "Average GPA",
    value: "3.8",
    trend: "Up",
  },
  {
    id: 2,
    period: "Term 1",
    category: "Finance",
    metric: "Operating Cost",
    value: "$4.2M",
    trend: "Down",
  },
  {
    id: 3,
    period: "Term 1",
    category: "Culture",
    metric: "Student Satisfaction",
    value: "92%",
    trend: "Up",
  },
  {
    id: 4,
    period: "Term 1",
    category: "Operations",
    metric: "Facility Usage",
    value: "85%",
    trend: "Stable",
  },
];

export default function TermPresentationPage() {
  return (
    <Page title="Term 1 Performance Report">
      <Header
        title="Term 1 Performance Report"
        subtitle="For Board Presentation - October 2023"
        actions={headerActions}
      />
      <Section title="Executive Summary">
        <Card title="Key Performance Indicators">
          {metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </Card>
      </Section>
      <Section title="Trend Analysis">
        <Card title="Strategic Metrics Overview">
          {trends.map((trend) => (
            <Trend key={trend.label} {...trend} />
          ))}
        </Card>
      </Section>
      <Section title="Detailed Performance by Category">
        <Card title="Term 1 Data Points">
          <DataTable
            columns={[
              { key: "period", label: "Period" },
              { key: "category", label: "Category" },
              { key: "metric", label: "Metric" },
              { key: "value", label: "Value" },
              { key: "trend", label: "Change" },
            ]}
            rows={rows}
          />
        </Card>
      </Section>
      <Section title="Data Integrity">
        <Card title="Data Freshness">
          <Status tone="success" label="Data verified: Current term, no anomalies detected" />
        </Card>
      </Section>
    </Page>
  );
}
