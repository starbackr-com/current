import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActiveConversationScreen, ConversationScreen } from '../views';
import { useSelector } from 'react-redux';
import { colors } from '../../../styles';

const Stack = createStackNavigator();

const ConversationNavigator = () => {
  const users = useSelector((state) => state.messages.users);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="All Chats"
        component={ActiveConversationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ConversationScreen}
        options={({ route }) => ({
          headerTitle: users[route.params.pk].name,
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
          },
          headerTintColor: 'white'
        })}
      />
    </Stack.Navigator>
  );
};

export default ConversationNavigator;
