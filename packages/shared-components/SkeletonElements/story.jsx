import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { ButtonWithSkeleton, TextWithSkeleton } from './index';

storiesOf('Skeleton|Skeleton Elements', module)
  .addDecorator(withA11y)
  .add('Button', () => (
    <div>
      <ButtonWithSkeleton
        displaySkeleton
        disabled
        type="primary"
        onClick={action('on-button-click')}
        disabledlabel="cenas"
        aria-label="Loading"
        label="Click here"
      />
    </div>
  ))
  .add('Text', () => (
    <div style={{ width: '450px' }}>
      <TextWithSkeleton type="p" displaySkeleton>
        Text
      </TextWithSkeleton>
    </div>
  ));
