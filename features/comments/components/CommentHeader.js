import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useParseContent } from '../../../hooks/useParseContent';
import { useHeaderNotes } from '../hooks/useHeaderNotes';
import { colors, globalStyles } from '../../../styles';

const ReplyItem = ({ event }) => {
  const user = useSelector((state) => state.messages.users[event.pubkey]);
  const content = useParseContent(event);
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', width: '100%', marginVertical: 12 }}>
      <Image
        source={
          user?.picture || require('../../../assets/user_placeholder.jpg')
        }
        style={{ height: 30, width: 30, borderRadius: 15 }}
      />
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Pressable
          onPress={() => {
            navigation.navigate('Profile', {
              screen: 'ProfileScreen',
              params: { pubkey: event.pubkey },
            });
          }}
        >
          <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
            {user?.name || event.pubkey.slice(0, 16)}
          </Text>
        </Pressable>
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {content}
        </Text>
      </View>
    </View>
  );
};

const CommentHeader = ({ parentId, rootId, parentEvent }) => {
  const { root, parent } = useHeaderNotes(parentEvent);
  return (
    <View style={{ marginBottom: 12 }}>
      {root ? (
        <View>
          <ReplyItem event={root} />
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: colors.backgroundSecondary,
              }}
            />
          </View>
        </View>
      ) : undefined}
      {parent ? (
        <View>
          <ReplyItem event={parent} />
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: colors.primary500,
              }}
            />
          </View>
        </View>
      ) : undefined}
      <View>
        <View></View>
      </View>
    </View>
  );
};

export default CommentHeader;
