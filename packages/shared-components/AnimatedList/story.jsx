import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import AnimatedList from './index';

storiesOf('Animated List', module)
  .addDecorator(withA11y)
  .add('with 2 elements', () => (
    <AnimatedList>
      <p>List item 1</p>
      <p>List item 2</p>
    </AnimatedList>
  ))
  .add('with 4 elements', () => (
    <AnimatedList>
      <p>List item 1</p>
      <p>List item 2</p>
      <p>List item 3</p>
      <p>List item 4</p>
    </AnimatedList>
  ));
