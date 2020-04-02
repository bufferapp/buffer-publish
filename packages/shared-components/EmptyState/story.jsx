import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import EmptyState from './index';

const primaryAction = {
  onClick: action('on-click'),
  label: 'Click here',
};

const secondaryAction = {
  onClick: action('on-click'),
  label: 'Click here',
};

storiesOf('EmptyState', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <EmptyState
      title="It looks like you haven't got any posts in your queue!"
      subtitle="Click the box above to add a post to your queue :)"
      heroImg="https://s3.amazonaws.com/buffer-publish/images/fresh-queue.png"
      heroImgSize={{ width: '229px', height: '196px' }}
    />
  ))
  .add('with emoji', () => (
    <EmptyState
      title={"Looks like you don't have any drafts yet!"}
      subtitle="This is where drafts from your team members will appear."
      emoji="✍️"
    />
  ))
  .add('with primary action', () => (
    <EmptyState
      title="Looks like you don't have any drafts yet!"
      subtitle="This is where drafts from your team members will appear."
      heroImg="https://buffer-publish.s3.amazonaws.com/images/campaign-sent-1.png"
      primaryAction={primaryAction}
    />
  ))
  .add('with primary and secondary action', () => (
    <EmptyState
      title="Looks like you don't have any drafts yet!"
      subtitle="This is where drafts from your team members will appear."
      heroImg="https://buffer-publish.s3.amazonaws.com/images/campaign-not-sent.png"
      secondaryAction={secondaryAction}
      primaryAction={primaryAction}
    />
  ));
