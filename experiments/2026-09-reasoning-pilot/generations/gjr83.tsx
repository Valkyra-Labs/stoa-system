import {
  Page,
  Header,
  Section,
  Card,
  Button,
  Metric,
  DataTable,
} from '@stoa/react';

export default function FailedPayoutsScreen() {
  // Goal: Enable payments analysts to systematically work through and resolve
  // failed payouts by presenting one payout for detailed action, with the queue
  // visible below. Layout: header, current payout details and actions, queue.

  const failedPayouts = [
    {
      id: 'payout_001',
      vendor: 'Acme Corp',
      amount: 5250.00,
      currency: 'USD',
      failureReason: 'Insufficient funds',
      failureDate: '2026-09-26 14:32 UTC',
      attempts: 2,
    },
    {
      id: 'payout_002',
      vendor: 'TechSupply Inc',
      amount: 12400.00,
      currency: 'USD',
      failureReason: 'Invalid bank account',
      failureDate: '2026-09-25 09:15 UTC',
      attempts: 1,
    },
    {
      id: 'payout_003',
      vendor: 'Global Services Ltd',
      amount: 8750.00,
      currency: 'USD',
      failureReason: 'Daily limit exceeded',
      failureDate: '2026-09-25 16:45 UTC',
      attempts: 3,
    },
    {
      id: 'payout_004',
      vendor: 'Regional Logistics',
      amount: 3200.00,
      currency: 'USD',
      failureReason: 'Bank connection timeout',
      failureDate: '2026-09-24 11:20 UTC',
      attempts: 4,
    },
    {
      id: 'payout_005',
      vendor: 'Content Creators Co',
      amount: 1875.50,
      currency: 'USD',
      failureReason: 'Account suspended',
      failureDate: '2026-09-24 08:00 UTC',
      attempts: 1,
    },
  ];

  const current = failedPayouts[0];

  return (
    <Page title="Failed Payouts Resolution">
      <Header
        title="Failed Payouts"
        subtitle={`${failedPayouts.length} payouts awaiting resolution`}
      />

      <main>
        <Section title="Current Payout">
          <Card title={current.vendor}>
            <Metric
              label="Payout Amount"
              value={current.amount.toFixed(2)}
              unit={current.currency}
            />
            <Metric
              label="Failed Attempts"
              value={current.attempts}
            />
            <p><strong>Failure Reason:</strong> {current.failureReason}</p>
            <p><strong>Failed At:</strong> {current.failureDate}</p>
          </Card>
        </Section>

        <Section title="Actions">
          <Button label="Retry Payment" />
          <Button label="Update Bank Account" />
          <Button label="Contact Vendor" />
          <Button label="Escalate to Manual Review" />
        </Section>

        <Section title="Remaining Queue">
          <DataTable
            columns={[
              { id: 'vendor', label: 'Vendor' },
              { id: 'amount', label: 'Amount' },
              { id: 'reason', label: 'Failure Reason' },
            ]}
            rows={failedPayouts.map((p) => ({
              id: p.id,
              vendor: p.vendor,
              amount: `$${p.amount.toFixed(2)}`,
              reason: p.failureReason,
            }))}
          />
        </Section>
      </main>
    </Page>
  );
}
