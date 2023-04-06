import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../views/ProfileScreen';
import EditProfileScreen from '../views/profile/EditProfileScreen';
import ProfileHeader from '../features/profile/components/ProfileHeader';
import ProfileQRScreen from '../features/profile/views/ProfileQRScreen';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={({ route, navigation }) => {
      return {
          header: ({route}) => <ProfileHeader route={route} navigation={navigation}/>
      };
  }}>
        <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
        <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}/>
        <Stack.Screen name='ProfileQRScreen' component={ProfileQRScreen}/>
    </Stack.Navigator>
  )
}

export default ProfileNavigator