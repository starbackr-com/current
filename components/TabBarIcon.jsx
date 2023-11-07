import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles';

const TabBarIcon = ({ route, focused, color, size }) => {
  let iconName;

  if (route.name === 'Home') {
    iconName = focused ? 'home-sharp' : 'home-outline';
  } else if (route.name === 'Wallet') {
    // iconName = focused ? 'wallet' : 'wallet-outline';
    return;
  } else if (route.name === 'Settings') {
    iconName = focused ? 'settings' : 'settings-outline';
  } else if (route.name === 'Search') {
    iconName = focused ? 'search-circle' : 'search-circle-outline';
  } else if (route.name === 'New') {
    iconName = focused ? 'add-circle' : 'add-circle-outline';
  } else if (route.name === 'Messages') {
    iconName = focused ? 'mail-sharp' : 'mail-outline';
  } else if (route.name === 'Community') {
    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  } else if (route.name === 'DVM') {
    if (focused) {
      return <MaterialCommunityIcons name="robot" size={size} color={color} />;
    }
    return (
      <MaterialCommunityIcons name="robot-outline" size={size} color={color} />
    );
  }
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default TabBarIcon;
