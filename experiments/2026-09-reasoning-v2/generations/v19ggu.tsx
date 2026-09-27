import { Page, Header, Section, Metric, Delta, DataTable, StaleData } from "@stoa/react";

export default function SchoolPerformance() {
  return (
    <Page title="School Performance">
      <Header title="School Performance" subtitle="Term Summary" />
      <main>
        <Section title="Key Metrics">
          <Metric label="Enrollment" value={1200} unit="students" />
          <Metric label="Attendance Rate" value={95.2} unit="%" />
          <Metric label="Graduation Rate" value={90.1} unit="%" />
          <Metric label="Teacher Turnover Rate" value={8.5} unit="%" />
        </Section>
        <Section title="Student Performance">
          <Metric label="Math Proficiency" value={78.3} unit="%" />
          <Metric label="Reading Proficiency" value={82.4} unit="%" />
          <Metric label="Science Proficiency" value={76.5} unit="%" />
          <Metric label="Writing Proficiency" value={79.8} unit="%" />
        </Section>
        <Section title="Financial Health">
          <Metric label="Budget Surplus" value={50000} unit="$" />
          <Metric label="Fund Balance" value={250000} unit="$" />
        </Section>
        <Section title="Enrollment Trends">
          <Trend series={[{ x: "2023-01", y: 1180 }, { x: "2023-02", y: 1190 }, { x: "2023-03", y: 1200 }]} />
        </Section>
        <Section title="Recent Attendance">
          <DataTable
            columns={[
              { label: "Date", key: "date" },
              { label: "Total Attendance", key: "totalAttendance" },
              { label: "Average Daily Attendance", key: "averageDailyAttendance", unit: "%" },
            ]}
            rows={[
              { date: "2023-04-01", totalAttendance: 1150, averageDailyAttendance: 93.5 },
              { date: "2023-04-02", totalAttendance: 1160, averageDailyAttendance: 94.2 },
              { date: "2023-04-03", totalAttendance: 1170, averageDailyAttendance: 95.0 },
            ]}
          />
        </Section>
        <Section title="Stale Data">
          <StaleData since="2023-03-31">
            <p>The data has not been updated since the end of March. Please check back for the latest figures.</p>
          </StaleData>
        </Section>
      </main>
    </Page>
  );
}
