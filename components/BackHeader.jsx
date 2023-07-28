import { View } from 'react-native';
import React, { memo } from 'react';
import BackButton from './BackButton';
import colors from '../styles/colors';

const BackHeader = memo(({ navigation }) => (
  <View
    style={{
      backgroundColor: colors.backgroundPrimary,
      padding: 12,
    }}
  >
    <BackButton
      onPress={() => {
        navigation.goBack();
      }}
    />
  </View>
));

export default BackHeader;
