import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommunityView, CommunitiesView } from '../views';
import { CommunitiesTitle } from '../components';

const Stack = createStackNavigator();

const ConversationNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Community Overview"
      component={CommunitiesView}
      options={{ headerTitle: CommunitiesTitle }}
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
