import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

import ExamplePost from './index';

storiesOf('Campaigns|ViewCampaign/ExamplePost', module)
  .addDecorator(withA11y)
  .add('default', () => <ExamplePost />)
  .add('loading skeleton', () => <ExamplePost displaySkeleton />);
