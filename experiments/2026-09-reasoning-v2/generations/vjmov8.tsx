import { Page, Header, Section, Card, Tabs, Drawer, Metric, Delta, Status, EmptyData, ErrorData, Timeline, DataTable, Button, FilterBar, SavedViews } from "@stoa/react";

const StudentDetails = {
  id: "S-2024-089",
  name: "Elena Rodriguez",
  grade: "8th Grade",
  status: "At Risk",
  attendance: 0.92,
  recentIncidents: 3,
  lastMeeting: "2024-09-15",
};

const MeetingAgenda = [
  { id: 1, topic: "Math Proficiency", notes: "Struggling with fractions, needs extra support", severity: "high" },
  { id: 2, topic: "Behavioral Incidents", notes: "3 unexcused absences, disruptive in class", severity: "high" },
  { id: 3, topic: "Social Integration", notes: "Isolated from peers, low participation", severity: "medium" },
];

const ParentHistory = [
  { date: "2024-09-15", action: "Parent meeting regarding attendance", outcome: "Plan initiated" },
  { date: "2024-08-20", action: "Homework submission review", outcome: "Incomplete assignments" },
  { date: "2024-07-10", action: "Summer progress check", outcome: "Needs remediation" },
];

export default function TeacherPrepScreen() {
  return (
    <Page title="Parent Meeting Preparation: Elena Rodriguez">
      <Header title="Student Meeting Prep" subtitle={`Student: ${StudentDetails.name} | Grade: ${StudentDetails.grade}`} />
      
      <Section title="Priority Focus: Meeting Agenda & Evidence">
        <Card title="Agenda Items (Sorted by Severity)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MeetingAgenda.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow-sm bg-white">
                <h3 className="font-bold text-lg">{item.topic}</h3>
                <p className="text-gray-600 mt-2">{item.notes}</p>
                <Status tone={item.severity === "high" ? "error" : "warning"} label={item.severity} />
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Historical Context & Evidence">
        <Card title="Parent Contact History">
          <DataTable 
            columns={[
              { key: "date", label: "Date" },
              { key: "action", label: "Action Taken" },
              { key: "outcome", label: "Outcome" },
            ]}
            rows={ParentHistory}
          />
        </Card>

        <Card title="Recent Academic & Behavioral Metrics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric label="Attendance Rate" value={StudentDetails.attendance} unit="92%" />
            <Metric label="Unexcused Absences" value={StudentDetails.recentIncidents} />
            <Metric label="Last Meeting Date" value={StudentDetails.lastMeeting} />
          </div>
        </Card>
      </Section>

      <Section title="Action Plan">
        <Card title="Next Steps">
          <div className="flex flex-col gap-3">
            <Button label="Draft Meeting Notes" onPress={() => alert("Notes drafted")} variant="primary" />
            <Button label="Schedule Follow-up" onPress={() => alert("Follow-up scheduled")} variant="secondary" />
            <Button label="Flag for Intervention Team" onPress={() => alert("Flagged for review")} variant="outline" />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            All actions will trigger a notification to the intervention team.
          </div>
        </Card>
      </Section>

      <Drawer title="Quick Actions" open={false}>
        <div className="p-4 space-y-2">
          <Button label="Add New Incident" onPress={() => {}} />
          <Button label="Upload Report Card" onPress={() => {}} />
          <Button label="Export Meeting Summary" onPress={() => {}} />
        </div>
      </Drawer>

      <FilterBar filters={{ search: "Search student records" }} />
      <SavedViews views={[{ id: "last", label: "Last Prep" }]} />
    </Page>
  );
}
