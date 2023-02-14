import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../views/ProfileScreen';
import EditProfileScreen from '../views/profile/EditProfileScreen';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
        <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}/>
    </Stack.Navigator>
  )
}

export default ProfileNavigator