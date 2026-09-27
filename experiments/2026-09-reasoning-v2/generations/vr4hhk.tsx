import { Page, Header, Section, Card, Tabs, Button, Metric, Delta, Status, EmptyData, DataTable, FilterBar, SavedViews, BulkActions } from "@stoa/react";

const StudentProfile = () => (
  <Page title="Parent Meeting Prep: Emily Chen">
    <Header title="Emily Chen" subtitle="Grade 8, Math" actions={<Button label="Save Notes" variant="primary" />} />
    <Section title="Student Overview">
      <Card title="Basic Info">
        <p><strong>Name:</strong> Emily Chen</p>
        <p><strong>Grade:</strong> 8</p>
        <p><strong>Teacher:</strong> Mr. Thompson</p>
        <p><strong>Parent Contact:</strong> emily.parent@example.com</p>
      </Card>
    </Section>
    <Section title="Academic Performance">
      <Card title="Math Performance">
        <Metric label="Current Grade" value="78%" unit="%" />
        <Delta value="-5%" basis="Last Term" />
        <Trend series={[75, 72, 68, 70, 78]} />
      </Card>
      <Card title="Comparisons">
        <Comparison entities={['Emily Chen', 'Class Average', 'Top 10%']} metrics={['Math Grade', 'Attendance', 'Homework Completion']} />
      </Card>
    </Section>
    <Section title="Behavior and Notes">
      <Card title="Behavior Log">
        <DataTable
          columns={['Date', 'Behavior', 'Notes']}
          rows={[
            ['2023-09-15', 'Late', 'Arrived 10 minutes late'],
            ['2023-09-12', 'Disruptive', 'Interrupted class twice'],
            ['2023-09-05', 'Positive', 'Helped a peer with homework']
          ]}
        />
      </Card>
      <Card title="Teacher Notes">
        <p>Emily has shown improvement in math recently but needs more support with algebra concepts. She is often distracted during lessons.</p>
      </Card>
    </Section>
    <Section title="Preparation">
      <Card title="Next Steps">
        <p>Discuss Emily's recent progress, address behavioral concerns, and outline a plan for improvement.</p>
        <BulkActions>
          <Button label="Add Note" variant="secondary" />
          <Button label="Schedule Follow-Up" variant="primary" />
        </BulkActions>
      </Card>
    </Section>
  </Page>
);

export default StudentProfile;
