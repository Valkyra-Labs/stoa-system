import { Page, Header, Section, Card, Metric, Delta, Status, EmptyData, Button, FilterBar, SavedViews, BulkActions, Explorer, Inspector, Tabs, Drawer, Timeline, AuditLog, DataTable, Comparison, Chart, Trend, Metric, Delta, Status, EmptyData, PartialData, StaleData, ErrorData, Button, FilterBar, SavedViews, BulkActions, Explorer, Inspector, Tabs, Drawer, Timeline, AuditLog, DataTable, Comparison, Chart, Trend } from "@stoa/react";

export default function PrepareForParentMeeting() {
  return (
    <Page title="Prepare for Parent Meeting">
      <Header title="Parent Meeting Prep" subtitle="Student: Emily Johnson" actions={<Button label="Save Notes" />} />
      <Section title="Student Overview">
        <Card title="Student Profile">
          <p><strong>Name:</strong> Emily Johnson</p>
          <p><strong>Grade:</strong> 6th</p>
          <p><strong>Class:</strong> Math 6A</p>
          <p><strong>Teacher:</strong> Mr. Thompson</p>
        </Card>
        <Card title="Performance Summary">
          <Metric label="Average Grade" value="78" unit="%" delta={<Delta value="5" basis="73" />} />
          <Metric label="Attendance" value="95%" unit="%" />
          <Metric label="Behavior Score" value="82" unit="%" />
          <Status tone="warning" label="Needs Improvement in Fractions" />
        </Card>
      </Section>
      <Section title="Recent Activity">
        <Explorer
          toolbar={
            <FilterBar filters={[{ label: "Last 30 Days", selected: true }, { label: "All Time" }]} />
          }
          table={
            <DataTable
              columns={[
                { key: "date", label: "Date" },
                { key: "subject", label: "Subject" },
                { key: "type", label: "Type" },
                { key: "note", label: "Note" }
              ]}
              rows={[
                { date: "2023-10-10", subject: "Math", type: "Assignment", note: "Missed 3 out of 5 questions on fractions." },
                { date: "2023-10-05", subject: "Science", type: "Quiz", note: "Scored 85% on the ecosystem quiz." },
                { date: "2023-09-28", subject: "Reading", type: "Behavior", note: "Distracted during group work." },
              ]}
            />
          }
          detail={
            <Inspector
              primary={
                <Card title="Last Assignment">
                  <p><strong>Date:</strong> 2023-10-10</p>
                  <p><strong>Subject:</strong> Math</p>
                  <p><strong>Type:</strong> Assignment</p>
                  <p><strong>Note:</strong> Missed 3 out of 5 questions on fractions.</p>
                </Card>
              }
              context={
                <Card title="Class Performance">
                  <Comparison
                    entities={[
                      { name: "Emily Johnson", metrics: [{ label: "Fractions", value: 68, delta: -12, basis: 80 }], },
                      { name: "Class Average", metrics: [{ label: "Fractions", value: 85, delta: 0, basis: 85 }], },
                    ]}
                  />
                </Card>
              }
            />
          }
        />
      </Section>
      <Section title="Next Steps">
        <Card title="Meeting Notes">
          <p>1. Discuss recent performance in fractions.</p>
          <p>2. Review missed assignments and identify support needs.</p>
          <p>3. Set goals for improving grades and behavior.</p>
        </Card>
        <Card title="Actions">
          <BulkActions>
            <Button label="Add Note" />
            <Button label="Schedule Follow-Up" />
            <Button label="Send Email" />
          </BulkActions>
        </Card>
      </Section>
    </Page>
  );
}
