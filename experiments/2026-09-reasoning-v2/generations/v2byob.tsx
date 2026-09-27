import { Page, Header, Section, Card, Metric, Delta, EmptyData, StaleData, ErrorData, Button } from "@stoa/react";

const MOCK_DATA = {
  totalRevenue: { value: 1250000, target: 1200000, basis: "budget" },
  operatingExpenses: { value: 480000, target: 450000, basis: "budget", delta: -30000 },
  grossMargin: { value: 62, target: 65, basis: "budget", delta: -3 },
  cashFlow: { value: -15000, target: 0, basis: "budget", delta: -15000 },
  receivables: { value: 320000, target: 280000, basis: "budget", delta: 40000 },
  inventory: { value: 180000, target: 150000, basis: "budget", delta: 30000 },
};

const exceptions = Object.entries(MOCK_DATA)
  .filter(([_, data]) => Math.abs(data.delta) > 0)
  .sort((a, b) => Math.abs(b[1].delta) - Math.abs(a[1].delta));

export default function FinanceDashboard() {
  return (
    <Page title="Weekly Finance Review">
      <Header title="Finance Overview" subtitle="Weekly performance vs. budget" />
      <Section title="Exception Alert: Variance > 5%" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exceptions.map(([label, data]) => (
            <Card key={label} title={label} className="bg-red-50 border-red-200">
              <Metric label="Current" value={data.value} unit={data.basis === "budget" ? " $" : "%"} />
              <Delta value={data.delta} basis={data.basis} />
              <Button
                label="Analyze"
                variant="outline"
                onPress={() => alert(`Drilling into ${label}: Review details and history.`)}
              />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Key Performance Indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(MOCK_DATA).map(([label, data]) => (
            <Card key={label} title={label}>
              <Metric label="Current" value={data.value} unit={data.basis === "budget" ? " $" : "%"} />
              <Delta value={data.delta} basis={data.basis} />
              <p className="text-sm text-gray-500 mt-2">Target: {data.target}{data.basis === "budget" ? " $" : "%"}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Detailed Financial Statement">
        <Card title="Weekly Summary">
          <div className="table w-full">
            <thead>
              <tr className="border-b">
                <th className="sticky left-0 bg-gray-100 py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-right">Actual</th>
                <th className="py-2 px-4 text-right">Budget</th>
                <th className="py-2 px-4 text-right">Variance</th>
                <th className="py-2 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MOCK_DATA).map(([label, data]) => (
                <tr key={label} className="border-b">
                  <td className="sticky left-0 bg-white py-2 px-4 text-left font-medium">{label}</td>
                  <td className="py-2 px-4 text-right">${data.value.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right">${data.target.toLocaleString()}</td>
                  <td className={`py-2 px-4 text-right font-bold ${data.delta > 0 ? "text-red-600" : "text-green-600"}`}>
                    {data.delta > 0 ? "+" : ""}{data.delta.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right">
                    <Status tone={data.delta > 0 ? "critical" : "neutral"} label={data.delta > 0 ? "Over Budget" : "On Track"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        </Card>
      </Section>

      <Section title="Data Integrity">
        <div className="flex gap-4">
          <StaleData since="2 days ago" label="Cash Flow Report" />
          <ErrorData retry label="Inventory Audit (System Error)" />
          <EmptyData label="Q3 Forecast" />
        </div>
      </Section>
    </Page>
  );
}
