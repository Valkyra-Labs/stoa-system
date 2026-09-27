import { Page, Header, FilterBar, DataTable, Delta, Status } from "@stoa/react";

// Intent: Monitor what moved since yesterday in the portfolio
// Information: All positions, current values, deltas from yesterday, percentage changes
// Decision: Which positions moved significantly and need investigation or action
// Pattern: Explorer (filter and sort positions by delta, understand outliers)

const PortfolioManager = () => {
  const positions = [
    {
      id: "AAPL",
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 1250,
      price: 234.85,
      value: 293_562.50,
      yesterday: 288_400.00,
      change: 5_162.50,
      percent: 1.79,
      marketChange: -0.32,
    },
    {
      id: "MSFT",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: 850,
      price: 418.90,
      value: 356_065.00,
      yesterday: 351_800.00,
      change: 4_265.00,
      percent: 1.21,
      marketChange: 0.45,
    },
    {
      id: "TSLA",
      symbol: "TSLA",
      name: "Tesla Inc.",
      shares: 320,
      price: 287.50,
      value: 92_000.00,
      yesterday: 98_560.00,
      change: -6_560.00,
      percent: -6.65,
      marketChange: -3.21,
    },
    {
      id: "NVDA",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      shares: 450,
      price: 142.75,
      value: 64_237.50,
      yesterday: 61_500.00,
      change: 2_737.50,
      percent: 4.45,
      marketChange: 2.18,
    },
    {
      id: "GOOGL",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 620,
      price: 195.40,
      value: 121_148.00,
      yesterday: 119_250.00,
      change: 1_898.00,
      percent: 1.59,
      marketChange: -0.18,
    },
    {
      id: "JPM",
      symbol: "JPM",
      name: "JPMorgan Chase",
      shares: 1800,
      price: 208.30,
      value: 374_940.00,
      yesterday: 375_600.00,
      change: -660.00,
      percent: -0.18,
      marketChange: 0.32,
    },
    {
      id: "BRK.B",
      symbol: "BRK.B",
      name: "Berkshire Hathaway B",
      shares: 280,
      price: 456.20,
      value: 127_736.00,
      yesterday: 126_800.00,
      change: 936.00,
      percent: 0.74,
      marketChange: 0.12,
    },
    {
      id: "JNJ",
      symbol: "JNJ",
      name: "Johnson & Johnson",
      shares: 540,
      price: 156.45,
      value: 84_483.00,
      yesterday: 85_320.00,
      change: -837.00,
      percent: -0.98,
      marketChange: -1.45,
    },
  ];

  const columns = [
    { key: "symbol", label: "Symbol", width: "90px" },
    { key: "name", label: "Position" },
    { key: "shares", label: "Shares", align: "right" },
    { key: "price", label: "Price", align: "right", format: "currency" },
    { key: "value", label: "Value", align: "right", format: "currency" },
    {
      key: "change",
      label: "Δ 24h",
      align: "right",
      format: (row) => (
        <Delta value={row.change} basis={row.yesterday} />
      ),
    },
    {
      key: "percent",
      label: "Δ %",
      align: "right",
      format: (row) => (
        <span style={{ color: row.percent >= 0 ? "#059669" : "#dc2626" }}>
          {row.percent >= 0 ? "+" : ""}
          {row.percent.toFixed(2)}%
        </span>
      ),
    },
  ];

  const sortedByDelta = [...positions].sort(
    (a, b) => Math.abs(b.percent) - Math.abs(a.percent)
  );

  return (
    <Page title="Portfolio Book">
      <Header
        title="Morning Review"
        subtitle="See what moved since yesterday"
        actions={[
          { label: "Refresh", variant: "secondary" },
          { label: "Export", variant: "secondary" },
        ]}
      />

      <FilterBar
        filters={[
          { key: "sector", label: "Sector", options: ["Tech", "Finance", "Healthcare"] },
          { key: "movers", label: "Show", options: ["All", "Gainers", "Losers"] },
        ]}
      />

      <section style={{ padding: "20px" }}>
        <h2>Positions (sorted by magnitude of change)</h2>
        <DataTable
          columns={columns}
          rows={sortedByDelta}
          stickyFirstColumn
        />
      </section>
    </Page>
  );
};

export default PortfolioManager;
