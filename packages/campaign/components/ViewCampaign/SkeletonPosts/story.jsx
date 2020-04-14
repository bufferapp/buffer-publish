import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

import SkeletonPosts from './index';

storiesOf('Campaigns|ViewCampaign/SkeletonPosts', module)
  .addDecorator(withA11y)
  .add('default', () => <SkeletonPosts />);
