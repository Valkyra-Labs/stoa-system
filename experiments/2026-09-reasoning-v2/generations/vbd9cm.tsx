import { Page, Header, Section, Card, Timeline, AuditLog, Status } from "@stoa/react";

export default function ParentTeacherMeeting() {
  return (
    <Page title="Parent-Teacher Meeting Prep">
      <Header title="Student: Jane Doe" subtitle="Meeting on Tuesday, March 15, 2023" />
      <Section title="Student Overview">
        <Card title="Academic Performance">
          <Metric label="Overall GPA" value={3.5} unit="GPA" />
          <Metric label="Attendance" value={92} unit="%" />
          <Metric label="Behavior Score" value={85} unit="%" />
        </Card>
        <Card title="Recent Events">
          <Timeline events={[
            { date: "2023-03-08", description: "Received A in Math quiz" },
            { date: "2023-03-10", description: "Late for class" },
            { date: "2023-03-12", description: "Participated in Science fair" },
          ]} />
        </Card>
      </Section>
      <Section title="Meeting Notes">
        <AuditLog entries={[
          { date: "2023-02-20", description: "First meeting: Discussed homework habits" },
          { date: "2023-03-05", description: "Follow-up: Encouraged more participation in class" },
        ]} />
        <Status tone="positive" label="Prepared and ready for meeting" />
      </Section>
    </Page>
  );
}
