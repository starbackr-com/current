import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PlebhyGifView, PlebhyStickerView } from '../Views';
import { colors } from '../../../styles';

const Tab = createMaterialTopTabNavigator();

const PlebhyNavigator = ({ route }) => {
  const { opener } = route?.params || undefined;
  console.log(opener);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary500,
        tabBarStyle: { backgroundColor: colors.backgroundPrimary },
        tabBarIndicatorStyle: {
          borderColor: colors.primary500,
          backgroundColor: colors.primary500,
        },
      }}
    >
      <Tab.Screen
        name="GIFs"
        component={PlebhyGifView}
        initialParams={{ opener }}
      />
      <Tab.Screen
        name="Sticker"
        component={PlebhyStickerView}
        initialParams={{ opener }}
      />
    </Tab.Navigator>
  );
};

export default PlebhyNavigator;
