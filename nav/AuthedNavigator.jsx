/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '../views/HomeView';
import TwitterModal from '../views/welcome/TwitterModal';
import WalletNavigator from './WalletNavigator';
import SettingsNavigator from './SettingsNavigator';
import SearchScreen from '../views/SearchScreen';
import PostView from '../views/post/PostView';
import FullScreenImage from '../components/Images/FullScreenImage';
import ReadMoreModal from '../features/homefeed/components/ReadMoreModal';
import VerifyTwitterModal from '../views/welcome/VerifyTwitterModal';
import ProfileNavigator from './ProfileNavigator';
import ZapListModal from '../views/home/ZapListModal';
import PostMenuModal from '../views/post/PostMenuModal';
import ReportPostModal from '../features/reports/views/ReportPostModal';
import { BackHeader, TabBarHeaderLeft, TabBarHeaderRight } from '../components';
import MentionsNavigator from '../features/mentions/nav/MentionsNavigator';
import { PlebhyNavigator } from '../features/plebhy';
import TabBarIcon from '../components/TabBarIcon';
import { colors } from '../styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => (
        <TabBarIcon route={route} focused={focused} color={color} size={size} />
      ),
      headerStyle: { backgroundColor: '#222222' },
      headerTitleStyle: {
        color: 'white',
        fontFamily: 'Montserrat-Bold',
      },
      tabBarActiveTintColor: colors.primary500,
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#222222',
      },
      tabBarShowLabel: false,
      headerShadowVisible: false,
      headerRight: () => <TabBarHeaderRight />,
      headerLeft: TabBarHeaderLeft,
      tabBarHideOnKeyboard: Platform.OS !== 'ios',
    })}
  >
    <Tab.Screen name="Home" component={HomeView} />
    <Tab.Screen name="Wallet" component={WalletNavigator} />
    <Tab.Screen
      name="New"
      component={WalletNavigator}
      options={({ navigation }) => ({
        tabBarButton: (props) => (
          <Pressable
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            onPress={() => navigation.navigate('PostView')}
          />
        ),
      })}
    />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Settings" component={SettingsNavigator} />
  </Tab.Navigator>
);

const AuthedNavigator = () => (
  <Stack.Navigator initialRouteName="MainTabNav">
    <Stack.Screen
      name="MainTabNav"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TwitterModal"
      component={TwitterModal}
      options={{ presentation: 'modal', headerShown: false }}
    />
    <Stack.Screen
      name="VerifyTwitterModal"
      component={VerifyTwitterModal}
      options={{ presentation: 'modal', headerShown: false }}
    />
    <Stack.Screen
      name="PostView"
      component={PostView}
      options={{ presentation: 'modal', headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileNavigator}
      options={() => ({
        presentation: 'modal',
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="ImageModal"
      component={FullScreenImage}
      options={{
        presentation: 'transparentModal',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ReadMoreModal"
      component={ReadMoreModal}
      options={{
        presentation: 'transparentModal',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="PostMenuModal"
      component={PostMenuModal}
      options={{
        presentation: 'transparentModal',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ZapListModal"
      component={ZapListModal}
      options={{
        presentation: 'transparentModal',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ReportPostModal"
      component={ReportPostModal}
      options={{ presentation: 'modal', headerShown: false }}
    />
    <Stack.Screen
      name="MentionsModal"
      component={MentionsNavigator}
      options={{
        presentation: 'modal',
        header: () => <BackHeader />,
      }}
    />
    <Stack.Screen
      name="PlebhyModal"
      component={PlebhyNavigator}
      options={{
        presentation: 'modal',
        header: () => <BackHeader />,
      }}
    />
  </Stack.Navigator>
);

export default AuthedNavigator;
