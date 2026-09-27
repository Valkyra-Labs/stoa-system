import { Page, Header, Section, Card, Metric, Delta, Status, EmptyData, ErrorData, Timeline, AuditLog, Button } from "@stoa/react";

export default function StudentPreparation() {
  const studentId = "S-2024-892";
  const studentName = "Alex M.";
  const parentName = "Sarah M.";
  const meetingDate = "2023-11-15";

  // Metrics
  const currentGrade = 84.5;
  const targetGrade = 88.0;
  const previousPeriod = 82.0;
  const behaviorScore = 4.2; // 1-5 scale
  const attendanceRate = 94;

  // Timeline of events
  const events = [
    { date: "2023-10-01", type: "alert", text: "Late submission of Project A", severity: "medium" },
    { date: "2023-10-12", type: "alert", text: "Inappropriate comment during group work", severity: "high" },
    { date: "2023-10-20", type: "success", text: "Improved focus on Math quiz", severity: "low" },
    { date: "2023-10-25", type: "info", text: "Parent conference requested", severity: "low" },
  ];

  // Audit log
  const auditEntries = [
    { user: "Mr. Henderson", action: "lowered grade", target: "Math", timestamp: "2023-10-12T10:00:00Z", reason: "Insufficient effort on final exam" },
    { user: "System", action: "imported grades", target: "Math", timestamp: "2023-10-01T08:00:00Z", reason: "Auto-sync from LMS" },
    { user: "Ms. Davis", action: "added note", target: "Behavior", timestamp: "2023-10-15T14:30:00Z", reason: "Parent communication" },
  ];

  return (
    <Page title={`Preparation: ${studentName} (${meetingDate})`}>
      <Header title="Student Meeting Prep" subtitle={`Student: ${studentName}`} actions={
        <>
          <Button label="Save Draft" />
          <Button label="Schedule Meeting" variant="primary" />
        </>
      } />

      <Section title="Key Issues & Exceptions" id="exceptions">
        <Card title="Behavioral Concerns">
          <Metric label="Behavior Score" value={behaviorScore} unit=" / 5" />
          <Metric label="Attendance" value={attendanceRate} unit="%" />
          <Metric label="Current Grade" value={currentGrade} unit="%" />
          <Metric label="Target Grade" value={targetGrade} unit="%" />
          <Delta value={currentGrade - targetGrade} basis={targetGrade} />
          <Status tone="warning" label="Behavior score below average" />
        </Card>
      </Section>

      <Section title="Meeting Agenda & Evidence">
        <Card title="Timeline of Incidents & Improvements">
          <Timeline events={events} />
        </Card>
        
        <Card title="Grade History & Rationale">
          <AuditLog entries={auditEntries} />
        </Card>
      </Section>

      <Section title="Student Context" id="context">
        <Card title="Student Profile">
          <p><strong>ID:</strong> {studentId}</p>
          <p><strong>Parent:</strong> {parentName}</p>
          <p><strong>Enrollment Date:</strong> 2022-09-01</p>
          <p><strong>Last Contact:</strong> 2023-10-15 (Parent call)</p>
        </Card>
      </Section>

      <Section title="Data Status" id="status">
        <Card title="Data Freshness">
          <Metric label="Grade Sync" value="2023-10-26" unit="2 hours ago" />
          <Metric label="Behavior Log" value="2023-10-26" unit="1 hour ago" />
          <Status tone="neutral" label="Data current" />
        </Card>
      </Section>

      <Section title="Action Plan" id="actions">
        <Card title="Discussion Points">
          <ul>
            <li>Address the behavior incident on 2023-10-12 immediately.</li>
            <li>Review the math project requirements to ensure clarity.</li>
            <li>Discuss home-school communication protocols.</li>
          </ul>
          <div style={{ marginTop: '1rem' }}>
            <Button label="Generate Meeting Script" variant="secondary" onPress={() => alert("Script generation requested")} />
            <Button label="Mark as Ready" variant="primary" onPress={() => alert("Meeting marked as prepared")} />
          </div>
        </Card>
      </Section>
    </Page>
  );
}
