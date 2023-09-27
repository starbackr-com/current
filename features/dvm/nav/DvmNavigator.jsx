import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DvmSelectionScreen, ImageGenScreen } from '../views';
import { colors } from '../../../styles';

const Stack = createNativeStackNavigator();

const DvmNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="DvmSelection" component={DvmSelectionScreen} options={{headerStyle: {backgroundColor: colors.backgroundSecondary}, headerTitle: 'Select your task'}}/>
    <Stack.Screen name="ImageGen" component={ImageGenScreen}/>
  </Stack.Navigator>
);

export default DvmNavigator;
