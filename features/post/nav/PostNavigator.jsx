import { View, Platform } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../styles';
import { NewPostScreen } from '../views';
import { PlebhyNavigator } from '../../plebhy';

const Stack = createNativeStackNavigator();

const PostNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? insets.top : 0,
        backgroundColor: colors.backgroundPrimary,
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="PostNote" component={NewPostScreen} />
        <Stack.Screen name="PlebhySelector" component={PlebhyNavigator} />
      </Stack.Navigator>
    </View>
  );
};

export default PostNavigator;
