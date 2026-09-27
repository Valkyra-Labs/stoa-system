// Intent: review — work through a queue of failed payouts and decide on each one.
// Information: payout id, merchant, amount, currency, failure reason, processor
//   error evidence, retry count, and time of the last attempt — the basis for
//   judging whether another retry is likely to succeed.
// Decision: retry, retry with a different method, refund the customer, or
//   escalate to the processor — needs the failure reason, retry history, and
//   freshness of the last attempt to decide safely.
// Pattern: ReviewQueue — one payout at a time, its evidence, the decision, next.

import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Status,
  ErrorData,
  StaleData,
  Timeline,
  AuditLog,
  DataTable,
  FilterBar,
  Button,
  BulkActions,
  ReviewQueue,
} from "@stoa/react";

const queueItems = [
  {
    id: "po_8841",
    merchant: "Lindqvist & Sons",
    amount: 4200.0,
    currency: "SEK",
    reason: "insufficient_funds",
    failedAt: "2026-09-27T06:12:00Z",
    retries: 2,
  },
  {
    id: "po_8839",
    merchant: "Kestrel Freight",
    amount: 18500.0,
    currency: "EUR",
    reason: "invalid_account",
    failedAt: "2026-09-27T05:58:00Z",
    retries: 0,
  },
  {
    id: "po_8836",
    merchant: "Nordvik Studio",
    amount: 960.0,
    currency: "EUR",
    reason: "bank_declined",
    failedAt: "2026-09-27T04:30:00Z",
    retries: 1,
  },
  {
    id: "po_8830",
    merchant: "Alta Verde Coffee",
    amount: 3120.5,
    currency: "USD",
    reason: "processor_timeout",
    failedAt: "2026-09-26T22:05:00Z",
    retries: 3,
  },
  {
    id: "po_8827",
    merchant: "Rowlett Freight",
    amount: 750.0,
    currency: "GBP",
    reason: "invalid_account",
    failedAt: "2026-09-26T19:40:00Z",
    retries: 0,
  },
];

const current = queueItems[0];

const attemptHistory = [
  {
    id: "a3",
    label: "Retry attempt 2 failed: insufficient_funds",
    at: "2026-09-27T06:12:00Z",
  },
  {
    id: "a2",
    label: "Retry attempt 1 failed: insufficient_funds",
    at: "2026-09-26T18:03:00Z",
  },
  { id: "a1", label: "Original payout submitted", at: "2026-09-25T09:00:00Z" },
];

const auditEntries = [
  {
    actor: "system",
    action: "Scheduled automatic retry",
    at: "2026-09-27T06:12:00Z",
  },
  {
    actor: "m.oyelaran@ops",
    action: "Flagged for manual review",
    at: "2026-09-26T18:10:00Z",
  },
];

export default function FailedPayoutsReview() {
  return (
    <Page title="Failed payouts">
      <Header
        title="Failed payouts"
        subtitle="5 payouts need a decision"
        actions={
          <BulkActions
            actions={[
              { label: "Retry selected", onPress: () => {} },
              { label: "Refund selected", onPress: () => {} },
            ]}
          />
        }
      />
      <FilterBar
        filters={[
          { label: "Failure reason", value: "all" },
          { label: "Amount", value: "any" },
          { label: "Currency", value: "all" },
        ]}
      />
      <ReviewQueue
        items={
          <DataTable
            columns={[
              { key: "id", label: "Payout" },
              { key: "merchant", label: "Merchant" },
              { key: "amount", label: "Amount", align: "right" },
              { key: "reason", label: "Reason" },
              { key: "retries", label: "Retries", align: "right" },
            ]}
            rows={queueItems.map((item) => ({
              id: item.id,
              merchant: item.merchant,
              amount: `${item.amount.toLocaleString()} ${item.currency}`,
              reason: item.reason,
              retries: item.retries,
            }))}
            selectable
            stickyFirstColumn
            onRowSelect={() => {}}
          />
        }
        current={
          <Section title={`${current.merchant} — ${current.id}`}>
            <Card title="Payout">
              <Metric
                label="Amount"
                value={`${current.amount.toLocaleString()} ${current.currency}`}
              />
              <Delta
                value={-current.retries}
                basis="successful attempts to date"
              />
              <Status tone="critical" label="insufficient_funds" />
              <StaleData since={current.failedAt} />
            </Card>
            <Card title="Processor evidence">
              <ErrorData retry={() => {}} />
            </Card>
            <Card title="Attempt history">
              <Timeline events={attemptHistory} />
            </Card>
            <Card title="Review activity">
              <AuditLog entries={auditEntries} />
            </Card>
          </Section>
        }
        decision={
          <>
            <Button label="Retry now" onPress={() => {}} variant="primary" />
            <Button
              label="Retry with different method"
              onPress={() => {}}
              variant="secondary"
            />
            <Button
              label="Refund customer"
              onPress={() => {}}
              variant="secondary"
            />
            <Button
              label="Escalate to processor"
              onPress={() => {}}
              variant="destructive"
            />
          </>
        }
      />
    </Page>
  );
}
