import { Page, Header, Sidebar, Section, Card, Metric, Delta, DataTable, Status, EmptyData } from "@stoa/react";

export default function PrepareForMeeting() {
  return (
    <Page title="Prepare for Parent-Teacher Meeting">
      <Header title="John Doe" subtitle="Grade 5, Math & Science" actions={<Button label="Mark as Reviewed" />} />
      <main>
        <Section title="Overview">
          <Card title="Recent Performance">
            <Metric label="Latest Math Test" value={78} unit="%" />
            <Metric label="Latest Science Test" value={85} unit="%" />
            <Metric label="Attendance" value={92} unit="%" />
            <Metric label="Behavior" value={80} unit="%" />
          </Card>
          <Card title="Recent Grades">
            <DataTable
              columns={[
                { label: "Subject", key: "subject" },
                { label: "Test", key: "test" },
                { label: "Grade", key: "grade" },
                { label: "Date", key: "date" },
              ]}
              rows={[
                { subject: "Math", test: "Midterm", grade: 78, date: "2023-10-15" },
                { subject: "Science", test: "Unit Test", grade: 85, date: "2023-10-20" },
                { subject: "English", test: "Essay", grade: 80, date: "2023-10-18" },
              ]}
            />
          </Card>
        </Section>
        <Section title="Behavior">
          <Card title="Behavior Reports">
            <DataTable
              columns={[
                { label: "Date", key: "date" },
                { label: "Incident", key: "incident" },
                { label: "Description", key: "description" },
              ]}
              rows={[
                { date: "2023-10-10", incident: "Tardy", description: "Arrived late to class" },
                { date: "2023-10-12", incident: "Disruptive", description: "Interrupted class discussion" },
                { date: "2023-10-14", incident: "Unprepared", description: "Missing homework" },
              ]}
            />
          </Card>
        </Section>
        <Section title="Interventions">
          <Card title="Intervention Logs">
            <DataTable
              columns={[
                { label: "Date", key: "date" },
                { label: "Intervention", key: "intervention" },
                { label: "Outcome", key: "outcome" },
              ]}
              rows={[
                { date: "2023-10-11", intervention: "Study Group", outcome: "Improved participation" },
                { date: "2023-10-13", intervention: "One-on-One Tutoring", outcome: "Increased confidence" },
              ]}
            />
          </Card>
        </Section>
      </main>
      <aside>
        <Sidebar>
          <Card title="Next Steps">
            <p>Review recent performance and behavior data.</p>
            <p>Discuss progress and areas for improvement.</p>
            <p>Plan next steps and interventions.</p>
          </Card>
        </Sidebar>
      </aside>
    </Page>
  );
}
