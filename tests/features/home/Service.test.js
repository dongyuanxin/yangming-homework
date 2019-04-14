import React from 'react';
import { shallow } from 'enzyme';
import { Service } from '../../../src/features/home/Service';

describe('home/Service', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Service {...props} />
    );

    expect(
      renderedComponent.find('.home-service').length
    ).toBe(1);
  });
});
