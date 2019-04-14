import React from 'react';
import { shallow } from 'enzyme';
import { Owner } from '../../../src/features/home/Owner';

describe('home/Owner', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Owner {...props} />
    );

    expect(
      renderedComponent.find('.home-owner').length
    ).toBe(1);
  });
});
