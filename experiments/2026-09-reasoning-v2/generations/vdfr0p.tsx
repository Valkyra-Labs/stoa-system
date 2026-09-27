import { Page, Header, Sidebar, Section, Card, Tabs, Metric, Delta, Chart, DataTable, Comparison, Timeline, EmptyData } from "@stoa/react";

const WeeklyFinanceDashboard = () => {
  return (
    <Page title="Weekly Finance Overview">
      <Header title="Weekly Finance Overview" subtitle="Monday Morning Check" />
      <Sidebar>
        <Section title="Navigation">
          <Tabs
            items={[
              { id: "overview", label: "Overview", content: <Card><Metric label="Revenue" value="$12.5M" delta={+3.2} unit="USD" /> <Metric label="Expenses" value="$8.2M" delta={-1.5} unit="USD" /> <Metric label="Profit" value="$4.3M" delta={+2.7} unit="USD" /></Card> },
              { id: "trends", label: "Trends", content: <Chart type="line" series={[{ name: "Revenue", data: [10, 12, 14, 16] }, { name: "Expenses", data: [7, 7.5, 8, 8.2] }]} x="Week" y="USD" /> },
              { id: "top-performers", label: "Top Performers", content: <DataTable
                columns={[{ name: "Department", sortable: true }, { name: "Revenue", sortable: true }, { name: "Profit Margin", sortable: true }]}
                rows={[
                  { Department: "Sales", Revenue: "$4.2M", "Profit Margin": "25%" },
                  { Department: "Engineering", Revenue: "$3.1M", "Profit Margin": "30%" },
                  { Department: "Marketing", Revenue: "$2.8M", "Profit Margin": "20%" }
                ]}
                selectable
              /> },
              { id: "exceptions", label: "Exceptions", content: <Comparison
                entities={["Region A", "Region B"]}
                metrics={[
                  { name: "Revenue", value: "Region A: $4.2M", basis: "Region B: $3.8M" },
                  { name: "Expenses", value: "Region A: $2.1M", basis: "Region B: $2.4M" }
                ]}
              /> }
            ]}
          />
        </Section>
      </Sidebar>
      <main>
        <Section title="Key Insights">
          <Card>
            <p>Revenue increased by 3.2% from last week, driven by strong sales in the Americas. Expenses decreased by 1.5% due to cost optimization initiatives.</p>
          </Card>
        </Section>
      </main>
    </Page>
  );
};

export default WeeklyFinanceDashboard;
