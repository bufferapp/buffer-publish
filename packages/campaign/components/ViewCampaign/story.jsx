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
  lastUpdated: 'Updated 3 hours ago',
};

const campaignPosts = [
  {
    queueItemType: 'header',
    text: 'Friday 27th March',
    dayOfWeek: 'Friday',
    date: '27th March',
    id: 'header-0',
    hasCommentEnabled: false,
  },
  {
    queueItemType: 'post',
    isManager: false,
    index: 0,
    day: 'Friday 27th March',
    id: '5e7c7cf7c759831b43169252',
    createdAt: 1585216759,
    profileId: '5da9abc96f72c2000a5c1935',
    isPastDue: false,
    imageUrls: [],
    links: [],
    profileTimezone: 'Europe/London',
    linkAttachment: {},
    needsApproval: false,
    postDetails: {
      postAction: 'This post will be sent March 27th at 8:05 AM (GMT).',
      isRetweet: false,
      error: null,
      errorLink: null,
      isCustomScheduled: false,
      isInstagramReminder: false,
    },
    profile_service: 'twitter',
    retweetCommentLinks: [],
    sent: false,
    text: 'Sample post',
    type: 'text',
    media: {},
    due_at: 1585296300,
    pinned: false,
    isFixed: false,
    user: {
      email: 'admin@bufferapp.com',
      name: 'Buffer Admin',
      gravatar:
        'https://secure.gravatar.com/avatar/3a7d27d63bfd66b2ca44e53620d464b3?s=40&d=mm',
      avatar:
        'https://secure.gravatar.com/avatar/3a7d27d63bfd66b2ca44e53620d464b3?s=80&d=mm',
      id: '5da9abc96f72c2000a5c1932',
    },
    dueTime: '8:05 am',
    commentEnabled: false,
    campaignDetails: {
      id: '5e5fe06136ae5f05316cabf4',
      name: 'AA',
      color: '#FF702C',
    },
    headerDetails: {
      channel: { handle: 'Buffer Admin', type: 'twitter' },
      creatorName: 'Buffer Admin',
      avatarUrl:
        'https://secure.gravatar.com/avatar/3a7d27d63bfd66b2ca44e53620d464b3?s=80&d=mm',
      createdAt: 'March 26th at 9:59 AM (GMT)',
    },
    hasCommentEnabled: false,
  },
];

const actions = {
  onCreatePostClick: action('create post'),
  onDeleteCampaignClick: action('delete campaign'),
  onEditCampaignClick: action('edit campaign'),
  fetchCampaign: action('fetch campaign'),
  goToAnalyzeReport: action('go to analyze report'),
  onComposerCreateSuccess: action('composer sucess'),
  onComposerOverlayClick: action('composer overlay click'),
};
const postActions = {
  onEditClick: action('edit post'),
  onDeleteConfirmClick: action('delete post'),
  onShareNowClick: action('share now'),
  onRequeueClick: action('requeue'),
  onImageClick: action('image gallery open'),
  onImageClose: action('image gallery close'),
  onImageClickPrev: action('previous image'),
  onImageClickNext: action('next image'),
};

storiesOf('Campaigns|ViewCampaign', module)
  .addDecorator(withA11y)
  .addDecorator(UpgradeModalDecorator)
  .add('Campaign view with posts', () => (
    <ViewCampaign
      campaign={campaignDetails}
      campaignPosts={campaignPosts}
      isLoading={false}
      hideAnalyzeReport={false}
      translations={translations.campaigns.viewCampaign}
      campaignId="id"
      hasCampaignsFlip
      showComposer={false}
      editMode={false}
      actions={actions}
      postActions={postActions}
    />
  ))
  .add('Campaign view without posts', () => (
    <ViewCampaign
      campaign={campaignDetails}
      campaignPosts={[]}
      isLoading={false}
      hideAnalyzeReport={false}
      translations={translations.campaigns.viewCampaign}
      campaignId="id"
      hasCampaignsFlip
      showComposer={false}
      editMode={false}
      actions={actions}
      postActions={postActions}
    />
  ));

export default campaignDetails;
