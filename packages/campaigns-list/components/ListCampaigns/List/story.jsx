import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { MemoryRouter } from 'react-router-dom';

import List from './index';

const campaigns = [
  {
    name: 'Luna X Outdoorsy Launch',
    color: '#9C2BFF',
    dateRange: 'Oct 19-39, 2020',
    scheduled: 8,
    sent: 0,
    lastUpdated: 'Updated 12 days ago',
    id: '2',
  },
  {
    name: 'Awareness Day',
    color: '#9C2BFF',
    dateRange: 'March 23-April 4, 2020',
    scheduled: 11,
    sent: 25,
    lastUpdated: 'Updated yesterday',
    id: '3',
  },
  {
    name: '#SaveOurSeasWeek',
    color: '#9C2BFF',
    dateRange: 'Jan 5-18, 2020',
    scheduled: 7,
    sent: 1,
    lastUpdated: 'Updated 3 hours ago',
    id: '1',
  },
  {
    name: 'New Year, New You',
    color: '#9C2BFF',
    dateRange: 'Dec 27, 2019-Jan 7,2020',
    scheduled: 7,
    sent: 1,
    lastUpdated: 'Updated 3 hours ago',
    id: '1',
  },
];

storiesOf('Campaigns|ListCampaigns', module)
  .addDecorator(getStory => <MemoryRouter>{getStory()}</MemoryRouter>)
  .addDecorator(withA11y)
  .add('List of campaigns', () => (
    <List
      campaigns={campaigns}
      onViewCampaignClick={action('view campaign')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      showCampaignActions
    />
  ));
