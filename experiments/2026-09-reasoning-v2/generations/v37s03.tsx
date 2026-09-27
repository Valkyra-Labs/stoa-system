import { Page, Header, Section, Card, Tabs, Metric, Delta, Button, FilterBar, DataTable, EmptyData } from "@stoa/react";

const Student = () => (
  <Page title="Prepare for Parent Meeting">
    <Header title="Parent Meeting Prep" subtitle="Student: Emily Johnson" actions={<Button label="Save Notes" />} />
    <Section title="Student Overview">
      <Card title="Basic Info">
        <p><strong>Name:</strong> Emily Johnson</p>
        <p><strong>Grade:</strong> 6th</p>
        <p><strong>Teacher:</strong> Mr. Thompson</p>
        <p><strong>Meeting Time:</strong> Tomorrow at 3:00 PM</p>
      </Card>
    </Section>
    <Section title="Academic Progress">
      <Card title="Subject Performance">
        <DataTable
          columns={[{ label: "Subject" }, { label: "Last Grade" }, { label: "Change" }]}
          rows={[
            { cells: ["Math", "B", <Delta value={-1} basis={10} />] },
            { cells: ["English", "A", <Delta value={2} basis={10} />] },
            { cells: ["Science", "C", <Delta value={-3} basis={10} />] },
          ]}
        />
      </Card>
    </Section>
    <Section title="Behavior & Notes">
      <Card title="Recent Observations">
        <p>Emily has shown improvement in class participation but needs to manage distractions during group work.</p>
        <p>She is often the first to complete assignments but sometimes submits work without checking for accuracy.</p>
      </Card>
    </Section>
    <Section title="Discussion Points">
      <Card title="Suggested Topics">
        <ul>
          <li>Review recent academic performance and set goals for improvement</li>
          <li>Discuss strategies for managing distractions during group work</li>
          <li>Explore ways to encourage more careful review of assignments</li>
        </ul>
      </Card>
    </Section>
    <Section title="Additional Notes">
      <Card title="Teacher Notes">
        <p>Emily is a bright student with potential but needs guidance in self-regulation and attention to detail. Recommend a structured approach to homework and regular check-ins.</p>
      </Card>
    </Section>
  </Page>
);

export default Student;
