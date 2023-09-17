import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DvmSelectionScreen, ImageGenScreen } from '../views';
import { globalStyles } from '../../../styles';
import DVMHeader from '../components/DVMHeader';

const Stack = createNativeStackNavigator();

const DvmNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ImageGen">
      <Stack.Screen name="DvmSelection" component={DvmSelectionScreen} />
      <Stack.Screen name="ImageGen" component={ImageGenScreen} />
    </Stack.Navigator>
  );
};

export default DvmNavigator;
