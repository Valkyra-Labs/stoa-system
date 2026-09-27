import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Comparison, Status, EmptyData, StaleData } from "@stoa/react";

const SchoolPerformanceDashboard = () => {
  return (
    <Page title="School Term Performance Overview">
      <Header title="Term Performance Overview" subtitle="Presented to the Board" />
      <Section title="Key Metrics">
        <Card>
          <Metric label="Student Pass Rate" value="89%" delta={+2} unit="%" />
          <Metric label="Staff Retention" value="92%" delta={-1} unit="%" />
          <Metric label="Budget Utilization" value="$1.2M" delta={+5} unit="USD" />
        </Card>
      </Section>
      <Section title="Performance Trends">
        <Card>
          <Trend series={[85, 87, 89, 90, 88]} />
          <Trend series={[88, 86, 87, 89, 86]} />
          <Trend series={[1.1, 1.2, 1.3, 1.4, 1.2]} />
        </Card>
      </Section>
      <Section title="Comparison with Previous Term">
        <Comparison
          entities={[
            { name: "Current Term", metrics: { passRate: 89, retention: 92, budget: 1200000 } },
            { name: "Previous Term", metrics: { passRate: 87, retention: 93, budget: 1150000 } },
          ]}
        />
      </Section>
      <Section title="Student Performance by Grade">
        <DataTable
          columns={[{ name: "Grade" }, { name: "Average Score" }, { name: "Improvement" }]}
          rows={[
            { Grade: "6", "Average Score": "78", "Improvement": "+5" },
            { Grade: "7", "Average Score": "72", "Improvement": "+3" },
            { Grade: "8", "Average Score": "65", "Improvement": "+2" },
            { Grade: "9", "Average Score": "60", "Improvement": "+1" },
          ]}
        />
      </Section>
      <Section title="Data Freshness">
        <Status tone="success" label="All data is up to date" />
      </Section>
    </Page>
  );
};

export default SchoolPerformanceDashboard;
