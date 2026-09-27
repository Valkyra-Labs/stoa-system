import { Page, Header, Section, Card, Metric, Delta, Status, EmptyData, Button, FilterBar, DataTable, Tabs, Tab, Timeline, AuditLog } from "@stoa/react";

const StudentProfile = () => {
  return (
    <Page title="Prepare for Parent Meeting - Student A">
      <Header title="Student A" subtitle="Parent Meeting Preparation" actions={<Button label="Save Notes" />} />
      <Section title="Student Overview">
        <Card title="Current Performance">
          <Metric label="Math Grade" value="78%" delta={-5} unit="%" />
          <Metric label="Reading Level" value="Grade 3" delta={+1} />
          <Metric label="Behavior Score" value="4.2/5" />
        </Card>
        <Card title="Recent Progress">
          <Timeline events={[
            { date: "2023-10-05", description: "Completed 3 math assessments with 75% accuracy" },
            { date: "2023-10-12", description: "Received warning for repeated disruptions in class" },
            { date: "2023-10-19", description: "Improved reading comprehension by 15% in last week" }
          ]} />
        </Card>
      </Section>
      <Section title="Notes and Actions">
        <Card title="Teacher Notes">
          <p>Student has shown improvement in reading but needs more support in math. Recommend tutoring and behavior check-ins.</p>
        </Card>
        <Card title="Upcoming Tasks">
          <ul>
            <li>Review student's math assessment from October 5th</li>
            <li>Schedule a meeting with the counselor for behavior support</li>
            <li>Prepare a list of 3 key points to discuss with the parent</li>
          </ul>
        </Card>
      </Section>
      <Section title="History">
        <Card title="Audit Log">
          <AuditLog entries={[
            { user: "jane.doe", action: "Updated math grade", timestamp: "2023-10-06T14:30:00Z" },
            { user: "jane.doe", action: "Added behavior note", timestamp: "2023-10-12T10:15:00Z" }
          ]} />
        </Card>
      </Section>
    </Page>
  );
};

export default StudentProfile;
