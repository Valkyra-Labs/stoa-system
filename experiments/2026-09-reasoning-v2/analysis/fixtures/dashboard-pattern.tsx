import { Page, Dashboard, Chart, DataTable } from "@stoa/react";
const rows = [];
function Charts() {
  return <Chart type="line" series={[]} x="d" y="v" />;
}
export default function Screen() {
  return (
    <Page title="Book">
      <Dashboard
        metrics={[{ label: "P&L", value: 1 }, { label: "Exposure", value: 2 }, { label: "VaR", value: 3 }]}
        charts={<Charts />}
        table={<DataTable columns={[]} rows={rows} />}
      />
    </Page>
  );
}
