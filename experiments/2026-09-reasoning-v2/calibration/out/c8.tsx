import { Page, Header, Section, Card, Metric, Delta, Chart, DataTable, Status, Tabs, Button, FilterBar, SavedViews, EmptyData, Timeline, AuditLog, Comparison, Explorer, Inspector, Monitor, ReviewQueue, Dashboard, Sidebar, Drawer, Tabs, Tab, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, EmptyData, PartialData, StaleData, ErrorData, Button, FilterBar, SavedViews, BulkActions } from "@stoa/react";

export default function TeacherReviewPage() {
  return (
    <Page title="Unit Test Review">
      <Header title="Unit Test Review" subtitle="Class of 28 students" actions={<Button label="Mark Again" variant="secondary" />} />
      
      <Section title="Class Overview">
        <Card title="Overall Performance">
          <Metric label="Average Score" value="68.5" unit="%" delta={{ value: 2.3, basis: "previous" }} />
          <Metric label="Pass Rate" value="65%" delta={{ value: -5, basis: "previous" }} />
          <Metric label="Highest Score" value="94" />
          <Metric label="Lowest Score" value="32" />
          <Status tone="warning" label="Below target" />
        </Card>
        
        <Card title="Student Distribution">
          <Chart type="bar" series={[{ name: "Above Average", value: 12 }, { name: "Average", value: 10 }, { name: "Below Average", value: 6 }]} />
        </Card>
      </Section>

      <Section title="Student Performance">
        <DataTable
          columns={[
            { name: "Student", sortable: true },
            { name: "Score", sortable: true },
            { name: "Status", sortable: true },
            { name: "Actions", sortable: false }
          ]}
          rows={[
            { Student: "Alice Johnson", Score: 88, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Bob Smith", Score: 55, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Charlie Brown", Score: 92, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Diana Prince", Score: 45, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Ethan Hunt", Score: 77, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Fiona Apple", Score: 63, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "George Washington", Score: 38, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Helen Keller", Score: 82, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Ian Fleming", Score: 70, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Julia Child", Score: 68, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Kevin Costner", Score: 59, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Linda Evans", Score: 91, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Mark Twain", Score: 65, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Nancy Drew", Score: 74, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Oliver Twist", Score: 49, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Peter Pan", Score: 81, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Quinn Jones", Score: 76, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Rachel Green", Score: 67, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Steve Jobs", Score: 56, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Tony Stark", Score: 89, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Ursula Le Guin", Score: 73, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Victor Hugo", Score: 62, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Walter White", Score: 47, Status: "Fail", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Xander Harris", Score: 78, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Yulia Volkova", Score: 85, Status: "Pass", Actions: <Button label="View" variant="secondary" /> },
            { Student: "Zachary Quinto", Score: 69, Status: "Pass", Actions: <Button label="View" variant="secondary" /> }
          ]}
          selectable
          stickyFirstColumn
          onRowSelect={(selectedRows) => console.log("Selected rows:", selectedRows)}
        />
      </Section>

      <Section title="Next Steps">
        <Card title="Intervention Plan">
          <Metric label="Students to Re-teach" value="6" />
          <Metric label="Students to Support" value="10" />
          <Metric label="Students to Praise" value="12" />
          <Button label="Create Plan" variant="primary" />
        </Card>
        
        <Card title="Review Queue">
          <ReviewQueue
            items={[
              { id: 1, title: "Alice Johnson", status: "Pass", score: 88 },
              { id: 2, title: "Bob Smith", status: "Fail", score: 55 },
              { id: 3, title: "Charlie Brown", status: "Pass", score: 92 },
              { id: 4, title: "Diana Prince", status: "Fail", score: 45 },
              { id: 5, title: "Ethan Hunt", status: "Pass", score: 77 },
              { id: 6, title: "Fiona Apple", status: "Pass", score: 63 },
              { id: 7, title: "George Washington", status: "Fail", score: 38 },
              { id: 8, title: "Helen Keller", status: "Pass", score: 82 },
              { id: 9, title: "Ian Fleming", status: "Pass", score: 70 },
              { id: 10, title: "Julia Child", status: "Pass", score: 68 },
              { id: 11, title: "Kevin Costner", status: "Fail", score: 59 },
              { id: 12, title: "Linda Evans", status: "Pass", score: 91 },
              { id: 13, title: "Mark Twain", status: "Pass", score: 65 },
              { id: 14, title: "Nancy Drew", status: "Pass", score: 74 },
              { id: 15, title: "Oliver Twist", status: "Fail", score: 49 },
              { id: 16, title: "Peter Pan", status: "Pass", score: 81 },
              { id: 17, title: "Quinn Jones", status: "Pass", score: 76 },
              { id: 18, title: "Rachel Green", status: "Pass", score: 67 },
              { id: 19, title: "Steve Jobs", status: "Fail", score: 56 },
              { id: 20, title: "Tony Stark", status: "Pass", score: 89 },
              { id: 21, title: "Ursula Le Guin", status: "Pass", score: 73 },
              { id: 22, title: "Victor Hugo", status: "Pass", score: 62 },
              { id: 23, title: "Walter White", status: "Fail", score: 47 },
              { id: 24, title: "Xander Harris", status: "Pass", score: 78 },
              { id: 25, title: "Yulia Volkova", status: "Pass", score: 85 },
              { id: 26, title: "Zachary Quinto", status: "Pass", score: 69 }
            ]}
            current={null}
            decision="Intervention"
          />
        </Card>
      </Section>

      <Section title="Audit Trail">
        <AuditLog entries={[
          { id: 1, user: "Teacher", action: "Marked test", timestamp: "2023-04-05T14:30:00Z" },
          { id: 2, user: "Teacher", action: "Reviewed test results", timestamp: "2023-04-05T15:15:00Z" },
          { id: 3, user: "Teacher", action: "Started intervention plan", timestamp: "2023-04-05T16:00:00Z" }
        ]} />
      </Section>
    </Page>
  );
}
