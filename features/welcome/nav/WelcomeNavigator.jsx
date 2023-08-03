import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  EULAView,
  IntroductionView,
  LoadingProfileView,
  StartUpView,
  UsernameView,
} from '../views';
import CreateProfileNavigator from './CreateProfileNavigator';
import ImportNavigator from './ImportNavigator';

const Stack = createStackNavigator();

const WelcomeNavigator = () => (
  <BottomSheetModalProvider>
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#18181b' },
        headerTitleStyle: { color: 'white' },
        headerTitle: () => null,
        headerLeft: () => null,
        headerShadowVisible: false,
        // gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={StartUpView}
        options={{
          title: 'Welcome!',
        }}
      />
      <Stack.Screen
        name="Introduction"
        component={IntroductionView}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EULA"
        component={EULAView}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Username"
        component={UsernameView}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Loading"
        component={LoadingProfileView}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Import"
        component={ImportNavigator}
        options={{
          title: '',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  </BottomSheetModalProvider>
);

export default WelcomeNavigator;
