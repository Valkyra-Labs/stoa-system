// Synthetic worked example (not a generation): a comparison. Two suppliers
// on the same measures, the differences marked, the basis stated. The
// domain is deliberately outside the experiment's tasks.
import { Page, Header, Comparison, Card, Status, Button } from "@stoa/react";

const entities = [
  { name: "Supplier A", price: "$4.10 / unit", lead: "12 days", defects: "0.8%", terms: "Net 30" },
  { name: "Supplier B", price: "$3.85 / unit", lead: "21 days", defects: "1.9%", terms: "Net 45" },
];
const metrics = [
  { key: "price", label: "Unit price (1,000 units)" },
  { key: "lead", label: "Lead time (last 6 orders)" },
  { key: "defects", label: "Defect rate (last 12 months)" },
  { key: "terms", label: "Payment terms" },
];

export default function SupplierComparison() {
  return (
    <Page title="Choose a supplier for Q4">
      <Header title="Supplier A vs Supplier B" subtitle="Same order size, same period" />
      <Comparison entities={entities} metrics={metrics} />
      <Card title="Differences">
        <Status tone="warning" label="B is 6% cheaper" /> <Status tone="danger" label="B takes 9 days longer" /> <Status tone="danger" label="B has 2.4x the defects" />
      </Card>
      <Card title="Decision"><Button label="Choose Supplier A" variant="primary" /><Button label="Choose Supplier B" /></Card>
    </Page>
  );
}
