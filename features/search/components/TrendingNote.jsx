import { View, Text } from 'react-native';
import React from 'react';
import { useParseContent } from '../../../hooks';
import { globalStyles } from '../../../styles';

const TrendingNote = ({ event }) => {
  const content = useParseContent(event);
  return (
    <View>
      <Text style={globalStyles.textBody} numberOfLines={event.content.length > 100 ? 10 : undefined}>{content}</Text>
    </View>
  );
};

export default TrendingNote;