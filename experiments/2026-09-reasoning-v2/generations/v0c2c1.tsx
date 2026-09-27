import { Page, Header, Sidebar, Section, Card, Tabs, Comparison } from "@stoa/react";

export default function FundComparison() {
  return (
    <Page title="Fund Comparison">
      <Header title="Compare Funds" subtitle="Choose the best fund for your client" />
      <Section title="Funds Overview">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund", metrics: ["return", "risk", "fees"] },
            { id: "fund2", label: "Stable Fund", metrics: ["return", "risk", "fees"] }
          ]}
        />
      </Section>
      <Section title="Detailed Information">
        <Tabs items={[
          { id: "fund1", label: "Growth Fund", content: <Card title="Growth Fund">
            <p>Diversified portfolio with high potential returns.</p>
          </Card> },
          { id: "fund2", label: "Stable Fund", content: <Card title="Stable Fund">
            <p>Conservative portfolio with steady returns.</p>
          </Card> }
        ]} />
      </Section>
    </Page>
  );
}
