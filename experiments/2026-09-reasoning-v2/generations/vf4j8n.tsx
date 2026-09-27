import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Chart,
  DataTable,
  Status,
  Tabs,
  EmptyData,
  Button,
  Sidebar,
} from "@stoa/react";

const Header = ({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) => (
  <Header title={title} subtitle={subtitle} actions={actions} />
);

const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <Sidebar>{children}</Sidebar>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Section title={title}>{children}</Section>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card title={title}>{children}</Card>
);

const Metric = ({ label, value, delta, unit }: { label: string; value: string; delta?: number | null; unit?: string }) => (
  <Metric label={label} value={value} delta={delta} unit={unit} />
);

const Delta = ({ value, basis }: { value: number; basis: string }) => (
  <Delta value={value} basis={basis} />
);

const Chart = ({ type, series, x, y }: { type: "line" | "bar" | "scatter"; series: any; x: any; y: any }) => (
  <Chart type={type} series={series} x={x} y={y} />
);

const DataTable = ({ columns, rows, selectable, stickyFirstColumn, onRowSelect }: {
  columns: { key: string; label: string }[];
  rows: any[];
  selectable?: boolean;
  stickyFirstColumn?: boolean;
  onRowSelect?: (row: any) => void;
}) => (
  <DataTable columns={columns} rows={rows} selectable={selectable} stickyFirstColumn={stickyFirstColumn} onRowSelect={onRowSelect} />
);

const Status = ({ tone, label }: { tone: "success" | "warning" | "error"; label: string }) => (
  <Status tone={tone} label={label} />
);

const Tabs = ({ items }: { items: { id: string; label: string; content: React.ReactNode }[] }) => (
  <Tabs items={items} />
);

const EmptyData = () => (
  <EmptyData />
);

const Page = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Page title={title}>{children}</Page>
);

export default function SchoolTermReport() {
  // Executive Metrics
  const overallScore = "87.4";
  const enrollmentGrowth = "12.5%";
  const retentionRate = "94.2%";
  const budgetUtilization = "98.1%";

  // Cohort Data for Chart
  const cohortData = [
    { x: "Term 1", y: 78 },
    { x: "Term 2", y: 82 },
    { x: "Term 3", y: 87 },
    { x: "Term 4", y: 91 },
  ];

  // Departmental Performance Rows
  const departmentRows = [
    { id: "math", name: "Mathematics", score: "88.2", trend: "+2.1%", students: 145, status: "success" },
    { id: "science", name: "Science", score: "85.6", trend: "+1.4%", students: 132, status: "success" },
    { id: "literacy", name: "English Literacy", score: "91.0", trend: "+0.8%", students: 148, status: "success" },
    { id: "arts", name: "Visual Arts", score: "89.5", trend: "+3.2%", students: 98, status: "success" },
    { id: "sports", name: "Physical Ed", score: "84.1", trend: "-0.5%", students: 156, status: "warning" },
  ];

  return (
    <Page title="Annual Term Performance Report">
      <Header 
        title="Annual Term Performance Report" 
        subtitle="Fiscal Year 2023-2024 • Term 4"
        actions={
          <Button label="Export PDF" variant="secondary" />
        }
      />

      <main>
        {/* Top Level Executive Metrics */}
        <Section title="Executive Summary">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <Metric label="Overall Academic Score" value={overallScore} unit="%" delta={2.4} />
            <Metric label="Enrollment Growth" value={enrollmentGrowth} unit="%" delta={0.8} />
            <Metric label="Student Retention" value={retentionRate} unit="%" delta={null} />
            <Metric label="Budget Utilization" value={budgetUtilization} unit="%" delta={-0.1} />
          </div>
        </Section>

        {/* Middle Level: Trends and Charts */}
        <Section title="Academic Progression Trends">
          <Card title="School-Wide Academic Growth (Last 4 Terms)">
            <Chart 
              type="line" 
              series={["Academic Score"]} 
              x={cohortData.map(d => d.x)} 
              y={cohortData.map(d => d.y)} 
            />
          </Card>
        </Section>

        {/* Bottom Level: Detailed Table */}
        <Section title="Departmental Performance Breakdown">
          <Card title="Cohort Metrics & Trends">
            <DataTable 
              columns={[
                { key: "name", label: "Department" },
                { key: "score", label: "Avg. Score" },
                { key: "trend", label: "YoY Change" },
                { key: "students", label: "Active Students" },
                { key: "status", label: "Status" }
              ]}
              rows={departmentRows}
              selectable={true}
              onRowSelect={(row) => console.log("Selected:", row)}
            />
          </Card>
        </Section>

        {/* Supporting Context / Sidebar */}
        <aside>
          <Sidebar title="Operational Health & Audit">
            <Section title="Critical Alerts">
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Status tone="warning" label="Science Lab Equipment Maintenance Due" />
                <Status tone="success" label="IT Infrastructure Status: Operational" />
                <Status tone="success" label="Safety Protocols: Compliant" />
              </div>
            </Section>

            <Section title="Recent Audit Log">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Student Records Sync</span>
                  <span>2 mins ago</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Financial Reconciliation</span>
                  <span>1 hour ago</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Staff Onboarding Review</span>
                  <span>3 hours ago</span>
                </div>
              </div>
            </Section>

            <Section title="Term Goals vs Actuals">
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Academic Excellence</span>
                    <span>100% Achieved</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ flex: 1, background: "#e0e0e0", height: "10px", borderRadius: "4px" }}>
                      <div style={{ width: "100%", background: "#4caf50", height: "100%", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Financial Sustainability</span>
                    <span>98% Achieved</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ flex: 1, background: "#e0e0e0", height: "10px", borderRadius: "4px" }}>
                      <div style={{ width: "98%", background: "#2196f3", height: "100%", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </Sidebar>
        </aside>
      </main>
    </Page>
  );
}
