import { Page, Header, Section, Card, Metric, Delta, Tabs, Button } from "@stoa/react";

const FundA = () => (
  <Card>
    <h2>Fund A</h2>
    <Metric label="Annual Return" value="7.2%" delta={+0.5} unit="%" />
    <Metric label="Risk Score" value="65" />
    <Metric label="Fee" value="$150" />
    <Metric label="Minimum Investment" value="$10,000" />
  </Card>
);

const FundB = () => (
  <Card>
    <h2>Fund B</h2>
    <Metric label="Annual Return" value="6.8%" delta={+0.3} unit="%" />
    <Metric label="Risk Score" value="72" />
    <Metric label="Fee" value="$200" />
    <Metric label="Minimum Investment" value="$5,000" />
  </Card>
);

const Comparison = () => (
  <Card>
    <h2>Comparison</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      <Metric label="Annual Return" value="7.2%" delta={+0.5} unit="%" />
      <Metric label="Annual Return" value="6.8%" delta={+0.3} unit="%" />
      <Metric label="Risk Score" value="65" />
      <Metric label="Risk Score" value="72" />
      <Metric label="Fee" value="$150" />
      <Metric label="Fee" value="$200" />
      <Metric label="Minimum Investment" value="$10,000" />
      <Metric label="Minimum Investment" value="$5,000" />
    </div>
  </Card>
);

const Recommendation = () => (
  <Card>
    <h2>Recommendation</h2>
    <p>
      Based on the risk profile and return potential, Fund A is recommended for clients seeking a balance of growth and moderate risk. Fund B is suitable for clients with a higher risk tolerance and longer investment horizon.
    </p>
    <Button label="Select Fund A" variant="primary" />
    <Button label="Select Fund B" variant="secondary" />
  </Card>
);

export default function FundComparison() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Fund Recommendation" subtitle="Choose between Fund A and Fund B based on client needs" />
      <Section>
        <Tabs
          items={[
            { id: "fund-a", label: "Fund A", content: <FundA /> },
            { id: "fund-b", label: "Fund B", content: <FundB /> },
          ]}
        />
      </Section>
      <Section>
        <Comparison />
      </Section>
      <Section>
        <Recommendation />
      </Section>
    </Page>
  );
}
