import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';

import EmptyState from './index';

const campaignEmpty = {
  scheduled: 0,
  sent: 0,
};

const campaignNoSentPosts = {
  scheduled: 3,
  sent: 0,
};

const campaignAllPostsSent = {
  scheduled: 0,
  sent: 3,
};

const actions = {
  onCreatePostClick: action('create post'),
  goToAnalyzeReport: action('go to analyze report'),
  onCreateCampaignClick: action('create campaign'),
};
storiesOf('Campaigns|ViewCampaign/EmptyState', module)
  .addDecorator(withA11y)
  .add('Campaign with no posts', () => (
    <EmptyState campaign={campaignEmpty} sentView={false} actions={actions} />
  ))
  .add('Campaign with no sent posts', () => (
    <EmptyState campaign={campaignNoSentPosts} sentView actions={actions} />
  ))
  .add('Campaign with no scheduled posts, team member', () => (
    <EmptyState
      campaign={campaignAllPostsSent}
      sentView={false}
      actions={actions}
      hideAnalyzeReport
    />
  ))
  .add('Campaign with no scheduled posts, owner', () => (
    <EmptyState
      campaign={campaignAllPostsSent}
      sentView={false}
      actions={actions}
      hideAnalyzeReport={false}
    />
  ));
