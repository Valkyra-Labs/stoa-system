import { Page, Header, Section, Metric, Delta, Chart, DataTable, EmptyData, StaleData, FilterBar, SavedViews, Button, Comparison } from "@stoa/react";

export default function SchoolPerformance() {
  return (
    <Page title="School Performance">
      <Header title="School Performance" subtitle="Term Overview" />
      <Section title="Key Metrics">
        <Metric label="Total Enrollment" value={1200} unit="students" />
        <Metric label="Average Daily Attendance" value={95} unit="%" />
        <Metric label="Graduation Rate" value={85} unit="%" />
      </Section>
      <Section title="Recent Changes">
        <Metric label="Enrollment Change" value={50} delta={<Delta value={50} basis={1150} />} unit="students" />
        <Metric label="Attendance Change" value={-2} delta={<Delta value={-2} basis={97} />} unit="%" />
        <Metric label="Graduation Rate Change" value={3} delta={<Delta value={3} basis={82} />} unit="%" />
      </Section>
      <Section title="Performance Trends">
        <Chart type="line" series={[
          { id: "enrollment", label: "Enrollment", data: [{ x: "2023-01-01", y: 1100 }, { x: "2023-04-01", y: 1150 }, { x: "2023-07-01", y: 1200 }] },
          { id: "attendance", label: "Attendance", data: [{ x: "2023-01-01", y: 96 }, { x: "2023-04-01", y: 96 }, { x: "2023-07-01", y: 95 }] },
          { id: "graduation", label: "Graduation Rate", data: [{ x: "2023-01-01", y: 82 }, { x: "2023-04-01", y: 82 }, { x: "2023-07-01", y: 85 }] }
        ]} x="date" y="value" />
      </Section>
      <Section title="Comparison with Peers">
        <Comparison entities={[
          { id: "ourSchool", label: "Our School", metrics: [{ label: "Enrollment", value: 1200, unit: "students" }, { label: "Attendance", value: 95, unit: "%" }, { label: "Graduation Rate", value: 85, unit: "%" }] },
          { id: "peerSchool1", label: "Peer School 1", metrics: [{ label: "Enrollment", value: 1150, unit: "students" }, { label: "Attendance", value: 96, unit: "%" }, { label: "Graduation Rate", value: 83, unit: "%" }] },
          { id: "peerSchool2", label: "Peer School 2", metrics: [{ label: "Enrollment", value: 1250, unit: "students" }, { label: "Attendance", value: 94, unit: "%" }, { label: "Graduation Rate", value: 84, unit: "%" }] }
        ]} />
      </Section>
      <Section title="Student Data">
        <DataTable columns={[
          { id: "studentId", label: "Student ID", sortable: true, sticky: true },
          { id: "name", label: "Name" },
          { id: "grade", label: "Grade" },
          { id: "attendance", label: "Attendance", type: "number", unit: "%" },
          { id: "gpa", label: "GPA", type: "number" }
        ]} rows={[
          { studentId: "1001", name: "Alice Smith", grade: "9", attendance: 97, gpa: 3.8 },
          { studentId: "1002", name: "Bob Johnson", grade: "10", attendance: 96, gpa: 3.5 },
          { studentId: "1003", name: "Charlie Lee", grade: "11", attendance: 95, gpa: 3.9 },
          { studentId: "1004", name: "Diana Wang", grade: "12", attendance: 98, gpa: 4.0 }
        ]} />
      </Section>
      <Section title="Filters">
        <FilterBar filters={[
          { id: "term", label: "Term", options: ["Fall", "Winter", "Spring", "Summer"] },
          { id: "year", label: "Year", options: ["2022", "2023"] },
          { id: "grade", label: "Grade", options: ["9", "10", "11", "12"] }
        ]} />
      </Section>
      <Section title="Saved Views">
        <SavedViews views={[
          { id: "currentTerm", label: "Current Term" },
          { id: "previousTerm", label: "Previous Term" },
          { id: "allYears", label: "All Years" }
        ]} />
      </Section>
      <Section title="Empty State">
        <EmptyData message="No data available for selected filters." />
      </Section>
      <Section title="Stale Data">
        <StaleData since="2023-07-01" message="Data is stale and needs to be refreshed." />
      </Section>
      <Section title="Error State">
        <ErrorData retry={() => console.log("Retry fetching data")} message="An error occurred while fetching data." />
      </Section>
    </Page>
  );
}
