import { Page, Header, Section, Card, Metric, Status, Tabs, Drawer, Button, DataTable, AuditLog } from "@stoa/react";

export default function StudentMeetingPrep() {
  const student = {
    id: "S-1024",
    name: "Alex Mercer",
    grade: "8th Grade",
    homeroom: "Science Lab B",
    assignedTeacher: "Ms. Rivera",
    parentContact: "Sarah Mercer (555-0123)",
    status: "At Risk",
    recentIncidents: 2,
    attendanceRate: 84.5,
    lastAttendanceDate: "2023-10-15",
    behaviorScore: 3.2,
    behaviorTrend: "Down",
    academicScore: 78,
    attendanceScore: 84,
    behaviorScore: 32,
    notes: "Student is struggling with focus in the classroom. Parents concerned about missed assignments. Suggests a quiet corner for work.",
    recentEvents: [
      { id: 1, date: "2023-10-12", type: "Incident", description: "Disrupted class period", severity: "High" },
      { id: 2, date: "2023-10-05", type: "Note", description: "Submitted 3 days late", severity: "Medium" },
      { id: 3, date: "2023-09-28", type: "Success", description: "Completed extra credit project", severity: "Low" },
    ],
    auditLog: [
      { id: 1, action: "Grade Updated", actor: "Ms. Rivera", date: "2023-10-10" },
      { id: 2, action: "Incident Reported", actor: "Security", date: "2023-10-12" },
      { id: 3, action: "Parent Email Sent", actor: "Ms. Rivera", date: "2023-10-01" },
    ],
    history: [
      { id: 1, type: "Behavior", value: 3.5, date: "2023-09-01" },
      { id: 2, type: "Behavior", value: 3.3, date: "2023-09-15" },
      { id: 3, type: "Attendance", value: 92, date: "2023-09-01" },
      { id: 4, type: "Attendance", value: 84, date: "2023-09-15" },
    ],
  };

  return (
    <Page title="Student Meeting Preparation">
      <Header
        title="Alex Mercer - 8th Grade"
        subtitle="Preparation for Parent Conference"
        actions={
          <Button label="Mark Meeting Complete" onPress={() => alert("Meeting marked complete")} />
        }
      />

      <Section title="Student Overview">
        <Card title="Core Information">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            <Metric label="Grade Level" value={student.grade} />
            <Metric label="Homeroom" value={student.homeroom} />
            <Metric label="Assigned Teacher" value={student.assignedTeacher} />
            <Metric label="Parent Contact" value={student.parentContact} />
            <Metric label="Attendance Rate" value={student.attendanceRate} unit="%" />
            <Metric label="Academic Score" value={student.academicScore} unit="%" />
          </div>
        </Card>
      </Section>

      <Section title="Key Metrics & Trends">
        <Card title="Behavior & Attendance Trend">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Metric label="Behavior Score" value={student.behaviorScore} unit="Points" />
            <Metric label="Attendance Rate" value={student.attendanceScore} unit="%" />
            <Metric label="Recent Incidents" value={student.recentIncidents} />
            <Metric label="Status" value={student.status} />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>Status</span>
            <Status tone={student.behaviorTrend === "Down" ? "error" : "neutral"} label={student.behaviorTrend} />
          </div>
        </Card>
      </Section>

      <Section title="Recent Activity">
        <Card title="Incident Log">
          <DataTable
            columns={[
              { key: "date", label: "Date" },
              { key: "type", label: "Type" },
              { key: "description", label: "Description" },
              { key: "severity", label: "Severity" },
            ]}
            rows={student.recentEvents}
          />
        </Card>
      </Section>

      <Section title="History & Patterns">
        <Card title="Historical Trends">
          <DataTable
            columns={[
              { key: "type", label: "Category" },
              { key: "value", label: "Value" },
              { key: "date", label: "Date" },
            ]}
            rows={student.history}
          />
        </Card>
      </Section>

      <Section title="Communication & Notes">
        <Card title="Teacher Notes">
          <p>{student.notes}</p>
          <Button label="Add Note" variant="secondary" onPress={() => alert("Note added")} />
        </Card>
        <Card title="Communication History">
          <AuditLog entries={student.auditLog} />
        </Card>
      </Section>
    </Page>
  );
}
