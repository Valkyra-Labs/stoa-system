import { Page, Header, Section, Card, DataTable, Button, FilterBar, EmptyData, Delta, Metric, Status, Tabs, Drawer, Metric, Delta, Status, EmptyData, PartialData, StaleData, ErrorData } from "@stoa/react";

const failedPayouts = [
  { id: "P-1001", amount: 500, reason: "Bank account invalid", status: "Failed", timestamp: "2023-10-05T14:30:00Z" },
  { id: "P-1002", amount: 200, reason: "Duplicate transaction", status: "Failed", timestamp: "2023-10-05T14:25:00Z" },
  { id: "P-1003", amount: 1500, reason: "Insufficient funds", status: "Failed", timestamp: "2023-10-05T14:20:00Z" },
  { id: "P-1004", amount: 750, reason: "Card expired", status: "Failed", timestamp: "2023-10-05T14:15:00Z" },
  { id: "P-1005", amount: 1000, reason: "Processing error", status: "Failed", timestamp: "2023-10-05T14:10:00Z" },
];

const resolvePayout = (id: string) => {
  // Simulate resolution
  console.log(`Resolving payout ${id}`);
};

const retryPayout = (id: string) => {
  // Simulate retry
  console.log(`Retrying payout ${id}`);
};

const viewDetails = (id: string) => {
  // Simulate viewing details
  console.log(`Viewing details for payout ${id}`);
};

const resolvePayouts = () => {
  // Simulate bulk resolution
  console.log("Resolving all failed payouts");
};

const retryPayouts = () => {
  // Simulate bulk retry
  console.log("Retrying all failed payouts");
};

const PageComponent = () => {
  return (
    <Page title="Failed Payouts">
      <Header title="Failed Payouts" subtitle="Resolve failed transactions" actions={
        <div>
          <Button label="Resolve All" onPress={resolvePayouts} variant="primary" />
          <Button label="Retry All" onPress={retryPayouts} variant="secondary" />
        </div>
      } />
      <FilterBar filters={[]} />
      <Section title="Failed Payouts">
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "amount", label: "Amount", format: (v) => <Metric label="Amount" value={v} unit="USD" /> },
            { key: "reason", label: "Reason" },
            { key: "status", label: "Status", format: (v) => <Status tone={v === "Failed" ? "error" : "success"} label={v} /> },
            { key: "timestamp", label: "Timestamp" },
            { key: "actions", label: "Actions" },
          ]}
          rows={failedPayouts}
          selectable
          stickyFirstColumn
          onRowSelect={(id) => {
            viewDetails(id);
          }}
        />
      </Section>
      <Section title="Summary">
        <Card>
          <p>Total Failed Payouts: <Metric label="Total" value={failedPayouts.length} unit="payouts" /></p>
          <p>Total Amount: <Metric label="Total" value={failedPayouts.reduce((sum, p) => sum + p.amount, 0)} unit="USD" /></p>
        </Card>
      </Section>
      <Section title="Recent Activity">
        <Card>
          <p>Most Recent Failed Payout: <Metric label="Most Recent" value={failedPayouts[0].id} /></p>
          <p>Most Recent Amount: <Metric label="Most Recent" value={failedPayouts[0].amount} unit="USD" /></p>
        </Card>
      </Section>
    </Page>
  );
};

export default PageComponent;
