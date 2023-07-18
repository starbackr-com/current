import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ImportKeyView, ImportSelectionView, ImportWordsView, NewImportWordsView } from '../views';

const Stack = createStackNavigator();

const ImportNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ImportSelection" component={ImportSelectionView} />
    <Stack.Screen name="ImportWords" component={ImportWordsView} />
    <Stack.Screen name="ImportKey" component={ImportKeyView} />
  </Stack.Navigator>
);

export default ImportNavigator;
