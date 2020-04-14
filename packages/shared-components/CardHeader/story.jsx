import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import CardHeader from './index';

const details = {
  creatorName: 'Ash',
  avatarUrl:
    'https://buffer-uploads.s3.amazonaws.com/510521020a19000b6a00001e/a476fed03b1de4e06563d6063d7d3ee0.jpg',
  createdAt: 'March 2nd at 12:45pm (GMT)',
};

const channel = {
  avatarUrl: '',
  handle: 'lunasneakers',
  type: 'instagram',
};

const hideCreatorDetails = true;

const preview = action('preview-click');

storiesOf('Cards|Basic Elements/CardHeader', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <CardHeader
      headerDetails={{
        ...details,
      }}
    />
  ))
  .add('with preview button', () => (
    <CardHeader
      headerDetails={{
        ...details,
        onPreviewClick: preview,
      }}
    />
  ))
  .add('with channel details', () => (
    <CardHeader
      headerDetails={{
        ...details,
        channel,
      }}
    />
  ))
  .add('with channel details and no creator', () => (
    <CardHeader
      headerDetails={{
        ...details,
        channel,
        hideCreatorDetails,
      }}
    />
  ));
