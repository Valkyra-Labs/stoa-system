import { Page, Header, Section, Card, Metric, Delta, Timeline, Status, EmptyData, FilterBar, Button, BulkActions } from '@stoa/react';

const PortfolioOverview = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayData = {
    totalValue: 12500000,
    totalReturn: 12500000 - 11500000,
    topGainers: [
      { name: 'Tech Corp', change: 8.2, value: 1500000 },
      { name: 'Green Energy', change: 6.5, value: 800000 },
      { name: 'Health Innovations', change: 5.8, value: 600000 },
    ],
    topLosers: [
      { name: 'Retail Co', change: -4.1, value: -200000 },
      { name: 'Auto Parts', change: -3.7, value: -150000 },
      { name: 'Energy Inc', change: -3.2, value: -120000 },
    ],
    events: [
      { time: '09:15 AM', description: 'Tech Corp announced a new product line.' },
      { time: '10:45 AM', description: 'Green Energy acquired a renewable energy firm.' },
      { time: '12:30 PM', description: 'Health Innovations reported strong Q3 earnings.' },
      { time: '02:15 PM', description: 'Retail Co warned of supply chain disruptions.' },
    ],
  };

  const yesterdayData = {
    totalValue: 11500000,
    totalReturn: 0,
  };

  return (
    <Page title="Portfolio Overview">
      <Header
        title="Portfolio Changes Since Yesterday"
        subtitle={`As of ${today.toLocaleDateString()}`}
        actions={
          <FilterBar>
            <Button label="Refresh" variant="primary" />
            <Button label="Save View" variant="secondary" />
          </FilterBar>
        }
      />
      <Section title="Key Metrics">
        <Card>
          <Metric label="Total Value" value={todayData.totalValue} unit="USD" />
          <Metric label="Total Return" value={todayData.totalReturn} unit="USD" />
          <Delta value={todayData.totalReturn} basis={yesterdayData.totalReturn} />
        </Card>
      </Section>
      <Section title="Top Gainers">
        <Card>
          {todayData.topGainers.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{item.name}</span>
              <Metric value={item.value} unit="USD" />
              <Delta value={item.change} basis={0} />
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Top Losers">
        <Card>
          {todayData.topLosers.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{item.name}</span>
              <Metric value={item.value} unit="USD" />
              <Delta value={item.change} basis={0} />
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Recent Events">
        <Card>
          {todayData.events.map((event, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{event.time}</span>
              <span>{event.description}</span>
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Actions">
        <Card>
          <BulkActions>
            <Button label="Sell Gainers" variant="danger" />
            <Button label="Buy Losers" variant="success" />
          </BulkActions>
        </Card>
      </Section>
    </Page>
  );
};

export default PortfolioOverview;
