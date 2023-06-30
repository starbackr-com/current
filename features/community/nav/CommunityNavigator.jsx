import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommunityView, CommunitiesView } from '../views';

const Stack = createStackNavigator();

const ConversationNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Community Overview"
      component={CommunitiesView}
      options={{headerTitle: "Communities (alpha)"}}
    />
    <Stack.Screen
      name="Community Chat"
      component={CommunityView}
      options={({ route }) => ({
        headerTitle: route.params.communityObject.communitySlug,
      })}
    />
  </Stack.Navigator>
);

export default ConversationNavigator;
