import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { Text } from '@bufferapp/components';
import Draft from './index';

const draftDetails = {
  avatarUrl:
    'https://buffer-uploads.s3.amazonaws.com/510521020a19000b6a00001e/a476fed03b1de4e06563d6063d7d3ee0.jpg',
  createdAt: 'on March 2nd at 12:45pm (GMT)',
  email: 'ash@buffer.com',
  isRetweet: false,
  postAction: 'This post will be added to the queue',
  creatorName: 'Ash',
  via: 'web',
};

const pastDueDraftDetails = {
  ...draftDetails,
  postAction: 'This draft was scheduled for June 21st',
};

const isARetweetDraftDetails = {
  ...draftDetails,
  isRetweet: true,
};

const scheduledDraftDetails = {
  ...draftDetails,
  postAction: 'This post is scheduled for 9:42pm (GMT)',
};

const retweetProfile = {
  avatarUrl:
    'https://buffer-uploads.s3.amazonaws.com/503a5c8ffc99f72a7f00002e/f49c2ff693f1c307af5e1b3d84e581ca.png',
  handle: '@joelgascoigne',
  name: 'Joel Gascoigne',
};

const links = [
  {
    rawString: 'http://buff.ly/1LTbUqv',
    displayString: 'http://buff.ly/1LTbUqv',
    url:
      'https://austinstartups.com/what-is-a-product-designer-who-cares-eb38fc7afa7b#.i3r34a75x',
    indices: [74, 96],
  },
];

const retweetComment =
  'What is a Product Designer? An awesome story by @jgadapee over on Medium! http://buff.ly/1LTbUqv';

const draftsView = 'drafts';
const approvalView = 'approval';
const scheduledAt = 123456789;

const children = <Text size={'mini'}>{'I am a text-only test post.'}</Text>;

const childrenLineBreaks = (
  <Text size="mini">
    {'I am a text-only \n test post \n with line breaks.'}
  </Text>
);

storiesOf('Cards|Drafts/Draft', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <Draft
      hasPermission
      draftDetails={draftDetails}
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('post text with line breaks', () => (
    <Draft
      hasPermission
      draftDetails={draftDetails}
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      view={draftsView}
    >
      {childrenLineBreaks}
    </Draft>
  ))
  .add('scheduled', () => (
    <Draft
      hasPermission
      draftDetails={scheduledDraftDetails}
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      scheduledAt={scheduledAt}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('manager', () => (
    <Draft
      hasPermission
      onMouseEnter={action('on-mouse-enter')}
      onMouseLeave={action('on-mouse-leave')}
      onApproveClick={linkTo('Draft', 'isWorkingManager')}
      onDeleteConfirmClick={action('delete-confirm-click')}
      onEditClick={action('edit-click')}
      manager
      draftDetails={draftDetails}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('isConfirmingDelete', () => (
    <Draft
      hasPermission
      isConfirmingDelete
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      draftDetails={draftDetails}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('isDeleting', () => (
    <Draft
      hasPermission
      isDeleting
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      draftDetails={draftDetails}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('isWorking', () => (
    <Draft
      hasPermission
      isWorking
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      draftDetails={draftDetails}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('isWorkingManager', () => (
    <Draft
      hasPermission
      manager
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      isWorking
      draftDetails={draftDetails}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('approval view: isMoving', () => (
    <Draft
      hasPermission
      isMoving
      isWorking
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      draftDetails={draftDetails}
      view={approvalView}
    >
      {children}
    </Draft>
  ))
  .add('retweet', () => (
    <Draft
      hasPermission
      draftDetails={isARetweetDraftDetails}
      onMouseEnter={action('mouse-enter')}
      onMouseLeave={action('mous-leave')}
      onApproveClick={action('approve-click')}
      onDeleteConfirmClick={action('delete-confirm-click')}
      onEditClick={action('edit-click')}
      retweetProfile={retweetProfile}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('retweet with comment', () => (
    <Draft
      hasPermission
      draftDetails={isARetweetDraftDetails}
      retweetCommentLinks={links}
      onMouseEnter={action('mouse-enter')}
      onMouseLeave={action('mous-leave')}
      onApproveClick={action('approve-click')}
      onDeleteConfirmClick={action('delete-confirm-click')}
      onEditClick={action('edit-click')}
      retweetProfile={retweetProfile}
      retweetComment={retweetComment}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('past due', () => (
    <Draft
      hasPermission
      draftDetails={pastDueDraftDetails}
      isPastDue
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      onRescheduleClick={action('reschedule-click')}
      scheduledAt={scheduledAt}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('past due no permission', () => (
    <Draft
      hasPermission={false}
      manager={false}
      draftDetails={pastDueDraftDetails}
      isPastDue
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      onRescheduleClick={action('reschedule-click')}
      scheduledAt={scheduledAt}
      view={draftsView}
    >
      {children}
    </Draft>
  ))
  .add('no permission', () => (
    <Draft
      hasPermission={false}
      manager={false}
      draftDetails={draftDetails}
      onApproveClick={linkTo('Draft', 'isWorking')}
      onDeleteConfirmClick={linkTo('Draft', 'isDeleting')}
      onEditClick={action('edit-click')}
      view={draftsView}
    >
      {children}
    </Draft>
  ));
