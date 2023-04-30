import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../../styles';
import { useParseContent } from '../../../hooks';
import { getHourAndMinute } from '../../../utils';

const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  container: {
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    marginVertical: 6,
    width: '90%',
    borderRadius: 10,
  },
  send: {
    backgroundColor: colors.backgroundActive,
    alignSelf: 'flex-end',
  },
});

const ConversationText = ({ type, event }) => {
  const parsedContent = useParseContent(event);
  return (
    <View style={styles.outer}>
      <View
        style={[styles.container, type === 'send' ? styles.send : undefined]}
      >
        <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
          {parsedContent}
        </Text>
        <View style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Text style={[globalStyles.textBodyS, { textAlign: 'right' }]}>
            {getHourAndMinute(event.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ConversationText;
