import { Page, Header, Section, Card, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, Status, EmptyData, StaleData } from "@stoa/react";

const SchoolPerformanceReport = () => {
  return (
    <Page title="School Performance Overview">
      <Header title="Term Progress Report" subtitle="Presented to the Board" actions={[]} />
      <Section title="Key Performance Indicators">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          <Card title="Student Achievement">
            <Metric label="Average Exam Score" value="82.5" unit="%" delta={+2.3} basis="Last Term" />
            <Delta value={+2.3} basis="Last Term" />
            <Trend series={[80, 81, 83, 82.5]} />
          </Card>
          <Card title="Staff Retention">
            <Metric label="Retention Rate" value="92%" delta={-1.5} basis="Last Term" />
            <Delta value={-1.5} basis="Last Term" />
            <Trend series={[93, 92.5, 91.5, 92]} />
          </Card>
          <Card title="Financial Health">
            <Metric label="Budget Utilization" value="88%" unit="%" delta={+3.2} basis="Last Term" />
            <Delta value={+3.2} basis="Last Term" />
            <Trend series={[85, 86, 87, 88]} />
          </Card>
        </div>
      </Section>
      <Section title="Comparative Analysis">
        <Comparison
          entities={["School A", "School B", "School C"]}
          metrics={[
            { label: "Exam Score", value: "82.5", unit: "%" },
            { label: "Retention Rate", value: "92%", unit: "%" },
            { label: "Budget Utilization", value: "88%", unit: "%" },
          ]}
        />
      </Section>
      <Section title="Recent Events">
        <Timeline
          events={[
            { date: "2024-03-15", description: "New STEM program launched with 120 students enrolled." },
            { date: "2024-03-10", description: "Teacher training workshop on differentiated instruction completed." },
            { date: "2024-02-28", description: "School budget approved with a 5% increase in operational funds." },
          ]}
        />
      </Section>
      <Section title="Data Status">
        <Status tone="success" label="All data is current and verified." />
        <StaleData since="2024-03-01" />
      </Section>
    </Page>
  );
};

export default SchoolPerformanceReport;
