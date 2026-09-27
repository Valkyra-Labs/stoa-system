import { Page, Header, Sidebar, Section, Card, Metric, Delta, Comparison, Timeline, AuditLog, Status, EmptyData, PartialData, StaleData, FilterBar, Button, BulkActions, Explorer, Compare, Inspector } from "@stoa/react";

export default function PrepareMeeting() {
  return (
    <Page title="Prepare for Parent-Teacher Meeting">
      <Header title="Prepare for Parent-Teacher Meeting" subtitle="Student: Jane Doe" />
      <Sidebar>
        <Section title="Quick Links">
          <Card title="Student Profile">
            <Metric label="Overall GPA" value={3.2} delta={{ value: -0.3, basis: 3.5 }} unit="points" />
            <Metric label="Attendance" value={85} delta={{ value: -5, basis: 90 }} unit="%" />
          </Card>
          <Card title="Recent Activity">
            <Timeline events={[
              { time: "2023-11-01", label: "Received a B in Math" },
              { time: "2023-10-25", label: "Absent from English" },
              { time: "2023-10-18", label: "Late to School" }
            ]} />
          </Card>
        </Section>
      </Sidebar>
      <main>
        <Section title="Behavioral Summary">
          <Card title="Behavioral Notes">
            <AuditLog entries={[
              { time: "2023-11-01", action: "Received a warning for talking in class", by: "Mr. Smith" },
              { time: "2023-10-25", action: "Notified for tardiness", by: "Ms. Johnson" },
              { time: "2023-10-18", action: "Detention assigned for disruptive behavior", by: "Mrs. Lee" }
            ]} />
          </Card>
        </Section>
        <Section title="Academic Performance">
          <Card title="Grades">
            <DataTable
              columns={[
                { label: "Subject", name: "subject" },
                { label: "Grade", name: "grade", align: "right" }
              ]}
              rows={[
                { subject: "Math", grade: "B" },
                { subject: "English", grade: "C" },
                { subject: "Science", grade: "B-" },
                { subject: "History", grade: "A-" }
              ]}
            />
          </Card>
        </Section>
        <Section title="Action Plan">
          <Card title="Next Steps">
            <Button label="Send Email to Parent" onPress={() => alert("Email sent to parent")} variant="primary" />
            <Button label="Schedule Tutoring" onPress={() => alert("Tutoring session scheduled")} variant="secondary" />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
