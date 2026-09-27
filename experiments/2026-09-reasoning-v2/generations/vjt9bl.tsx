import { Page, Header, Section, DataTable, Button, BulkActions, FilterBar, EmptyData, StaleData, Delta, Metric, Card, Tabs, Tab, Status, Section, Card, Metric, Delta, Status, EmptyData, StaleData, Section, Card, Metric, Delta, Status, EmptyData, StaleData, Section, Card, Metric, Delta, Status, EmptyData, StaleData, Section, Card, Metric, Delta, Status, EmptyData, StaleData } from "@stoa/react";

const failedPayouts = [
  {
    id: "P-1001",
    merchant: "TechShop Inc.",
    amount: "$1200.00",
    currency: "USD",
    status: "failed",
    error: "PaymentDeclined",
    reason: "CardExpired",
    timestamp: "2023-10-05T14:32:00Z",
    retries: 0,
    lastAttempt: "2023-10-05T14:32:00Z",
    customerEmail: "customer@techshop.com",
    paymentMethod: "Card ending in 4242",
  },
  {
    id: "P-1002",
    merchant: "FashionHub Ltd.",
    amount: "$350.00",
    currency: "USD",
    status: "failed",
    error: "PaymentDeclined",
    reason: "InsufficientFunds",
    timestamp: "2023-10-05T13:15:00Z",
    retries: 1,
    lastAttempt: "2023-10-05T13:15:00Z",
    customerEmail: "customer@fashionhub.com",
    paymentMethod: "Card ending in 5105",
  },
  {
    id: "P-1003",
    merchant: "FoodDeliveries Co.",
    amount: "$85.00",
    currency: "USD",
    status: "failed",
    error: "PaymentDeclined",
    reason: "InvalidCardNumber",
    timestamp: "2023-10-05T11:45:00Z",
    retries: 2,
    lastAttempt: "2023-10-05T11:45:00Z",
    customerEmail: "customer@fooddeliveries.com",
    paymentMethod: "Card ending in 4539",
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "merchant", label: "Merchant" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "error", label: "Error" },
  { key: "reason", label: "Reason" },
  { key: "timestamp", label: "Last Attempt" },
  { key: "retries", label: "Retries" },
  { key: "customerEmail", label: "Customer Email" },
  { key: "paymentMethod", label: "Payment Method" },
];

const resolvePayout = (id: string) => {
  alert(`Resolved payout ${id}`);
};

const retryPayout = (id: string) => {
  alert(`Retried payout ${id}`);
};

const contactMerchant = (id: string) => {
  alert(`Contacted merchant for payout ${id}`);
};

const retryAll = () => {
  alert("Retried all failed payouts");
};

const resolveAll = () => {
  alert("Resolved all failed payouts");
};

const contactAll = () => {
  alert("Contacted merchants for all failed payouts");
};

const FailedPayoutsPage = () => {
  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed Payouts"
        subtitle="Review and resolve failed payment attempts"
        actions={
          <BulkActions>
            <Button label="Retry All" onPress={retryAll} variant="secondary" />
            <Button label="Resolve All" onPress={resolveAll} variant="secondary" />
            <Button label="Contact All" onPress={contactAll} variant="secondary" />
          </BulkActions>
        }
      />
      <FilterBar filters={[]} />
      <Section title="Failed Payouts">
        {failedPayouts.length > 0 ? (
          <DataTable
            columns={columns}
            rows={failedPayouts}
            selectable
            stickyFirstColumn
            onRowSelect={(selected) => {
              if (selected.length === 1) {
                const id = selected[0].id;
                const item = failedPayouts.find((p) => p.id === id);
                if (item) {
                  alert(`Selected payout ${id} for action`);
                }
              }
            }}
          />
        ) : (
          <EmptyData>
            <p>No failed payouts found.</p>
          </EmptyData>
        )}
      </Section>
      <Section title="Key Metrics">
        <Card>
          <Metric label="Total Failed Payouts" value={failedPayouts.length} unit="payouts" />
          <Delta value={failedPayouts.length} basis={10} tone="neutral" />
        </Card>
      </Section>
      <Section title="Recent Activity">
        <Card>
          <p>Review the most recent failed payouts and take action.</p>
        </Card>
      </Section>
    </Page>
  );
};

export default FailedPayoutsPage;
