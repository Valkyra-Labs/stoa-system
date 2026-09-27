import { Page, Header, Section, Card, Button, Status, EmptyData, StaleData, ErrorData, Comparison, DataTable, FilterBar, SavedViews, Metric, BulkActions, Timeline } from "@stoa/react";

const FAULTS = [
  { id: "F-1024", date: "2023-10-24T10:15:00", entity: "Acme Corp", amount: 12500.00, reason: "Insufficient funds", status: "pending", evidence: "Bank returned E22: Account closed. Last valid balance $450.", actions: ["Reverse", "Escrow"] },
  { id: "F-1023", date: "2023-10-24T09:45:00", entity: "Globex Inc", amount: 3200.50, reason: "Invalid card", status: "pending", evidence: "Card BIN mismatch detected against merchant category code.", actions: ["Escrow", "Retry"] },
  { id: "F-1022", date: "2023-10-24T08:30:00", entity: "Stark Ind", amount: 8900.00, reason: "Fraud flag", status: "pending", evidence: "Velocity check exceeded threshold (5 txns/1hr) from IP 192.168.1.1.", actions: ["Escrow"] },
  { id: "F-1021", date: "2023-10-23T22:10:00", entity: "Wayne Ent", amount: 540.00, reason: "Timeout", status: "pending", evidence: "Gateway API latency > 5000ms during settlement window.", actions: ["Retry"] },
  { id: "F-1020", date: "2023-10-23T21:05:00", entity: "Cyberdyne", amount: 1200.00, reason: "Insufficient funds", status: "pending", evidence: "Source account frozen by regulator pending review.", actions: ["Reverse", "Escrow"] },
];

const metrics = [
  { label: "Avg Amount", value: 3709.90, delta: 12.5, unit: "USD" },
  { label: "Pending Resolves", value: 5, delta: 0, unit: "count" },
  { label: "Escrowed", value: 2, delta: -1, unit: "count" },
  { label: "Reversed", value: 0, delta: 0, unit: "count" },
];

export default function FailedPayoutsScreen() {
  return (
    <Page title="Failed Payouts Resolution">
      <Header title="Failed Payouts" subtitle="Operational Review Queue" />

      <Section title="Queue Status">
        <Card title="Current Position">
          <div style={{ display: "flex", gap: 16 }}>
            <Metric label="Remaining" value={5} />
            <Metric label="Pending Action" value={3} />
            <Metric label="Escrowed" value={2} />
            <Metric label="Reversed" value={0} />
          </div>
        </Card>
      </Section>

      <Section title="Failed Items" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Failed Transactions</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Button label="Export CSV" variant="secondary" />
            <Button label="Clear Escrowed" onPress={() => alert("Unescrow action confirmed")} variant="danger" />
          </div>
        </div>

        <DataTable
          columns={[
            { key: "id", label: "Ref ID" },
            { key: "entity", label: "Entity", stickyFirstColumn: true },
            { key: "amount", label: "Amount", align: "right" },
            { key: "reason", label: "Failure Reason" },
            { key: "evidence", label: "Evidence" },
            { key: "actions", label: "Actions", align: "right" },
          ]}
          rows={FAULTS}
          onRowSelect={(row) => {
            // In a real app, this might open a detail view beside the row
            console.log("Selected:", row);
          }}
        />

        <BulkActions actions={[
          { label: "Escrow All", count: 5, onExecute: () => alert("Escrow action initiated for all selected") },
          { label: "Reverse All", count: 0, onExecute: () => alert("Reverse action initiated for all selected") },
        ]} />
      </Section>

      <Section title="Decision Context & Evidence">
        <Comparison entities={["Acme Corp", "Globex Inc"]} metrics={metrics} />
        <Timeline events={[
          { time: "2023-10-24T10:15:00", title: "Payout Initiated", desc: "Batch ID #9921 started." },
          { time: "2023-10-24T10:16:00", title: "Gateway Error", desc: "Transaction failed with E22 response." },
          { time: "2023-10-24T10:17:00", title: "Flagged for Review", desc: "Automated workflow triggered for manual resolution." },
        ]} />
      </Section>

      <Section title="Data Integrity">
        <Status tone="warning" label="Data Stale" />
        <p style={{ marginTop: 8, fontSize: 14 }}>Last updated: 2 minutes ago. Some historical records may not reflect the latest bank confirmations.</p>
        <Button label="Refresh Queue" onPress={() => window.location.reload()} />
      </Section>

      {FAULTS.length === 0 && (
        <Section title="Queue Empty">
          <EmptyData title="No Failed Payouts" description="All transactions have been resolved or reversed." />
        </Section>
      )}
    </Page>
  );
}
