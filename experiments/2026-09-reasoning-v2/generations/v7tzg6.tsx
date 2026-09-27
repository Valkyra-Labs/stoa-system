import { Page, Header, Section, Card, Tabs, Metric, Delta, Status, Button, EmptyData } from '@stoa/react';

const StudentProfile = () => (
  <Page title="Parent-Teacher Meeting Prep: Emma Johnson">
    <Header title="Emma Johnson" subtitle="Grade 3, Class 2B" actions={<Button label="Save Notes" variant="primary" />} />
    <Section title="Student Overview">
      <Card title="Basic Info">
        <p><strong>Name:</strong> Emma Johnson</p>
        <p><strong>Grade:</strong> 3</p>
        <p><strong>Class:</strong> 2B</p>
        <p><strong>Teacher:</strong> Mr. Thompson</p>
      </Card>
      <Card title="Recent Performance">
        <Metric label="Math Grade" value="B+" delta={-1} unit="out of A+" />
        <Metric label="Reading Grade" value="A" delta={0} unit="out of A+" />
        <Metric label="Attendance" value="95%" delta={-2} unit="%" />
        <Metric label="Behavior" value="Good" />
      </Card>
    </Section>
    <Section title="Academic Progress">
      <Tabs
        items={[
          { id: 'math', label: 'Math', content: <Card title="Math Progress"><p>Emma has shown consistent improvement in math, especially in multiplication and division. She needs more practice with fractions.</p></Card> },
          { id: 'reading', label: 'Reading', content: <Card title="Reading Progress"><p>Emma reads at an advanced level for her grade. She enjoys fiction and is often the first to finish reading assignments.</p></Card> },
          { id: 'writing', label: 'Writing', content: <Card title="Writing Progress"><p>Emma's writing skills are strong, but she needs to work on organizing her thoughts and using more descriptive language.</p></Card> },
        ]}
      />
    </Section>
    <Section title="Behavior and Attendance">
      <Card title="Behavior Summary">
        <p>Emma has been respectful and cooperative with classmates and teachers. She sometimes talks out of turn but is usually able to refocus when reminded.</p>
      </Card>
      <Card title="Attendance Record">
        <p>Emma has missed 5 days of school this term, mostly due to illness. She is generally punctual and participates in class activities.</p>
      </Card>
    </Section>
    <Section title="Preparation Notes">
      <Card title="Key Points to Discuss">
        <ul>
          <li>Emma's recent math progress and areas needing improvement.</li>
          <li>Her strong reading skills and interest in fiction.</li>
          <li>Her behavior and attendance record.</li>
        </ul>
      </Card>
      <Card title="Next Steps">
        <p>Discuss strategies to support Emma's math learning. Encourage her to continue reading independently. Suggest ways to improve her attendance.</p>
      </Card>
    </Section>
  </Page>
);

export default StudentProfile;
