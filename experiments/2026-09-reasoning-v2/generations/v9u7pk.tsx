import { Page, Header, Section, Card, DataTable, Button, FilterBar, Tabs, Status, EmptyData } from '@stoa/react';

const failedPayouts = [
  { id: 'P-1001', amount: '$250.00', status: 'Failed', reason: 'Bank account not found', timestamp: '2023-10-05T14:23:00Z', lastAttempt: '2023-10-05T14:23:00Z' },
  { id: 'P-1002', amount: '$150.00', status: 'Failed', reason: 'Insufficient funds', timestamp: '2023-10-05T14:25:00Z', lastAttempt: '2023-10-05T14:25:00Z' },
  { id: 'P-1003', amount: '$300.00', status: 'Failed', reason: 'Network error', timestamp: '2023-10-05T14:27:00Z', lastAttempt: '2023-10-05T14:27:00Z' },
  { id: 'P-1004', amount: '$400.00', status: 'Failed', reason: 'Card expired', timestamp: '2023-10-05T14:29:00Z', lastAttempt: '2023-10-05T14:29:00Z' },
];

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'reason', label: 'Reason' },
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'lastAttempt', label: 'Last Attempt' },
];

const resolvePayout = (id: string) => {
  alert(`Resolved payout ${id}`);
};

const retryPayout = (id: string) => {
  alert(`Retried payout ${id}`);
};

const escalatePayout = (id: string) => {
  alert(`Escalated payout ${id}`);
};

const FailedPayoutsPage = () => (
  <Page title="Failed Payouts">
    <Header title="Failed Payouts" subtitle="Resolve failed transactions" actions={
      <Button variant="primary">Mark All as Resolved</Button>
    } />
    <FilterBar filters={
      <div>
        <label>Filter by reason: </label>
        <select>
          <option>All</option>
          <option>Bank account not found</option>
          <option>Insufficient funds</option>
          <option>Network error</option>
          <option>Card expired</option>
        </select>
      </div>
    } />
    <Section title="Failed Payouts">
      <Card>
        <DataTable
          columns={columns}
          rows={failedPayouts}
          selectable
          onRowSelect={(selected) => {
            if (selected.length > 0) {
              const ids = selected.map((item) => item.id);
              alert(`Selected payouts: ${ids.join(', ')}`);
            }
          }}
        />
      </Card>
    </Section>
    <Section title="Actions">
      <Card>
        <Button onClick={() => resolvePayout('P-1001')}>Resolve</Button>
        <Button onClick={() => retryPayout('P-1001')}>Retry</Button>
        <Button onClick={() => escalatePayout('P-1001')}>Escalate</Button>
      </Card>
    </Section>
    <Section title="Summary">
      <Card>
        <p>Total failed payouts: {failedPayouts.length}</p>
        <p>Resolved: 0</p>
        <p>Unresolved: {failedPayouts.length}</p>
        <Status tone="warning" label="Some payouts are failing" />
      </Card>
    </Section>
  </Page>
);

export default FailedPayoutsPage;
