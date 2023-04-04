import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CreateProfileView, SelectImageView } from '../views';

const Stack = createStackNavigator();

const CreateProfileNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EditProfile" component={CreateProfileView} />
    <Stack.Screen name="SelectImage" component={SelectImageView} />
  </Stack.Navigator>
);

export default CreateProfileNavigator;
