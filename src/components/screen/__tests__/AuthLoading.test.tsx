import 'react-native';
import * as React from 'react';
import AuthLoading from '../AuthLoading';

import renderer from 'react-test-renderer';
import { render, wait } from '@testing-library/react-native';

const createTestProps = (props: Object) => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...props,
});

let props: any;

describe('[AuthLoading] render', () => {
  beforeAll(() => {
    props = createTestProps({});
  });

  it('component and snapshot matches', () => {
    const rendered: renderer.ReactTestRendererJSON = renderer.create(<AuthLoading {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

describe('[AuthLoading] interaction', () => {
  beforeAll(() => {
    props = createTestProps({});
  });

   it('should navigate to other screen', async () => {
    const { getByTestId } = render(<AuthLoading {...props} />);
    await wait(async () => {
      const SplashImage = getByTestId('SPLASH_IMAGE');
      SplashImage.props.onLoadEnd();
      await wait(async () => {
        expect(props.navigation.navigate).toBeCalledTimes(1);
      });
    }, { timeout: 3000 });
  });
});
