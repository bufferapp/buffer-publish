import React from 'react';
import { mount } from 'enzyme';
import TableCell from './index';

describe('TableCell', () => {
  it('should have children', () => {
    const wrapper = mount(<TableCell>I Love Buffer</TableCell>);
    expect(wrapper.find(TableCell).length).toBe(1);
  });
});
