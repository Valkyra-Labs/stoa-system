import { Page, Header, Sidebar, Section, Card, Metric, Delta, Chart, DataTable, Tabs, Status, EmptyData } from "@stoa/react";

const schoolPerformanceData = {
  academic: {
    label: "Academic Performance",
    metrics: [
      { label: "Average Test Scores", value: 82, delta: +3, unit: "%" },
      { label: "Graduation Rate", value: 92, delta: +2, unit: "%" },
      { label: "AP Exam Pass Rate", value: 78, delta: -1, unit: "%" },
    ],
    chart: {
      type: "line",
      series: [
        { name: "Math", data: [80, 82, 85, 83, 84] },
        { name: "English", data: [75, 77, 79, 80, 82] },
      ],
      x: "Quarter",
      y: "Score",
    },
  },
  financial: {
    label: "Financial Health",
    metrics: [
      { label: "Budget Utilization", value: 88, delta: -2, unit: "%" },
      { label: "Revenue Growth", value: 5, delta: +1, unit: "%" },
      { label: "Debt Ratio", value: 12, delta: -1, unit: "%" },
    ],
    chart: {
      type: "bar",
      series: [
        { name: "Operating Budget", data: [1200000, 1250000, 1300000] },
        { name: "Capital Budget", data: [300000, 320000, 350000] },
      ],
      x: "Year",
      y: "USD",
    },
  },
  operational: {
    label: "Operational Efficiency",
    metrics: [
      { label: "Class Size", value: 22, delta: -1, unit: "students" },
      { label: "Facility Maintenance Cost", value: 15000, delta: +5, unit: "USD" },
      { label: "Staff Retention Rate", value: 95, delta: +1, unit: "%" },
    ],
    chart: {
      type: "scatter",
      series: [
        { name: "Class Size", data: [[20, 85], [22, 90], [24, 88]] },
        { name: "Staff Retention", data: [[92, 88], [94, 91], [96, 93]] },
      ],
      x: "Class Size",
      y: "Retention Rate",
    },
  },
  wellBeing: {
    label: "Student Well-Being",
    metrics: [
      { label: "Mental Health Support", value: 85, delta: +3, unit: "%" },
      { label: "Student Engagement", value: 78, delta: -2, unit: "%" },
      { label: "Attendance Rate", value: 94, delta: +1, unit: "%" },
    ],
    chart: {
      type: "line",
      series: [
        { name: "Counseling Sessions", data: [120, 135, 140, 130, 135] },
        { name: "Peer Support Groups", data: [45, 50, 55, 50, 52] },
      ],
      x: "Month",
      y: "Sessions",
    },
  },
  summary: {
    label: "Summary",
    status: "positive",
    message: "The school is performing well overall with positive trends in academic and financial performance. However, there are areas for improvement in student engagement and operational efficiency.",
  },
};

export default function SchoolPerformanceReport() {
  return (
    <Page title="School Performance Report">
      <Header title="School Performance Report" subtitle="Term Overview for the Board" />
      <Sidebar>
        <Section title="Navigation">
          <Tabs
            items={[
              { id: "academic", label: "Academic Performance", content: <Card title="Academic Performance">{schoolPerformanceData.academic.metrics.map((metric, i) => (
                <Metric key={i} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
              ))}</Card> },
              { id: "financial", label: "Financial Health", content: <Card title="Financial Health">{schoolPerformanceData.financial.metrics.map((metric, i) => (
                <Metric key={i} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
              ))}</Card> },
              { id: "operational", label: "Operational Efficiency", content: <Card title="Operational Efficiency">{schoolPerformanceData.operational.metrics.map((metric, i) => (
                <Metric key={i} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
              ))}</Card> },
              { id: "wellBeing", label: "Student Well-Being", content: <Card title="Student Well-Being">{schoolPerformanceData.wellBeing.metrics.map((metric, i) => (
                <Metric key={i} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
              ))}</Card> },
            ]}
          />
        </Section>
      </Sidebar>
      <main>
        <Section title="Performance Overview">
          <Card title="Academic Performance">
            <Chart {...schoolPerformanceData.academic.chart} />
          </Card>
          <Card title="Financial Health">
            <Chart {...schoolPerformanceData.financial.chart} />
          </Card>
          <Card title="Operational Efficiency">
            <Chart {...schoolPerformanceData.operational.chart} />
          </Card>
          <Card title="Student Well-Being">
            <Chart {...schoolPerformanceData.wellBeing.chart} />
          </Card>
        </Section>
        <Section title="Summary">
          <Card title="Summary">
            <Status tone={schoolPerformanceData.summary.status} label={schoolPerformanceData.summary.message} />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
