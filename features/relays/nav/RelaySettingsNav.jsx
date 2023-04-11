import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RelaysOverviewView } from '../views';
import RelaySettingsHeader from '../components/RelaySettingsHeader';

const Stack = createStackNavigator();

const RelaySettingsNav = () => (
  <Stack.Navigator screenOptions={{ header: RelaySettingsHeader }}>
    <Stack.Screen name="Overview" component={RelaysOverviewView} />
    <Stack.Screen name="Overview2" component={RelaysOverviewView} />
  </Stack.Navigator>
);

export default RelaySettingsNav;
