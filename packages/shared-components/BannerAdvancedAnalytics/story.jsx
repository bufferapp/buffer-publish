import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import BannerAdvancedAnalytics from './index';

storiesOf('BannerAdvancedAnalytics', module)
  .addDecorator(withA11y)
  .add('default', () => <BannerAdvancedAnalytics />)
  .add('existing analyze customer', () => (
    <BannerAdvancedAnalytics isAnalyzeCustomer />
  ));
