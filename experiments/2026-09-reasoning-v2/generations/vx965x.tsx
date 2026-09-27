import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, Button, FilterBar, EmptyData } from "@stoa/react";

const Student = () => (
  <Page title="Parent-Teacher Meeting Prep: Emma Johnson">
    <Header title="Emma Johnson" subtitle="Parent-Teacher Meeting: Tomorrow at 3:00 PM" actions={<Button label="Save Notes" />} />
    <Sidebar>
      <Section title="Student Overview">
        <Card title="Basic Info">
          <p><strong>Name:</strong> Emma Johnson</p>
          <p><strong>Grade:</strong> 3rd</p>
          <p><strong>Teacher:</strong> Mr. Thompson</p>
          <p><strong>DOB:</strong> April 5, 2010</p>
        </Card>
        <Card title="Recent Performance">
          <Metric label="Math Grade" value="85" unit="%" />
          <Metric label="Reading Grade" value="92" unit="%" />
          <Metric label="Science Grade" value="78" unit="%" />
          <Delta value="5" basis="80" tone="positive" />
        </Card>
        <Card title="Behavior & Attendance">
          <Metric label="Absences" value="0" />
          <Metric label="Late" value="1" />
          <Metric label="Behavior Notes" value="2" />
        </Card>
      </Section>
    </Sidebar>
    <main>
      <Section title="Meeting Notes">
        <Card title="Discussion Points">
          <p>1. Review recent math progress and strategies for improvement.</p>
          <p>2. Discuss reading habits and suggest ways to encourage more reading at home.</p>
          <p>3. Address any concerns about behavior and attendance.</p>
        </Card>
        <Card title="Action Items">
          <p>1. Share a reading list with the parent.</p>
          <p>2. Schedule a follow-up check-in in two weeks.</p>
          <p>3. Provide resources for supporting math at home.</p>
        </Card>
        <Card title="Notes">
          <p>Emma is very engaged in class but struggles with math word problems. She needs more practice with breaking down steps. Her parents are supportive but unsure how to help with math at home.</p>
        </Card>
      </Section>
    </main>
  </Page>
);

export default Student;
