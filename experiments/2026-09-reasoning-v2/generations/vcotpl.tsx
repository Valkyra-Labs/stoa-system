import { Page, Header, Sidebar, Section, Card, Metric, DataTable, Status } from "@stoa/react";

export default function ParentTeacherMeetingPrep() {
  return (
    <Page title="Parent-Teacher Meeting Prep">
      <Header title="Preparation for Parent-Teacher Meeting" subtitle="Student Overview" />
      <Sidebar>
        <Card title="Navigation">
          <div>
            <p>Academic Performance</p>
            <p>Attendance</p>
            <p>Teacher Notes</p>
          </div>
        </Card>
      </Sidebar>
      <main>
        <Section title="Academic Performance">
          <Metric label="Average Grade" value="B+" unit="%" delta={{ value: 2, basis: "B" }} />
          <Metric label="Current GPA" value="3.5" unit="4.0 scale" />
          <Card title="Recent Grades">
            <DataTable
              columns={[
                { label: "Subject", key: "subject" },
                { label: "Grade", key: "grade" },
                { label: "Date", key: "date" },
              ]}
              rows={[
                { subject: "Math", grade: "B+", date: "2023-10-15" },
                { subject: "English", grade: "A-", date: "2023-10-10" },
                { subject: "Science", grade: "B", date: "2023-10-05" },
              ]}
            />
          </Card>
        </Section>
        <Section title="Attendance">
          <Metric label="Attendance Rate" value="95%" unit="%" />
          <Card title="Attendance Record">
            <DataTable
              columns={[
                { label: "Date", key: "date" },
                { label: "Status", key: "status" },
              ]}
              rows={[
                { date: "2023-10-16", status: "Present" },
                { date: "2023-10-13", status: "Absent" },
                { date: "2023-10-12", status: "Tardy" },
              ]}
            />
          </Card>
        </Section>
        <Section title="Teacher Notes">
          <Status tone="positive" label="Student is performing well in most subjects." />
          <Status tone="neutral" label="Student occasionally arrives late." />
          <Status tone="negative" label="Math homework submission has been inconsistent." />
          <p>Note: The student has shown improvement in English and Math over the past month.</p>
        </Section>
      </main>
    </Page>
  );
}
