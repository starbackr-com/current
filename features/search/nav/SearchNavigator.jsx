import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchView, TrendingView } from '../views';
import { colors } from '../../../styles';
import { BackHeader } from '../../../components';

const Stack = createStackNavigator();

const SearchNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Search Home"
      component={SearchView}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Search Trending"
      component={TrendingView}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
  </Stack.Navigator>
);

export default SearchNavigator;
