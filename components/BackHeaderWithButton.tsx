import { Platform, View } from 'react-native';
import React, { ReactNode, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import colors from '../styles/colors';
import { NavigationProp } from '@react-navigation/native';

type BackHeaderWithButtonProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  rightButton: () => ReactNode;
  modal: boolean
}

const BackHeaderWithButton = memo(({ navigation, rightButton, modal }: BackHeaderWithButtonProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: colors.backgroundPrimary,
        padding: 12,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: modal && Platform.OS === 'android' ? insets.top : 12,
      }}
    >
      {/* @ts-ignore */}
      <BackButton
        onPress={() => {
          navigation.goBack();
        }}
      />
      {rightButton()}
    </View>
  );
});

export default BackHeaderWithButton;
