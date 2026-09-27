import React from 'react';
import {
  Page,
  Header,
  Section,
  Dashboard,
  Card,
  Metric,
  Delta,
  Chart,
  DataTable,
  FilterBar,
  Tabs,
} from '@stoa/react';

export default function PortfolioOverview() {
  const portfolioMetrics = [
    {
      label: 'Portfolio Value',
      value: '$2,450,000',
      delta: 45000,
      unit: 'USD',
    },
    {
      label: 'Daily Return',
      value: '+$45,000',
      unit: '+1.86%',
    },
    {
      label: 'YTD Return',
      value: '+$180,000',
      unit: '+7.94%',
    },
    {
      label: 'Portfolio Beta',
      value: '1.12',
    },
  ];

  const holdingsColumns = [
    { key: 'symbol', label: 'Symbol', width: 80 },
    { key: 'name', label: 'Holding', width: 180 },
    { key: 'shares', label: 'Shares', width: 100 },
    { key: 'price', label: 'Price', width: 100 },
    { key: 'value', label: 'Value', width: 120 },
    { key: 'change1d', label: 'Change (1D)', width: 110 },
    { key: 'changePct', label: '% Change', width: 100 },
  ];

  const holdingsRows = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      shares: '1,250',
      price: '$230.45',
      value: '$288,063',
      change1d: '+$3,150',
      changePct: '+1.11%',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: '300',
      price: '$875.40',
      value: '$262,620',
      change1d: '+$26,250',
      changePct: '+11.05%',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: '850',
      price: '$415.30',
      value: '$353,005',
      change1d: '-$2,100',
      changePct: '-0.59%',
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc',
      shares: '420',
      price: '$315.20',
      value: '$132,384',
      change1d: '+$9,450',
      changePct: '+7.67%',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      shares: '650',
      price: '$142.80',
      value: '$92,820',
      change1d: '+$1,950',
      changePct: '+2.15%',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      shares: '400',
      price: '$245.60',
      value: '$98,240',
      change1d: '+$8,400',
      changePct: '+8.55%',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc',
      shares: '550',
      price: '$178.50',
      value: '$98,175',
      change1d: '-$4,200',
      changePct: '-4.10%',
    },
  ];

  const portfolioTrendData = {
    type: 'line',
    series: [
      {
        name: 'Portfolio Value',
        data: [2400000, 2405000, 2410000, 2415000, 2425000, 2450000],
      },
    ],
    x: ['9/21', '9/22', '9/23', '9/24', '9/25', '9/26'],
    y: ['Value (USD)'],
  };

  const sectorChangeData = {
    type: 'bar',
    series: [
      {
        name: 'Daily Change',
        data: [15000, 22000, -8000, 12000, 4000],
      },
    ],
    x: ['Technology', 'Finance', 'Healthcare', 'Consumer', 'Energy'],
    y: ['Change (USD)'],
  };

  const filters = [
    {
      id: 'sector',
      label: 'Sector',
      options: ['All', 'Technology', 'Finance', 'Healthcare', 'Consumer', 'Energy'],
    },
    {
      id: 'performance',
      label: 'Performance',
      options: ['All', 'Top Gainers', 'Top Losers'],
    },
  ];

  return (
    <Page title="Portfolio Manager">
      <Header
        title="Good Morning"
        subtitle="See what moved in your portfolio since yesterday"
        actions={[]}
      />

      <Section title="Portfolio Summary">
        <Dashboard
          metrics={portfolioMetrics.map((m) => (
            <Metric
              key={m.label}
              label={m.label}
              value={m.value}
              unit={m.unit}
            />
          ))}
          charts={[
            <Card key="trend" title="Portfolio Trend (5 Days)">
              <Chart {...portfolioTrendData} />
            </Card>,
            <Card key="sectors" title="Daily Change by Sector">
              <Chart {...sectorChangeData} />
            </Card>,
          ]}
        />
      </Section>

      <Section title="Holdings">
        <div style={{ marginBottom: '16px' }}>
          <FilterBar filters={filters} />
        </div>
        <DataTable
          columns={holdingsColumns}
          rows={holdingsRows}
          selectable={true}
          stickyFirstColumn={true}
        />
      </Section>
    </Page>
  );
}
