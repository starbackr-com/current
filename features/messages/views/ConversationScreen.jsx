import {
  View,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import React, { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import useMessages from '../hooks/useMessages';
import { ExpandableInput } from '../../../components';
import { globalStyles } from '../../../styles';
import ConversationText from '../components/ConversationText';
import publishMessage from '../utils/publishMessage';

const ConversationScreen = ({ route }) => {
  const { pk, sk } = route.params || {};
  const [viewHeight, setViewHeight] = useState();

  const messages = useMessages(pk, sk);
  const tabBarHeight = useBottomTabBarHeight();
  const { height } = useWindowDimensions();

  const renderText = ({ item }) => {
    if (item.pubkey === pk) {
      return (
        <ConversationText type="receive" content={item.content} event={item} />
      );
    }
    return <ConversationText type="send" content={item.content} event={item} />;
  };

  const sendHandler = async (content) => {
    publishMessage(sk, pk, content);

  };

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => {
        setViewHeight(e.nativeEvent.layout.height);
      }}
    >
      <KeyboardAvoidingView
        style={[globalStyles.screenContainer, { paddingTop: 0 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={height - viewHeight - tabBarHeight}
      >
        <FlatList
          data={messages}
          renderItem={renderText}
          style={{ width: '100%' }}
          inverted
        />
        <View style={{ width: '100%', marginTop: 6 }}>
          <ExpandableInput onSubmit={sendHandler} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConversationScreen;
