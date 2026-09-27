// Goal: let a payments operations analyst work through failed payouts one
// at a time until each is resolved. The layout puts the whole queue in a
// scannable table on the left of the review area so the analyst always
// knows how much work remains and can jump between items, while the
// right side holds one payout in depth (its numbers, account context,
// attempt history and audit trail) plus the resolution decision for that
// item. Filters and saved views sit above the queue so the analyst can
// narrow to the slice they own (e.g. high value, compliance holds)
// before working through it top to bottom.

import {
  Page,
  Header,
  Section,
  Card,
  FilterBar,
  SavedViews,
  ReviewQueue,
  Inspector,
  DataTable,
  Metric,
  Status,
  Timeline,
  AuditLog,
  Button,
} from "@stoa/react";

const failedPayouts = [
  {
    id: "PO-58212",
    payee: "Marisol Ibarra",
    amount: "$2,340.00",
    reason: "Bank rejected: account closed",
    provider: "Wells Fargo ACH",
    age: "4 days",
    attempts: 2,
    status: { tone: "error", label: "Failed" },
  },
  {
    id: "PO-58198",
    payee: "Denton Freight LLC",
    amount: "$18,900.00",
    reason: "Compliance hold: sanctions match review",
    provider: "SWIFT wire",
    age: "6 days",
    attempts: 1,
    status: { tone: "warning", label: "On hold" },
  },
  {
    id: "PO-58177",
    payee: "Priya Chandrasekaran",
    amount: "$540.25",
    reason: "Invalid routing number",
    provider: "Stripe Treasury",
    age: "2 days",
    attempts: 1,
    status: { tone: "error", label: "Failed" },
  },
  {
    id: "PO-58165",
    payee: "Okafor & Sons Trading",
    amount: "$7,120.00",
    reason: "Insufficient funds in settlement account",
    provider: "Chase ACH",
    age: "9 days",
    attempts: 3,
    status: { tone: "error", label: "Failed" },
  },
  {
    id: "PO-58150",
    payee: "Lena Vogt",
    amount: "$980.00",
    reason: "Bank rejected: name mismatch",
    provider: "SEPA",
    age: "3 days",
    attempts: 1,
    status: { tone: "error", label: "Failed" },
  },
  {
    id: "PO-58133",
    payee: "Riverbend Clinic",
    amount: "$3,275.50",
    reason: "Payout method removed by payee",
    provider: "Stripe Treasury",
    age: "7 days",
    attempts: 2,
    status: { tone: "warning", label: "Needs info" },
  },
  {
    id: "PO-58120",
    payee: "Tomas Hrbek",
    amount: "$210.00",
    reason: "Bank rejected: account closed",
    provider: "SEPA",
    age: "1 day",
    attempts: 1,
    status: { tone: "error", label: "Failed" },
  },
  {
    id: "PO-58104",
    payee: "Bright Harbor Logistics",
    amount: "$12,450.00",
    reason: "Compliance hold: high value review",
    provider: "SWIFT wire",
    age: "11 days",
    attempts: 1,
    status: { tone: "warning", label: "On hold" },
  },
];

const queueColumns = [
  { key: "id", label: "Payout ID" },
  { key: "payee", label: "Payee" },
  { key: "amount", label: "Amount" },
  { key: "reason", label: "Reason" },
  { key: "provider", label: "Provider" },
  { key: "age", label: "Age" },
  { key: "status", label: "Status" },
];

const queueRows = failedPayouts.map((p) => ({
  id: p.id,
  payee: p.payee,
  amount: p.amount,
  reason: p.reason,
  provider: p.provider,
  age: p.age,
  status: <Status tone={p.status.tone} label={p.status.label} />,
}));

// The analyst is currently working the first item in the queue.
const current = failedPayouts[0];

export default function FailedPayoutsQueue() {
  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed payouts"
        subtitle="8 payouts need action, 2 on compliance hold"
        actions={<Button label="Export queue" variant="secondary" onPress={() => {}} />}
      />

      <Section title="Queue filters">
        <SavedViews
          views={[
            { id: "mine", label: "My queue" },
            { id: "high-value", label: "High value (over $5,000)" },
            { id: "compliance", label: "Compliance holds" },
            { id: "repeat", label: "Retried 2+ times" },
          ]}
        />
        <FilterBar
          filters={[
            { id: "status", label: "Status", value: "All" },
            { id: "reason", label: "Reason", value: "All" },
            { id: "provider", label: "Provider", value: "All" },
            { id: "amount", label: "Amount", value: "Any" },
            { id: "age", label: "Age", value: "Any" },
          ]}
        />
      </Section>

      <Section title="Review">
        <ReviewQueue
          items={
            <DataTable
              columns={queueColumns}
              rows={queueRows}
              selectable
              stickyFirstColumn
              onRowSelect={() => {}}
            />
          }
          current={
            <Inspector
              primary={
                <>
                  <Metric label="Amount" value={current.amount} />
                  <Metric label="Attempts" value={String(current.attempts)} />
                  <Metric label="Age" value={current.age} />
                  <Status tone={current.status.tone} label={current.status.label} />
                </>
              }
              context={
                <Card title="Payout details">
                  <p>Payee: {current.payee}</p>
                  <p>Method: {current.provider}</p>
                  <p>Reason: {current.reason}</p>
                </Card>
              }
              history={
                <>
                  <Timeline
                    events={[
                      { label: "Payout created", time: "4 days ago" },
                      { label: "Attempt 1 failed: account closed", time: "4 days ago" },
                      { label: "Flagged for review", time: "3 days ago" },
                      { label: "Attempt 2 failed: account closed", time: "1 day ago" },
                    ]}
                  />
                  <AuditLog
                    entries={[
                      { actor: "System", action: "Auto-retry scheduled", time: "3 days ago" },
                      { actor: "Dana Reyes", action: "Added note: contacted payee by email", time: "2 days ago" },
                    ]}
                  />
                </>
              }
              actions={
                <>
                  <Button label="View payee profile" variant="secondary" onPress={() => {}} />
                  <Button label="Contact payee" variant="secondary" onPress={() => {}} />
                </>
              }
            />
          }
          decision={
            <Card title="Resolve this payout">
              <Button label="Retry payout" variant="primary" onPress={() => {}} />
              <Button label="Update bank details" variant="secondary" onPress={() => {}} />
              <Button label="Refund payee" variant="secondary" onPress={() => {}} />
              <Button label="Escalate to compliance" variant="secondary" onPress={() => {}} />
              <Button label="Mark resolved" variant="secondary" onPress={() => {}} />
              <Button label="Skip for now" variant="secondary" onPress={() => {}} />
            </Card>
          }
        />
      </Section>
    </Page>
  );
}
