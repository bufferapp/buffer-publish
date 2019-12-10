import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { Text } from '@bufferapp/ui';
import QueueBanner from './index';

const TextWithStyles = styled(Text)`
  margin: 0;
`;

const content = (
  <TextWithStyles type="p">
    Due to Instagram limitations, we cannot auto publish some of your queued
    posts.
  </TextWithStyles>
);

storiesOf('Queue|QueueBanner', module)
  .addDecorator(withA11y)
  .add('without button', () => (
    <QueueBanner
      title="Uh-oh! Some of your content can't be published."
      content={content}
    />
  ))
  .add('with button', () => (
    <QueueBanner
      title="Uh-oh! Some of your content can't be published."
      content={content}
      onClick={action('on-click')}
      actionLabel="Set Up Reminders"
    />
  ));
