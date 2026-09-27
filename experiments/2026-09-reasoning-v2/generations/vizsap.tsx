import { Page, Header, Sidebar, Section, Card, Comparison, Timeline, DataTable, FilterBar, Button } from "@stoa/react";

const StudentPreparationPage = () => {
  return (
    <Page title="Parent-Teacher Meeting Prep: Emma Johnson">
      <Header
        title="Emma Johnson"
        subtitle="Parent-Teacher Meeting - Tomorrow at 3:00 PM"
        actions={
          <Button label="Save Draft" variant="secondary" />
        }
      />
      <Sidebar>
        <Section title="Student Overview">
          <Card>
            <p><strong>Grade:</strong> 5th</p>
            <p><strong>Class:</strong> Blue Class</p>
            <p><strong>Attendance:</strong> 95% (Last Month)</p>
            <p><s>Behavior: Average</s> <strong>Behavior:</strong> Needs Improvement</p>
          </Card>
        </Section>
        <Section title="Recent Events">
          <Timeline>
            <Timeline.Event date="2023-10-10" summary="Submitted 3 assignments late" />
            <Timeline.Event date="2023-10-05" summary="Received warning for disruptive behavior" />
            <Timeline.Event date="2023-09-28" summary="Participated in science fair" />
          </Timeline>
        </Section>
      </Sidebar>
      <main>
        <Section title="Performance Comparison">
          <Card>
            <Comparison
              entities={['Emma Johnson', 'Class Average']}
              metrics={[
                { label: 'Math Score', value: 78, unit: '%', delta: -5 },
                { label: 'Reading Score', value: 85, unit: '%', delta: +2 },
                { label: 'Science Score', value: 65, unit: '%', delta: -8 },
              ]}
            />
          </Card>
        </Section>
        <Section title="Recent Assignments">
          <FilterBar filters={[]} />
          <DataTable
            columns={['Subject', 'Assignment', 'Score', 'Due Date']}
            rows={[
              ['Math', 'Multiplication Quiz', '78%', '2023-10-10'],
              ['Reading', 'Book Report', '85%', '2023-10-05'],
              ['Science', 'Ecosystem Project', '65%', '2023-09-28'],
            ]}
          />
        </Section>
        <Section title="Meeting Notes">
          <Card>
            <p><strong>Notes:</strong> Emma has shown improvement in reading but needs more support in math. She is often distracted during lessons and has not completed assignments on time. Recommend a structured study plan and check-in with her parents.</p>
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default StudentPreparationPage;
