import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';

import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import { queueItems } from '@bufferapp/publish-test-utils/mock-ui-data';

import QueuedPosts from './index';

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
  user: {
    profileLimit: 3,
    id: 'id1',
  },
  profileSidebar: {
    selectedProfile: {
      id: 'id1',
    },
  },
  organizations: {
    selected: {
      isOwner: true,
      planBase: 'free',
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
      items={queueItems({ isSent: false, isPastReminder: false })}
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
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
    />
  ))
  .add('loading', () => (
    <QueuedPosts
      total={0}
      loading
      items={queueItems({ isSent: false, isPastReminder: false })}
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
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
    />
  ))
  .add('paused if Manager', () => (
    <QueuedPosts
      total={10}
      loading={false}
      items={queueItems({ isSent: false, isPastReminder: false })}
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
      onRequeueClick={action('onRequeueClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
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
      onRequeueClick={action('onRequeueClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
    />
  ))
  .add('locked profile', () => (
    <QueuedPosts
      total={10}
      loading={false}
      items={queueItems({ isSent: false, isPastReminder: false })}
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
      onRequeueClick={action('onRequeueClick')}
      onCalendarClick={action('onCalendarClick')}
      onEmptySlotClick={action('onEmptySlotClick')}
    />
  ));
