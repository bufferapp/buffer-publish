import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';
import PastRemindersPosts from './index';
import { header, subHeader, postLists } from './postData';

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

const StoreDecorator = storyFn => (
  <Provider store={store}>{storyFn()}</Provider>
);

storiesOf('PastRemindersPosts', module)
  .addDecorator(withA11y)
  .addDecorator(StoreDecorator)
  .add('default', () => (
    <PastRemindersPosts
      total={10}
      loading={false}
      header={header}
      subHeader={subHeader}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      onRequeueClick={action('onRequeueClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onClickUpgrade={action('onClickUpgrade')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
    />
  ))
  .add('loading', () => (
    <PastRemindersPosts
      total={0}
      loading
      header={header}
      subHeader={subHeader}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      onRequeueClick={action('onRequeueClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onClickUpgrade={action('onClickUpgrade')}
    />
  ))
  .add('if Manager and in Business Account', () => (
    <PastRemindersPosts
      total={5}
      loading={false}
      header={header}
      subHeader={subHeader}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      onRequeueClick={action('onRequeueClick')}
      onClickSwitchPlan={action('onClickSwitchPlan')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onClickUpgrade={action('onClickUpgrade')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
      isBusinessAccount
      isManager
    />
  ))
  .add('if Contributor and in Business Account', () => (
    <PastRemindersPosts
      total={5}
      loading={false}
      header={header}
      subHeader={subHeader}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      onRequeueClick={action('onRequeueClick')}
      onClickSwitchPlan={action('onClickSwitchPlan')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onClickUpgrade={action('onClickUpgrade')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
      isBusinessAccount
      isManager={false}
    />
  ));
