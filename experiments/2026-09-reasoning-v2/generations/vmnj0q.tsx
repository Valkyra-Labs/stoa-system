import { Page, Header, Section, Card, DataTable, Button, FilterBar, Tabs, Metric, Delta, Status, EmptyData } from "@stoa/react";

const failedPayouts = [
  {
    id: "PAYOUT-001",
    amount: "$150.00",
    method: "Bank Transfer",
    status: "Failed",
    error: "Invalid account number",
    timestamp: "2023-09-15T10:15:00Z",
    merchant: "TechShop Inc.",
    reason: "Account not found",
  },
  {
    id: "PAYOUT-002",
    amount: "$300.00",
    method: "PayPal",
    status: "Failed",
    error: "Transaction declined",
    timestamp: "2023-09-15T10:20:00Z",
    merchant: "FashionCo",
    reason: "Insufficient funds",
  },
  {
    id: "PAYOUT-003",
    amount: "$200.00",
    method: "Card",
    status: "Failed",
    error: "Card expired",
    timestamp: "2023-09-15T10:25:00Z",
    merchant: "BookStore",
    reason: "Expired credit card",
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
  { key: "error", label: "Error" },
  { key: "timestamp", label: "Timestamp" },
  { key: "merchant", label: "Merchant" },
  { key: "reason", label: "Reason" },
];

const filters = [
  { label: "Status", value: "Failed", type: "select", options: ["All", "Failed", "Pending", "Success"] },
  { label: "Merchant", value: "All", type: "select", options: ["All", "TechShop Inc.", "FashionCo", "BookStore"] },
];

const views = [
  { id: "all", label: "All" },
  { id: "failed", label: "Failed" },
  { id: "pending", label: "Pending" },
];

export default function FailedPayoutsPage() {
  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed Payouts"
        subtitle="Review and resolve failed payout transactions"
        actions={
          <Button variant="primary" onPress={() => {}}>
            Resolve Selected
          </Button>
        }
      />
      <FilterBar filters={filters} />
      <Section title="Overview">
        <Card>
          <Metric label="Total Failed Payouts" value={failedPayouts.length} />
          <Metric label="Average Failed Amount" value="$250.00" />
          <Metric label="Last 24h Failed" value="5" />
        </Card>
      </Section>
      <Section title="Failed Payouts">
        <DataTable
          columns={columns}
          rows={failedPayouts}
          selectable
          stickyFirstColumn
          onRowSelect={(selected) => console.log("Selected:", selected)}
        />
      </Section>
      <Section title="Resolution Actions">
        <Card>
          <Tabs items={[
            { id: "all", label: "All", content: <div>Resolution steps and guidance go here.</div> },
            { id: "failed", label: "Failed", content: <div>Specific steps for failed payouts.</div> },
            { id: "pending", label: "Pending", content: <div>Steps for pending transactions.</div> },
          ]} />
        </Card>
      </Section>
      <Section title="Status Summary">
        <Card>
          <Status tone="warning" label="High volume of failed payouts" />
          <Status tone="info" label="Last updated: 2023-09-15 10:30 AM" />
        </Card>
      </Section>
      <Section title="Audit Log">
        <Card>
          <AuditLog entries={[]} />
        </Card>
      </Section>
    </Page>
  );
}
