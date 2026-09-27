import { Page, Header, Section, Card, Metric, Delta, Status, Button, FilterBar, Tabs, DataTable, Comparison, Timeline, AuditLog, EmptyData, SavedViews, BulkActions, Explorer, Inspector, Monitor, ReviewQueue, Dashboard, Sidebar, Drawer, Tabs, Tab, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, EmptyData, PartialData, StaleData, ErrorData, Button, FilterBar, SavedViews, BulkActions, Explorer, Inspector, Monitor, ReviewQueue, Dashboard, Page, Header, Section, Card, Tabs, Tab, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, EmptyData, PartialData, StaleData, ErrorData, Button, FilterBar, SavedViews, BulkActions, Explorer, Inspector, Monitor, ReviewQueue, Dashboard, Page, Header, Section, Card, Tabs, Tab, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, EmptyData, PartialData, StaleData, ErrorData, Button, FilterBar, SavedViews, BulkActions, Explorer, Inspector, Monitor, ReviewQueue, Dashboard } from "@stoa/react";

// Step 1: The person and the session
// A teacher who has just marked a class test, reviewing the results to assess class performance and plan next steps.

// Step 2: The shape of the work
// The teacher is getting a general picture of many unrelated numbers (student scores) and may decide on actions elsewhere (like interventions or curriculum adjustments).

// Step 3: The information
// Entities: Students, class performance metrics (average score, pass rate, etc.), time frame: current test.
// Values are judged against targets (passing score), previous period (last test), and peers (class average).
// Values that change the next step: scores below passing threshold, significant drop from previous test.

// Step 4: The decision and its evidence
// The teacher decides on interventions, curriculum adjustments, or further assessments.
// Evidence includes student scores, class trends, and individual performance history.
// A wrong decision could impact student learning, but some actions can be undone (like revising the curriculum).

// Step 5: The structure
// The screen should first show an overview of class performance with metrics and comparisons.
// Then, a detailed view of individual student scores, with the ability to filter and select students.
// Finally, a section for the teacher to decide on next steps and actions.

export default function ReviewTestResults() {
  return (
    <Page title="Test Results Review">
      <Header title="Class Test Results" subtitle="Review and decide on next steps" actions={<Button label="Save" />} />
      <Section title="Class Overview">
        <Card title="Class Performance">
          <Metric label="Average Score" value="68.5" unit="%" delta={{ value: -4.2, basis: "Last Test" }} />
          <Metric label="Pass Rate" value="62" unit="%" delta={{ value: -5, basis: "Last Test" }} />
          <Metric label="Highest Score" value="95" unit="%" />
          <Metric label="Lowest Score" value="25" unit="%" />
          <Status tone="warning" label="4 students scored below passing threshold (50%)" />
        </Card>
        <Card title="Comparison with Previous Test">
          <Comparison
            entities={["This Test", "Last Test"]}
            metrics={[
              { label: "Average Score", value: 68.5, delta: -4.2 },
              { label: "Pass Rate", value: 62, delta: -5 },
              { label: "Highest Score", value: 95 },
              { label: "Lowest Score", value: 25 },
            ]}
          />
        </Card>
      </Section>
      <Section title="Student Performance">
        <Explorer
          toolbar={
            <FilterBar filters={[{ label: "Score Range", value: "60-100" }]} />
          }
          table={
            <DataTable
              columns={[
                { key: "student", label: "Student" },
                { key: "score", label: "Score", variant: "numeric" },
                { key: "status", label: "Status", variant: "status" },
                { key: "actions", label: "Actions", variant: "actions" },
              ]}
              rows={[
                { student: "Alice", score: 78, status: "Pass", actions: <Button label="View" /> },
                { student: "Bob", score: 55, status: "Fail", actions: <Button label="View" /> },
                { student: "Charlie", score: 89, status: "Pass", actions: <Button label="View" /> },
                { student: "David", score: 45, status: "Fail", actions: <Button label="View" /> },
                { student: "Eve", score: 92, status: "Pass", actions: <Button label="View" /> },
                { student: "Frank", score: 38, status: "Fail", actions: <Button label="View" /> },
              ]}
              selectable
              onRowSelect={(selected) => console.log("Selected:", selected)}
            />
          }
          detail={
            <Inspector
              primary={
                <Card title="Student Details">
                  <Metric label="Score" value="78" unit="%" />
                  <Metric label="Previous Score" value="72" unit="%" delta={{ value: 6, basis: "Last Test" }} />
                  <Status tone="info" label="Needs additional support" />
                </Card>
              }
              context={
                <Card title="Class Context">
                  <Metric label="Class Average" value="68.5" unit="%" />
                  <Metric label="Pass Rate" value="62" unit="%" />
                  <Status tone="warning" label="4 students scored below passing threshold (50%)" />
                </Card>
              }
            />
          }
        />
      </Section>
      <Section title="Next Steps">
        <Card title="Decisions">
          <Tabs items={[
            { id: "interventions", label: "Interventions", content: <Card title="Interventions"><Metric label="Students needing support" value="4" unit="students" /></Card> },
            { id: "curriculum", label: "Curriculum", content: <Card title="Curriculum"><Metric label="Topics to review" value="3" unit="topics" /></Card> },
            { id: "assessments", label: "Assessments", content: <Card title="Assessments"><Metric label="Retakes scheduled" value="2" unit="students" /></Card> },
          ]} />
          <BulkActions actions={[{ label: "Mark as Reviewed", action: () => console.log("Marked as reviewed") }]} />
        </Card>
        <Card title="Timeline of Actions">
          <Timeline events={[
            { date: "2023-10-01", description: "Test marked and results reviewed" },
            { date: "2023-10-05", description: "Interventions scheduled for 4 students" },
            { date: "2023-10-10", description: "Curriculum review initiated" },
            { date: "2023-10-15", description: "Retake scheduled for 2 students" },
          ]} />
        </Card>
      </Section>
    </Page>
  );
}
