import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';
import campaignDetails from '../story';
import Header from './index';

const campaignWithoutDaterange = {
  ...campaignDetails,
  dateRange: null,
  sent: 0,
  scheduled: 0,
};

storiesOf('Campaigns|ViewCampaignHeader', module)
  .addDecorator(withA11y)
  .add('Campaign view header with posts', () => (
    <Header
      campaignDetails={campaignDetails}
      translations={translations.campaigns.viewCampaign}
      onCreatePostClick={action('create post')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport={false}
    />
  ))
  .add('Campaign view header without a date range', () => (
    <Header
      campaignDetails={campaignWithoutDaterange}
      translations={translations.campaigns.viewCampaign}
      onCreatePostClick={action('create post')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport={false}
    />
  ))
  .add('Campaign view header as team member', () => (
    <Header
      campaignDetails={campaignDetails}
      translations={translations.campaigns.viewCampaign}
      onCreatePostClick={action('create post')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      hideAnalyzeReport
    />
  ));
