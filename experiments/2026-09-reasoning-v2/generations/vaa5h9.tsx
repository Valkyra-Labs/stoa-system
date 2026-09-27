import { Page, Header, Section, Card, Button, Status, EmptyData, Metric, Drawer } from "@stoa/react";

export default function FailedPayoutsScreen() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const items = [
    { id: 101, amount: 250.00, currency: "USD", status: "Pending Review", error: "Insufficient Funds", retryCount: 0, customer: "Alice Corp", date: "2023-10-24" },
    { id: 102, amount: 150.50, currency: "EUR", status: "Pending Review", error: "Card Declined", retryCount: 1, customer: "Bob Ltd", date: "2023-10-24" },
    { id: 103, amount: 750.00, currency: "GBP", status: "Pending Review", error: "Invalid Account", retryCount: 0, customer: "Charlie Inc", date: "2023-10-23" },
    { id: 104, amount: 320.25, currency: "USD", status: "Pending Review", error: "Network Timeout", retryCount: 2, customer: "Delta LLC", date: "2023-10-23" },
    { id: 105, amount: 999.99, currency: "CAD", status: "Pending Review", error: "Fraud Flag", retryCount: 0, customer: "Eve Services", date: "2023-10-22" },
  ];

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <Page title="Failed Payouts Resolution">
      <Header title="Failed Payouts" subtitle="Batch: 2023-10-24 | Total: 42 items" actions={
        <Button label="Clear Queue" variant="primary" onPress={() => alert("Queue cleared")}/>
      }/>

      <Section title="Queue Progress">
        <Metric label="Remaining" value={items.length} unit="items"/>
        <Metric label="Success Rate" value="98%" unit="target"/>
        <Metric label="Avg. Time" value="12m" unit="elapsed"/>
      </Section>

      <Section title="Failure Log">
        <Card title="Failed Transactions">
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {items.map(item => (
              <div 
                key={item.id} 
                onClick={() => { setSelectedId(item.id); setOpenDrawer(true); }}
                style={{padding: 16, border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedId === item.id ? '#f0f4ff' : 'white'}}
              >
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: 4}}>#{item.id} • {item.customer}</div>
                  <div style={{fontSize: '0.9em', color: '#666'}}>Amount: {item.amount} {item.currency} • {item.date}</div>
                </div>
                <div>
                  <Status tone={item.retryCount > 2 ? 'error' : 'warning'} label={item.error}/>
                  <div style={{margin: '4px 0'}}>
                    <Button label={item.retryCount >= 2 ? "Escalate" : "Retry"} onPress={() => alert(`Action on ${item.id}`)} variant={item.retryCount >= 2 ? "danger" : "secondary"}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {items.length === 0 && <EmptyData message="No failed items to review."/>}
        </Card>
      </Section>

      <Drawer title="Transaction Details" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        {selectedItem && (
          <div style={{padding: 24}}>
            <div style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: 16}}>
              Transaction #{selectedItem.id}
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24}}>
              <div><strong>Customer:</strong> {selectedItem.customer}</div>
              <div><strong>Amount:</strong> {selectedItem.amount} {selectedItem.currency}</div>
              <div><strong>Date:</strong> {selectedItem.date}</div>
              <div><strong>Attempt Count:</strong> {selectedItem.retryCount}</div>
            </div>

            <div style={{background: '#fff3cd', padding: 16, borderRadius: 8, marginBottom: 24, borderLeft: '4px solid #ffc107'}}>
              <strong>Failure Reason:</strong> {selectedItem.error}
              <div style={{marginTop: 8, fontSize: '0.9em', color: '#555'}}>
                {selectedItem.retryCount === 0 ? "First attempt failed. Customer account may need funding." : 
                 selectedItem.retryCount === 1 ? "Retry failed. Consider checking network connectivity." :
                 "Multiple retries exhausted. Requires manual intervention."}
              </div>
            </div>

            <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
              <Button label="Reject" variant="secondary" onPress={() => alert(`Rejected #${selectedItem.id}`)} />
              <Button label="Fix Customer & Retry" variant="primary" onPress={() => alert(`Fixed customer #${selectedItem.id} and retried`)} />
              <Button label="Escalate to Support" variant="warning" onPress={() => alert(`Escalated #${selectedItem.id}`)} />
            </div>
          </div>
        )}
      </Drawer>
    </Page>
  );
}
