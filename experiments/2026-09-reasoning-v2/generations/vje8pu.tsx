import { Page, Header, Section, Card, Metric, Status, Timeline, Button, EmptyData } from "@stoa/react";

export default function StudentPreparationScreen() {
  const student = {
    name: "Elena R.",
    grade: "8th Grade",
    id: "STU-2024-892",
  };

  const metrics = [
    { label: "Math (Q2)", value: "82%", delta: "+5%", unit: "grade" },
    { label: "Attendance", value: "96%", delta: "-1%", unit: "attendance" },
    { label: "Behavior", value: "Good", delta: null, unit: "status" },
  ];

  const recentEvents = [
    { date: "Oct 12", type: "positive", title: "Math quiz improvement", details: "Scored 95% on algebra practice." },
    { date: "Oct 10", type: "neutral", title: "Late arrival", details: "Arrived 20 mins late to homeroom." },
    { date: "Oct 05", type: "negative", title: "Missed assignment", details: "Did not submit history essay." },
    { date: "Sep 28", type: "positive", title: "Helpful in lab", details: "Assisted peers with science equipment." },
  ];

  return (
    <Page title={`Preparation: ${student.name}`} children={
      <div>
        <Header title={`Meeting Prep: ${student.name}`} subtitle="8th Grade - 2nd Quarter" />

        <Section title="Student Snapshot">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {metrics.map((m) => (
              <Card key={m.label} title={m.label}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <Metric label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
                </div>
                <Status tone={m.delta?.startsWith("+") ? "positive" : m.delta?.startsWith("-") ? "warning" : "neutral"}>
                  {m.delta ? m.delta : "Stable"}
                </Status>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Recent Activities (Last 4 Weeks)">
          <Timeline events={recentEvents} />
        </Section>

        <Section title="Preparation Checklist">
          <Card title="Key Talking Points">
            <div>
              <strong>Strengths:</strong> Elena has shown significant improvement in math recently. She was helpful in the science lab last week.
              <br /><br />
              <strong>Concerns:</strong> She missed the history assignment due to confusion about the deadline. There was one instance of lateness last week.
              <br /><br />
              <strong>Goal for Meeting:</strong> Discuss the missed assignment and establish a routine to ensure future homework is submitted on time.
            </div>
          </Card>
          <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
            <Button label="Save Notes" variant="primary" onPress={() => alert("Notes saved to draft.")} />
            <Button label="Print Summary" variant="secondary" onPress={() => alert("Summary printed.")} />
          </div>
        </Section>
      </div>
    } />
  );
}
