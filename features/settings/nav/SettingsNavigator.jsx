/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  DeleteAccountScreen,
  KeysScreen,
  LanguageSettingsScreen,
  ListScreen,
  NotifcationsSettingsScreen,
  PaymentSettingsScreen,
  UserSettingsScreen,
} from '../views';
import { RelaySettingsNav } from '../../relays';
import { BackHeader } from '../../../components';
import { PremiumView } from '../../premium';
import ChooseTierView from '../../premium/views/ChooseTierView';

const NativeStack = createNativeStackNavigator();

const SettingsNavigator = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen
      name="SettingsHomeScreen"
      component={ListScreen}
      options={{ headerShown: false }}
    />
    <NativeStack.Screen
      name="Backup Keys"
      component={KeysScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <NativeStack.Screen
      name="Push Notifications"
      component={NotifcationsSettingsScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <NativeStack.Screen
      name="Network Settings"
      component={RelaySettingsNav}
      options={{ headerShown: false }}
    />
    <NativeStack.Screen
      name="Payment Settings"
      component={PaymentSettingsScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <NativeStack.Screen
      name="Muted Users"
      component={UserSettingsScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <NativeStack.Screen
      name="Delete Account"
      component={DeleteAccountScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <NativeStack.Screen
      name="Language Settings"
      component={LanguageSettingsScreen}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <NativeStack.Screen
      name="Premium"
      component={ChooseTierView}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
  </NativeStack.Navigator>
);

export default SettingsNavigator;
