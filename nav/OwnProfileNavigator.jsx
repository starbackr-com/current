/* eslint-disable react/no-unstable-nested-components */
import { View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileScreen from '../views/ProfileScreen';
import EditProfileScreen from '../views/profile/EditProfileScreen';
import ProfileHeader from '../features/profile/components/ProfileHeader';
import ProfileQRScreen from '../features/profile/views/ProfileQRScreen';
import { BadgeDetaiView } from '../features/badges';
import ChooseBadgeView from '../features/badges/views/ChooseBadgeView';
import { colors } from '../styles';
import { BackHeader } from '../components';
import ThreadScreen from '../features/comments/views/ThreadScreen';

const Stack = createNativeStackNavigator();

const OwnProfileNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
      }}
    >
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          header: () => <ProfileHeader route={route} navigation={navigation} />,
        })}
      >
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen
          name="CommentScreen"
          component={ThreadScreen}
          options={({ navigation }) => ({
            header: () => <BackHeader navigation={navigation} />,
          })}
          initialParams={{ noBar: true }}
        />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ProfileQRScreen" component={ProfileQRScreen} />
        <Stack.Screen name="BadgeDetails" component={BadgeDetaiView} />
        <Stack.Screen name="ChooseBadge" component={ChooseBadgeView} />
      </Stack.Navigator>
    </View>
  );
};

export default OwnProfileNavigator;
