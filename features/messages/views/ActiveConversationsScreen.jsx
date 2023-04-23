import { View, Text, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import { Input } from '../../../components';
import useConversations from '../hooks/useConversations';
import { getUserData } from '../../../utils/nostrV2';

const Conversation = ({ item }) => {
  useEffect(() => {
    getUserData([item]);
  }, []);
  const user = useSelector((state) => state.messages.users[item]) || {};
  const navigation = useNavigation();
  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        padding: 10,
        borderRadius: 6,
        marginTop: 12,
        width: '100%',
      }}
      onPress={() => {
        navigation.navigate('');
      }}
    >
      <Image
        source={user.picture || undefined}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
      />
      <Text style={globalStyles.textBody}>{user.name || item}</Text>
    </Pressable>
  );
};

const ActiveConversationsScreen = () => {
  const activeConversation = useConversations();
  return (
    <View style={globalStyles.screenContainer}>
      <Input textInputConfig={{ placeholder: 'Search' }} />
      <FlatList
        data={activeConversation}
        renderItem={({ item }) => <Conversation item={item} />}
        style={{ width: '100%' }}
      />
    </View>
  );
};

export default ActiveConversationsScreen;
