// Goal: let a payments operations analyst move through failed payouts
// one at a time and resolve each one without losing track of the rest
// of the queue or the record's own history. Layout: the header names
// the screen and states today's totals; a FilterBar sits right below
// it so the analyst can narrow the queue without leaving the flow; a
// compact metrics row gives shape to the backlog before the real work
// starts. The ReviewQueue pattern then anchors the page: the list of
// pending payouts stays visible on one side, the current payout is
// shown in depth through an Inspector (key facts, failure context,
// history), and a single decision panel holds the actions that move
// the analyst to the next item. Recently resolved payouts sit in an
// AuditLog below, low priority but available for confirmation.
import {
  Page,
  Header,
  Section,
  Card,
  FilterBar,
  ReviewQueue,
  Inspector,
  Timeline,
  AuditLog,
  Status,
  Metric,
  Delta,
  Button,
} from "@stoa/react";

export default function FailedPayoutsScreen() {
  const queueItems = [
    {
      id: "po_8841",
      label: "Maria Chen — Payroll payout",
      amount: "$2,140.00",
      status: { tone: "critical", label: "3 attempts" },
    },
    {
      id: "po_8842",
      label: "Acme Freight — Vendor payout",
      amount: "$18,600.00",
      status: { tone: "critical", label: "Card expired" },
    },
    {
      id: "po_8843",
      label: "J. Alvarez — Refund payout",
      amount: "$86.40",
      status: { tone: "warning", label: "1 attempt" },
    },
    {
      id: "po_8844",
      label: "North Star Co-op — Settlement",
      amount: "$4,920.00",
      status: { tone: "warning", label: "Bank rejected" },
    },
    {
      id: "po_8845",
      label: "Priya Nair — Contractor payout",
      amount: "$1,275.00",
      status: { tone: "critical", label: "2 attempts" },
    },
  ];

  return (
    <Page title="Failed Payouts">
      <Header
        title="Failed Payouts"
        subtitle="18 payouts need review, 4 marked critical"
        actions={
          <Button label="Refresh queue" onPress={() => {}} variant="secondary" />
        }
      />

      <FilterBar
        filters={[
          { id: "reason", label: "Failure reason", value: "All reasons" },
          { id: "priority", label: "Priority", value: "All" },
          { id: "age", label: "Age", value: "Any time" },
        ]}
      />

      <Section title="Queue overview">
        <Metric label="Open failures" value="18" />
        <Metric
          label="Critical"
          value="4"
          delta={<Delta value="+2" basis="vs yesterday" />}
        />
        <Metric label="Resolved today" value="11" />
      </Section>

      <Section title="Work through the queue">
        <ReviewQueue
          items={queueItems}
          current={
            <Inspector
              primary={
                <Card title="Maria Chen — Payroll payout">
                  <p>Payout ID: po_8841</p>
                  <p>Amount: $2,140.00 USD</p>
                  <p>Destination: Chase •••• 4471</p>
                  <Status tone="critical" label="Failed after 3 attempts" />
                </Card>
              }
              context={
                <Card title="Failure detail">
                  <p>Reason: destination account closed</p>
                  <p>Last attempt: 2 hours ago</p>
                  <p>Provider code: R02, account closed</p>
                </Card>
              }
              history={
                <Timeline
                  events={[
                    { id: "e1", label: "Payout created", time: "Mon 9:02 AM" },
                    {
                      id: "e2",
                      label: "Attempt 1 failed, account closed",
                      time: "Mon 9:05 AM",
                    },
                    {
                      id: "e3",
                      label: "Attempt 2 failed, account closed",
                      time: "Tue 8:40 AM",
                    },
                    {
                      id: "e4",
                      label: "Attempt 3 failed, account closed",
                      time: "Today 7:15 AM",
                    },
                  ]}
                />
              }
            />
          }
          decision={
            <Card title="Resolve this payout">
              <p>Choose how to resolve po_8841 before moving to the next payout.</p>
              <Button
                label="Request new account details"
                onPress={() => {}}
                variant="primary"
              />
              <Button label="Retry payout" onPress={() => {}} variant="secondary" />
              <Button
                label="Escalate to finance"
                onPress={() => {}}
                variant="secondary"
              />
              <Button label="Cancel payout" onPress={() => {}} variant="destructive" />
            </Card>
          }
        />
      </Section>

      <Section title="Recently resolved">
        <AuditLog
          entries={[
            {
              id: "a1",
              who: "Dana K.",
              what: "Retried payout po_8830",
              when: "10 minutes ago",
            },
            {
              id: "a2",
              who: "Dana K.",
              what: "Cancelled payout po_8829, duplicate",
              when: "32 minutes ago",
            },
            {
              id: "a3",
              who: "Sam O.",
              what: "Escalated payout po_8811 to finance",
              when: "1 hour ago",
            },
          ]}
        />
      </Section>
    </Page>
  );
}
