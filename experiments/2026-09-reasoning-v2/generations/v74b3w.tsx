import { Page, Header, Comparison, Metric, Delta } from "@stoa/react";

export default function FundComparison() {
  return (
    <Page title="Fund Comparison">
      <Header
        title="Recommendation for John Doe"
        subtitle="Choose between Fund A and Fund B"
        actions={<Button label="Save and Send" />}
      />
      <Comparison
        entities={[
          { id: "fund-a", label: "Fund A" },
          { id: "fund-b", label: "Fund B" },
        ]}
        metrics={[
          { label: "Current Value", id: "value" },
          { label: "1-Year Return", id: "return-year" },
          { label: "Risk Rating", id: "risk" },
          { label: "Management Fee", id: "fee" },
        ]}
      >
        {({ entity, metric, value }) => (
          <Metric
            label={metric.label}
            value={value}
            delta={
              metric.id === "return-year" ? (
                <Delta value={value} basis={100} />
              ) : null
            }
            unit={metric.id === "value" ? "USD" : ""}
          />
        )}
      </Comparison>
    </Page>
  );
}
