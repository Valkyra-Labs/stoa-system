import { Page, Header, Section, Card, Metric, Delta, Status, Timeline, DataTable, Comparison, Tabs, Tab, EmptyData, StaleData } from "@stoa/react";

const TermReport = () => {
  return (
    <Page title="Term Performance Report">
      <Header title="Term Performance Overview" subtitle="School Year 2023-2024" actions={[]} />
      
      <Section title="Key Metrics">
        <Card>
          <Metric label="Student Engagement Score" value="82%" delta={+3} unit="%" />
          <Metric label="Average Class Size" value="24" delta={-2} unit="students" />
          <Metric label="Budget Utilization" value="$1.2M" delta={-150000} unit="USD" />
          <Metric label="Staff Retention Rate" value="92%" delta={-2} unit="%" />
        </Card>
      </Section>

      <Section title="Performance Highlights">
        <Card>
          <Status tone="success" label="On Track for Academic Targets" />
          <Status tone="warning" label="Budget Overruns in STEM Department" />
          <Status tone="error" label="Low Engagement in Grade 3 Classes" />
        </Card>
      </Section>

      <Section title="Class Performance">
        <Comparison
          entities={["Grade 3", "Grade 5", "Grade 7"]}
          metrics={[
            { label: "Engagement Score", value: "78%", delta: +2 },
            { label: "Average Test Score", value: "72%", delta: -3 },
            { label: "Attendance Rate", value: "94%", delta: -1 }
          ]}
        />
      </Section>

      <Section title="Timeline of Key Events">
        <Timeline
          events={[
            { date: "2024-01-15", description: "New STEM Lab Installed" },
            { date: "2024-03-01", description: "Budget Revisions Approved" },
            { date: "2024-05-20", description: "End of Term Assessment Completed" }
          ]}
        />
      </Section>

      <Section title="Student Performance Data">
        <DataTable
          columns={["Student", "Engagement", "Test Score", "Attendance"]}
          rows={[
            ["Alex", "85%", "78%", "96%"],
            ["Jordan", "72%", "68%", "92%"],
            ["Sophia", "90%", "85%", "98%"]
          ]}
          selectable
          stickyFirstColumn
        />
      </Section>

      <Section title="Data Status">
        <StaleData since="2024-05-10" />
      </Section>
    </Page>
  );
};

export default TermReport;
