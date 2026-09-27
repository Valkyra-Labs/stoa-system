import { Page, Header, Sidebar, Section, Card, Button, FilterBar, Metric, Delta, DataTable, Timeline, Status, EmptyData } from "@stoa/react";

export default function PrepareForParentMeeting() {
  return (
    <Page title="Prepare for Parent Meeting">
      <Header title="Emma Johnson" subtitle="Parent-Teacher Meeting - Tomorrow at 3:00 PM" actions={<Button label="Save Notes" variant="primary" />} />
      <Sidebar>
        <Section title="Student Info">
          <Card title="Student Profile">
            <p><strong>Name:</strong> Emma Johnson</p>
            <p><strong>Grade:</strong> 3rd</p>
            <p><strong>Teacher:</strong> Sarah Lee</p>
          </Card>
        </Section>
        <Section title="Quick Links">
          <Button label="View Report Card" />
          <Button label="View Behavior Log" />
        </Section>
      </Sidebar>
      <main>
        <Section title="Academic Performance">
          <Metric label="Math Score" value="85" delta={+5} unit="%" />
          <Metric label="Reading Level" value="Grade 3.2" />
          <Delta value={+2} basis="Last Month" />
        </Section>
        <Section title="Behavior">
          <Timeline events={[
            { date: "2023-10-05", description: "Received award for participation" },
            { date: "2023-10-12", description: "Minor behavior issue - corrected" }
          ]} />
        </Section>
        <Section title="Notes">
          <Card title="Teacher Notes">
            <p>Emma is very engaged in class and shows strong potential in math. She needs to work on following instructions during group activities.</p>
          </Card>
        </Section>
        <Section title="Parent Contact">
          <Card title="Parent Details">
            <p><strong>Parent:</strong> John Johnson</p>
            <p><strong>Email:</strong> john.johnson@example.com</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
          </Card>
        </Section>
        <Section title="Upcoming Tasks">
          <Card title="Tasks">
            <ul>
              <li>Prepare a summary of Emma's progress</li>
              <li>Review recent assignments</li>
              <li>Prepare questions for the parent</li>
            </ul>
          </Card>
        </Section>
      </main>
    </Page>
  );
}
