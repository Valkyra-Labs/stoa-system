// Portfolio morning view: see what moved overnight and understand why.
// Layout prioritizes overall performance and biggest movers at top, with detailed
// positions below for drill-down. Dashboard pattern aggregates metrics and charts
// to give instant picture of the book's overnight changes.

import {
  Page,
  Header,
  Dashboard,
  Card,
  Section,
  Metric,
  Delta,
  Chart,
  DataTable,
  Status,
} from "@stoa/react";

export default function PortfolioMorningView() {
  const portfolioMetrics = [
    {
      label: "Total Value",
      value: "$2,847,230",
      delta: 94520,
      unit: "$",
    },
    {
      label: "Daily Return",
      value: "3.42%",
      delta: 2.15,
      unit: "%",
    },
    {
      label: "Positions Up",
      value: "18 of 24",
      delta: 3,
    },
    {
      label: "Largest Gain",
      value: "NVDA +8.2%",
    },
  ];

  const portfolioSeries = [
    {
      id: "portfolio",
      name: "Portfolio Value",
      data: [
        { x: "2:00 AM", y: 2752710 },
        { x: "4:00 AM", y: 2765890 },
        { x: "6:00 AM", y: 2801340 },
        { x: "8:00 AM", y: 2847230 },
      ],
    },
  ];

  const topMoversTable = {
    columns: [
      { id: "symbol", label: "Symbol" },
      { id: "position", label: "Position" },
      { id: "price", label: "Price Change" },
      { id: "pnl", label: "P&L" },
      { id: "reason", label: "Reason" },
    ],
    rows: [
      {
        symbol: "NVDA",
        position: "$420,000",
        price: "+8.2%",
        pnl: "+$34,440",
        reason: "AI earnings beat, raised guidance",
      },
      {
        symbol: "TSLA",
        position: "$385,000",
        price: "+5.9%",
        pnl: "+$22,715",
        reason: "Production beat, cybertruck demand",
      },
      {
        symbol: "GOOGL",
        position: "$310,000",
        price: "+4.1%",
        pnl: "+$12,710",
        reason: "Search ad demand strong",
      },
      {
        symbol: "JPM",
        position: "$290,000",
        price: "-2.3%",
        pnl: "-$6,670",
        reason: "Fed rate expectations shift",
      },
      {
        symbol: "XOM",
        position: "$265,000",
        price: "-1.8%",
        pnl: "-$4,770",
        reason: "Oil prices lower on weak demand",
      },
    ],
  };

  const allPositions = {
    columns: [
      { id: "symbol", label: "Symbol", stickyFirstColumn: true },
      { id: "sector", label: "Sector" },
      { id: "allocation", label: "% Alloc" },
      { id: "price", label: "Price Chg" },
      { id: "value", label: "Position Value" },
      { id: "status", label: "Status" },
    ],
    rows: [
      {
        symbol: "NVDA",
        sector: "Technology",
        allocation: "14.8%",
        price: "+8.2%",
        value: "$420,560",
        status: "up",
      },
      {
        symbol: "TSLA",
        sector: "Consumer",
        allocation: "13.5%",
        price: "+5.9%",
        value: "$385,230",
        status: "up",
      },
      {
        symbol: "GOOGL",
        sector: "Technology",
        allocation: "10.9%",
        price: "+4.1%",
        value: "$310,140",
        status: "up",
      },
      {
        symbol: "MSFT",
        sector: "Technology",
        allocation: "9.2%",
        price: "+2.7%",
        value: "$261,850",
        status: "up",
      },
      {
        symbol: "JPM",
        sector: "Finance",
        allocation: "10.2%",
        price: "-2.3%",
        value: "$290,000",
        status: "down",
      },
      {
        symbol: "WMT",
        sector: "Consumer",
        allocation: "6.1%",
        price: "+1.2%",
        value: "$173,500",
        status: "up",
      },
      {
        symbol: "JNJ",
        sector: "Healthcare",
        allocation: "8.4%",
        price: "+0.8%",
        value: "$238,900",
        status: "up",
      },
      {
        symbol: "XOM",
        sector: "Energy",
        allocation: "9.3%",
        price: "-1.8%",
        value: "$264,780",
        status: "down",
      },
    ],
  };

  const keyDrivers = [
    {
      category: "Sector Strength",
      items: [
        "Technology outperforming: AI narrative continues driving semi/software",
        "Finance weakness: Rising rate expectations pressure banking sector",
      ],
    },
    {
      category: "Macro Events",
      items: [
        "Fed speakers signal patience on rate cuts",
        "China stimulus expectations up ahead of policy conference",
      ],
    },
    {
      category: "Earnings",
      items: [
        "NVDA beat on GPU demand, raised FY guidance",
        "TSLA production beat alleviates supply concerns",
      ],
    },
  ];

  return (
    <Page title="Portfolio Morning View">
      <Header
        title="Your Book"
        subtitle="September 27, 2026 — Markets opened +1.4%"
        actions={[
          { label: "Rebalance", onPress: () => {} },
          { label: "Export", onPress: () => {} },
        ]}
      />

      <Dashboard
        metrics={portfolioMetrics.map((m) => (
          <Metric key={m.label} label={m.label} value={m.value} delta={m.delta} unit={m.unit} />
        ))}
        charts={[
          <Card key="chart" title="Overnight Performance">
            <Chart
              type="line"
              series={portfolioSeries}
              x={{ label: "Time (ET)" }}
              y={{ label: "Value ($)" }}
            />
          </Card>,
        ]}
        table={
          <Section title="Top Movers (Biggest Drivers of Your Return)">
            <DataTable columns={topMoversTable.columns} rows={topMoversTable.rows} />
          </Section>
        }
      />

      <Section title="Full Book">
        <DataTable
          columns={allPositions.columns}
          rows={allPositions.rows}
          stickyFirstColumn
        />
      </Section>

      <Section title="What's Moving the Market">
        <div>
          {keyDrivers.map((driver) => (
            <Card key={driver.category} title={driver.category}>
              <ul>
                {driver.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}
