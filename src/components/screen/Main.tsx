import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import { NavigationScreenProp, NavigationStateRoute } from 'react-navigation';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.Text`
  font-size: 16;
  color: blue;
`;

interface Props {
  navigation?: NavigationScreenProp<any, any>;
}

function Page(props: Props) {
  return (
    <Container>
      <StyledText testID='myText'>dooboolab</StyledText>
    </Container>
  );
}

export default Page;
