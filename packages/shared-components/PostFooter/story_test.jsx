import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withA11y } from '@storybook/addon-a11y';
import PostFooter from './index';

const postDetails = {
  postAction: 'This post will be sent at 9:21 (GMT)',
};

const postDetailsSent = {
  postAction: 'This post was sent at 9:21 (GMT)',
};

const postDetailsCustomScheduled = {
  postAction: 'This post is custom scheduled for 9:21 (GMT)',
  isCustomScheduled: true,
};

const postDetailsCustomScheduledSent = {
  postAction: 'This post was custom scheduled for 9:21 (GMT)',
  isCustomScheduled: true,
};

const postDetailsInstagramReminder = {
  postAction:
    'You will receive a reminder at 9:21 (GMT) when it is time to post',
  isCustomScheduled: true,
  isInstagramReminder: true,
};

const postDetailsError = {
  postAction: 'This post will be sent at 9:21 (GMT)',
  error: 'Woops! Something went wrong. Try again?',
};

storiesOf('Cards|Posts/PostFooter', module)
  .addDecorator(withA11y)
  .add('queued post', () => (
    <PostFooter
      onDeleteConfirmClick={linkTo('PostFooter', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('PostFooter', 'isWorking')}
      postDetails={postDetails}
      isSent={false}
    />
  ))
  .add('dragging post', () => (
    <PostFooter
      onDeleteConfirmClick={linkTo('PostFooter', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('PostFooter', 'isWorking')}
      postDetails={postDetails}
      isSent={false}
      dragging
    />
  ))
  .add('has instagram comment', () => (
    <PostFooter
      onDeleteConfirmClick={linkTo('PostFooter', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('PostFooter', 'isWorking')}
      postDetails={postDetails}
      isSent={false}
      hasCommentEnabled
      commentEnabled
      commentText="Cenas"
    />
  ))
  .add('post if contributor', () => (
    <PostFooter postDetails={postDetails} isSent={false} isManager={false} />
  ))
  .add('sent post', () => <PostFooter postDetails={postDetailsSent} isSent />)
  .add('sent post if link', () => (
    <PostFooter
      postDetails={postDetailsSent}
      isSent
      isManager
      serviceLink="www.buffer.com"
    />
  ))
  .add('past reminder', () => (
    <PostFooter
      postDetails={postDetailsSent}
      isPastReminder
      day="Today"
      dueTime="12:08pm"
    />
  ))
  .add('custom scheduled post', () => (
    <PostFooter postDetails={postDetailsCustomScheduled} isSent={false} />
  ))
  .add('sent custom scheduled post', () => (
    <PostFooter postDetails={postDetailsCustomScheduledSent} isSent />
  ))
  .add('instagram reminder post', () => (
    <PostFooter postDetails={postDetailsInstagramReminder} isSent={false} />
  ))
  .add('post with error', () => (
    <PostFooter
      onDeleteConfirmClick={linkTo('PostFooter', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('PostFooter', 'isWorking')}
      postDetails={postDetailsError}
      isSent={false}
      onRequeueClick={action('requeue-click')}
    />
  ))
  .add('isDeleting', () => (
    <PostFooter
      onDeleteConfirmClick={linkTo('PostFooter', 'isDeleting')}
      onEditClick={action('edit-click')}
      postDetails={postDetails}
      isDeleting
      isSent={false}
    />
  ))
  .add('isWorking', () => (
    <PostFooter
      onDeleteConfirmClick={linkTo('PostFooter', 'isDeleting')}
      onEditClick={action('edit-click')}
      postDetails={postDetails}
      isWorking
      isSent={false}
    />
  ));
