import { Page, Header, Section, Card, DataTable, Button, FilterBar, Tabs, Sidebar, Metric, Delta, Status, EmptyData } from "@stoa/react";

const failedPayouts = [
  {
    id: "P-1001",
    amount: "$150.00",
    merchant: "TechShop Inc.",
    status: "Failed",
    reason: "Bank account invalid",
    createdAt: "2023-10-05",
    lastAttempted: "2023-10-05",
    nextAttempt: "2023-10-06",
  },
  {
    id: "P-1002",
    amount: "$250.00",
    merchant: "FashionCo Ltd.",
    status: "Failed",
    reason: "Insufficient funds",
    createdAt: "2023-10-04",
    lastAttempted: "2023-10-04",
    nextAttempt: "2023-10-05",
  },
  {
    id: "P-1003",
    amount: "$300.00",
    merchant: "TravelHub Co.",
    status: "Failed",
    reason: "Transaction declined",
    createdAt: "2023-10-03",
    lastAttempted: "2023-10-03",
    nextAttempt: "2023-10-04",
  },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "merchant", label: "Merchant" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "reason", label: "Reason" },
  { key: "createdAt", label: "Created At" },
  { key: "nextAttempt", label: "Next Attempt" },
];

const PageComponent = () => (
  <Page title="Failed Payouts">
    <Header title="Failed Payouts" subtitle="Resolve failed transactions efficiently" actions={<Button label="Refresh" />} />
    <section className="flex gap-4">
      <FilterBar filters={[{ label: "Status", options: ["Failed", "Pending", "Resolved"] }]} />
      <Sidebar>
        <Card title="Bulk Actions">
          <Button label="Resolve Selected" variant="primary" />
          <Button label="Retry Selected" variant="secondary" />
        </Card>
        <Card title="Resolution Stats">
          <Metric label="Total Failed" value={failedPayouts.length} />
          <Delta value={failedPayouts.length} basis={failedPayouts.length - 1} />
          <Status tone="warning" label="Pending Review" />
        </Card>
      </Sidebar>
      <main>
        <Section title="Failed Payouts List">
          <DataTable
            columns={columns}
            rows={failedPayouts}
            selectable
            stickyFirstColumn
            onRowSelect={(id) => console.log(`Selected payout ${id}`)}
          />
        </Section>
      </main>
    </section>
  </Page>
);

export default PageComponent;
