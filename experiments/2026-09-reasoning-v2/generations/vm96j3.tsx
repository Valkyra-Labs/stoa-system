import { Page, Header, Section, Card, Tabs, Metric, Delta, Chart, DataTable, Timeline, Status, EmptyData, Button, FilterBar, SavedViews, Explorer, Inspector, Monitor, ReviewQueue, Dashboard, Metric, Delta, Trend, Chart, DataTable, Comparison, Timeline, AuditLog, Status, EmptyData, PartialData, StaleData, ErrorData, Button, BulkActions, FilterBar, SavedViews } from "@stoa/react";

export default function WeeklyFinanceOverview() {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Weekly Financial Summary" subtitle="Monday, April 8, 2024" actions={<Button label="Refresh" variant="primary" />} />
      <Section title="Key Metrics">
        <Card>
          <Metric label="Revenue" value="$12.5M" delta={+3.2} unit="USD" />
          <Metric label="Net Profit" value="$2.1M" delta={-0.8} unit="USD" />
          <Metric label="Operating Expenses" value="$4.8M" delta={+1.5} unit="USD" />
        </Card>
      </Section>
      <Section title="Trends & Charts">
        <Card>
          <Chart type="line" series={[{ name: "Revenue", data: [10, 12, 15, 14, 16, 18, 19] }]} />
          <Chart type="bar" series={[{ name: "Expenses", data: [4, 4.2, 4.5, 4.8, 5, 5.2, 5.5] }]} />
        </Card>
      </Section>
      <Section title="Recent Activity">
        <Card>
          <Timeline events={[
            { date: "Apr 1", description: "New client onboarded: TechCorp" },
            { date: "Apr 3", description: "Budget variance noted in R&D" },
            { date: "Apr 5", description: "Payment received from EU client" },
            { date: "Apr 7", description: "Invoice dispute resolved with North American client" }
          ]} />
        </Card>
      </Section>
      <Section title="Anomalies & Alerts">
        <Card>
          <Status tone="warning" label="High variance in Q3 marketing spend" />
          <Status tone="success" label="All accounts reconciled" />
        </Card>
      </Section>
      <Section title="Drill Down">
        <Card>
          <Explorer
            toolbar={<FilterBar filters={["Region", "Department", "Timeframe"]} />}
            table={
              <DataTable
                columns={["Date", "Department", "Revenue", "Expenses", "Profit"]}
                rows={[
                  ["Apr 1", "Sales", "$3.2M", "$1.1M", "$2.1M"],
                  ["Apr 2", "Marketing", "$1.8M", "$0.9M", "$0.9M"],
                  ["Apr 3", "R&D", "$2.4M", "$1.5M", "$0.9M"],
                  ["Apr 4", "Operations", "$2.3M", "$1.2M", "$1.1M"],
                  ["Apr 5", "Customer Support", "$1.5M", "$0.7M", "$0.8M"],
                  ["Apr 6", "IT", "$1.3M", "$0.6M", "$0.7M"],
                  ["Apr 7", "Finance", "$1.2M", "$0.5M", "$0.7M"]
                ]}
                selectable
                stickyFirstColumn
                onRowSelect={(row) => alert(`Selected row: ${row}`)}
              />
            }
            detail={
              <Inspector
                primary="Department"
                context="Sales"
                history={[
                  { date: "Apr 1", action: "New sales target set" },
                  { date: "Apr 3", action: "Sales rep John promoted" },
                  { date: "Apr 5", action: "Sales target exceeded" }
                ]}
                actions={<BulkActions actions={["View Details", "Export Data", "Send Report"]} />}
              />
            }
          />
        </Card>
      </Section>
    </Page>
  );
}
