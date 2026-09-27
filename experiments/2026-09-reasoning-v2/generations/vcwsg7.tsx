import { Page, Header, Card, Comparison, Metric, Status, Button, EmptyData, Section } from "@stoa/react";

// Realistic placeholder data for two funds
const fundA = {
  id: "fund-a",
  name: "SteadyGrowth Core",
  risk: "Moderate",
  return12m: 8.2,
  return1y: 6.5,
  return3y: 5.8,
  volatility: 12,
  maxDrawdown: -4.1,
  fees: 0.65,
  minInvestment: 10000,
  liquidity: "Daily"
};

const fundB = {
  id: "fund-b",
  name: "Aggressive Tech",
  risk: "High",
  return12m: 14.8,
  return1y: 11.2,
  return3y: 9.5,
  volatility: 28,
  maxDrawdown: -18.3,
  fees: 1.2,
  minInvestment: 25000,
  liquidity: "Weekly"
};

const metrics = [
  { label: "12-Month Return", basis: "Target: 7.0%", fundA: fundA.return12m, fundB: fundB.return12m },
  { label: "1-Year Return", basis: "Target: 5.0%", fundA: fundA.return1y, fundB: fundB.return1y },
  { label: "3-Year Return", basis: "Target: 4.5%", fundA: fundA.return3y, fundB: fundB.return3y },
  { label: "Volatility (Std Dev)", basis: "Target: <15%", fundA: fundA.volatility, fundB: fundB.volatility },
  { label: "Max Drawdown", basis: "Target: <5%", fundA: fundA.maxDrawdown, fundB: fundB.maxDrawdown },
  { label: "Annual Fee (%)", basis: "Target: <0.8%", fundA: fundA.fees, fundB: fundB.fees },
];

const comparisonData = {
  entities: [
    { id: "fund-a", name: fundA.name },
    { id: "fund-b", name: fundB.name }
  ],
  metrics
};

export default function FundSelectorPage() {
  return (
    <Page title="Fund Recommendation Tool">
      <Header title="Select the Best Fund" subtitle="Compare performance, risk, and fees to make an informed decision" />
      
      <Section title="Client Profile">
        <Card title="Client Constraints">
          <Metric label="Risk Tolerance" value="Moderate to High" />
          <Metric label="Investment Horizon" value="5+ Years" />
          <Metric label="Available Capital" value="$25,000" />
          <Metric label="Liquidity Need" value="Weekly Access" />
        </Card>
      </Section>

      <Section title="Comparison & Recommendation">
        <Comparison entities={comparisonData.entities} metrics={comparisonData.metrics} />
        
        <div style={{ marginTop: '2rem' }}>
          <Status tone="success" label="Recommendation Logic" />
          <p style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            Based on the client's moderate risk tolerance and need for weekly liquidity, 
            the <strong>SteadyGrowth Core</strong> is recommended. It offers superior risk-adjusted returns 
            with significantly lower volatility and drawdown risk compared to the Aggressive Tech fund, 
            despite a slightly lower raw return. The fee difference is negligible over the 5-year horizon.
          </p>

          <Card title="Action: Recommend SteadyGrowth Core">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p><strong>Confirm Recommendation</strong> for SteadyGrowth Core (Fund A)</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Consequence: The client will be allocated $25,000 into Fund A. 
                  Weekly withdrawals will be processed. Fees of 0.65% apply.
                </p>
              </div>
              <Button 
                label="Submit Recommendation" 
                onPress={() => alert("Recommendation submitted for SteadyGrowth Core.")} 
                variant="primary"
              />
            </div>
          </Card>

          <Card title="Alternative: Recommend Aggressive Tech">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p><strong>Confirm Recommendation</strong> for Aggressive Tech (Fund B)</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Consequence: The client will be allocated $25,000 into Fund B. 
                  Withdrawals are only available weekly. Fees of 1.2% apply. 
                  Higher risk of significant drawdowns (-18.3% max).
                </p>
              </div>
              <Button 
                label="Submit Recommendation" 
                onPress={() => alert("Recommendation submitted for Aggressive Tech.")} 
                variant="secondary"
              />
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Detailed Evidence">
        <Card title={fundA.name} >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Metric label="12-Month Return" value={fundA.return12m.toFixed(1)} unit="%" />
            <Metric label="1-Year Return" value={fundA.return1y.toFixed(1)} unit="%" />
            <Metric label="3-Year Return" value={fundA.return3y.toFixed(1)} unit="%" />
            <Metric label="Volatility" value={fundA.volatility} unit="%" />
            <Metric label="Max Drawdown" value={fundA.maxDrawdown} unit="%" />
            <Metric label="Annual Fee" value={fundA.fees} unit="%" />
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
            <p><strong>Min Investment:</strong> $10,000 | <strong>Liquidity:</strong> Daily</p>
          </div>
        </Card>

        <Card title={fundB.name}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Metric label="12-Month Return" value={fundB.return12m.toFixed(1)} unit="%" />
            <Metric label="1-Year Return" value={fundB.return1y.toFixed(1)} unit="%" />
            <Metric label="3-Year Return" value={fundB.return3y.toFixed(1)} unit="%" />
            <Metric label="Volatility" value={fundB.volatility} unit="%" />
            <Metric label="Max Drawdown" value={fundB.maxDrawdown} unit="%" />
            <Metric label="Annual Fee" value={fundB.fees} unit="%" />
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
            <p><strong>Min Investment:</strong> $25,000 | <strong>Liquidity:</strong> Weekly</p>
          </div>
        </Card>
      </Section>
    </Page>
  );
}
