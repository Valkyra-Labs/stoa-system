import { Page, Header, Section, Card, Metric, DataTable, Status, Tabs, Button, Timeline, AuditLog } from "@stoa/react";

export default function StudentMeetingPrep() {
  const student = {
    id: "S-1024",
    name: "Alex Johnson",
    grade: "8th Grade",
    meetingTime: "Oct 14, 2023, 10:00 AM",
    status: "Pending Review",
  };

  const academicMetrics = [
    { label: "Math (Algebra)", value: 72, delta: -8, unit: "/100", trend: "declining" },
    { label: "Reading (Literature)", value: 85, delta: 0, unit: "/100", trend: "stable" },
    { label: "Science", value: 68, delta: -5, unit: "/100", trend: "declining" },
    { label: "Attendance", value: 94, delta: 2, unit: "%", trend: "improving" },
  ];

  const behavioralEvents = [
    { date: "Oct 10", type: "positive", text: "Completed group project on time." },
    { date: "Oct 05", type: "negative", text: "Missed 3 classes due to unexcused absence." },
    { date: "Sep 28", type: "neutral", text: "Requested help with homework." },
  ];

  const auditLog = [
    { action: "Teacher Note", user: "M. Smith", time: "2023-10-12T09:30:00Z", details: "Noted improvement in attendance." },
    { action: "Grade Update", user: "S. Jones", time: "2023-10-08T14:15:00Z", details: "Updated Math grade to 72." },
  ];

  return (
    <Page title={`Prep Meeting: ${student.name}`}>
      <Header title={`Student Meeting Prep`} subtitle={student.name} actions={<Button label="Save Draft" onPress={() => alert("Saved")} />} />
      
      <Section title="Student Profile & Context">
        <Card title="Student Details">
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div>
              <p><strong>ID:</strong> {student.id}</p>
              <p><strong>Grade:</strong> {student.grade}</p>
              <p><strong>Next Meeting:</strong> {student.meetingTime}</p>
              <p><strong>Current Status:</strong> <Status tone="neutral" label={student.status} /></p>
            </div>
            <div>
              <p><strong>Key Concern:</strong> Struggling with Algebra concepts.</p>
              <p><strong>Goal:</strong> Improve Math score to 80+ by next conference.</p>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Academic Performance (Last 4 Weeks)">
        <Card title="Metrics & Trends">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {academicMetrics.map((metric) => (
              <Metric key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} unit={metric.unit} />
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Behavioral & Interaction Log">
        <Card title="Recent Events">
          <Timeline events={behavioralEvents} />
        </Card>
      </Section>

      <Section title="History & Notes">
        <Card title="Audit Log">
          <AuditLog entries={auditLog} />
        </Card>
      </Section>

      <Section title="Action Items">
        <Card title="Pre-Meeting Checklist">
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Button label="Draft Email to Parent" variant="primary" onPress={() => alert("Draft opened")} />
            <Button label="View School Data" variant="secondary" onPress={() => alert("Data view opened")} />
            <Button label="Schedule Reminder" variant="tertiary" onPress={() => alert("Reminder set")} />
          </div>
        </Card>
      </Section>
    </Page>
  );
}
