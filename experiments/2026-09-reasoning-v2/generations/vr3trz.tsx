import { Page, Header, Section, Card, Metric, Delta, Status, EmptyData, StaleData, ErrorData, Comparison } from "@stoa/react";

export default function SchoolBoardReport() {
  return (
    <Page title="Term 4 Board Report">
      <Header title="Academic Performance & Operations" subtitle="Fiscal Year 2024" />
      
      <Section title="Critical Issues & Exceptions">
        <Card title="Schools Below Target">
          <Comparison
            entities={[
              { id: "s1", name: "Northwood Academy", status: "below" },
              { id: "s2", name: "Greenfield Middle", status: "below" },
              { id: "s3", name: "Oakridge Primary", status: "ontrack" },
              { id: "s4", name: "Westside High", status: "below" },
            ]}
            metrics={[
              { label: "Reading Proficiency", value: 72, target: 80, basis: "national avg" },
              { label: "Enrollment Growth", value: -4, target: 2, basis: "year-ago" },
              { label: "Budget Variance", value: 12, target: 0, basis: "approved", unit: "%" },
            ]}
          />
        </Card>
      </Section>

      <Section title="Operational Health & Stability">
        <Card title="Critical Alerts">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Status tone="error" label="Server Downtime - West Campus" />
            <Status tone="warning" label="Library Book Inventory Low" />
            <Status tone="neutral" label="IT Support Ticket Queue: 15 pending" />
          </div>
        </Card>

        <Card title="Financial Metrics">
          <Metric label="Total Revenue" value="4.2M" basis="Fiscal Year" unit="USD" />
          <Metric label="Operating Margin" value="18.5" basis="approved budget" unit="%" />
          <Metric label="Student-Teacher Ratio" value="16.2" basis="national standard" />
        </Card>
      </Section>

      <Section title="Data Integrity">
        <Card title="Data Freshness Check">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Metric label="Last Sync" value="2 hours ago" />
            <Status tone="success" label="All data current" />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <EmptyData title="Missing Department Data" message="No data available for South Regional School (closed)." />
          </div>
        </Card>
      </Section>
    </Page>
  );
}
