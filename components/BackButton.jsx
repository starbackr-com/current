import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, globalStyles } from '../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  containerActive: {
    backgroundColor: colors.backgroundActive,
  },
});

const BackButton = ({ onPress, text }) => (
  <Pressable
    style={({ pressed }) => [
      styles.container,
      pressed ? styles.containerActive : undefined,
    ]}
    onPress={onPress}
  >
    <Ionicons name="arrow-back" size={14} color={colors.primary500} />
    <Text
      style={[
        globalStyles.textBody,
        { color: colors.primary500, textAlign: 'left' },
      ]}
    >
      {text || 'Back'}
    </Text>
  </Pressable>
);

export default BackButton;
