import { Page, Header, Section, Card, Button, DataTable, FilterBar, Metric, Delta, Status, EmptyData } from "@stoa/react";

const failedPayouts = [
  {
    id: "P-1001",
    amount: "$150.00",
    status: "Failed",
    error: "Invalid bank account",
    timestamp: "2023-10-05T14:32:18Z",
    retryCount: 2,
    lastAttempt: "2023-10-05T14:32:18Z",
    resolution: "Pending",
  },
  {
    id: "P-1002",
    amount: "$250.00",
    status: "Failed",
    error: "Insufficient funds",
    timestamp: "2023-10-05T14:28:45Z",
    retryCount: 0,
    lastAttempt: "2023-10-05T14:28:45Z",
    resolution: "Escalated",
  },
  {
    id: "P-1003",
    amount: "$100.00",
    status: "Failed",
    error: "Network timeout",
    timestamp: "2023-10-05T14:25:12Z",
    retryCount: 1,
    lastAttempt: "2023-10-05T14:25:12Z",
    resolution: "Pending",
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "error", label: "Error" },
  { key: "timestamp", label: "Timestamp" },
  { key: "retryCount", label: "Retry Count" },
  { key: "resolution", label: "Resolution" },
];

const resolvePayout = (id: string) => {
  alert(`Resolved payout ${id}`);
};

const retryPayout = (id: string) => {
  alert(`Retrying payout ${id}`);
};

const escalatePayout = (id: string) => {
  alert(`Escalating payout ${id}`);
};

export default function FailedPayoutsPage() {
  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed Payouts"
        subtitle="Review and resolve failed payout attempts"
        actions={
          <Button variant="primary">New Search</Button>
        }
      />
      <FilterBar filters={[]} />
      <Section title="Overview">
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <Metric label="Total Failed Payouts" value={failedPayouts.length} />
          <Metric label="Pending Resolutions" value={failedPayouts.filter(p => p.resolution === "Pending").length} />
          <Metric label="Escalated" value={failedPayouts.filter(p => p.resolution === "Escalated").length} />
        </div>
      </Section>
      <Section title="Failed Payouts">
        <DataTable
          columns={columns}
          rows={failedPayouts}
          selectable
          onRowSelect={(selected) => {
            if (selected.length === 1) {
              const payout = selected[0];
              alert(`Selected payout: ${payout.id}`);
            }
          }}
        />
      </Section>
      <Section title="Resolution Actions">
        <Card title="Resolution Options">
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={() => resolvePayout("P-1001")}>
              Resolve
            </Button>
            <Button variant="secondary" onClick={() => retryPayout("P-1001")}>
              Retry
            </Button>
            <Button variant="secondary" onClick={() => escalatePayout("P-1001")}>
              Escalate
            </Button>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
