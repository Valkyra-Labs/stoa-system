// Intent: review - work through a queue of failed payouts one by one
// Information: each payout's amount, recipient, failure reason, retry history, and timestamps
// Decision: for each payout, decide whether to retry, investigate, escalate, or mark resolved
// Pattern: ReviewQueue - one item at a time with evidence and decision controls

import React, { useState } from 'react';
import {
  Page,
  Header,
  ReviewQueue,
  Card,
  Section,
  Status,
  Metric,
  Delta,
  Button,
  DataTable,
  AuditLog,
} from '@stoa/react';

export default function FailedPayoutsQueue() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const payouts = [
    {
      id: 'PAY-2024-10847',
      recipient: 'Acme Corp',
      recipientId: 'vendor_48391',
      amount: 12500.00,
      currency: 'USD',
      createdAt: '2024-09-25T14:22:00Z',
      failedAt: '2024-09-25T14:23:45Z',
      failureReason: 'insufficient_funds',
      failureCode: 'ACCT_002',
      retryCount: 2,
      lastRetryAt: '2024-09-26T09:15:00Z',
      description: 'Invoice INV-2024-8847 settlement',
      history: [
        { action: 'Payment initiated', timestamp: '2024-09-25T14:22:00Z', actor: 'system' },
        { action: 'Failed: insufficient_funds', timestamp: '2024-09-25T14:23:45Z', actor: 'system' },
        { action: 'Auto-retry scheduled', timestamp: '2024-09-25T14:24:00Z', actor: 'system' },
        { action: 'Retry attempt 1', timestamp: '2024-09-25T18:00:00Z', actor: 'system' },
        { action: 'Failed: insufficient_funds', timestamp: '2024-09-25T18:00:30Z', actor: 'system' },
        { action: 'Manual retry attempt 2', timestamp: '2024-09-26T09:15:00Z', actor: 'support_alice' },
        { action: 'Failed: insufficient_funds', timestamp: '2024-09-26T09:15:45Z', actor: 'system' },
      ],
    },
    {
      id: 'PAY-2024-10848',
      recipient: 'CloudSync Inc',
      recipientId: 'vendor_52847',
      amount: 8350.50,
      currency: 'USD',
      createdAt: '2024-09-26T08:10:00Z',
      failedAt: '2024-09-26T08:11:22Z',
      failureReason: 'invalid_account',
      failureCode: 'ACCT_004',
      retryCount: 0,
      lastRetryAt: null,
      description: 'Monthly software license fee',
      history: [
        { action: 'Payment initiated', timestamp: '2024-09-26T08:10:00Z', actor: 'system' },
        { action: 'Failed: invalid_account', timestamp: '2024-09-26T08:11:22Z', actor: 'system' },
        { action: 'Flagged for review', timestamp: '2024-09-26T08:12:00Z', actor: 'system' },
      ],
    },
    {
      id: 'PAY-2024-10849',
      recipient: 'Global Logistics Ltd',
      recipientId: 'vendor_19284',
      amount: 45200.00,
      currency: 'USD',
      createdAt: '2024-09-24T16:45:00Z',
      failedAt: '2024-09-24T16:46:15Z',
      failureReason: 'network_error',
      failureCode: 'NET_001',
      retryCount: 1,
      lastRetryAt: '2024-09-25T10:30:00Z',
      description: 'Freight invoice FRT-2024-5521',
      history: [
        { action: 'Payment initiated', timestamp: '2024-09-24T16:45:00Z', actor: 'system' },
        { action: 'Failed: network_error', timestamp: '2024-09-24T16:46:15Z', actor: 'system' },
        { action: 'Auto-retry scheduled', timestamp: '2024-09-24T16:47:00Z', actor: 'system' },
        { action: 'Retry attempt 1', timestamp: '2024-09-25T10:30:00Z', actor: 'system' },
        { action: 'Failed: network_error', timestamp: '2024-09-25T10:30:42Z', actor: 'system' },
      ],
    },
  ];

  const currentPayout = payouts[currentIndex];

  const decisions = [
    { label: 'Retry Now', onPress: () => moveToNext() },
    { label: 'Investigate', onPress: () => moveToNext() },
    { label: 'Escalate', onPress: () => moveToNext() },
    { label: 'Mark Resolved', onPress: () => moveToNext() },
  ];

  const moveToNext = () => {
    if (currentIndex < payouts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Page title="Failed Payouts Review">
      <Header
        title="Failed Payouts Queue"
        subtitle={`${currentIndex + 1} of ${payouts.length} payouts`}
      />

      <ReviewQueue
        items={payouts}
        current={
          <main>
            <Section title="Payout Details">
              <Card title={`${currentPayout.recipient} - ${currentPayout.id}`}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Metric
                    label="Amount"
                    value={currentPayout.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    unit={currentPayout.currency}
                  />
                  <Metric
                    label="Retry Count"
                    value={currentPayout.retryCount}
                  />
                </div>
                <p><strong>Description:</strong> {currentPayout.description}</p>
                <p><strong>Recipient ID:</strong> {currentPayout.recipientId}</p>
              </Card>
            </Section>

            <Section title="Failure Information">
              <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p><strong>Failure Reason:</strong></p>
                    <Status tone="critical" label={currentPayout.failureReason} />
                  </div>
                  <div>
                    <p><strong>Failure Code:</strong></p>
                    <p>{currentPayout.failureCode}</p>
                  </div>
                </div>
                <p><strong>First Failed:</strong> {new Date(currentPayout.failedAt).toLocaleString()}</p>
                {currentPayout.lastRetryAt && (
                  <p><strong>Last Retry:</strong> {new Date(currentPayout.lastRetryAt).toLocaleString()}</p>
                )}
              </Card>
            </Section>

            <Section title="Audit Trail">
              <AuditLog
                entries={currentPayout.history.map(entry => ({
                  actor: entry.actor,
                  action: entry.action,
                  timestamp: new Date(entry.timestamp).toLocaleString(),
                }))}
              />
            </Section>

            <Section title="Decision">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {decisions.map((decision) => (
                  <Button
                    key={decision.label}
                    label={decision.label}
                    onPress={decision.onPress}
                  />
                ))}
              </div>
            </Section>
          </main>
        }
        decision={null}
      />
    </Page>
  );
}
