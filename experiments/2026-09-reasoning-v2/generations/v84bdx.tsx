import { Page, Header, Section, Card, Tabs, Button, Metric, Status, DataTable, Comparison, Tabs as StoaTabs, EmptyData } from "@stoa/react";

// --- Mock Data ---

const fundA = {
  id: "fund-a",
  name: "Growth Horizon Fund",
  ticker: "GHRN",
  riskLevel: "Moderate-High",
  minInvestment: 2500,
  expenseRatio: 0.75,
  returns: {
    ytd: 12.5,
    oneYear: 18.2,
    threeYear: 14.1,
    fiveYear: 11.8
  },
  description: "Focuses on technology and healthcare sectors with a long-term growth orientation.",
  manager: "Sarah Jenkins",
  status: "Recommended"
};

const fundB = {
  id: "fund-b",
  name: "Stable Yield Fund",
  ticker: "SYLD",
  riskLevel: "Moderate-Low",
  minInvestment: 1000,
  expenseRatio: 0.50,
  returns: {
    ytd: 6.8,
    oneYear: 9.4,
    threeYear: 8.9,
    fiveYear: 7.2
  },
  description: "Balanced approach utilizing fixed income and blue-chip equities for capital preservation.",
  manager: "Michael Ross",
  status: "Not Recommended"
};

const comparisonMetrics = [
  { label: "Expense Ratio", fundA: 0.75, fundB: 0.50 },
  { label: "Min. Investment", fundA: 2500, fundB: 1000 },
  { label: "Manager Tenure", fundA: 12, fundB: 8 },
  { label: "Liquidity (Days)", fundA: 2, fundB: 5 },
];

const auditLog = [
  { action: "Created recommendation draft", user: "Advisor", time: "10m ago" },
  { action: "Updated client notes", user: "Client", time: "1h ago" },
  { action: "Added performance data", user: "System", time: "2h ago" },
];

// --- Main Component ---

export default function FundSelectionScreen() {
  return (
    <Page title="Fund Selection Review" className="bg-slate-50 text-slate-900">
      <Header 
        title="Client Fund Recommendation" 
        subtitle="Review and finalize selection for Portfolio Growth Ltd."
      />

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Top-level Status & Recommendation */}
        <Section title="Adviser Recommendation" className="bg-white shadow-sm border border-slate-200 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Status tone="success" label="Recommended for Growth Horizon Fund" />
              <p className="text-slate-600 max-w-md">
                Based on the client's risk profile (Moderate) and time horizon (5+ years), 
                we recommend the Growth Horizon Fund for its superior historical returns and sector focus.
              </p>
            </div>
            <Button label="Save Selection" variant="primary" className="w-full md:w-auto" />
          </div>
        </Section>

        {/* Side-by-Side Comparison */}
        <Section title="Fund Comparison" className="bg-white shadow-sm border border-slate-200 rounded-lg">
          <Comparison 
            entities={[
              { id: fundA.id, name: fundA.name, ticker: fundA.ticker },
              { id: fundB.id, name: fundB.name, ticker: fundB.ticker },
            ]}
            metrics={comparisonMetrics}
          />
        </Section>

        {/* Detailed Inspector for the Recommended Fund */}
        <Section title="Detailed View: Growth Horizon Fund" className="bg-white shadow-sm border border-slate-200 rounded-lg">
          <Card title="Profile Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Fund Details</h3>
                <p className="text-slate-600 leading-relaxed">{fundA.description}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex justify-between"><span>Manager:</span> <span className="font-medium">{fundA.manager}</span></li>
                  <li className="flex justify-between"><span>Risk Level:</span> <span className="font-medium">{fundA.riskLevel}</span></li>
                  <li className="flex justify-between"><span>Min. Investment:</span> <span className="font-medium">${fundA.minInvestment.toLocaleString()}</span></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Performance History</h3>
                <Metric label="YTD Return" value={fundA.returns.ytd} unit="%" />
                <Metric label="1-Year Return" value={fundA.returns.oneYear} unit="%" />
                <Metric label="3-Year Return" value={fundA.returns.threeYear} unit="%" />
                <Metric label="5-Year Return" value={fundA.returns.fiveYear} unit="%" />
              </div>
            </div>
          </Card>

          <Card title="Historical Performance Trend" className="mt-6">
            <div className="h-48 w-full">
              {/* Placeholder for a Chart component if needed, using a visual representation via CSS/grid for now as per constraints */}
              <div className="flex items-end justify-between h-full gap-2 px-4">
                {[5, 8, 6, 9, 11, 10, 14, 16, 15, 18, 17, 21].map((val, i) => (
                  <div key={i} className="flex-1 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}%
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">Approx. 12-month performance trend</p>
            </div>
          </Card>
        </Section>

        {/* Audit Trail */}
        <Section title="Activity Log" className="bg-white shadow-sm border border-slate-200 rounded-lg">
          <AuditLog entries={auditLog} />
        </Section>

      </main>
    </Page>
  );
}

// --- Sub-components defined inline for single-file requirement ---

function Comparison({ entities, metrics }: { entities: {id: string, name: string, ticker: string}[], metrics: {label: string, fundA: number, fundB: number}[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 font-semibold">Metric</th>
            <th className="py-3 px-4 font-semibold">{entities[0].name} ({entities[0].ticker})</th>
            <th className="py-3 px-4 font-semibold">{entities[1].name} ({entities[1].ticker})</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {metrics.map((m, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="py-3 px-4 font-medium text-slate-600">{m.label}</td>
              <td className="py-3 px-4">{m.fundA}</td>
              <td className="py-3 px-4">{m.fundB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditLog({ entries }: { entries: { action: string, user: string, time: string }[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div key={i} className="flex items-center justify-between text-sm border-b border-slate-100 last:border-0 py-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-700">{entry.action}</span>
          </div>
          <div className="text-slate-500 flex items-center gap-3">
            <span className="font-medium">{entry.user}</span>
            <span>•</span>
            <span>{entry.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
