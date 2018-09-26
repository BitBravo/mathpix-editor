import React from 'react';
import { shallow } from 'enzyme';

import Preview from '../index';

describe('<Preview />', () => {
  it('should render the copyright notice', () => {
    const renderedComponent = shallow(<Preview />);
    expect(
      renderedComponent.contains(
        <section></section>
      )
    ).toBe(true);
  });

  it('should render the credits', () => {
    const renderedComponent = shallow(<Preview />);
    expect(renderedComponent.text()).toContain('Dinesh Pandiyan');
  });
});
