import { Page, Header, Section, Comparison, Chart, DataTable } from "@stoa/react";

export default function FundComparison() {
  return (
    <Page title="Fund Comparison">
      <Header title="Compare Funds" subtitle="Choose the best fund for your client" />
      <Section title="Fund Metrics">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Stable Fund" }
          ]}
          metrics={[
            { id: "returns", label: "1-Year Returns", unit: "%" },
            { id: "volatility", label: "Volatility", unit: "%" },
            { id: "fees", label: "Management Fees", unit: "%" }
          ]}
        />
      </Section>
      <Section title="Performance Charts">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Stable Fund" }
          ]}
          metrics={[
            { id: "returns", label: "Cumulative Returns", type: "line" },
            { id: "volatility", label: "Monthly Volatility", type: "bar" }
          ]}
        />
      </Section>
      <Section title="Fund Details">
        <Comparison
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Stable Fund" }
          ]}
          metrics={[
            { id: "details", label: "Fund Details" }
          ]}
        >
          <DataTable
            columns={[
              { label: "Fund Name" },
              { label: "Manager" },
              { label: "Inception Date" },
              { label: "Asset Class" },
              { label: "Minimum Investment" }
            ]}
            rows={[
              ["Growth Fund", "Jane Doe", "2020-01-01", "Equities", "$1,000"],
              ["Stable Fund", "John Smith", "2015-06-15", "Fixed Income", "$500"]
            ]}
          />
        </Comparison>
      </Section>
    </Page>
  );
}
