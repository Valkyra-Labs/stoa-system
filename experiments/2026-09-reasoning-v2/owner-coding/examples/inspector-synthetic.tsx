// Synthetic worked example (not a generation): an inspector. One customer
// account at the centre: profile, figures against a basis, history, notes
// and actions. The domain is deliberately outside the experiment's tasks.
import { Page, Header, Section, Card, Metric, Delta, Timeline, Status, Button } from "@stoa/react";

const account = { name: "Northwind Traders", plan: "Business", owner: "J. Alvarez", since: "2021-03-14" };
const events = [
  { date: "2026-09-20", title: "Support ticket closed", description: "Invoice export fixed" },
  { date: "2026-09-02", title: "Plan renewed", description: "12 months, Business" },
  { date: "2026-08-11", title: "Usage spike", description: "API calls 3x the monthly average" },
];

export default function AccountInspector() {
  return (
    <Page title="Account: Northwind Traders">
      <Header title={account.name} subtitle={`${account.plan} plan, customer since ${account.since}`} actions={<Status tone="success" label="Healthy" />} />
      <Section title="Usage against plan">
        <Metric label="Seats used" value="42 of 50" delta={<Delta value={4} basis="last month" />} />
        <Metric label="API calls" value="1.2M" delta={<Delta value={-8} basis="plan limit %" />} />
        <Metric label="Open tickets" value={1} delta={<Delta value={-2} basis="last month" />} />
      </Section>
      <Card title="History"><Timeline events={events} /></Card>
      <Card title="Notes">Renewal call planned for October; asked about SSO.</Card>
      <Card title="Actions"><Button label="Schedule call" variant="primary" /><Button label="Open ticket" /></Card>
    </Page>
  );
}
