import { Page, Compare, Metric, Trend, Chart, DataTable, Button } from "@stoa/react";

const FundComparison = () => {
  return (
    <Page title="Fund Comparison">
      <Header title="Fund Comparison" subtitle="Choose the best fund for the client" />
      <Compare
        entities={[
          { id: "fund1", label: "Growth Fund" },
          { id: "fund2", label: "Income Fund" },
        ]}
        metrics={[
          { id: "annualReturn", label: "Annual Return", unit: "%" },
          { id: "volatility", label: "Volatility", unit: "%" },
          { id: "sharpeRatio", label: "Sharpe Ratio" },
        ]}
      >
        {(entity, metric) => {
          const data = {
            fund1: {
              annualReturn: { value: 8.5, delta: 0.5, basis: 8 },
              volatility: { value: 4.2, delta: -0.3, basis: 4.5 },
              sharpeRatio: { value: 1.9, delta: 0.1, basis: 1.8 },
            },
            fund2: {
              annualReturn: { value: 7.2, delta: 0.4, basis: 6.8 },
              volatility: { value: 5.1, delta: 0.1, basis: 5 },
              sharpeRatio: { value: 1.4, delta: 0.05, basis: 1.35 },
            },
          };

          return (
            <Metric
              label={metric.label}
              value={data[entity.id][metric.id].value}
              delta={data[entity.id][metric.id].delta}
              basis={data[entity.id][metric.id].basis}
              unit={metric.unit}
            />
          );
        }}
      </Compare>
      <section>
        <Header title="Performance Trends" />
        <Compare
          entities={[
            { id: "fund1", label: "Growth Fund" },
            { id: "fund2", label: "Income Fund" },
          ]}
          metrics={[
            { id: "trend", label: "Trend" },
          ]}
        >
          {(entity, metric) => (
            <Trend series={[{ label: "Return", data: [1.2, 1.3, 1.1, 1.4, 1.5] }]} />
          )}
        </Compare>
      </section>
      <section>
        <Header title="Historical Data" />
        <DataTable
          columns={[
            { label: "Date", key: "date" },
            { label: "Return", key: "return", unit: "%" },
            { label: "Volatility", key: "volatility", unit: "%" },
          ]}
          rows={[
            { date: "2022-12-31", return: 8.5, volatility: 4.2 },
            { date: "2021-12-31", return: 7.8, volatility: 4.5 },
            { date: "2020-12-31", return: 6.9, volatility: 5.1 },
          ]}
        />
      </section>
      <section>
        <Header title="Recommendation" />
        <p>
          Based on the analysis, the <strong>Growth Fund</strong> is recommended due to its higher annual return and lower volatility.
        </p>
        <Button label="Confirm Recommendation" onPress={() => console.log("Recommendation confirmed")} />
      </section>
    </Page>
  );
};

export default FundComparison;
