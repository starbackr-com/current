import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DvmSelectionScreen, ImageGenScreen } from '../views';

const Stack = createNativeStackNavigator();

const DvmNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DvmSelection" component={DvmSelectionScreen} />
      <Stack.Screen name="ImageGen" component={ImageGenScreen} />
    </Stack.Navigator>
  );
};

export default DvmNavigator;
