import { Page, Header, Section, Card, Comparison, Metric, Delta, Trend, Chart, Tabs, Button, Sidebar, DataTable, Status } from "@stoa/react";

const FundComparisonPage = () => {
  const fundA = {
    name: "Global Growth Fund",
    returns: { annual: 12.5, yearToYear: 10.2 },
    risk: "Moderate",
    fees: 1.2,
    composition: "60% Equities, 30% Bonds, 10% Alternatives",
    manager: "Jane Doe",
    performanceTrend: [10.5, 11.2, 12.3, 11.8, 12.5],
  };

  const fundB = {
    name: "Balanced Income Fund",
    returns: { annual: 8.9, yearToYear: 7.6 },
    risk: "Low",
    fees: 0.8,
    composition: "40% Equities, 40% Bonds, 20% Alternatives",
    manager: "John Smith",
    performanceTrend: [7.2, 7.5, 7.8, 8.0, 8.9],
  };

  const metrics = [
    { label: "Annual Return", value: fundA.returns.annual, delta: 1.3, unit: "%" },
    { label: "Risk Level", value: fundA.risk, delta: null },
    { label: "Annual Fees", value: fundA.fees, delta: -0.4, unit: "%" },
  ];

  const performanceTrend = {
    type: "line",
    series: [
      { name: fundA.name, data: fundA.performanceTrend },
      { name: fundB.name, data: fundB.performanceTrend },
    ],
    x: "Year",
    y: "Return (%)",
  };

  const fundDetails = [
    { name: "Fund A", data: fundA },
    { name: "Fund B", data: fundB },
  ];

  return (
    <Page title="Fund Recommendation for John Smith">
      <Header
        title="Choose a Fund for John Smith"
        subtitle="Compare Global Growth Fund vs Balanced Income Fund"
        actions={
          <Button variant="primary">Make Recommendation</Button>
        }
      />
      <Section title="Fund Comparison">
        <Comparison entities={fundDetails} metrics={metrics} />
        <Card title="Performance Trend">
          <Chart {...performanceTrend} />
        </Card>
      </Section>
      <Sidebar>
        <Section title="Fund Details">
          {fundDetails.map((fund) => (
            <Card key={fund.name} title={fund.name}>
              <p>{fund.data.composition}</p>
              <p>Manager: {fund.data.manager}</p>
            </Card>
          ))}
        </Section>
      </Sidebar>
    </Page>
  );
};

export default FundComparisonPage;
