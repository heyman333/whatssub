import React, { useState } from 'react';
import { Asset } from 'expo-asset';
import { SplashScreen } from 'expo';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import styled from 'styled-components/native';

import { IMG_GIF_SPLASH } from '../../utils/Images';

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

const SPLASH_SHOW_TIME = 1500;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const StyledSplashImage = styled.Image`
  width: 200;
  height: 47;
  margin-bottom: 50%;
`;

const StyledText = styled.Text`
  color: #cdd3d3;
  position: absolute;
  bottom: 50;
`;

export default function AuthLoading(props: Props) {
  const [areResourcesReady, setResourcesReady] = useState(false);
  const [isAppReady, setAppReady] = useState(false);

  const cacheResourcesAsync = async () => {
    try {
      await Asset.fromModule(IMG_GIF_SPLASH).downloadAsync();
    } catch (error) {
      // handle error
    } finally {
      setResourcesReady(true);
    }
  };

  React.useEffect(() => {
    if (!isAppReady) {
      SplashScreen.preventAutoHide();
      cacheResourcesAsync();
      return;
    }

    // if non-authorized user
    props.navigation.navigate('AuthStackNavigator');

    // if authorized user
    // props.navigation.navigate('MainStackNavigator');
  }, [isAppReady]);

  if (!isAppReady && areResourcesReady) {
    return (
      <Container>
        <StyledSplashImage
          testID="SPLASH_IMAGE"
          source={IMG_GIF_SPLASH}
          resizeMode='contain'
          onLoadEnd={() => {
            setTimeout(() => {
              setAppReady(true);
            }, SPLASH_SHOW_TIME);
            SplashScreen.hide();
          }}
        />
        <StyledText>ⓒ Whatssub Studio</StyledText>
      </Container>
    );
  }

  return (<Container />);
};
