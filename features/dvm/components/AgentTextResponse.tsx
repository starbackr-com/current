import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../../styles';

const styles = StyleSheet.create({
  card: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 12,
    borderColor: colors.backgroundActive,
    borderWidth: 1,
  },
  body: {
    ...globalStyles.textBody,
    textAlign: 'left',
  },
});

const AgentTextResponse = ({ content }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.body}>{content}</Text>
    </View>
  );
};

export default AgentTextResponse;
