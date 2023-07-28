import { View } from 'react-native';
import React, { memo } from 'react';
import BackButton from './BackButton';
import colors from '../styles/colors';

const BackHeaderWithButton = memo(({ navigation, rightButton }) => (
  <View
    style={{
      backgroundColor: colors.backgroundPrimary,
      padding: 12,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <BackButton
      onPress={() => {
        navigation.goBack();
      }}
    />
    {rightButton()}
  </View>
));

export default BackHeaderWithButton;
