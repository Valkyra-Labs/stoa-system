import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, Button, FilterBar, SavedViews, BulkActions, Explorer, Inspector, Monitor, ReviewQueue, Dashboard, EmptyData, PartialData, StaleData, ErrorData, Status } from "@stoa/react";

export default function PrepareParentMeeting() {
  return (
    <Page title="Prepare Parent Meeting - Emma Johnson">
      <Header title="Emma Johnson - Parent Meeting" subtitle="Tomorrow at 3:00 PM" actions={<Button label="Save Notes" variant="primary" />} />
      <Sidebar>
        <Section title="Student Overview">
          <Card title="Academic Performance">
            <Metric label="Math" value="78" delta={-5} unit="%" />
            <Metric label="Reading" value="85" delta={+2} unit="%" />
            <Metric label="Writing" value="72" delta={-3} unit="%" />
          </Card>
          <Card title="Behavior & Attendance">
            <Metric label="Absences" value="2" unit="days" />
            <Metric label="Discipline" value="1" unit="incidents" />
            <Status tone="warning" label="Needs Improvement" />
          </Card>
        </Section>
        <Section title="Recent Progress">
          <Card>
            <p>Emma has shown improvement in reading comprehension but needs more support in math problem-solving. She is engaged in class but struggles with time management.</p>
          </Card>
        </Section>
      </Sidebar>
      <main>
        <Section title="Meeting Notes">
          <Card>
            <p>Plan to discuss Emma's progress in math, strategies for improving time management, and ways to support her at home. Include specific examples of her work and areas where she needs more practice.</p>
          </Card>
        </Section>
        <Section title="Preparation Checklist">
          <Card>
            <ul>
              <li>Review Emma's recent work samples</li>
              <li>Prepare 2-3 specific examples of her progress</li>
              <li>Identify 1-2 areas for improvement</li>
              <li>Plan 2-3 discussion questions for the parent</li>
            </ul>
          </Card>
        </Section>
      </main>
    </Page>
  );
}
