import { Page, Header, Sidebar, Section, Card, Metric, Delta, DataTable, Button } from "@stoa/react";

export default function PrepareMeeting() {
  return (
    <Page title="Prepare for Parent-Teacher Meeting">
      <Header title="Meeting Preparation" subtitle="Student: Jane Doe" />
      <main>
        <Section title="Student Profile">
          <Card title="Basic Information">
            <p>Name: Jane Doe</p>
            <p>Grade: 10</p>
            <p>Class: English 10A</p>
          </Card>
          <Card title="Contact Information">
            <p>Parent: John Doe</p>
            <p>Email: john.doe@example.com</p>
            <p>Phone: 555-123-4567</p>
          </Card>
        </Section>
        <Section title="Recent Academic Performance">
          <Card title="Grades">
            <DataTable
              columns={[
                { label: "Subject", key: "subject" },
                { label: "Grade", key: "grade" },
                { label: "Date", key: "date" },
              ]}
              rows={[
                { subject: "English", grade: "B+", date: "2023-10-01" },
                { subject: "Math", grade: "A-", date: "2023-10-02" },
                { subject: "Science", grade: "B", date: "2023-10-03" },
              ]}
            />
          </Card>
          <Card title="Attendance">
            <Metric label="Total Days Absent" value={2} unit="days" />
            <Metric label="Total Days Present" value={30} unit="days" />
          </Card>
        </Section>
        <Section title="Behavior and Notes">
          <Card title="Behavioral Notes">
            <p>Note: Jane has been more attentive in class lately.</p>
            <p>Note: Jane participated in the school play.</p>
          </Card>
          <Card title="Action Items">
            <Button label="Send Email" />
            <Button label="Add Note" />
          </Card>
        </Section>
      </main>
    </Page>
  );
}
