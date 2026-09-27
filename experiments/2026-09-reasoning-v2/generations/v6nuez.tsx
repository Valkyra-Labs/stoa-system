import { Page, Header, Sidebar, Section, Card, DataTable, Status, Button, EmptyData, FilterBar, BulkActions, Metric, Delta, Drawer } from "@stoa/react";

const FAILED_PAYOUTS: { id: string; amount: number; currency: string; status: string; reason: string; timestamp: string; user: string }[] = [
  { id: "TX-9921", amount: 450.00, currency: "USD", status: "FAILED", reason: "Insufficient funds", timestamp: "2023-10-24T10:30:00Z", user: "Alice M." },
  { id: "TX-9922", amount: 120.50, currency: "EUR", status: "FAILED", reason: "Invalid card BIN", timestamp: "2023-10-24T11:15:00Z", user: "Bob S." },
  { id: "TX-9923", amount: 3200.00, currency: "GBP", status: "FAILED", reason: "Fraud alert", timestamp: "2023-10-24T12:00:00Z", user: "Charlie D." },
  { id: "TX-9924", amount: 85.00, currency: "USD", status: "FAILED", reason: "Account frozen", timestamp: "2023-10-24T13:45:00Z", user: "Diana L." },
  { id: "TX-9925", amount: 1200.75, currency: "CAD", status: "FAILED", reason: "Network timeout", timestamp: "2023-10-24T14:20:00Z", user: "Evan R." },
  { id: "TX-9926", amount: 65.20, currency: "USD", status: "FAILED", reason: "Invalid recipient", timestamp: "2023-10-24T15:10:00Z", user: "Fiona K." },
];

const FilterBar = ({ filters }: { filters: Record<string, any> }) => (
  <FilterBar filters={filters} />
);

const BulkActions = ({ actions }: { actions: { id: string; label: string; onPress: () => void }[] }) => (
  <BulkActions actions={actions} />
);

const Drawer = ({ open, title, children }: { open: boolean; title: string; children: React.ReactNode }) => (
  <Drawer open={open} title={title}>
    {children}
  </Drawer>
);

const Inspector = ({ record }: { record: any }) => (
  <Section title="Transaction Details">
    <Card title="Metadata">
      <p><strong>ID:</strong> {record.id}</p>
      <p><strong>Amount:</strong> {record.amount} {record.currency}</p>
      <p><strong>User:</strong> {record.user}</p>
    </Card>
    <Card title="Error Analysis">
      <Status tone="error" label={record.reason} />
      <p className="mt-2 text-gray-600">The payout failed due to {record.reason}. This requires manual intervention or system retry.</p>
    </Card>
  </Section>
);

const Page = () => (
  <Page title="Failed Payouts Resolution">
    <Header title="Failed Payouts" subtitle="Resolve transaction failures" />
    
    <Section title="Filter & Search">
      <FilterBar filters={{ reason: "all", currency: "all", date: "today" }} />
    </Section>

    <Section title="Resolution Queue">
      <Card title="Failed Transactions">
        <DataTable
          columns={[
            { key: "id", label: "Transaction ID" },
            { key: "amount", label: "Amount" },
            { key: "currency", label: "Currency" },
            { key: "reason", label: "Failure Reason" },
            { key: "timestamp", label: "Time" },
            { key: "user", label: "User" },
            { key: "status", label: "Status" },
          ]}
          rows={FAILED_PAYOUTS}
          onRowSelect={(record) => {
            Drawer.open({
              open: true,
              title: `Inspect: ${record.id}`,
              children: <Inspector record={record} />,
            });
          }}
        />
      </Card>
    </Section>

    <Section title="Quick Actions">
      <Card title="Bulk Resolution">
        <BulkActions
          actions={[
            { id: "retry-all", label: "Retry All Selected", onPress: () => alert("Initiating retry sequence...") },
            { id: "escalate", label: "Escalate to Support", onPress: () => alert("Ticket created for support team.") },
          ]}
        />
      </Card>
    </Section>

    <Sidebar>
      <Section title="System Metrics">
        <Metric label="Total Failed" value={FAILED_PAYOUTS.length} />
        <Metric label="Resolved Today" value={3} />
        <Metric label="Avg Resolution Time" value="12" unit="min" />
      </Section>
    </Sidebar>
  </Page>
);

export default Page;
