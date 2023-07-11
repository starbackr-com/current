import { View, Text, Platform } from 'react-native';
import React, { memo } from 'react';
import { globalStyles } from '../../../styles';
import { Event } from 'nostr-tools';
import { useParseContent } from '../../../hooks';

type RelayMessageProps = {
  event: Event;
}

const RelayMessage = memo(({event}: RelayMessageProps) => {
  const content = useParseContent(event);
  return (
    <View style={Platform.OS === 'android' ? { scaleY: -1 } : undefined}>
      <Text style={globalStyles.textBodyG}>{content}</Text>
    </View>
  );
});

export default RelayMessage;
