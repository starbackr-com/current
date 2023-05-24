import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DisplayKeysScreen from '../views/settings/DisplayKeysScreen';
import SettingsHomeScreen from '../views/settings/SettingsHomeScreen';
import SettingsPaymentsScreen from '../views/settings/SettingsPaymentsScreen';
import SettingsUserScreen from '../views/settings/SettingsUserScreen';
import SettingsDeleteAccountScreen from '../views/settings/SettingsDeleteAccountScreen';
import RelaySettingsNav from '../features/relays/nav/RelaySettingsNav';
import SettingsNotifcationsScreen from '../views/settings/SettingsNotifcationsScreen';
import { BackHeader } from '../components';
import SettingsLanguageView from '../views/settings/SettingsLanguageView';

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsHomeScreen"
      component={SettingsHomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Backup Keys"
      component={DisplayKeysScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Push Notifications"
      component={SettingsNotifcationsScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <Stack.Screen
      name="Network Settings"
      component={RelaySettingsNav}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Payment Settings"
      component={SettingsPaymentsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Muted Users"
      component={SettingsUserScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Delete Account"
      component={SettingsDeleteAccountScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Language Settings"
      component={SettingsLanguageView}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
