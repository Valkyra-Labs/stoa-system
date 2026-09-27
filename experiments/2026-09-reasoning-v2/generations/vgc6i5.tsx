import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Trend, DataTable, FilterBar, Status, Button } from "@stoa/react";

const student = {
  name: "Alex Rivera",
  grade: "8th Grade",
  status: "Ready for Meeting",
  metrics: [
    { label: "Attendance", value: "94%", delta: "+2%", unit: "%", tone: "positive" },
    { label: "Math Average", value: "82", delta: "-4", unit: "pts", tone: "neutral" },
    { label: "Attendance", value: "94%", delta: "+2%", unit: "%", tone: "positive" },
    { label: "Reading Level", value: "Grade 6.5", delta: "0", unit: "", tone: "neutral" },
    { label: "Attendance", value: "94%", delta: "+2%", unit: "%", tone: "positive" },
  ],
  trends: [
    { label: "Math", points: [{ x: "Week 1", y: 88 }, { x: "Week 4", y: 82 }, { x: "Week 7", y: 82 }] },
    { label: "Attendance", points: [{ x: "Week 1", y: 92 }, { x: "Week 4", y: 94 }, { x: "Week 7", y: 94 }] },
  ],
  events: [
    { id: 1, date: "2023-10-15", type: "Assignment", title: "Algebra Quiz", grade: 85, note: "Completed on time." },
    { id: 2, date: "2023-10-18", type: "Incident", title: "Classroom Disruption", note: "Disturbed group work for 5 mins." },
    { id: 3, date: "2023-10-22", type: "Assignment", title: "Essay Draft", grade: 78, note: "Good structure, weak thesis." },
    { id: 4, date: "2023-10-25", type: "Assignment", title: "Math Homework", grade: 90, note: "Excellent completion." },
    { id: 5, date: "2023-10-28", type: "Incident", title: "Lunch Room Conflict", note: "Verbal disagreement with peer." },
  ],
};

export default function StudentPrepPage() {
  return (
    <Page title={`Pre-Meeting: ${student.name}`}>
      <Header title={student.name} subtitle="8th Grade Math & Science" actions={<Button label="Start Meeting" />} />
      <Section title="Overview">
        <Card title="Key Metrics">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {student.metrics.map((m, i) => (
              <Metric key={i} label={m.label} value={m.value} delta={m.delta} unit={m.unit} tone={m.tone} />
            ))}
          </div>
        </Card>
        <Card title="Performance Trends">
          <Tabs items={student.trends.map((t) => ({ id: t.label, label: t.label, content: <Trend series={t.points} /> }))} />
        </Card>
      </Section>
      <Section title="Recent Activity Log">
        <FilterBar filters={{ type: ["Assignment", "Incident"], date: ["last_week", "this_month"] }} />
        <DataTable
          columns={[
            { key: "date", label: "Date" },
            { key: "type", label: "Type" },
            { key: "title", label: "Event" },
            { key: "grade", label: "Grade (if applicable)" },
            { key: "note", label: "Notes" },
          ]}
          rows={student.events}
          selectable
        />
      </Section>
      <Section title="Teacher Notes & Action Items">
        <Card title="Pre-Meeting Checklist">
          <p>Review Math trends with parent. Discuss the two incidents in detail. Propose a tutoring plan for Algebra.</p>
          <Status tone="neutral" label="Next Step: Send parent email draft" />
        </Card>
      </Section>
    </Page>
  );
}
