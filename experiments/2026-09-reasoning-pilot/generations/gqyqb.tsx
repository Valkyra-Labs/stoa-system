import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Delta,
  Trend,
  DataTable,
  AuditLog,
  Status,
  FilterBar,
  SavedViews,
  Button,
  ReviewQueue,
  Inspector,
} from "@stoa/react";

const filters = [
  { id: "reason", label: "Failure reason", value: "all" },
  { id: "provider", label: "Provider", value: "all" },
  { id: "dateRange", label: "Date range", value: "last_7_days" },
  { id: "amount", label: "Amount", value: "any" },
];

const savedViews = [
  { id: "aging-over-3d", label: "Aging over 3 days", active: true },
  { id: "high-value", label: "High value (> $1,000)", active: false },
  { id: "insufficient-funds", label: "Insufficient funds", active: false },
  { id: "retried-once", label: "Already retried once", active: false },
];

const failedPayouts = [
  {
    id: "po_8841",
    merchant: "Northwind Traders",
    amount: "$2,450.00",
    reason: "Insufficient funds",
    provider: "Stripe",
    failedAt: "2026-09-24 09:12",
    age: "3d 4h",
    attempts: 2,
  },
  {
    id: "po_8839",
    merchant: "Blue Harbor Cafe",
    amount: "$186.20",
    reason: "Bank account closed",
    provider: "Plaid",
    failedAt: "2026-09-25 14:03",
    age: "2d 0h",
    attempts: 1,
  },
  {
    id: "po_8830",
    merchant: "Fjord Analytics AB",
    amount: "$9,120.00",
    reason: "Compliance hold",
    provider: "Wise",
    failedAt: "2026-09-23 22:41",
    age: "3d 15h",
    attempts: 0,
  },
  {
    id: "po_8825",
    merchant: "Terra Greenhouse Co",
    amount: "$540.00",
    reason: "Invalid routing number",
    provider: "Stripe",
    failedAt: "2026-09-26 08:55",
    age: "1d 5h",
    attempts: 1,
  },
  {
    id: "po_8819",
    merchant: "Solace Wellness Studio",
    amount: "$1,275.50",
    reason: "Insufficient funds",
    provider: "Adyen",
    failedAt: "2026-09-22 11:30",
    age: "4d 6h",
    attempts: 3,
  },
  {
    id: "po_8812",
    merchant: "Meridian Freight LLC",
    amount: "$6,300.00",
    reason: "Bank account closed",
    provider: "Plaid",
    failedAt: "2026-09-25 19:47",
    age: "1d 18h",
    attempts: 1,
  },
];

const currentPayout = failedPayouts[0];

const auditEntries = [
  {
    id: "evt_1",
    timestamp: "2026-09-24 09:12",
    actor: "system",
    action: "Payout attempt failed: insufficient funds in source account",
  },
  {
    id: "evt_2",
    timestamp: "2026-09-24 09:13",
    actor: "system",
    action: "Merchant notified via email",
  },
  {
    id: "evt_3",
    timestamp: "2026-09-25 16:40",
    actor: "priya.nair@ops",
    action: "Reviewed payout, requested balance recheck",
  },
  {
    id: "evt_4",
    timestamp: "2026-09-26 07:05",
    actor: "system",
    action: "Balance recheck failed, still insufficient",
  },
];

const inspectorPrimary = (
  <div>
    <h2>{currentPayout.merchant}</h2>
    <p>Payout {currentPayout.id}</p>
    <Metric label="Amount" value={currentPayout.amount} />
    <Status tone="error" label="Failed" />
  </div>
);

const inspectorContext = (
  <div>
    <Metric label="Provider" value={currentPayout.provider} />
    <Metric label="Failure reason" value={currentPayout.reason} />
    <Metric label="Attempts" value={String(currentPayout.attempts)} />
    <Metric label="Age" value={currentPayout.age} />
  </div>
);

const inspectorHistory = <AuditLog entries={auditEntries} />;

const inspectorActions = (
  <div>
    <Button label="View raw payload" variant="secondary" onPress={() => {}} />
    <Button label="Open merchant profile" variant="secondary" onPress={() => {}} />
  </div>
);

const decisionPanel = (
  <div>
    <Button label="Retry payout" variant="primary" onPress={() => {}} />
    <Button label="Issue refund" variant="secondary" onPress={() => {}} />
    <Button label="Escalate to finance" variant="secondary" onPress={() => {}} />
    <Button label="Mark resolved" variant="ghost" onPress={() => {}} />
  </div>
);

const currentInspector = (
  <Inspector
    primary={inspectorPrimary}
    context={inspectorContext}
    history={inspectorHistory}
    actions={inspectorActions}
  />
);

export default function FailedPayoutsQueue() {
  return (
    <Page title="Failed Payouts">
      <Sidebar>
        <nav>
          <p>Payouts</p>
          <p>Disputes</p>
          <p>Settlements</p>
          <p>Reconciliation</p>
        </nav>
      </Sidebar>

      <Header
        title="Failed Payouts"
        subtitle="6 payouts require action before end of day"
        actions={[
          <Button label="Export queue" variant="secondary" onPress={() => {}} />,
          <Button label="Refresh" variant="secondary" onPress={() => {}} />,
        ]}
      />

      <Section title="Overview">
        <Card title="Open failures">
          <Metric label="Failed payouts" value="6" />
          <Delta value="+2" basis="vs yesterday" />
        </Card>
        <Card title="Value at risk">
          <Metric label="Total amount" value="$19,871.70" unit="USD" />
          <Trend series={[3, 5, 4, 6, 8, 6, 6]} />
        </Card>
        <Card title="Oldest unresolved">
          <Metric label="Age" value="4d 6h" />
          <Status tone="warning" label="Escalation due" />
        </Card>
      </Section>

      <Section title="Work the queue">
        <FilterBar filters={filters} />
        <SavedViews views={savedViews} />
        <DataTable
          columns={[
            { key: "id", label: "Payout" },
            { key: "merchant", label: "Merchant" },
            { key: "amount", label: "Amount" },
            { key: "reason", label: "Reason" },
            { key: "provider", label: "Provider" },
            { key: "age", label: "Age" },
          ]}
          rows={failedPayouts}
          selectable
          stickyFirstColumn
          onRowSelect={() => {}}
        />

        <ReviewQueue
          items={failedPayouts}
          current={currentInspector}
          decision={decisionPanel}
        />
      </Section>
    </Page>
  );
}
