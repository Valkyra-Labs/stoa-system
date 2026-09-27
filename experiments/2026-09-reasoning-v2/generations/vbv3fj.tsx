import { Page, Header, Sidebar, Section, Card, Metric, Delta, Comparison, DataTable, Button, FilterBar, SavedViews } from "@stoa/react";

export default function PrepareMeeting() {
  return (
    <Page title="Prepare for Parent-Teacher Meeting">
      <Header title="Student Overview" subtitle="John Doe" />
      <Section title="Key Metrics">
        <Metric label="Attendance Rate" value={90} unit="%" />
        <Metric label="Average Grade" value={B} />
        <Metric label="Behavior Incidents" value={2} />
      </Section>
      <Section title="Recent Activity">
        <DataTable
          columns={[
            { label: "Date", key: "date" },
            { label: "Activity", key: "activity" },
            { label: "Details", key: "details" },
          ]}
          rows={[
            { date: "2023-10-05", activity: "Absent", details: "Sick leave" },
            { date: "2023-10-04", activity: "Late", details: "Bus delay" },
            { date: "2023-10-03", activity: "Behavior Incident", details: "Tardy" },
          ]}
          selectable
        />
      </Section>
      <Section title="Grade Comparison">
        <Comparison
          entities={[
            { id: "John Doe", metrics: [{ label: "Math", value: 85 }, { label: "English", value: 90 }] },
            { id: "Class Average", metrics: [{ label: "Math", value: 80 }, { label: "English", value: 85 }] },
          ]}
        />
      </Section>
      <Sidebar>
        <FilterBar filters={[
          { label: "Grade Level", value: "9th Grade" },
          { label: "Subject", value: "Math, English" },
          { label: "Behavior", value: "Incidents" },
        ]} />
        <SavedViews views={[
          { label: "All Grades", selected: true },
          { label: "Behavior Issues" },
          { label: "Academic Performance" },
        ]} />
        <Button label="Prepare Talking Points" onPress={() => console.log("Prepare talking points")} />
      </Sidebar>
    </Page>
  );
}
