import 'react-native';
import * as React from 'react';
import * as GoogleSignIn from 'expo-google-sign-in';
import { AuthSession, AppAuth } from 'expo';

// Note: test renderer must be required after react-native.
import { ThemeProvider } from 'styled-components/native';
import renderer from 'react-test-renderer';
import { render, fireEvent, act, RenderResult, cleanup } from '@testing-library/react-native';
import _range from 'lodash/range';
import Intro from '../Intro';
import { AppProvider } from '../../../providers';
import Button from '../../shared/Button';
import { createTheme, ThemeType } from '../../../theme';

import { getString } from '../../../../STRINGS';

const titleArray = _range(5).map((index: number) => getString(`INTRO_TITLE_${index + 1}`));
const createTestProps = (obj: object) => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...obj,
});

const props: any = createTestProps({});
const Component = (
  <AppProvider>
    <ThemeProvider theme={createTheme(ThemeType.LIGHT)}>
      <Intro
        {...props}
        screenProps={{
          theme: createTheme(ThemeType.LIGHT),
        }}
      />
    </ThemeProvider>
  </AppProvider>
);
const RTLComponent = (props) => (
  <AppProvider>
    <ThemeProvider theme={createTheme(ThemeType.LIGHT)}>
      <Intro
        {...props}
        screenProps={{
          theme: createTheme(ThemeType.LIGHT),
        }}
      />
    </ThemeProvider>
  </AppProvider>
);
let json: renderer.ReactTestRendererJSON;

beforeEach(() => {
  jest.useFakeTimers();
});

// test for the container page in dom
describe('[Intro] screen rendering test', () => {
  it('should render outer component and snapshot matches', () => {
    act(() => {
      json = renderer.create(Component).toJSON();
    });
    expect(json).toMatchSnapshot();
  });
});

describe('[Intro] screen useTransition with setInterval test', () => {
  it('should match the second title text after 1500ms', () => {
    const { getByTestId } = render(<RTLComponent {...props} />);
    setTimeout(() => {
      expect(getByTestId('animatableText').props.children).toBe(titleArray[1]); // 'Subscription'
    }, 2000);
    jest.clearAllTimers();
  });
});

describe('[Intro] Interaction', () => {
  let rendered: renderer.ReactTestRenderer;
  let root: renderer.ReactTestInstance;
  let testingLib: RenderResult;

  beforeEach(() => {
    testingLib = render(Component);
    rendered = renderer.create(Component);
  });

  afterEach(cleanup);

  it('should simulate [facebookLogin] click', () => {
    testingLib = render(Component);
    act(() => {
      fireEvent.press(testingLib.getByTestId('btnFacebook'));
    });
    // expect(navigate).toBeCalled();
  });
});

describe('[Intro] GoogleSingIn', () => {
  let testingLib: RenderResult;

  beforeEach(() => {
    testingLib = render(Component);
  });

  afterEach(cleanup);

  it('should pass [GoogleSignIn] unit test', async () => {
    await GoogleSignIn.initAsync();
    const ask = await GoogleSignIn.askForPlayServicesAsync();
    const { type, user } = await GoogleSignIn.signInAsync();
    expect(ask).toEqual(true);
    expect(type).toEqual('success');
    expect(user).toEqual({
      auth: {
        clientId: 'test',
        accessToken: 'aabb',
        accessTokenExpirationDate: 1562518153000,
      },
    });
  });
  it('should call [googleSignIn] and resolves methods', () => {
    act(() => {
      fireEvent.press(testingLib.queryByTestId('btnGoogle'));
    });
    expect(GoogleSignIn.askForPlayServicesAsync()).resolves.toBeCalled();
    expect(GoogleSignIn.signInAsync()).resolves.toBeCalled();
  });
  it('should signin with [AppAuth] when ownership is expo', () => {
    jest.mock('expo-constants', () => {
      return {
        appOwnership: 'expo',
      };
    });
    jest.mock('expo', () => {
      return {
        AppAuth: {
          authAsync: jest.fn(() => Promise.resolve()),
        },
      };
    });

    const btnGoogle = testingLib.queryByTestId('btnGoogle');
    act(() => {
      fireEvent.press(btnGoogle);
    });
    expect(AppAuth.authAsync()).resolves.toBeCalled();
  });
});
