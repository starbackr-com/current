import { View, Text, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import useMessages from '../hooks/useMessages';

const ConversationScreen = ({ navigation, route }) => {
  const { pk } = route.params || {};
  const messages = useMessages(pk);
  console.log(messages);
  return (
    <KeyboardAvoidingView>
      <FlatList />
    </KeyboardAvoidingView>
  );
};

export default ConversationScreen;
