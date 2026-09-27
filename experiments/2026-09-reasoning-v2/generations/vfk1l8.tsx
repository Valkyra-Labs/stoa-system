import { Page, Header, Sidebar, Section, Card, Tabs, Button, FilterBar, SavedViews, EmptyData, Metric, Delta, DataTable, Comparison, Timeline, AuditLog, Status, Explorer, Inspector, Monitor, ReviewQueue, Dashboard } from "@stoa/react";

export default function PrepareParentMeeting() {
  return (
    <Page title="Prepare Parent Meeting">
      <Header title="Prepare Parent Meeting" subtitle="Student: Emma Johnson" actions={<Button label="Save" />} />
      <div style={{ display: "flex" }}>
        <Sidebar>
          <Section title="Students">
            <Card>
              <ul>
                <li><strong>Emma Johnson</strong> - Grade 3</li>
                <li>John Smith - Grade 3</li>
                <li>Maria Garcia - Grade 3</li>
              </ul>
            </Card>
          </Section>
        </Sidebar>
        <main style={{ flex: 1, padding: "1rem" }}>
          <Explorer
            toolbar={
              <FilterBar filters={[{ label: "Academic", selected: true }, { label: "Behavior", selected: false }]} />
            }
            table={
              <DataTable
                columns={[{ key: "subject", label: "Subject" }, { key: "score", label: "Score" }, { key: "trend", label: "Trend" }]}
                rows={[
                  { subject: "Math", score: "85", trend: <Trend series={[80, 85, 88]} /> },
                  { subject: "Reading", score: "92", trend: <Trend series={[88, 90, 92]} /> },
                  { subject: "Science", score: "78", trend: <Trend series={[75, 76, 78]} /> },
                ]}
              />
            }
            detail={
              <Card>
                <Section title="Behavior Notes">
                  <p>Emma has shown improvement in following classroom rules. She is often helpful to peers and participates in group activities.</p>
                </Section>
                <Section title="Academic Progress">
                  <Comparison
                    entities={[{ name: "Emma", metrics: { math: 85, reading: 92, science: 78 } }, { name: "Class Average", metrics: { math: 82, reading: 88, science: 76 } }]}
                  />
                </Section>
              </Card>
            }
          />
          <Section title="Meeting Preparation">
            <Card>
              <FilterBar filters={[{ label: "Academic", selected: true }, { label: "Behavior", selected: false }]} />
              <SavedViews views={["Academic Focus", "Behavior Focus", "Overall Summary"]} />
              <Button label="Send Summary" />
            </Card>
          </Section>
        </main>
      </div>
    </Page>
  );
}
