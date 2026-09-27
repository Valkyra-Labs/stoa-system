import { Page, Header, Sidebar, Section, Card, Tabs, Metric, DataTable, Button, Status, EmptyData } from "@stoa/react";

type PayoutFailure = {
  id: string;
  amount: number;
  currency: string;
  merchantId: string;
  merchantName: string;
  failureReason: string;
  status: "pending" | "resolved" | "escalated";
  createdAt: string;
};

const placeholderData: PayoutFailure[] = [
  {
    id: "PKT-998877",
    amount: 1250.00,
    currency: "USD",
    merchantId: "MCH-4421",
    merchantName: "Global Electronics Ltd",
    failureReason: "Insufficient funds",
    status: "pending",
    createdAt: "2023-10-24T10:15:00Z",
  },
  {
    id: "PKT-998876",
    amount: 450.50,
    currency: "EUR",
    merchantId: "MCH-1102",
    merchantName: "Fashion Outlet Paris",
    failureReason: "Merchant declined",
    status: "pending",
    createdAt: "2023-10-24T09:45:00Z",
  },
  {
    id: "PKT-998875",
    amount: 8900.00,
    currency: "GBP",
    merchantId: "MCH-7733",
    merchantName: "Tech Supplies UK",
    failureReason: "Fraud detection trigger",
    status: "escalated",
    createdAt: "2023-10-24T08:30:00Z",
  },
  {
    id: "PKT-998874",
    amount: 320.00,
    currency: "USD",
    merchantId: "MCH-2211",
    merchantName: "Home Decor Inc",
    failureReason: "Account locked",
    status: "resolved",
    createdAt: "2023-10-23T14:20:00Z",
  },
  {
    id: "PKT-998873",
    amount: 120.75,
    currency: "CAD",
    merchantId: "MCH-5544",
    merchantName: "Canadian Retailers",
    failureReason: "Invalid card number",
    status: "pending",
    createdAt: "2023-10-23T11:10:00Z",
  },
  {
    id: "PKT-998872",
    amount: 5600.00,
    currency: "USD",
    merchantId: "MCH-9988",
    merchantName: "Industrial Parts Co",
    failureReason: "Regulatory approval pending",
    status: "pending",
    createdAt: "2023-10-23T09:00:00Z",
  },
];

export default function FailedPayoutsScreen() {
  return (
    <Page title="Failed Payouts Resolution">
      <Header
        title="Failed Payouts"
        subtitle="Work through outstanding transaction failures"
        actions={
          <div className="flex gap-2">
            <Button label="Export Report" variant="secondary" />
            <Button label="Clear Queue" onPress={() => alert("Queue cleared")} />
          </div>
        }
      />

      <Section title="Summary Metrics">
        <div className="flex gap-4">
          <Metric label="Total Failed" value={12} unit="payouts" />
          <Metric label="Pending Resolution" value={4} unit="items" />
          <Metric label="Avg Time to Resolve" value="1.2" unit="days" />
          <Metric label="Escalations" value={1} unit="pending" />
        </div>
      </Section>

      <Section title="Failure Queue">
        <Card title="Pending Failures">
          <DataTable
            columns={[
              { key: "id", label: "Transaction ID" },
              { key: "merchantName", label: "Merchant" },
              { key: "amount", label: "Amount" },
              { key: "currency", label: "Currency" },
              { key: "failureReason", label: "Failure Reason" },
              { key: "status", label: "Status" },
            ]}
            rows={placeholderData}
            selectable
            onRowSelect={(row) => console.log("Selected:", row)}
          />
        </Card>

        <Card title="Escalated Items">
          <DataTable
            columns={[
              { key: "id", label: "Transaction ID" },
              { key: "merchantName", label: "Merchant" },
              { key: "amount", label: "Amount" },
              { key: "currency", label: "Currency" },
              { key: "failureReason", label: "Failure Reason" },
              { key: "status", label: "Status" },
            ]}
            rows={placeholderData.filter((p) => p.status === "escalated")}
            selectable
          />
        </Card>
      </Section>

      <Section title="Resolution Actions">
        <Card title="Bulk Resolution">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button label="Retry All Pending" variant="primary" onPress={() => alert("Retry initiated")} />
              <Button label="Force Resolved" variant="secondary" onPress={() => alert("Force resolved")} />
              <Button label="Mark as Escalated" onPress={() => alert("Escalated")} />
            </div>
            <p className="text-sm text-gray-500">
              Select rows above to apply bulk actions. Individual row actions are available via the action menu in the table header.
            </p>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
