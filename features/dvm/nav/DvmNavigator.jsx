import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgentChatScreen, DvmSelectionScreen, ImageGenScreen } from '../views';
import ChooseTierView from '../../premium/views/ChooseTierView';
import { BackHeader } from '../../../components';

const Stack = createNativeStackNavigator();

const DvmNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DvmSelection"
      component={DvmSelectionScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen name="ImageGen" component={ImageGenScreen} />
    <Stack.Screen name="AgentChat" component={AgentChatScreen} />
    <Stack.Screen
      name="Premium"
      component={ChooseTierView}
      options={({ navigation }) => ({
        header: () => <BackHeader navigation={navigation} />,
      })}
    />
  </Stack.Navigator>
);

export default DvmNavigator;
