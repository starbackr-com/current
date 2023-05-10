/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../views/ProfileScreen';
import EditProfileScreen from '../views/profile/EditProfileScreen';
import ProfileHeader from '../features/profile/components/ProfileHeader';
import ProfileQRScreen from '../features/profile/views/ProfileQRScreen';
import { BadgeDetaiView } from '../features/badges';
import ChooseBadgeView from '../features/badges/views/ChooseBadgeView';

const Stack = createStackNavigator();

const ProfileNavigator = () => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      header: () => <ProfileHeader route={route} navigation={navigation} />,
    })}
  >
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="ProfileQRScreen" component={ProfileQRScreen} />
    <Stack.Screen name="BadgeDetails" component={BadgeDetaiView} />
    <Stack.Screen name="ChooseBadge" component={ChooseBadgeView} />
  </Stack.Navigator>
);

export default ProfileNavigator;
