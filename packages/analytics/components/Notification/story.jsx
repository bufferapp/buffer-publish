import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import Notification from './index';

storiesOf('Unsupported Notification', module)
  .addDecorator(withA11y)
  .add('default', () => <Notification />);
