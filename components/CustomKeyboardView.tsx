import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import React, { ReactNode, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

type CustomKeyboardViewProps = {
  children: ReactNode;
  noBottomBar?: boolean;
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  avoidingContainer: {
    flex: 1,
    flexGrow: 1,
  },
});

const CustomKeyboardView = ({
  children,
  noBottomBar,
}: CustomKeyboardViewProps) => {
  const [outerContainerHeight, setOuterContainerHeight] =
    useState<number>(null);
  const { height } = useWindowDimensions();
  let bottomTabBarHeight: number;
  if (noBottomBar) {
    bottomTabBarHeight = 0;
  } else {
    bottomTabBarHeight = useBottomTabBarHeight();
  }
  return (
    <View
      style={styles.outerContainer}
      onLayout={(e) => {
        setOuterContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          height -
          outerContainerHeight -
          (Platform.OS === 'ios' ? bottomTabBarHeight : 0)
        }
        style={styles.avoidingContainer}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

export default CustomKeyboardView;
