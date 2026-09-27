import { Page, Header, Sidebar, Section, Card, Metric, Delta, DataTable, Status, EmptyData, StaleData, ErrorData } from "@stoa/react";

const StudentRecord = () => {
  const student = {
    id: "STU-8842",
    name: "Elias Thorne",
    grade: "9B",
    status: "At Risk",
    attendance: 82,
    attendanceTarget: 95,
    attendanceDelta: -13,
    behaviorScore: 4.2,
    behaviorTarget: 5.0,
    behaviorDelta: -0.8,
    lastIncident: "Defiance in Math Period",
    lastIncidentDate: "2023-10-12",
    recentIncidents: [
      { date: "2023-10-12", type: "Behavior", desc: "Refused to participate in group work." },
      { date: "2023-10-05", type: "Attendance", desc: "Late arrival - 15 min." },
      { date: "2023-09-28", type: "Behavior", desc: "Disruptive comment in class." },
    ],
    academicMetrics: [
      { subject: "Math", score: 65, target: 78, delta: -13 },
      { subject: "Science", score: 82, target: 85, delta: -3 },
      { subject: "English", score: 90, target: 92, delta: -2 },
    ],
    notes: "Parent meeting scheduled for tomorrow. Focus on Math decline and recent behavioral incident. Bring attendance records.",
  };

  return (
    <Page title={`Preparation: ${student.name}`}>
      <Header title="Student Meeting Prep" subtitle={`ID: ${student.id} • Grade: ${student.grade}`} />
      <Sidebar>
        <Section title="Overview">
          <Metric label="Attendance" value={student.attendance} unit="%" delta={student.attendanceDelta} basis="Target" />
          <Metric label="Behavior Score" value={student.behaviorScore} unit="x" delta={student.behaviorDelta} basis="Target" />
          <Metric label="Academic Avg" value={82} unit="%" />
        </Section>
        <Section title="Critical Items">
          <Status tone="warning" label={student.status} />
          <p>Top priority: Math performance and recent defiance incident.</p>
        </Section>
      </Sidebar>
      <main>
        <Section title="Current State & Exceptions">
          <Card title="Recent Incidents & Evidence">
            <DataTable
              columns={[
                { key: "date", label: "Date", sticky: true },
                { key: "type", label: "Type" },
                { key: "desc", label: "Description" },
              ]}
              rows={student.recentIncidents}
              selectable
            />
            <p className="mt-2">
              <Status tone="error" label="Action Required" />
              : Address Math deficit and discuss incident on 2023-10-12 before meeting.
            </p>
          </Card>
        </Section>

        <Section title="Detailed Metrics">
          <Card title="Academic Performance">
            <DataTable
              columns={[
                { key: "subject", label: "Subject", sticky: true },
                { key: "score", label: "Current Score" },
                { key: "target", label: "Target" },
                { key: "delta", label: "Change" },
              ]}
              rows={student.academicMetrics}
              selectable
            />
            <p className="mt-2">
              <Status tone="warning" label="Data Freshness" />
              : Last imported 2 days ago. Verify Math gradebook today.
            </p>
          </Card>
        </Section>

        <Section title="Meeting Context">
          <Card title="Meeting Notes">
            <p>{student.notes}</p>
            <div className="mt-4">
              <Button label="Mark as Ready" onPress={() => alert("Marked as ready")} />
              <Button label="Export Summary" variant="secondary" onPress={() => alert("Exporting...")} />
            </div>
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default StudentRecord;
