import { Page, Header, Section, Card, Tabs, Metric, Delta, Comparison, Status, Button } from "@stoa/react";

const Fund = ({ name, returns, risk, fees, performanceTrend, benchmark }) => (
  <Card>
    <h2>{name}</h2>
    <Metric label="Annual Return" value={returns} unit="%" />
    <Metric label="Risk Score" value={risk} />
    <Metric label="Fees" value={fees} unit="%" />
    <Trend series={performanceTrend} />
    <Metric label="Benchmark" value={benchmark} />
  </Card>
);

export default function Page() {
  return (
    <Page title="Fund Recommendation">
      <Header
        title="Choose a Fund"
        subtitle="Compare Fund A and Fund B based on performance, risk, and fees"
        actions={
          <Button variant="primary">Recommend</Button>
        }
      />
      <Section title="Fund Comparison">
        <Comparison
          entities={[
            { id: "fund-a", name: "Fund A", component: <Fund name="Fund A" returns={7.2} risk={4.8} fees={1.2} performanceTrend={[6.5, 7.0, 7.2, 7.5, 7.8]} benchmark="S&P 500" /> },
            { id: "fund-b", name: "Fund B", component: <Fund name="Fund B" returns={6.8} risk={3.9} fees={0.9} performanceTrend={[6.2, 6.5, 6.7, 6.8, 7.0]} benchmark="S&P 500" /> },
          ]}
        />
      </Section>
      <Section title="Key Insights">
        <Card>
          <h3>Recommendation Summary</h3>
          <p>Based on the comparison, Fund A offers higher returns but with greater risk. Fund B provides lower risk and fees but slightly lower returns. Choose Fund A if you seek growth, or Fund B if you prioritize stability and cost efficiency.</p>
        </Card>
      </Section>
    </Page>
  );
}
