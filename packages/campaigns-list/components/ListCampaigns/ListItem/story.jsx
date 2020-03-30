import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { MemoryRouter } from 'react-router-dom';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';

import ListItem from './index';

const campaign = {
  name: '#SaveOurSeasWeek',
  color: '#9C2BFF',
  dateRange: 'Oct 19-39, 2020',
  scheduled: 8,
  sent: 0,
  lastUpdated: 'Last updated 12 days ago',
  id: '2',
};

const campaignWithoutPosts = {
  name: 'Awareness Day',
  color: '#9C2BFF',
  dateRange: null,
  scheduled: 0,
  sent: 0,
  lastUpdated: 'Last updated yesterday',
  id: '3',
};

storiesOf('Campaigns|ListItem', module)
  .addDecorator(withA11y)
  .addDecorator(getStory => <MemoryRouter>{getStory()}</MemoryRouter>)
  .add('Owner view of campaign list item', () => (
    <ListItem
      campaign={campaign}
      isEvenItem
      translations={translations.campaigns.viewCampaign}
      onViewCampaignClick={action('view campaign')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport={false}
    />
  ))
  .add('Team member view of campaign list item', () => (
    <ListItem
      campaign={campaign}
      isEvenItem
      translations={translations.campaigns.viewCampaign}
      onViewCampaignClick={action('view campaign')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport
    />
  ))
  .add('Campaign list item with gray background', () => (
    <ListItem
      campaign={campaign}
      isEvenItem={false}
      translations={translations.campaigns.viewCampaign}
      onViewCampaignClick={action('view campaign')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport={false}
    />
  ))
  .add('Campaign list item without any posts', () => (
    <ListItem
      campaign={campaignWithoutPosts}
      isEvenItem={false}
      translations={translations.campaigns.viewCampaign}
      onViewCampaignClick={action('view campaign')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport={false}
    />
  ));
