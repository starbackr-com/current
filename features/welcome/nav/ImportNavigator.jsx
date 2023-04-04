import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ImportSelectionView } from '../views';

const Stack = createStackNavigator();

const ImportNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ImportSelection" component={ImportSelectionView} />
    {/* <Stack.Screen name="ImportWords" />
    <Stack.Screen name="ImportKey" /> */}
  </Stack.Navigator>
);

export default ImportNavigator;
