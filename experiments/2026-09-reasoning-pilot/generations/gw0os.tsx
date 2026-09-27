// Goal: Show a portfolio manager what moved in their book since yesterday and why.
// Layout: Header with key metrics, top movers comparison, asset allocation chart,
// and a detailed holdings table. Emphasizes biggest changes and provides context
// about performance drivers.

import React from 'react';
import {
  Page,
  Header,
  Section,
  Card,
  Metric,
  Delta,
  Comparison,
  Chart,
  DataTable,
  Status,
} from '@stoa/react';

export default function PortfolioReview() {
  const portfolioMetrics = [
    { label: 'Total Value', value: '$2,450,000', delta: 42500, unit: 'USD' },
    { label: 'Daily Change', value: '+1.75%', delta: 42500 },
    { label: 'YTD Return', value: '+12.4%', delta: 890000 },
  ];

  const topMovers = {
    entities: [
      { id: 'NVDA', name: 'NVIDIA Corp', type: 'Equity' },
      { id: 'MSFT', name: 'Microsoft Corp', type: 'Equity' },
      { id: 'TSLA', name: 'Tesla Inc', type: 'Equity' },
      { id: 'AAPL', name: 'Apple Inc', type: 'Equity' },
    ],
    metrics: [
      {
        id: 'price',
        label: 'Price',
        values: [
          { entityId: 'NVDA', value: '$142.50', change: '+8.3%' },
          { entityId: 'MSFT', value: '$438.20', change: '+5.1%' },
          { entityId: 'TSLA', value: '$287.65', change: '-2.8%' },
          { entityId: 'AAPL', value: '$231.90', change: '+1.2%' },
        ],
      },
      {
        id: 'gain',
        label: 'Position Gain',
        values: [
          { entityId: 'NVDA', value: '+$125,400', change: '+8.3%' },
          { entityId: 'MSFT', value: '+$87,200', change: '+5.1%' },
          { entityId: 'TSLA', value: '-$45,300', change: '-2.8%' },
          { entityId: 'AAPL', value: '+$18,900', change: '+1.2%' },
        ],
      },
    ],
  };

  const assetAllocationSeries = [
    {
      id: 'equities',
      name: 'Equities',
      data: [
        { x: 'Sept 26', y: 1680 },
        { x: 'Sept 27', y: 1710 },
      ],
    },
    {
      id: 'bonds',
      name: 'Fixed Income',
      data: [
        { x: 'Sept 26', y: 540 },
        { x: 'Sept 27', y: 545 },
      ],
    },
    {
      id: 'cash',
      name: 'Cash',
      data: [
        { x: 'Sept 26', y: 230 },
        { x: 'Sept 27', y: 195 },
      ],
    },
  ];

  const holdingsTableColumns = [
    { id: 'symbol', label: 'Symbol', width: '80px' },
    { id: 'name', label: 'Name', width: '200px' },
    { id: 'shares', label: 'Shares', width: '100px' },
    { id: 'price', label: 'Price', width: '100px' },
    { id: 'value', label: 'Value', width: '120px' },
    { id: 'dayChange', label: 'Day Change', width: '120px' },
    { id: 'status', label: 'Status', width: '80px' },
  ];

  const holdingsTableRows = [
    {
      id: 'NVDA',
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      shares: '12,400',
      price: '$142.50',
      value: '$1,767,000',
      dayChange: '+$125,400 (+8.3%)',
      status: { tone: 'positive', label: 'Strong Buy' },
    },
    {
      id: 'MSFT',
      symbol: 'MSFT',
      name: 'Microsoft Corp',
      shares: '2,850',
      price: '$438.20',
      value: '$1,249,070',
      dayChange: '+$87,200 (+5.1%)',
      status: { tone: 'positive', label: 'Overweight' },
    },
    {
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple Inc',
      shares: '8,500',
      price: '$231.90',
      value: '$197,115',
      dayChange: '+$18,900 (+1.2%)',
      status: { tone: 'neutral', label: 'Hold' },
    },
    {
      id: 'TSLA',
      symbol: 'TSLA',
      name: 'Tesla Inc',
      shares: '1,800',
      price: '$287.65',
      value: '$517,770',
      dayChange: '-$45,300 (-2.8%)',
      status: { tone: 'negative', label: 'Underweight' },
    },
    {
      id: 'BND',
      symbol: 'BND',
      name: 'Vanguard Total Bond',
      shares: '5,200',
      price: '$78.40',
      value: '$407,680',
      dayChange: '+$2,100 (+0.5%)',
      status: { tone: 'neutral', label: 'Core' },
    },
  ];

  return (
    <Page title="Portfolio Review">
      <Header
        title="Morning Review - September 27, 2026"
        subtitle="Your portfolio at a glance"
      />

      <Section title="Portfolio Summary">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {portfolioMetrics.map((metric) => (
            <Metric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              delta={metric.delta ? <Delta value={metric.delta} basis={metric.basis} /> : undefined}
              unit={metric.unit}
            />
          ))}
        </div>
      </Section>

      <Section title="Top Movers">
        <Comparison
          entities={topMovers.entities}
          metrics={topMovers.metrics}
        />
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          NVIDIA surged on strong earnings guidance. Microsoft gained on cloud strength. Tesla declined on production concerns.
        </p>
      </Section>

      <Section title="Asset Allocation Trend">
        <Chart
          type="bar"
          series={assetAllocationSeries}
          x="Date"
          y="Value (thousands)"
        />
      </Section>

      <Section title="All Holdings">
        <DataTable
          columns={holdingsTableColumns}
          rows={holdingsTableRows}
          stickyFirstColumn
        />
      </Section>
    </Page>
  );
}
