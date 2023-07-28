/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { ActiveConversationScreen, ConversationScreen } from '../views';
import { colors } from '../../../styles';
import { CustomButton } from '../../../components';
import { deleteMessageCache } from '../../../utils/database';

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
        options={({ route, navigation }) => ({
          headerTitle: users[route.params.pk].name,
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <CustomButton
              buttonConfig={{
                onPress: () => {
                  deleteMessageCache(route.params.pk);
                  navigation.goBack();
                },
              }}
              text="Clear Cache"
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default ConversationNavigator;
