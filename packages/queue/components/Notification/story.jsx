import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { checkA11y } from 'storybook-addon-a11y';
import Notification from './index';

storiesOf('QueuedPosts Locked Profile', module)
  .addDecorator(checkA11y)
  .add('default', () => (
    <Notification onClickUpgradeToPro={action('onClickUpgradeToPro')} />
));
