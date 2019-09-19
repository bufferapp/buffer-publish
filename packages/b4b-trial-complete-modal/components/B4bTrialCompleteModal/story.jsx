import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import B4bTrialCompleteModal from './index';

const translations = {
  header: 'Your Buffer for Business trial is complete!',
  completeAndUpgrade: 'Complete and Upgrade',
  cancelTrial: 'Cancel Trial',
  cancelTrialAndLock: 'Cancel Trial and Lock Extra Profiles'
};

storiesOf('B4bTrialCompleteModal', module)
  .addDecorator(withA11y)
  .add('should show modal', () => (
    <B4bTrialCompleteModal
      translations={translations}
      hideModal={() => {}}
    />
  ));
