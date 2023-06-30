import { View, Text, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { Event, nip19 } from 'nostr-tools';
import { colors, globalStyles } from '../../../styles';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';

type MessageProps = {
  event: Event;
  sent?: boolean;
};

const Message = memo(({ event, sent }: MessageProps) => {
  //@ts-ignore
  const user = useSelector((state) => state.messages.users[event.pubkey]);
  return (
    <View
      style={[
        { width: '100%', gap: 10, scaleY: -1 },
        sent ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' },
      ]}
    >
      {user && user.picture ? (
        <Image source={user.picture} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.container}>
        <Text style={styles.username}>
          {user?.name || nip19.npubEncode(event.pubkey).slice(0, 32)}
        </Text>
        <Text style={styles.text}>{event.content}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    width: '80%',
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 12,
  },
  username: {
    ...globalStyles.textBodyS,
    textAlign: 'left',
  },
  text: {
    ...globalStyles.textBody,
    textAlign: 'left',
  },
  image: { height: 40, width: 40, borderRadius: 20 },
  placeholder: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
});

export default Message;
