/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useHeaderHeight } from '@react-navigation/elements';
import { AddRelayView, RelaysOverviewView } from '../views';
import RelaySettingsHeader from '../components/RelaySettingsHeader';

const Stack = createStackNavigator();

const RelaySettingsNav = () => {
  const headerHeight = useHeaderHeight();
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route, navigation }) => (
          <RelaySettingsHeader route={route} navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen name="Overview" component={RelaysOverviewView} />
      <Stack.Screen
        name="Add"
        component={AddRelayView}
        initialParams={{ headerHeight }}
      />
    </Stack.Navigator>
  );
};

export default RelaySettingsNav;
