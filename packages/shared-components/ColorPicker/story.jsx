import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import ColorPicker from './index';

const DEFAULT_COLOR = '#000000';

storiesOf('ColorPicker', module)
  .addDecorator(withA11y)
  .add('default', () => (
    <ColorPicker
      label="Link Color"
      defaultColor={DEFAULT_COLOR}
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ));
