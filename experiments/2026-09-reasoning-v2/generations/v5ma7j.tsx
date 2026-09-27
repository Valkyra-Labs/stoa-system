import { Page, Header, Section, Metric, Delta, Comparison } from "@stoa/react";

const WeeklyFinancialOverview = () => {
  return (
    <Page title="Weekly Financial Overview">
      <Header title="Financial Overview" subtitle="Week of April 10, 2023" />
      <Section title="Revenue">
        <Comparison
          entities={[
            { id: "sales", label: "Sales", metrics: { current: 120000, previous: 115000, target: 125000 } },
            { id: "marketing", label: "Marketing", metrics: { current: 50000, previous: 45000, target: 55000 } },
            { id: "support", label: "Support", metrics: { current: 15000, previous: 14000, target: 16000 } }
          ]}
        />
      </Section>
      <Section title="Expenses">
        <Comparison
          entities={[
            { id: "operations", label: "Operations", metrics: { current: 75000, previous: 70000, target: 80000 } },
            { id: "hr", label: "HR", metrics: { current: 20000, previous: 18000, target: 22000 } },
            { id: "admin", label: "Admin", metrics: { current: 10000, previous: 9000, target: 11000 } }
          ]}
        />
      </Section>
      <Section title="Profit">
        <Comparison
          entities={[
            { id: "overall", label: "Overall", metrics: { current: 55000, previous: 48000, target: 60000 } }
          ]}
        />
      </Section>
    </Page>
  );
};

export default WeeklyFinancialOverview;
