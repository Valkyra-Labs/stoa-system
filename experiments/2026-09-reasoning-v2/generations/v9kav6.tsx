import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Status,
  Timeline,
  DataTable,
  ReviewQueue,
  Button,
  EmptyData,
  Tabs,
  Drawer,
} from "@stoa/react";

const StudentOverview = () => {
  return (
    <Page title="Parent Meeting Preparation">
      <Header title="Student Profile" subtitle="Leo Martinez - 8th Grade">
        <Button label="Add to Meeting Notes" variant="primary" />
      </Header>

      <Sidebar>
        <Section title="Quick Reference">
          <Metric label="Attendance" value="94%" delta="+2%" />
          <Metric label="Behavior Score" value="8.2" delta="+0.5" />
          <Metric label="Grade Point" value="B+" />
        </Section>
        <Section title="Recent Parent Contact">
          <Status tone="info" label="Last call: 2 days ago" />
        </Section>
      </Sidebar>

      <main>
        <Section title="Current Status">
          <Card title="Academic Standing">
            <Metric label="Math" value="A-" />
            <Metric label="Science" value="B+" />
            <Metric label="English" value="A" />
          </Card>
        </Section>

        <Section title="Behavioral Timeline">
          <Timeline
            events={[
              { date: "Today", type: "positive", title: "Helped a peer with homework" },
              { date: "Yesterday", type: "neutral", title: "Late to class" },
              { date: "Oct 10", type: "positive", title: "Awarded class participation prize" },
              { date: "Oct 05", type: "concern", title: "Verbal disagreement with teacher" },
            ]}
          />
        </Section>

        <Section title="Meeting Agenda Items">
          <Tabs
            items={[
              { id: "concerns", label: "Concerns", content: "Attendance and behavior trends" },
              { id: "strengths", label: "Strengths", content: "Math improvement and peer help" },
              { id: "goals", label: "Goals", content: "Next semester targets" },
            ]}
          />
        </Section>

        <Section title="Parent Feedback History">
          <DataTable
            columns={[
              { key: "date", label: "Date" },
              { key: "topic", label: "Topic" },
              { key: "sentiment", label: "Sentiment" },
            ]}
            rows={[
              { date: "Sep 28", topic: "Math struggles", sentiment: "Concerned" },
              { date: "Sep 15", topic: "Club interest", sentiment: "Positive" },
              { date: "Aug 20", topic: "Sleep schedule", sentiment: "Neutral" },
            ]}
            selectable
          />
          <EmptyData
            message="No additional feedback entries"
            onRetry={() => {}}
          />
        </Section>

        <Section title="Meeting Priority Queue">
          <ReviewQueue
            items={[
              { id: 1, title: "Discuss Math intervention plan", priority: "High" },
              { id: 2, title: "Review club application", priority: "Medium" },
              { id: 3, title: "Address attendance concerns", priority: "High" },
            ]}
            current={0}
            onNext={() => {}}
            onPrev={() => {}}
          />
        </Section>
      </main>
    </Page>
  );
};

export default StudentOverview;
