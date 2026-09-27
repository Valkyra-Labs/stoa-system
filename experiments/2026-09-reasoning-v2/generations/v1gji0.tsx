import { Page, Header, Card, Tabs, Metric, Delta, DataTable, Status, AuditLog } from "@stoa/react";

export default function FundSelectionScreen() {
  const fundA = {
    id: "fund-a",
    name: "Aggressive Growth Fund",
    type: "Equity",
    expenseRatio: 0.75,
    fiveYearReturn: 14.2,
    volatility: "High",
    manager: "Sarah Jenkins",
    description: "Focuses on high-growth small-cap stocks with a focus on technology and biotech sectors.",
  };

  const fundB = {
    id: "fund-b",
    name: "Stable Income Fund",
    type: "Bond",
    expenseRatio: 0.45,
    fiveYearReturn: 5.8,
    volatility: "Low",
    manager: "Michael Chen",
    description: "Conservative bond portfolio aimed at capital preservation with steady income generation.",
  };

  const comparisonData = [
    { label: "Expense Ratio", value: "0.75%", delta: "vs. 0.45%" },
    { label: "5-Year Return", value: "14.2%", delta: "vs. 5.8%" },
    { label: "Volatility", value: "High", delta: "vs. Low" },
    { label: "Minimum Investment", value: "$1,000", delta: "vs. $5,000" },
    { label: "Fund Fee Class", value: "Front-end", delta: "vs. Back-end" },
  ];

  const auditEntries = [
    { user: "Adviser #104", action: "Created recommendation", timestamp: "2 mins ago", target: "Fund A vs Fund B" },
    { user: "Adviser #104", action: "Saved to client profile", timestamp: "3 mins ago", target: "Client #8821" },
    { user: "System", action: "Template applied", timestamp: "1 hour ago", target: "Standard Review" },
  ];

  return (
    <Page title="Fund Recommendation">
      <Header title="Select Best Fund" subtitle="Compare options for Client #8821" />

      <main>
        <Section title="Client Overview">
          <Card title="Client Profile">
            <Metric label="Age" value="42" />
            <Metric label="Risk Tolerance" value="Moderate-High" />
            <Metric label="Investment Horizon" value="5+ Years" />
            <Metric label="Monthly Contribution" value="$2,500" />
          </Card>
        </Section>

        <Section title="Fund Comparison">
          <Tabs
            items={[
              { id: "fund-a", label: "Aggressive Growth Fund", content: <FundDetail {...fundA} /> },
              { id: "fund-b", label: "Stable Income Fund", content: <FundDetail {...fundB} /> },
            ]}
          />

          <Card title="Head-to-Head Metrics">
            <DataTable
              columns={[
                { key: "label", label: "Metric" },
                { key: "value", label: "Fund A" },
                { key: "delta", label: "vs. Fund B" },
              ]}
              rows={comparisonData}
              selectable
            />
          </Card>
        </Section>

        <Section title="Recommendation Summary">
          <Card title="Analysis">
            <p>Based on the client's moderate-high risk tolerance and 5+ year horizon, the Aggressive Growth Fund offers superior historical returns, though with higher volatility. The Stable Income Fund provides lower risk but significantly underperforms over the long term.</p>
            <div style={{ marginTop: "1rem" }}>
              <Status tone="success" label="Recommended: Aggressive Growth Fund" />
            </div>
          </Card>
        </Section>

        <Section title="Compliance Log">
          <AuditLog entries={auditEntries} />
        </Section>
      </main>
    </Page>
  );
}

function FundDetail({ fund }: { fund: typeof fundA }) {
  return (
    <div>
      <h2>{fund.name}</h2>
      <p>{fund.description}</p>
      <ul>
        <li>Manager: {fund.manager}</li>
        <li>Asset Class: {fund.type}</li>
        <li>Expense Ratio: {fund.expenseRatio}</li>
      </ul>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section style={{ marginBottom: "2rem" }}><h2>{title}</h2>{children}</section>;
}
