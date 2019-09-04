import React from 'react';
import { storiesOf } from '@storybook/react';
import { checkA11y } from 'storybook-addon-a11y';
import StoryGroupWrapper from './index';

storiesOf('StoryGroup', module)
  .addDecorator(checkA11y)
  .add('story group wrapper', () => (
    <StoryGroupWrapper />
  ));