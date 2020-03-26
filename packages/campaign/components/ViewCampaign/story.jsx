import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';

import ViewCampaign from './index';

const storeFake = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  productFeatures: {
    planName: 'free',
    features: {},
  },
});

const UpgradeModalDecorator = storyFn => (
  <Provider store={store}>{storyFn()}</Provider>
);

const campaignDetails = {
  name: '#SaveOurSeasWeek',
  color: '#9C2BFF',
  dateRange: 'Jan 5-18, 2020',
  scheduled: 5,
  sent: 2,
  lastUpdated: 'Last updated 3 hours ago',
};

storiesOf('Campaigns|ViewCampaign', module)
  .addDecorator(withA11y)
  .addDecorator(UpgradeModalDecorator)
  .add('Campaign view with posts', () => (
    <ViewCampaign
      campaign={campaignDetails}
      translations={translations.campaigns.viewCampaign}
      onCreatePostClick={action('create post')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      fetchCampaign={action('fetch campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      onComposerCreateSuccess={action('composer create success')}
      onComposerOverlayClick={action('composer overlay')}
      campaignId="id"
      hideAnalyzeReport
      hasCampaignsFlip
      isLoading={false}
      showComposer={false}
    />
  ))
  .add('Campaign view without posts', () => (
    <ViewCampaign
      campaign={campaignDetails}
      translations={translations.campaigns.viewCampaign}
      onCreatePostClick={action('create post')}
      onDeleteCampaignClick={action('delete campaign')}
      onEditCampaignClick={action('edit campaign')}
      fetchCampaign={action('fetch campaign')}
      goToAnalyzeReport={action('go to analyze report')}
      onComposerCreateSuccess={action('composer create success')}
      onComposerOverlayClick={action('composer overlay')}
      campaignId="id"
      hideAnalyzeReport
      hasCampaignsFlip
      isLoading={false}
      showComposer={false}
    />
  ));

export default campaignDetails;
