import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Tabs,
  Metric,
  Delta,
  Trend,
  DataTable,
  Status,
  Button,
  FilterBar,
} from "@stoa/react";

const studentName = "Alex Johnson";
const parentName = "Sarah Johnson";
const studentId = "S-2024-089";

const recentMetrics = [
  { label: "Math GPA", value: 3.2, delta: 0.4, unit: "/4.0" },
  { label: "Attendance", value: 94, delta: -2, unit: "%" },
  { label: "Homework Completion", value: 88, delta: 5, unit: "%" },
  { label: "Behavior Score", value: 4.1, delta: 0.1, unit: "/5.0" },
];

const timelineEvents = [
  { date: "2023-10-15", title: "Midterm Exam", type: "academic", detail: "Scored 78% on Algebra II." },
  { date: "2023-11-02", title: "Group Project", type: "behavior", detail: "Led team effectively; high engagement." },
  { date: "2023-11-18", title: "Attendance Alert", type: "attendance", detail: "Missed 3 days due to illness." },
  { date: "2023-12-01", title: "Parent Meeting", type: "meeting", detail: "Discussed math struggles." },
  { date: "2023-12-10", title: "Math Tutoring", type: "academic", detail: "Started 1-on-1 sessions." },
];

const comparisonData = [
  { entity: "Alex Johnson", value: 3.2, trend: "up" },
  { entity: "Class Average", value: 3.0, trend: "flat" },
  { entity: "School Average", value: 2.8, trend: "up" },
];

const incidentLog = [
  { id: 1, date: "2023-11-20", actor: "Student", action: "Missed deadline", context: "History Essay", severity: "medium" },
  { id: 2, date: "2023-11-25", actor: "Teacher", action: "Provided extension", context: "History Essay", severity: "low" },
  { id: 3, date: "2023-12-05", actor: "Student", action: "Submitted late", context: "Physics Lab", severity: "high" },
];

const conferenceNotes = [
  "Discuss the impact of recent absences on Math performance.",
  "Highlight Alex's leadership in the group project.",
  "Propose a homework partnership program.",
  "Address concerns about the late submission pattern.",
];

export default function StudentConferencePrep() {
  return (
    <Page title="Student Conference Prep" children={
      <>
        <Header title={`${studentName} - ${parentName}`} subtitle="Preparation Dashboard" actions={
          <Button label="Print Report" onPress={() => {}} />
        } />

        <Sidebar children={
          <nav>
            <ul>
              <li>Overview</li>
              <li>Academic History</li>
              <li>Behavioral Records</li>
              <li>Attendance Log</li>
              <li>Notes & Drafts</li>
            </ul>
          </nav>
        } />

        <main>
          <Section title="Quick Overview">
            <Card title="Key Metrics">
              <div className="grid">
                {recentMetrics.map((m) => (
                  <Metric key={m.label} label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
                ))}
              </div>
            </Card>
          </Section>

          <Section title="Academic Performance Comparison">
            <Card title="Grade Point Average Trend">
              <Trend series={comparisonData} x="Entity" y="GPA" />
              <div className="mt-2">
                {comparisonData.map((e) => (
                  <div key={e.entity} className="flex items-center gap-2">
                    <span>{e.entity}</span>
                    <span className="font-mono">{e.value}</span>
                    <Status tone={e.trend === "up" ? "positive" : "neutral"} label={e.trend} />
                  </div>
                ))}
              </div>
            </Card>
          </Section>

          <Section title="Recent Timeline">
            <Card title="Key Events">
              <Timeline events={timelineEvents} />
            </Card>
          </Section>

          <Section title="Incident Log">
            <Card title="Recent Incidents">
              <DataTable columns={[{ key: "date", label: "Date" }, { key: "action", label: "Action" }, { key: "context", label: "Context" }, { key: "severity", label: "Severity" }]} rows={incidentLog} />
            </Card>
          </Section>

          <Section title="Conference Notes">
            <Card title="Draft Notes">
              <ul>
                {conferenceNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Button label="Save Notes" onPress={() => {}} variant="primary" />
                <Button label="Clear Draft" onPress={() => {}} variant="secondary" />
              </div>
            </Card>
          </Section>
        </main>
      </>
    } />
  );
}

// Helper components for layout consistency
const Timeline = ({ events }: { events: { date: string; title: string; type: string; detail: string }[] }) => (
  <div className="space-y-4">
    {events.map((e, i) => (
      <div key={i} className="border-b pb-2 last:border-0">
        <div className="flex justify-between">
          <span className="font-mono text-sm">{e.date}</span>
          <span className="text-xs text-gray-500">{e.type}</span>
        </div>
        <div className="font-medium">{e.title}</div>
        <div className="text-sm text-gray-600">{e.detail}</div>
      </div>
    ))}
  </div>
);
