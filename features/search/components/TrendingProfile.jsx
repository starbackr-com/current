import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import UserBanner from '../../homefeed/components/UserBanner';

const style = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    marginVertical: 12,
  },
});

const TrendingNote = ({ event }) => {
  const [viewWidth, setViewWidth] = useState();
  const user = useSelector((state) => state.messages.users[event.pubkey]);
  const navigation = useNavigation();

  return (
    <Pressable
      onLayout={(e) => {
        setViewWidth(e.nativeEvent.layout.width);
      }}
      style={style.container}
      onPress={() => {
        navigation.push('Profile', {
          screen: 'ProfileScreen',
          params: {
            pubkey: event.pubkey,
          },
        });
      }}
    >
      {viewWidth ? (
        <UserBanner user={user} event={event} width={viewWidth} />
      ) : undefined}
      <Text
        style={[globalStyles.textBody, { textAlign: 'left' }]}
        numberOfLines={event.content.length > 100 ? 10 : undefined}
      >
        {JSON.parse(event.content).about}
      </Text>
    </Pressable>
  );
};

export default TrendingNote;
