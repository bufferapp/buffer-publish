import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';

import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';

import QueuedPosts from './index';
import postLists from './postData';

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
  appSidebar: {
    user: {
      profile_limit: 3,
      id: 'id1',
    },
  },
  profileSidebar: {
    selectedProfile: {
      ownerId: 'id1',
    },
  },
});

const UpgradeModalDecorator = storyFn => (
  <Provider store={store}>{storyFn()}</Provider>
);

/* eslint-disable react/prop-types */
class _TestContextContainer extends Component {
  // eslint-disable-line
  render() {
    return <div>{this.props.children}</div>;
  }
}
const TestContextContainer = DragDropContext(TestBackend)(
  _TestContextContainer
);

storiesOf('QueuedPosts', module)
  .addDecorator(withA11y)
  .addDecorator(UpgradeModalDecorator)
  .addDecorator(getStory => (
    <TestContextContainer>{getStory()}</TestContextContainer>
  ))
  .add('default', () => (
    <QueuedPosts
      total={10}
      loading={false}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      onRequeueClick={action('onRequeueClick')}
      onUnpauseClick={action('onUnpauseClick')}
      onCalendarBtnClick={action('onCalendarBtnClick')}
      isManager
      onComposerPlaceholderClick={action('onComposerPlaceholderClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onDropPost={action('onDropPost')}
      onSwapPosts={action('onSwapPosts')}
      onSetUpDirectPostingClick={action('onSetUpDirectPostingClick')}
      onDirectPostingClick={action('onDirectPostingClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
      onImageClick={action('onImageClick')}
      onImageClickNext={action('onImageClickNext')}
      onImageClickPrev={action('onImageClickPrev')}
      onImageClose={action('onImageClose')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
    />
  ))
  .add('loading', () => (
    <QueuedPosts
      total={0}
      loading
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      onRequeueClick={action('onRequeueClick')}
      onUnpauseClick={action('onUnpauseClick')}
      onCalendarBtnClick={action('onCalendarBtnClick')}
      isManager
      onComposerPlaceholderClick={action('onComposerPlaceholderClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onDropPost={action('onDropPost')}
      onSwapPosts={action('onSwapPosts')}
      onSetUpDirectPostingClick={action('onSetUpDirectPostingClick')}
      onDirectPostingClick={action('onDirectPostingClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
      onImageClick={action('onImageClick')}
      onImageClickNext={action('onImageClickNext')}
      onImageClickPrev={action('onImageClickPrev')}
      onImageClose={action('onImageClose')}
    />
  ))
  .add('paused if Manager', () => (
    <QueuedPosts
      total={10}
      loading={false}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      paused
      onUnpauseClick={action('onUnpauseClick')}
      onCalendarBtnClick={action('onCalendarBtnClick')}
      isManager
      onComposerPlaceholderClick={action('onComposerPlaceholderClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onDropPost={action('onDropPost')}
      onSwapPosts={action('onSwapPosts')}
      onSetUpDirectPostingClick={action('onSetUpDirectPostingClick')}
      onDirectPostingClick={action('onDirectPostingClick')}
      onRequeueClick={action('onRequeueClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
      onImageClick={action('onImageClick')}
      onImageClickNext={action('onImageClickNext')}
      onImageClickPrev={action('onImageClickPrev')}
      onImageClose={action('onImageClose')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
    />
  ))
  .add('paused if Contributor', () => (
    <QueuedPosts
      total={10}
      loading={false}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      paused
      onUnpauseClick={action('onUnpauseClick')}
      onCalendarBtnClick={action('onCalendarBtnClick')}
      isManager={false}
      onComposerPlaceholderClick={action('onComposerPlaceholderClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onDropPost={action('onDropPost')}
      onSwapPosts={action('onSwapPosts')}
      onSetUpDirectPostingClick={action('onSetUpDirectPostingClick')}
      onDirectPostingClick={action('onDirectPostingClick')}
      onRequeueClick={action('onRequeueClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
      onImageClick={action('onImageClick')}
      onImageClickNext={action('onImageClickNext')}
      onImageClickPrev={action('onImageClickPrev')}
      onImageClose={action('onImageClose')}
      fetchCampaignsIfNeeded={action('fetchCampaignsIfNeeded')}
    />
  ))
  .add('locked profile', () => (
    <QueuedPosts
      total={10}
      loading={false}
      postLists={postLists}
      onDeleteConfirmClick={action('onDeleteConfirmClick')}
      onEditClick={action('onEditClick')}
      onShareNowClick={action('onShareNowClick')}
      paused
      onUnpauseClick={action('onUnpauseClick')}
      onCalendarBtnClick={action('onCalendarBtnClick')}
      isLockedProfile
      isManager
      onComposerPlaceholderClick={action('onComposerPlaceholderClick')}
      onComposerCreateSuccess={action('onComposerCreateSuccess')}
      onDropPost={action('onDropPost')}
      onSwapPosts={action('onSwapPosts')}
      onSetUpDirectPostingClick={action('onSetUpDirectPostingClick')}
      onDirectPostingClick={action('onDirectPostingClick')}
      onRequeueClick={action('onRequeueClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
      onImageClick={action('onImageClick')}
      onImageClickNext={action('onImageClickNext')}
      onImageClickPrev={action('onImageClickPrev')}
      onImageClose={action('onImageClose')}
    />
  ));
