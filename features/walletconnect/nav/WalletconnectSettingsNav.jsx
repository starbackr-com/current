/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  AddWalletconnectView,
  WalletconnectOverviewView,
  WalletconnectInfoView,
} from '../views';
import WalletconnectSettingsHeader from '../components/WalletconnectSettingsHeader';
import { BackHeader } from '../../../components';

const Stack = createStackNavigator();

const WalletconnectSettingsNav = () => (
  <Stack.Navigator
    screenOptions={{
      header: ({ route, navigation }) => (
        <WalletconnectSettingsHeader route={route} navigation={navigation} />
      ),
    }}
  >
    <Stack.Screen
      name="WalletconnectOverview"
      component={WalletconnectOverviewView}
    />
    <Stack.Screen
      name="Add"
      component={AddWalletconnectView}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
    <Stack.Screen
      name="WalletconnectInfoView"
      component={WalletconnectInfoView}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default WalletconnectSettingsNav;
