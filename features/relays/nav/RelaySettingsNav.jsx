import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AddRelayView, RelaysOverviewView } from '../views';
import RelaySettingsHeader from '../components/RelaySettingsHeader';

const Stack = createStackNavigator();

const RelaySettingsNav = () => (
  <Stack.Navigator screenOptions={{ header: (props) => <RelaySettingsHeader {...props}/> }}>
    <Stack.Screen name="Overview" component={RelaysOverviewView} />
    <Stack.Screen name="Add" component={AddRelayView} />
  </Stack.Navigator>
);

export default RelaySettingsNav;
