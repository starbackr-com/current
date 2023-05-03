import { View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchView, TrendingPostView } from '../views';
import { colors } from '../../../styles';
import { BackHeader } from '../../../components';
import CommentScreen from '../../comments/views/CommentScreen';
import ProfileNavigator from '../../../nav/ProfileNavigator';

const Stack = createStackNavigator();

const SearchNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Search Home"
          component={SearchView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trending Posts"
          component={TrendingPostView}
          options={({ navigation }) => ({
            header: () => <BackHeader navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="CommentScreen"
          component={CommentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileNavigator}
          options={() => ({
            headerShown: false,
          })}
        />
      </Stack.Navigator>
    </View>
  );
};

export default SearchNavigator;
