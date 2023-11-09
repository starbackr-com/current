import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../../styles';

const styles = StyleSheet.create({
  card: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.backgroundActive,
    alignSelf: 'flex-end',
  },
  body: {
    ...globalStyles.textBody,
    textAlign: 'right',
  },
});

const AgentRequest = ({ content }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.body}>{content}</Text>
    </View>
  );
};

export default AgentRequest;
