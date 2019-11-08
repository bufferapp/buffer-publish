import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import Tabs from './index';
import Tab from '../Tab';

storiesOf('Tabs|Tabs', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <Tabs selectedTabId="tabId" onTabClick={action('tab-click')}>
      <Tab tabId="tabId">Tab 1</Tab>
      <Tab tabId="tabId2">Tab 2</Tab>
    </Tabs>
  ));
