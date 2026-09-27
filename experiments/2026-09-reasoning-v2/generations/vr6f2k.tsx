import { Page, Header, Section, Card, Status, Button, Metric, EmptyData, Drawer } from "@stoa/react";

export default function FailedPayoutsResolver() {
  const [queueOpen, setQueueOpen] = false;
  const [currentItem, setCurrentItem] = (null as any);

  const queue = [
    {
      id: "TX-8821",
      amount: 1250.00,
      customer: "Alice Chen",
      error: "INSUFFICIENT_FUNDS",
      retryCount: 2,
      status: "pending",
      evidence: "Last attempt failed at 09:42 AM. Account balance is zero.",
      actions: [
        { label: "Retry", variant: "primary", onPress: () => { /* logic */ } },
        { label: "Escalate", variant: "secondary", onPress: () => { /* logic */ } },
        { label: "Mark Write-off", variant: "danger", onPress: () => { /* logic */ } },
      ],
    },
    {
      id: "TX-8822",
      amount: 45.00,
      customer: "Bob Smith",
      error: "INVALID_CURRENCY",
      retryCount: 0,
      status: "pending",
      evidence: "Payment gateway returned 403. Currency mismatch detected.",
      actions: [
        { label: "Retry", variant: "primary", onPress: () => { /* logic */ } },
        { label: "Reject", variant: "secondary", onPress: () => { /* logic */ } },
      ],
    },
    {
      id: "TX-8823",
      amount: 2300.00,
      customer: "Carol Davis",
      error: "BLOCKED_ACCOUNT",
      retryCount: 1,
      status: "pending",
      evidence: "Bank flagged account for suspicious activity. Requires manual review.",
      actions: [
        { label: "Escalate", variant: "primary", onPress: () => { /* logic */ } },
        { label: "Hold", variant: "neutral", onPress: () => { /* logic */ } },
      ],
    },
    {
      id: "TX-8824",
      amount: 89.50,
      customer: "Dave Wilson",
      error: "TIMEOUT",
      retryCount: 0,
      status: "pending",
      evidence: "Network timeout during processing window.",
      actions: [
        { label: "Retry", variant: "primary", onPress: () => { /* logic */ } },
      ],
    },
    {
      id: "TX-8825",
      amount: 1200.00,
      customer: "Eve Johnson",
      error: "DUPLICATE_TRANSACTION",
      retryCount: 3,
      status: "pending",
      evidence: "System detected duplicate of TX-8820. User was refunded previously.",
      actions: [
        { label: "Reject", variant: "secondary", onPress: () => { /* logic */ } },
        { label: "Notify User", variant: "neutral", onPress: () => { /* logic */ } },
      ],
    },
  ];

  const handleNext = () => {
    if (queueOpen) {
      const next = queue[queue.indexOf(currentItem) + 1];
      if (next) {
        setCurrentItem(next);
        setQueueOpen(false);
      }
    } else {
      setCurrentItem(queue[0]);
      setQueueOpen(true);
    }
  };

  const handlePrev = () => {
    const prev = queue[queue.indexOf(currentItem) - 1];
    if (prev) {
      setCurrentItem(prev);
      setQueueOpen(true);
    }
  };

  return (
    <Page title="Failed Payouts Resolver">
      <Header title="Failed Payouts" subtitle="Batch ID: B-2023-10-27" />

      <main>
        <Section title="Queue Overview">
          <Card title="Batch Progress">
            <div className="flex gap-4">
              <Metric label="Total Items" value={queue.length} />
              <Metric label="Pending" value={queue.filter((i) => i.status === "pending").length} />
              <Metric label="Retry Limit" value={queue.filter((i) => i.retryCount >= 3).length} />
            </div>
          </Card>
        </Section>

        <Section title="Item List">
          <Card title="Failed Transactions">
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Error</th>
                    <th>Attempts</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono">{item.id}</td>
                      <td>{item.customer}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>{item.error}</td>
                      <td>{item.retryCount}/3</td>
                      <td>
                        <Status tone="warning" label={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Section>

        <Section title="Inspector View">
          <Card title="Current Item" className="max-w-2xl">
            {currentItem ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">Transaction: {currentItem.id}</h2>
                    <p className="text-sm text-gray-500">Customer: {currentItem.customer} | Amount: ${currentItem.amount.toFixed(2)}</p>
                  </div>
                  <Status tone="warning" label={currentItem.status} />
                </div>

                <div className="p-4 bg-gray-50 border rounded">
                  <p className="font-medium">Root Cause: <span className="font-mono">{currentItem.error}</span></p>
                  <p className="text-sm mt-2 text-gray-600">{currentItem.evidence}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {currentItem.actions.map((action) => (
                    <Button key={action.label} label={action.label} variant={action.variant} onPress={action.onPress} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyData message="No items selected. Select an item from the list or start a new batch." />
            )}
          </Card>
        </Section>
      </main>

      {queueOpen && (
        <Drawer title="Queue Navigation" open={true} onClose={() => setQueueOpen(false)}>
          <div className="flex justify-between items-center">
            <Button label="Previous" variant="secondary" onPress={handlePrev} disabled={queueOpen === 0} />
            <div className="text-sm">
              Item {queue.indexOf(currentItem) + 1} of {queue.length}
            </div>
            <Button label="Next" variant="primary" onPress={handleNext} disabled={queueOpen === queue.length - 1} />
          </div>
        </Drawer>
      )}
    </Page>
  );
}
