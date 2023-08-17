import { View, Text, Platform } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostView from '../../../views/post/PostView';
import { BackHeader } from '../../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../styles';

const Stack = createNativeStackNavigator();

const PostNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? insets.top : 0,
        backgroundColor: colors.backgroundPrimary
      }}
    >
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          header: () => <BackHeader navigation={navigation} />,
        })}
      >
        <Stack.Screen name="PostNote" component={PostView} />
      </Stack.Navigator>
    </View>
  );
};

export default PostNavigator;
