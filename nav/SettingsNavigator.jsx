import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DisplayKeysScreen from '../views/settings/DisplayKeysScreen';
import SettingsHomeScreen from '../views/settings/SettingsHomeScreen';
import SettingsPaymentsScreen from '../views/settings/SettingsPaymentsScreen';
import SettingsUserScreen from '../views/settings/SettingsUserScreen';
import SettingsDeleteAccountScreen from '../views/settings/SettingsDeleteAccountScreen';
import RelaySettingsNav from '../features/relays/nav/RelaySettingsNav';

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SettingsHomeScreen" component={SettingsHomeScreen} />
    <Stack.Screen name="Backup Keys" component={DisplayKeysScreen} />
    <Stack.Screen name="Network Settings" component={RelaySettingsNav} />
    <Stack.Screen name="Payment Settings" component={SettingsPaymentsScreen} />
    <Stack.Screen name="Muted Users" component={SettingsUserScreen} />
    <Stack.Screen
      name="Delete Account"
      component={SettingsDeleteAccountScreen}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
