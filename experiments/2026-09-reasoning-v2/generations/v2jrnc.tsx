import { Page, Header, Section, Card, Metric, Trend, AuditLog, Status, Button } from "@stoa/react";

export default function PrepForMeeting() {
  const student = {
    name: "Alex Chen",
    grade: "8B",
    status: "Needs Attention",
    lastUpdated: "2 hours ago",
    parentContact: "Parent meeting tomorrow at 3:00 PM"
  };

  const academicMetrics = [
    { label: "Math", value: 72, target: 80, trend: -5, unit: "/100" },
    { label: "Reading", value: 85, target: 85, trend: 0, unit: "Level" },
    { label: "Science", value: 68, target: 75, trend: -3, unit: "/100" }
  ];

  const behavioralMetrics = [
    { label: "Attendance", value: 94, trend: 2, unit: "%" },
    { label: "Participation", value: 65, trend: -10, unit: "Scale" }
  ];

  const recentEvents = [
    { date: "Oct 12", type: "Incident", text: "Disrupted class discussion regarding project", severity: "high" },
    { date: "Oct 10", type: "Achievement", text: "Completed advanced calculus worksheet", severity: "positive" },
    { date: "Oct 08", type: "Incident", text: "Absent due to family emergency", severity: "neutral" }
  ];

  const actionPlan = [
    { priority: "High", topic: "Discuss Math decline", context: "Need to review specific weak concepts", evidence: "Math score dropped 5 points" },
    { priority: "Medium", topic: "Address participation", context: "Student is withdrawn in group work", evidence: "Participation score down 10 points" }
  ];

  return (
    <Page title="Student Prep: Alex Chen">
      <Header title={`Meeting Prep: ${student.name}`} subtitle="Grade 8B" actions={<Button label="Save Draft" />}>
      </Header>

      <main>
        <Section title="Student Overview">
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#eee" }}>
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                  👤
                </div>
              </div>
              <div>
                <h1>{student.name}</h1>
                <Status tone="warning" label={student.status} />
                <p style={{ margin: 0, color: "#666" }}>Last updated: {student.lastUpdated} • Next meeting: {student.parentContact}</p>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Academic & Behavioral Metrics">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {academicMetrics.map((m) => (
              <Card key={m.label} title={m.label}>
                <Metric label="Current" value={m.value} unit={m.unit} />
                <Metric label="Target" value={m.target} unit={m.unit} />
                <Metric label="Change" value={m.trend} unit={m.unit} />
              </Card>
            ))}
            {behavioralMetrics.map((m) => (
              <Card key={m.label} title={m.label}>
                <Metric label="Current" value={m.value} unit={m.unit} />
                <Metric label="Change" value={m.trend} unit={m.unit} />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Recent Timeline">
          <Card title="Key Events & Incidents">
            <AuditLog entries={recentEvents} />
          </Card>
        </Section>

        <Section title="Meeting Strategy">
          <Card title="Action Plan">
            {actionPlan.map((item, index) => (
              <div key={index} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong>{item.topic}</strong>
                  <Status tone={item.priority === "High" ? "danger" : "warning"} label={item.priority} />
                </div>
                <div style={{ marginBottom: "4px", color: "#555" }}>{item.context}</div>
                <div style={{ fontSize: "14px", color: "#888" }}>• Evidence: {item.evidence}</div>
              </div>
            ))}
          </Card>
        </Section>
      </main>
    </Page>
  );
}
