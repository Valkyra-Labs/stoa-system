import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Tabs,
  Drawer,
  Metric,
  EmptyData,
  StaleData,
  ErrorData,
  FilterBar,
  Button,
  BulkActions,
  DataTable,
  Comparison,
  Status,
  AuditLog,
  Timeline,
} from "@stoa/react";

type FailureType = "timeout" | "insufficient_funds" | "fraud" | "invalid_account";

interface FailureRecord {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "in_progress" | "resolved";
  failureType: FailureType;
  timestamp: string;
  customerName: string;
  errorCode: string;
  retryCount: number;
}

const failures: FailureRecord[] = [
  {
    id: "PAY-001",
    amount: 1250.00,
    currency: "USD",
    status: "in_progress",
    failureType: "fraud",
    timestamp: "2023-10-24T10:15:00Z",
    customerName: "Alice Johnson",
    errorCode: "FRAUD_MATCH",
    retryCount: 0,
  },
  {
    id: "PAY-002",
    amount: 450.00,
    currency: "USD",
    status: "pending",
    failureType: "insufficient_funds",
    timestamp: "2023-10-24T09:30:00Z",
    customerName: "Bob Smith",
    errorCode: "INSUFF_FUNDS",
    retryCount: 1,
  },
  {
    id: "PAY-003",
    amount: 2100.50,
    currency: "EUR",
    status: "resolved",
    failureType: "timeout",
    timestamp: "2023-10-23T14:20:00Z",
    customerName: "Charlie Davis",
    errorCode: "TIMEOUT",
    retryCount: 3,
  },
  {
    id: "PAY-004",
    amount: 89.99,
    currency: "USD",
    status: "pending",
    failureType: "invalid_account",
    timestamp: "2023-10-24T11:00:00Z",
    customerName: "Diana Evans",
    errorCode: "INVALID_ACC",
    retryCount: 0,
  },
  {
    id: "PAY-005",
    amount: 3200.00,
    currency: "USD",
    status: "in_progress",
    failureType: "fraud",
    timestamp: "2023-10-24T08:45:00Z",
    customerName: "Ethan Wright",
    errorCode: "SUSPICIOUS_IP",
    retryCount: 0,
  },
  {
    id: "PAY-006",
    amount: 150.00,
    currency: "USD",
    status: "pending",
    failureType: "insufficient_funds",
    timestamp: "2023-10-24T10:00:00Z",
    customerName: "Fiona Green",
    errorCode: "INSUFF_FUNDS",
    retryCount: 2,
  },
];

const columns = [
  { key: "id", label: "ID", sticky: true },
  { key: "customerName", label: "Customer" },
  { key: "amount", label: "Amount", align: "right" },
  { key: "currency", label: "Currency" },
  { key: "failureType", label: "Type" },
  { key: "errorCode", label: "Error Code" },
  { key: "retryCount", label: "Retries", align: "right" },
  { key: "status", label: "Status" },
  { key: "timestamp", label: "Time" },
];

const types: FailureType[] = ["fraud", "insufficient_funds", "timeout", "invalid_account"];

export default function FailedPayoutsScreen() {
  const [activeTab, setActiveTab] = React.useState<"all" | "fraud" | "in_progress">("all");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isBulkOpen, setIsBulkOpen] = React.useState(false);

  const filteredFailures =
    activeTab === "all"
      ? failures
      : failures.filter((f) => f.failureType === activeTab || (activeTab === "in_progress" && f.status === "in_progress"));

  const handleBulkAction = () => {
    // Bulk action confirmation logic here
    alert(`Bulk action applied to ${selectedIds.length} records.`);
    setIsBulkOpen(false);
    setSelectedIds([]);
  };

  const selectedCount = filteredFailures.filter((f) => selectedIds.includes(f.id)).length;

  return (
    <Page title="Failed Payouts Resolution">
      <Header title="Failed Payouts" subtitle="Resolve and reattempt failed transactions" />

      <Section title="Overview Metrics">
        <Comparison entities={["this_week", "last_week"]} metrics={[
          { label: "Total Failed", value: 142, delta: 12, basis: "last_week", unit: "count" },
          { label: "Amount at Risk", value: 45200.50, delta: -1200.00, basis: "last_week", unit: "USD" },
          { label: "Fraud Flagged", value: 28, delta: 5, basis: "last_week", unit: "count" },
          { label: "Avg Retry Cost", value: 15.50, delta: 2.30, basis: "last_week", unit: "USD" },
        ]} />
      </Section>

      <Section title="Failure Queue">
        <FilterBar filters={{ type: ["all", "fraud", "insufficient_funds", "timeout", "invalid_account"], status: ["all", "pending", "in_progress", "resolved"] }} />
        <Tabs items={[
          { id: "all", label: "All Failures" },
          { id: "fraud", label: "Fraud Suspects" },
          { id: "in_progress", label: "Pending Review" },
        ]} />

        <Card title="Failed Transactions">
          <DataTable
            columns={columns}
            rows={filteredFailures}
            selectable={true}
            onRowSelect={(id) => {
              setSelectedIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              );
            }}
          />
          <BulkActions actions={[
            { label: "Mark Resolved", onPress: () => setIsBulkOpen(true) },
            { label: "Force Retry", onPress: () => setIsBulkOpen(true) },
            { label: "Reject", onPress: () => setIsBulkOpen(true) },
          ]} selectedCount={selectedCount} />
        </Card>
      </Section>

      <Section title="Recent Audit Log">
        <AuditLog entries={[
          { action: "Flagged as Fraud", user: "System Bot", time: "2023-10-24T10:15:02Z", id: "PAY-001" },
          { action: "Retry Attempt 1", user: "Ops Team", time: "2023-10-24T09:35:00Z", id: "PAY-002" },
          { action: "Manual Override", user: "Alice", time: "2023-10-23T15:00:00Z", id: "PAY-003" },
        ]} />
      </Section>

      <Section title="Detailed Timeline (Sample)">
        <Timeline events={[
          { time: "2023-10-24T10:15:00Z", label: "Transaction Initiated", type: "info" },
          { time: "2023-10-24T10:15:05Z", label: "Gateway Timeout", type: "error" },
          { time: "2023-10-24T10:15:10Z", label: "Fraud Check Triggered", type: "warning" },
          { time: "2023-10-24T10:15:15Z", label: "Block Decision", type: "error" },
        ]} />
      </Section>

      <Section title="System Status">
        <Status tone="warning" label="Data Stale: Last sync 5 mins ago" />
        <Status tone="error" label="Gateway Connection: Unstable" />
      </Section>

      {selectedCount > 0 && (
        <Drawer title="Confirm Bulk Actions" open={isBulkOpen} onClose={() => setIsBulkOpen(false)}>
          <p>You are about to apply the selected action to {selectedCount} records:</p>
          <ul>
            {selectedIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
          <div>
            <Button label="Confirm Action" onPress={handleBulkAction} variant="primary" />
            <Button label="Cancel" onPress={() => setIsBulkOpen(false)} variant="secondary" />
          </div>
          <p style={{ fontSize: "0.8rem", color: "#666" }}>This action cannot be undone.</p>
        </Drawer>
      )}
    </Page>
  );
}
