import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import Story from './index';

const storyDetails = {
  creatorName: 'Ash',
  avatarUrl:
    'https://buffer-uploads.s3.amazonaws.com/510521020a19000b6a00001e/a476fed03b1de4e06563d6063d7d3ee0.jpg',
  createdAt: 'March 2nd at 12:45pm (GMT)',
  storyAction:
    'You will receive a reminder today at 2:55 PM (BST) when it is time to post',
};

const storyDetailsWithError = {
  ...storyDetails,
  error: 'There was an error sharing this story. Please try again!',
};

storiesOf('Cards|Stories/Story', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <Story
      storyDetails={storyDetails}
      onDeleteConfirmClick={action('delete-click')}
      onEditClick={action('edit-click')}
      onShareNowClick={action('share-click')}
      onPreviewClick={action('preview-click')}
      userData={{ tags: ['has_instagram_stories_mobile'] }}
    />
  ))
  .add('story with banner message to download mobile app', () => (
    <Story
      storyDetails={storyDetails}
      onDeleteConfirmClick={action('delete-click')}
      onEditClick={action('edit-click')}
      onShareNowClick={action('share-click')}
      onPreviewClick={action('preview-click')}
      userData={{ tags: [] }}
    />
  ))
  .add('story with banner error message', () => (
    <Story
      storyDetails={storyDetailsWithError}
      onDeleteConfirmClick={action('delete-click')}
      onEditClick={action('edit-click')}
      onShareNowClick={action('share-click')}
      onPreviewClick={action('preview-click')}
      userData={{ tags: [] }}
    />
  ));
