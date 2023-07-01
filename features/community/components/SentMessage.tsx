import { View, Text, StyleSheet, Platform } from 'react-native';
import React, { memo } from 'react';
import { Event } from 'nostr-tools';
import { colors, globalStyles } from '../../../styles';
import { useParseContent } from '../../../hooks';

type MessageProps = {
  event: Event;
};

const SentMessage = memo(({ event }: MessageProps) => {
  const content = useParseContent(event);
  return (
    <View
      style={[
        { width: '100%', gap: 10, flexDirection: 'row-reverse' },
        Platform.OS === 'android' ? { scaleY: -1 } : undefined,
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{content}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    width: '80%',
    backgroundColor: colors.backgroundActive,
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

export default SentMessage;
