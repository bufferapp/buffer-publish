import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

import Checklist from './index';

storiesOf('Checklist', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <Checklist items={['item 1 description', 'item 2 description']} />
  ));
