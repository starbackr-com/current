/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useHeaderHeight } from '@react-navigation/elements';
import { AddWalletconnectView, WalletconnectOverviewView, WalletconnectInfoView } from '../views';
import WalletconnectSettingsHeader from '../components/WalletconnectSettingsHeader';
import { BackHeader } from '../../../components';

const Stack = createStackNavigator();

const WalletconnectSettingsNav = () => {
  const headerHeight = useHeaderHeight();
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route, navigation }) => (
          <WalletconnectSettingsHeader route={route} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen name="WalletconnectOverview" component={WalletconnectOverviewView}
      />
      <Stack.Screen
        name="Add"
        component={AddWalletconnectView}
        initialParams={{ headerHeight }}
        options={({ navigation }) => ({
          header: () => <BackHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="WalletconnectInfoView"
        component={WalletconnectInfoView}
        initialParams={{ headerHeight }}
        options={{ headerShown: false }}

      />
    </Stack.Navigator>
  );
};

export default WalletconnectSettingsNav;
