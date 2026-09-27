import {
  Page,
  Header,
  Sidebar,
  Section,
  Card,
  Metric,
  Delta,
  Timeline,
  AuditLog,
  Status,
  FilterBar,
  SavedViews,
  Button,
  ReviewQueue,
  Inspector,
} from "@stoa/react";

export default function FailedPayoutsScreen() {
  const queueItems = [
    {
      id: "po_8841",
      title: "Aldric Fabrications",
      subtitle: "$4,200.00 USD",
      meta: ["Insufficient funds", "Stripe", "Failed 2h ago"],
    },
    {
      id: "po_8842",
      title: "Nord & Vale Logistics",
      subtitle: "$980.50 USD",
      meta: ["Account closed", "Adyen", "Failed 3h ago"],
    },
    {
      id: "po_8843",
      title: "Merit Coastal Supply",
      subtitle: "$12,340.00 USD",
      meta: ["Bank rejected", "Wise", "Failed 5h ago"],
    },
    {
      id: "po_8844",
      title: "Halvorsen Studio",
      subtitle: "$310.00 USD",
      meta: ["Invalid routing number", "Stripe", "Failed 6h ago"],
    },
    {
      id: "po_8845",
      title: "Quorum Data Partners",
      subtitle: "$7,050.25 USD",
      meta: ["Compliance hold", "Adyen", "Failed 9h ago"],
    },
    {
      id: "po_8846",
      title: "Bellcrest Interiors",
      subtitle: "$1,125.00 USD",
      meta: ["Insufficient funds", "Wise", "Failed 11h ago"],
    },
  ];

  const currentPayout = queueItems[0];

  const currentPrimary = (
    <div>
      <h2>{currentPayout.title}</h2>
      <p>Payout {currentPayout.id} to account ending 4417</p>
      <Metric label="Amount" value="$4,200.00" unit="USD" />
      <Metric label="Attempts" value="2" />
      <Status tone="critical" label="Insufficient funds" />
    </div>
  );

  const currentContext = (
    <div>
      <p>Merchant: Aldric Fabrications</p>
      <p>Provider: Stripe</p>
      <p>Destination: Checking account, First Union Bank</p>
      <p>Merchant balance: $1,860.00 available</p>
      <p>Standing: 14 successful payouts, 1 prior failure</p>
    </div>
  );

  const currentHistory = (
    <Timeline
      events={[
        { label: "Payout created", timestamp: "09:12" },
        { label: "Sent to Stripe", timestamp: "09:12" },
        { label: "Failed: insufficient funds", timestamp: "09:14" },
        { label: "Retried automatically", timestamp: "11:00" },
        { label: "Failed: insufficient funds", timestamp: "11:02" },
      ]}
    />
  );

  const currentActions = (
    <div>
      <Button label="Retry payout" onPress={() => {}} variant="primary" />
      <Button label="Refund sender" onPress={() => {}} variant="secondary" />
      <Button label="Escalate to finance" onPress={() => {}} variant="secondary" />
      <Button label="Mark resolved" onPress={() => {}} variant="ghost" />
    </div>
  );

  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed Payouts"
        subtitle="132 payouts failed across 4 providers in the last 24 hours"
        actions={
          <>
            <Button label="Export CSV" onPress={() => {}} variant="secondary" />
            <Button label="Refresh queue" onPress={() => {}} variant="primary" />
          </>
        }
      />

      <Section title="Overview">
        <Metric
          label="Failed payouts"
          value="132"
          delta={<Delta value={18} basis="vs yesterday" />}
        />
        <Metric
          label="Total value held"
          value="$96,410"
          unit="USD"
          delta={<Delta value={-4} basis="vs yesterday" />}
        />
        <Metric label="Avg time to resolve" value="3.4" unit="hrs" />
        <Metric
          label="Retry success rate"
          value="61%"
          delta={<Delta value={6} basis="vs last week" />}
        />
      </Section>

      <Sidebar>
        <FilterBar
          filters={[
            { label: "Failure reason", options: ["Insufficient funds", "Account closed", "Bank rejected", "Invalid routing number", "Compliance hold"] },
            { label: "Provider", options: ["Stripe", "Adyen", "Wise"] },
            { label: "Amount", options: ["Under $500", "$500-$5,000", "Over $5,000"] },
            { label: "Age", options: ["Under 1h", "1-6h", "Over 6h"] },
          ]}
        />
        <SavedViews
          views={[
            { label: "My queue", count: 24 },
            { label: "High value (over $5,000)", count: 9 },
            { label: "Compliance holds", count: 3 },
            { label: "Retryable now", count: 41 },
          ]}
        />
      </Sidebar>

      <Section title="Resolve payouts">
        <ReviewQueue
          items={queueItems}
          current={
            <Inspector
              primary={currentPrimary}
              context={currentContext}
              history={currentHistory}
              actions={currentActions}
            />
          }
          decision={
            <div>
              <Button label="Retry" onPress={() => {}} variant="primary" />
              <Button label="Refund" onPress={() => {}} variant="secondary" />
              <Button label="Escalate" onPress={() => {}} variant="secondary" />
              <Button label="Skip" onPress={() => {}} variant="ghost" />
            </div>
          }
        />
      </Section>

      <Section title="Recent operator actions">
        <Card title="Audit trail">
          <AuditLog
            entries={[
              { actor: "Priya Nandan", action: "Retried payout po_8830", timestamp: "10:41" },
              { actor: "System", action: "Auto-retried payout po_8841", timestamp: "11:00" },
              { actor: "Priya Nandan", action: "Refunded payout po_8812", timestamp: "09:55" },
              { actor: "Marcus Idowu", action: "Escalated payout po_8798 to finance", timestamp: "09:20" },
            ]}
          />
        </Card>
      </Section>
    </Page>
  );
}
