import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import SentPosts from './index';
import { header, postLists } from './postData';

const storeFake = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  i18n: {
    translations: {
      'switch-plan-modal': {},
    },
  },
  switchPlanModal: {},
  stripe: {},
  productFeatures: {
    planName: 'free',
    features: {},
  },
});

const UpgradeModalDecorator = storyFn => (
  <Provider store={store}>{storyFn()}</Provider>
);

storiesOf('SentPosts', module)
  .addDecorator(withA11y)
  .addDecorator(UpgradeModalDecorator)
  .add('default', () => (
    <SentPosts
      total={1}
      loading={false}
      header={header}
      postLists={postLists}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onClickUpgrade={action('onClickUpgrade')}
      onShareAgainClick={action('onShareAgainClick')}
      fetchSentPosts={action('fetchSentPosts')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
      linkShortening={{}}
    />
  ))
  .add('if in Business Account', () => (
    <SentPosts
      total={1}
      loading={false}
      header={header}
      postLists={postLists}
      isBusinessAccount
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onClickUpgrade={action('onClickUpgrade')}
      onShareAgainClick={action('onShareAgainClick')}
      fetchSentPosts={action('fetchSentPosts')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
      linkShortening={{}}
    />
  ));
