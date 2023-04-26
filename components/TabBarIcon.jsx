import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabBarIcon = ({ route, focused, color, size }) => {
  let iconName;

  if (route.name === 'Home') {
    iconName = focused ? 'home-sharp' : 'home-outline';
  } else if (route.name === 'Wallet') {
    iconName = focused ? 'wallet' : 'wallet-outline';
  } else if (route.name === 'Settings') {
    iconName = focused ? 'settings' : 'settings-outline';
  } else if (route.name === 'Search') {
    iconName = focused ? 'search-circle' : 'search-circle-outline';
  } else if (route.name === 'New') {
    iconName = focused ? 'add-circle' : 'add-circle-outline';
  } else if (route.name === 'Messages') {
    iconName = focused ? 'mail-sharp' : 'mail-outline';
  }
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default TabBarIcon;
