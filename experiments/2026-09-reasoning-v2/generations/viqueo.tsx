import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Tabs,
  Drawer,
  Metric,
  FilterBar,
  Button,
  BulkActions,
  Status,
  EmptyData,
  PartialData,
  StaleData,
  ErrorData,
  DataTable,
  Comparison,
  Timeline,
  AuditLog,
  Monitor,
  ReviewQueue,
  Explorer,
  Compare,
  Inspector,
  Dashboard,
  Trend,
  Chart,
} from "@stoa/react";

// Mock Data
const FAILED_PAYOUTS: {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  reason: string;
  status: "pending" | "resolved" | "failed";
  timestamp: string;
  retryCount: number;
  details: {
    message: string;
    code: string;
  };
}[] = [
  {
    id: "F-1001",
    customerId: "CUST-8821",
    amount: 450.00,
    currency: "USD",
    reason: "Refused by Bank",
    status: "pending",
    timestamp: "2023-10-24T14:30:00Z",
    retryCount: 0,
    details: { message: "Card declined by issuing bank", code: "E001" },
  },
  {
    id: "F-1002",
    customerId: "CUST-9912",
    amount: 1200.50,
    currency: "USD",
    reason: "Timeout",
    status: "pending",
    timestamp: "2023-10-24T13:15:00Z",
    retryCount: 1,
    details: { message: "Network timeout during transfer", code: "E002" },
  },
  {
    id: "F-1003",
    customerId: "CUST-7744",
    amount: 75.00,
    currency: "EUR",
    reason: "Invalid Account",
    status: "pending",
    timestamp: "2023-10-24T11:45:00Z",
    retryCount: 2,
    details: { message: "Destination account number incorrect", code: "E003" },
  },
  {
    id: "F-1004",
    customerId: "CUST-5521",
    amount: 2300.00,
    currency: "USD",
    reason: "Compliance Hold",
    status: "resolved",
    timestamp: "2023-10-23T09:20:00Z",
    retryCount: 0,
    details: { message: "Flagged for manual review", code: "E004" },
  },
  {
    id: "F-1005",
    customerId: "CUST-3310",
    amount: 99.99,
    currency: "GBP",
    reason: "Refused by Bank",
    status: "failed",
    timestamp: "2023-10-22T16:00:00Z",
    retryCount: 3,
    details: { message: "Maximum retry limit reached", code: "E001" },
  },
];

export default function FailedPayoutsResolver() {
  const [selectedId, setSelectedId] = React.useState<string>(FAILED_PAYOUTS[0].id);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([FAILED_PAYOUTS[0].id]);
  const [filters, setFilters] = React.useState({ reason: "" });

  const selected = FAILED_PAYOUTS.find((p) => p.id === selectedId);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRetryAll = () => {
    console.log("Retrying selected:", selectedIds);
  };

  return (
    <Page title="Failed Payouts Resolver">
      <Header title="Failed Payouts" subtitle="Resolve and requeue failed transactions" />
      <main>
        <Section title="Queue Overview">
          <Metric label="Pending Resolution" value={FAILED_PAYOUTS.filter((p) => p.status === "pending").length} />
          <Metric label="Resolved Today" value={2} />
          <Metric label="Failed Permanently" value={1} />
        </Section>

        <Section title="Processing Queue">
          <ReviewQueue
            items={FAILED_PAYOUTS}
            current={selectedId}
            decision={
              <div className="decision-area">
                <Button
                  label="Retry Transaction"
                  onPress={() => {
                    console.log(`Retrying ${selected?.id}`);
                  }}
                  variant="primary"
                />
                <Button
                  label="Mark as Resolved"
                  onPress={() => {
                    console.log(`Marking ${selected?.id} as resolved`);
                  }}
                  variant="success"
                />
                <Button
                  label="Skip / Log Error"
                  onPress={() => {
                    console.log(`Skipping ${selected?.id}`);
                  }}
                  variant="danger"
                />
              </div>
            }
          />
        </Section>

        <Section title="Transaction Details">
          {selected ? (
            <Inspector
              primary={selected}
              context={
                <div>
                  <h3>Customer Info</h3>
                  <p>Customer ID: {selected.customerId}</p>
                  <p>Email: customer@{selected.customerId.split("-")[1]}.example.com</p>
                </div>
              }
              history={
                <Timeline
                  events={[
                    { time: "2023-10-24T14:30:00Z", event: "Initiated Payout" },
                    { time: "2023-10-24T14:30:05Z", event: "Bank Rejected" },
                  ]}
                />
              }
              actions={
                <BulkActions
                  actions={[
                    { label: "Retry", onPress: () => console.log("Retry") },
                    { label: "Log", onPress: () => console.log("Log") },
                  ]}
                />
              }
            />
          ) : (
            <EmptyData message="No transaction selected" />
          )}
        </Section>
      </main>
    </Page>
  );
}
