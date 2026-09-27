import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Status, Button, EmptyData } from "@stoa/react";

// Realistic placeholder data for fund comparison
const FUND_A = {
  id: "fund-a",
  name: "Aggressive Growth Fund",
  ticker: "AGGF",
  performance: {
    ytd: 12.5,
    oneYear: 8.2,
    threeYear: 14.1,
    fiveYear: 11.8,
  },
  risk: {
    volatility: "High",
    maxDrawdown: "-22%",
    sharpeRatio: 1.45,
  },
  fees: {
    management: 0.85,
    expenseRatio: 0.92,
  },
  description: "Focuses on emerging markets and tech stocks with a high risk tolerance.",
};

const FUND_B = {
  id: "fund-b",
  name: "Balanced Income Fund",
  ticker: "BALI",
  performance: {
    ytd: 6.8,
    oneYear: 5.4,
    threeYear: 7.9,
    fiveYear: 6.2,
  },
  risk: {
    volatility: "Medium",
    maxDrawdown: "-8%",
    sharpeRatio: 0.95,
  },
  fees: {
    management: 0.50,
    expenseRatio: 0.55,
  },
  description: "Balanced approach mixing equities and fixed income for steady growth and income.",
};

const Comparison = ({ entities, metrics, evidence }: { entities: { [key: string]: any }; metrics: any[]; evidence: any[] }) => {
  return (
    <Section title="Side-by-Side Comparison">
      <Card title="Performance Overview">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(entities).map(([key, entity]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-bold text-lg">{entity.name}</h3>
              <Metric label="YTD Return" value={entity.performance.ytd} unit="%" />
              <Metric label="1-Year Return" value={entity.performance.oneYear} unit="%" />
              <Metric label="Max Drawdown" value={entity.risk.maxDrawdown} unit="" />
              <Metric label="Expense Ratio" value={entity.fees.expenseRatio} unit="%" />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Risk Profile">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(entities).map(([key, entity]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-bold text-lg">{entity.name}</h3>
              <Status tone={entity.risk.volatility === "High" ? "red" : entity.risk.volatility === "Medium" ? "yellow" : "green"} label={entity.risk.volatility} />
              <Metric label="Sharpe Ratio" value={entity.risk.sharpeRatio} />
              <Metric label="Volatility" value={entity.risk.volatility} unit="" />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recent Fund News">
        <div className="space-y-2">
          {evidence.map((event, idx) => (
            <div key={idx} className="border-b pb-2 last:border-0">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-gray-600">{event.date}: {event.summary}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
};

export default function FundRecommendationScreen() {
  return (
    <Page title="Fund Recommendation">
      <Header title="Client Fund Selection" subtitle="Comparative analysis for John Doe" actions={<Button label="Save Recommendation" onPress={() => alert("Saved")} />} />
      <Sidebar children={<Section title="Client Profile">High Net Worth, Conservative Risk Tolerance</Section>} />
      <main className="flex-1 p-4">
        <Section title="Recommendation Decision">
          <Card title="Select the Best Fund">
            <div className="flex flex-col gap-4">
              <Comparison
                entities={FUND_A, FUND_B}
                metrics={[
                  { label: "YTD Return", unit: "%" },
                  { label: "1-Year Return", unit: "%" },
                  { label: "Expense Ratio", unit: "%" },
                  { label: "Sharpe Ratio", unit: "" },
                ]}
                evidence={[
                  { title: "Emerging Markets Rally", date: "2023-10-15", summary: "Aggressive Growth Fund saw a 5% gain due to tech sector surge." },
                  { title: "Bond Market Stability", date: "2023-10-12", summary: "Balanced Income Fund maintained stability amidst volatility." },
                ]}
              />
              <div className="mt-6 flex justify-center">
                <Button label="Recommend Fund A" variant="primary" onPress={() => alert("Recommendation: Fund A")} />
                <Button label="Recommend Fund B" variant="secondary" onPress={() => alert("Recommendation: Fund B")} />
                <Button label="Consult Another Advisor" onPress={() => alert("Consulted")} />
              </div>
            </div>
          </Card>
        </Section>
      </main>
    </Page>
  );
}
