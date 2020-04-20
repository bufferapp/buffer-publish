import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';

import SkeletonList from './index';

storiesOf('Campaigns|ListCampaigns/SkeletonList', module)
  .addDecorator(withA11y)
  .add('Skeleton list of campaigns', () => (
    <SkeletonList
      translations={translations.campaigns.viewCampaign}
      showCampaignActions
    />
  ));
