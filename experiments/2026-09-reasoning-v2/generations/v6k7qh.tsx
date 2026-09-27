import { Page, Header, Section, Card, Metric, Delta, DataTable, Button, FilterBar, SavedViews, EmptyData, Status, Tabs, Tab, Timeline, AuditLog, Comparison, Tabs, Tab, Section, Card, Metric, Delta, DataTable, Button, FilterBar, SavedViews, EmptyData, Status } from "@stoa/react";

const StudentProfile = () => {
  return (
    <Page title="Parent Meeting Prep: Emily Johnson">
      <Header title="Emily Johnson" subtitle="Grade 3, Class B" actions={<Button label="Save Notes" variant="primary" />} />
      <Section title="Student Overview">
        <Card title="Basic Info">
          <p><strong>Name:</strong> Emily Johnson</p>
          <p><strong>Grade:</strong> 3</p>
          <p><strong>Class:</strong> B</p>
          <p><strong>Teacher:</strong> Mr. Thompson</p>
        </Card>
        <Card title="Performance Summary">
          <Metric label="Math Grade" value="85%" unit="%" delta={<Delta value="5" basis="80%" />} />
          <Metric label="Reading Grade" value="78%" unit="%" delta={<Delta value="-3" basis="81%" />} />
          <Metric label="Attendance" value="92%" unit="%" delta={<Delta value="2" basis="90%" />} />
        </Card>
      </Section>
      <Section title="Behavior and Progress">
        <Card title="Behavior Log">
          <Timeline events={[
            { date: "2023-10-10", description: "Completed homework without supervision." },
            { date: "2023-10-05", description: "Fought with classmate, resolved with mediator." },
            { date: "2023-09-28", description: "Volunteered to help organize classroom materials." },
          ]} />
        </Card>
        <Card title="Progress Over Time">
          <Chart type="line" series={[{ name: "Math", data: [80, 82, 85, 87, 88] }, { name: "Reading", data: [75, 76, 77, 78, 78] }]} x="Week" y="Score" />
        </Card>
      </Section>
      <Section title="Comparisons">
        <Card title="Class Comparison">
          <Comparison entities={["Emily", "Liam", "Sophia"]} metrics={["Math Grade", "Reading Grade", "Attendance"]} />
        </Card>
      </Section>
      <Section title="Notes and Actions">
        <Card title="Teacher Notes">
          <p>Emily is showing strong improvement in math, but her reading comprehension needs more focus. She is generally well-behaved but occasionally struggles with following instructions during group work.</p>
        </Card>
        <Card title="Next Steps">
          <p>1. Recommend extra reading support during after-school hours.</p>
          <p>2. Suggest a parent-teacher conference to discuss strategies for improving focus.</p>
          <p>3. Send home a reading log to track progress.</p>
        </Card>
      </Section>
      <Section title="Audit Trail">
        <Card title="Recent Changes">
          <AuditLog entries={[
            { user: "Mr. Thompson", action: "Updated math grade", timestamp: "2023-10-12T14:30:00Z" },
            { user: "Mr. Thompson", action: "Added behavior note", timestamp: "2023-10-12T13:15:00Z" },
          ]} />
        </Card>
      </Section>
    </Page>
  );
};

export default StudentProfile;
