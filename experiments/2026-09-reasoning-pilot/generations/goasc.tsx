// Intent: review - a payments operations analyst works through failed
//   payouts one at a time and decides what happens to each.
// Information: entity = one failed payout; measures = amount and currency,
//   provider and failure reason/code, retry count, destination account,
//   time since failure; basis = retry-attempt threshold, the merchant's
//   90-day average payout, and provider SLA for retries.
// Decision: retry, redirect to a corrected account, escalate to compliance,
//   or cancel and refund. Needs provenance (provider + error code),
//   freshness (last provider sync), confidence (retryable vs terminal
//   error), and history (every prior attempt and manual action).
// Pattern: ReviewQueue - the queue stays visible on the side while the
//   current payout's evidence and the decision controls sit beside it.

import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Timeline,
  Status,
  StaleData,
  FilterBar,
  SavedViews,
  Button,
  ReviewQueue,
} from "@stoa/react";

const queueItems = [
  {
    id: "PO-8841",
    label: "Lumen Robotics",
    amount: 12450.0,
    currency: "USD",
    reason: "invalid_account_number",
    provider: "Stripe",
    tone: "warning",
    age: "3d",
  },
  {
    id: "PO-8839",
    label: "Ferro Metalworks",
    amount: 3120.5,
    currency: "USD",
    reason: "insufficient_funds",
    provider: "Wise",
    tone: "warning",
    age: "2d",
  },
  {
    id: "PO-8833",
    label: "Bramble & Co",
    amount: 890.0,
    currency: "EUR",
    reason: "card_declined",
    provider: "Adyen",
    tone: "critical",
    age: "6d",
  },
  {
    id: "PO-8827",
    label: "Northwind Freight",
    amount: 27650.0,
    currency: "USD",
    reason: "compliance_hold",
    provider: "Stripe",
    tone: "critical",
    age: "9d",
  },
  {
    id: "PO-8821",
    label: "Solace Health",
    amount: 5400.0,
    currency: "USD",
    reason: "insufficient_funds",
    provider: "Wise",
    tone: "warning",
    age: "1d",
  },
  {
    id: "PO-8814",
    label: "Verdant Foods",
    amount: 1210.0,
    currency: "GBP",
    reason: "invalid_account_number",
    provider: "Adyen",
    tone: "warning",
    age: "4d",
  },
  {
    id: "PO-8809",
    label: "Kestrel Logistics",
    amount: 960.75,
    currency: "USD",
    reason: "card_declined",
    provider: "Stripe",
    tone: "critical",
    age: "7d",
  },
  {
    id: "PO-8802",
    label: "Amber Studio",
    amount: 4300.0,
    currency: "USD",
    reason: "retry_exhausted",
    provider: "Wise",
    tone: "critical",
    age: "11d",
  },
];

const currentPayoutDetail = (
  <>
    <Section title="Payout PO-8841">
      <Card title="Amount and destination">
        <Metric label="Payout amount" value="$12,450.00" unit="USD" />
        <Delta value="+$4,250.00" basis="vs. Lumen Robotics 90-day average" />
        <p>Destination: Chase Business Checking, account ending 4471.</p>
      </Card>
      <Card title="Failure">
        <Status tone="warning" label="invalid_account_number" />
        <p>Provider: Stripe. Error code: routing_number_invalid.</p>
        <Delta value="2 of 3 attempts used" basis="vs. retry limit" />
        <StaleData since="4 minutes ago" />
      </Card>
    </Section>
    <Section title="History">
      <Timeline
        events={[
          {
            time: "9 days ago",
            label: "Payout created and queued for disbursement.",
          },
          {
            time: "6 days ago",
            label: "Attempt 1 failed: routing_number_invalid.",
          },
          {
            time: "3 days ago",
            label: "Attempt 2 failed: routing_number_invalid.",
          },
          {
            time: "3 days ago",
            label: "Jordan Reyes opened a case to verify the account on file.",
          },
          {
            time: "4 minutes ago",
            label: "Provider status resynced, no change.",
          },
        ]}
      />
    </Section>
  </>
);

const currentPayoutDecision = (
  <Section title="Decision">
    <Status tone="warning" label="Retryable: 1 attempt remaining" />
    <Button label="Retry with corrected account" onPress={() => {}} variant="primary" />
    <Button label="Request account correction from merchant" onPress={() => {}} variant="secondary" />
    <Button label="Escalate to compliance" onPress={() => {}} variant="secondary" />
    <Button label="Cancel and refund" onPress={() => {}} variant="danger" />
  </Section>
);

export default function FailedPayoutsReviewPage() {
  return (
    <Page title="Failed Payouts">
      <Header
        title="Resolve failed payouts"
        subtitle="8 payouts need a decision"
        actions={<Button label="Assign to me" onPress={() => {}} variant="secondary" />}
      />
      <FilterBar
        filters={[
          { id: "provider", label: "Provider" },
          { id: "reason", label: "Failure reason" },
          { id: "amount", label: "Amount" },
          { id: "age", label: "Age" },
        ]}
      />
      <SavedViews
        views={[
          { id: "unassigned", label: "Unassigned" },
          { id: "high-value", label: "High value (over $10,000)" },
          { id: "exhausted", label: "Retry exhausted" },
        ]}
      />
      <main>
        <ReviewQueue
          items={queueItems}
          current={currentPayoutDetail}
          decision={currentPayoutDecision}
        />
      </main>
    </Page>
  );
}
