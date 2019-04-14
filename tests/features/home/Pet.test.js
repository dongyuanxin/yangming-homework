import React from 'react';
import { shallow } from 'enzyme';
import { Pet } from '../../../src/features/home/Pet';

describe('home/Pet', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Pet {...props} />
    );

    expect(
      renderedComponent.find('.home-pet').length
    ).toBe(1);
  });
});
